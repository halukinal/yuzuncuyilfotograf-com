import firebase_admin
from firebase_admin import credentials
from google.cloud import firestore
import pandas as pd
import os
from datetime import datetime

# --- KONFIGURASYON ---
SERVICE_ACCOUNT_PATH = 'serviceAccountKey.json'
OUTPUT_FILE = 'oylama_sonuclari.xlsx'
PARTICIPANT_MAP_FILE = 'KATILIMCI_ESLESME_LISTESI.xlsx'

def get_owner_map():
    """
    Katilimci eslesme listesini okur ve photoId -> Owner seklinde sozluk doner.
    """
    if not os.path.exists(PARTICIPANT_MAP_FILE):
        print(f"UYARI: '{PARTICIPANT_MAP_FILE}' dosyasi bulunamadi, isim eslestirmesi yapilamayacak.")
        return {}
    
    try:
        df = pd.read_excel(PARTICIPANT_MAP_FILE)
        # Sütun isimlerini kontrol et
        if 'Jüri Dosya Adı' in df.columns and 'Katılımcı Adı' in df.columns:
            # Dosya adini (uzantili) anahtar, katilimci adini deger olarak al
            return pd.Series(df['Katılımcı Adı'].values, index=df['Jüri Dosya Adı']).to_dict()
        else:
            print("UYARI: Eslesme listesinde beklenen sutunlar (Jüri Dosya Adı, Katılımcı Adı) bulunamadi.")
            return {}
    except Exception as e:
        print(f"UYARI: Eslesme listesi okunurken hata olustu: {e}")
        return {}

def export_votes():
    # 1. Firebase Baglantisi
    if not os.path.exists(SERVICE_ACCOUNT_PATH):
        print(f"HATA: '{SERVICE_ACCOUNT_PATH}' dosyasi bulunamadi!")
        return

    # Initialize Firebase explicitly for the 'foto' database if not already initialized
    if not firebase_admin._apps:
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)

    try:
        # Connect to 'foto' database
        db = firestore.Client.from_service_account_json(SERVICE_ACCOUNT_PATH, database='foto')
    except Exception as e:
        print(f"Veritabani baglanti hatasi: {e}")
        return
    
    print("Oylar veritabanindan cekiliyor...")

    # 2. Oylari Çek
    votes_ref = db.collection('votes')
    try:
        docs = votes_ref.stream()
    except Exception as e:
        print(f"Oylar okunurken hata: {e}")
        return

    data = []
    owner_map = get_owner_map()

    for doc in docs:
        vote = doc.to_dict()
        
        # --- TIME ERROR FIX ---
        # Convert timestamp to string safely
        ts = vote.get('timestamp')
        if ts:
            if hasattr(ts, 'strftime'):
                vote['timestamp'] = ts.strftime('%Y-%m-%d %H:%M:%S')
            else:
                # String veya baska bir tur ise stringe cevir
                vote['timestamp'] = str(ts)
        
        # --- OWNER LOOKUP ---
        photo_id = vote.get('photoId')
        owner_name = "Bilinmiyor"
        if photo_id:
            # Tam eslesme dene
            if photo_id in owner_map:
                owner_name = owner_map[photo_id]
            # Uzantisiz eslesme dene (örn: YARISMA_ID_001.jpeg -> YARISMA_ID_001)
            else:
                # Eger listedeki anahtar uzantili ise ve bizde uzantisiz varsa bilemeyiz
                # Ama tam tersi veya farkli durumlar icin:
                # photoId'nin veritabaninda nasil tutulduguna bagli.
                pass
        
        vote['owner'] = owner_name
        data.append(vote)

    if not data:
        print("Hic oy bulunamadi.")
        return

    # 3. DataFrame Olustur
    df = pd.DataFrame(data)
    
    # Sütunları düzenle
    desired_order = ['photoId', 'owner', 'score', 'juryEmail', 'comment', 'timestamp']
    cols = [c for c in desired_order if c in df.columns]
    remaining = [c for c in df.columns if c not in cols]
    final_cols = cols + remaining
    df = df[final_cols]
    
    # Sirala
    if 'photoId' in df.columns:
        df = df.sort_values(by='photoId')

    # 4. Ozet Tablosu (Kazananlari Belirle)
    print("Sonuclar hesaplaniyor...")
    summary_data = []
    if 'score' in df.columns and 'photoId' in df.columns:
        # Score'u sayisal yap (gerekirse)
        df['score'] = pd.to_numeric(df['score'], errors='coerce').fillna(0)
        
        # Grupla
        grouped = df.groupby('photoId')
        for pid, group in grouped:
            total_score = group['score'].sum()
            vote_count = len(group)
            # Owner is consistent per photoId usually
            owner = group['owner'].iloc[0] if 'owner' in group.columns else "Bilinmiyor"
            
            summary_data.append({
                'photoId': pid,
                'owner': owner,
                'total_score': total_score,
                'vote_count': vote_count,
                'average_score': total_score / vote_count if vote_count > 0 else 0
            })
            
        df_summary = pd.DataFrame(summary_data)
        df_summary = df_summary.sort_values(by='total_score', ascending=False)
    else:
        df_summary = pd.DataFrame()

    # 5. Excel'e Kaydet (Multi-sheet)
    try:
        with pd.ExcelWriter(OUTPUT_FILE, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Tum Oylar', index=False)
            if not df_summary.empty:
                df_summary.to_excel(writer, sheet_name='Sonuclar (Ozet)', index=False)
                
        print(f"✅ Oylama sonuclari basariyla kaydedildi: {OUTPUT_FILE}")
        print(f"   - Tum Oylar sayfasi: {len(df)} satir")
        print(f"   - Sonuclar sayfasi: {len(df_summary)} satir (Kazanan en ustte)")
        
    except Exception as e:
        print(f"Kaydetme hatasi: {e}")
        # Fallback to CSV
        csv_file = OUTPUT_FILE.replace('.xlsx', '.csv')
        df.to_csv(csv_file, index=False)
        print(f"Excel hatasi nedeniyle detaylar CSV olarak kaydedildi: {csv_file}")

if __name__ == "__main__":
    export_votes()
