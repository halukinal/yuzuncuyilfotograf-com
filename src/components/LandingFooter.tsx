"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

export function LandingFooter() {
    return (
        <footer className="bg-[#1A1A1A] text-[#FFFBEB]/70 py-16 px-4 sm:px-8 border-t border-[#064E3B]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#FFFBEB]">
                        <div className="flex gap-1">
                            <div className="relative h-10 w-12 overflow-hidden rounded border border-[#FFFBEB]/10 bg-white">
                                <Image src="/dpu-logo.png" alt="DPÜ Logo" fill className="object-contain p-1" />
                            </div>
                            <div className="relative h-10 w-12 overflow-hidden rounded border border-[#FFFBEB]/10 bg-white">
                                <Image src="/dernek-logo.jpeg" alt="Dernek Logo" fill className="object-contain" />
                            </div>
                        </div>
                        <span className="font-black text-lg leading-tight uppercase italic tracking-tighter">DPÜ RAMAZAN <br /> FOTOĞRAF YARIŞMASI</span>
                    </div>
                    <p className="text-sm leading-relaxed italic">
                        Kütahya Dumlupınar Üniversitesi ve Yüzüncü Yıl Fotoğraf Derneği paydaşlığında düzenlenen bu yarışma, Ramazan ayının manevi coşkusunu ve paylaşma kültürünü ölümsüzleştirmeyi amaçlar.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-[#F59E0B] hover:text-[#FFFBEB] transition-colors"><Facebook size={20} /></Link>
                        <Link href="#" className="text-[#F59E0B] hover:text-[#FFFBEB] transition-colors"><Twitter size={20} /></Link>
                        <Link href="#" className="text-[#F59E0B] hover:text-[#FFFBEB] transition-colors"><Instagram size={20} /></Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-[#F59E0B] font-black mb-6 uppercase tracking-widest text-sm">Hızlı Bağlantılar</h3>
                    <ul className="space-y-4 text-sm font-bold uppercase italic tracking-tighter">
                        <li><Link href="#hakkimizda" className="hover:text-[#F59E0B] transition-colors">Yarışma Hakkında</Link></li>
                        <li><Link href="#kurallar" className="hover:text-[#F59E0B] transition-colors">Başvuru Koşulları</Link></li>
                        <li><Link href="#oduller" className="hover:text-[#F59E0B] transition-colors">Ödüller & Kategoriler</Link></li>
                        <li><Link href="#juri" className="hover:text-[#F59E0B] transition-colors">Seçici Kurul (Jüri)</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-[#F59E0B] font-black mb-6 uppercase tracking-widest text-sm">İletişim</h3>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin size={18} className="text-[#F59E0B] shrink-0" />
                            <span>Dumlupınar Üniversitesi Evliya Çelebi Yerleşkesi, Kütahya</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-[#F59E0B] shrink-0" />
                            <span>0553 851 00 84</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-[#F59E0B] shrink-0" />
                            <span>info@yuzuncuyilfotograf.com</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#FFFBEB]/5 text-center text-[10px] uppercase font-bold tracking-widest text-[#FFFBEB]/30">
                <p>&copy; {new Date().getFullYear()} Yüzüncü Yıl Tarih Kültür Sanat ve Fotoğraf Derneği. Tüm hakları saklıdır.</p>
            </div>
        </footer>
    );
}
