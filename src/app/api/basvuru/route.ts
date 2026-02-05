import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 30 * 60 * 1000; // 30 minutes
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);

  if (!limitData || now - limitData.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (limitData.count >= MAX_REQUESTS) {
    return true;
  }

  limitData.count += 1;
  return false;
}

// Sanitization function for filenames
function sanitizeFilename(name: string): string {
  const turkishMap: { [key: string]: string } = {
    'ğ': 'g', 'Ğ': 'G', 'ş': 's', 'Ş': 'S', 'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C', 'ü': 'u', 'Ü': 'U'
  };

  let sanitized = name.split('').map(char => turkishMap[char] || char).join('');
  return sanitized
    .replace(/[^a-z0-9\s.-]/gi, "_")
    .replace(/\s+/g, "-")
    .slice(0, 50); // Limit length further for safety
}

const submissionSchema = z.object({
  fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
  idNumber: z.string().min(1, "Numara girilmesi zorunludur"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  userType: z.enum(["student", "staff"]),
  photoTitles: z.array(z.string().min(1, "Eser adı zorunludur")),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (isRateLimited(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      { error: "Çok fazla deneme yaptınız. Lütfen 30 dakika sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  console.log(`Submission request received from IP: ${ip}`);

  try {
    const formData = await req.formData().catch(err => {
      console.error("Error parsing form data:", err);
      throw new Error("Form verileri okunamadı.");
    });

    const fullName = (formData.get("fullName") as string)?.trim();
    const idNumber = (formData.get("idNumber") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const userType = formData.get("userType") as "student" | "staff";

    let photoTitles: string[] = [];
    try {
      photoTitles = JSON.parse(formData.get("photoTitles") as string);
    } catch (e) {
      return NextResponse.json({ error: "Geçersiz eser başlıkları formatı." }, { status: 400 });
    }

    // Validate text data
    const validation = submissionSchema.safeParse({ fullName, idNumber, email, userType, photoTitles });
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    // Validate email domain
    const domain = email.split("@")[1];
    if (userType === "student" && domain !== "ogr.dpu.edu.tr") {
      return NextResponse.json({ error: "Lütfen @ogr.dpu.edu.tr uzantılı mailinizi kullanın." }, { status: 400 });
    }
    if (userType === "staff" && domain !== "dpu.edu.tr") {
      return NextResponse.json({ error: "Lütfen @dpu.edu.tr uzantılı mailinizi kullanın." }, { status: 400 });
    }

    // Process files
    const files = formData.getAll("photos") as File[];
    if (files.length === 0 || files.length > 3) {
      return NextResponse.json({ error: "En az 1, en fazla 3 fotoğraf yükleyebilirsiniz." }, { status: 400 });
    }

    const attachments = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Stricter file validation
      const isValidType = file.type.match(/^image\/(jpe?g|png)$/i);
      if (!isValidType) {
        return NextResponse.json({ error: "Sadece .jpg, .jpeg ve .png formatları kabul edilmektedir." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (buffer.length < 1024 * 1024 || buffer.length > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Her dosya 1MB - 10MB arasında olmalıdır." }, { status: 400 });
      }

      // Determine extension
      const extension = file.type === "image/png" ? "png" : "jpg";
      const sanitizedTitle = sanitizeFilename(photoTitles[i] || `Eser-${i + 1}`);
      console.log(`Attachment ${i + 1}: ${sanitizedTitle}.${extension} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);

      attachments.push({
        filename: `${sanitizedTitle}.${extension}`,
        content: buffer,
      });
    }

    const totalSize = attachments.reduce((sum, att) => sum + (att.content as Buffer).length, 0);
    if (totalSize > 20 * 1024 * 1024) { // 20MB limit for Gmail safety (base64 overhead)
      return NextResponse.json({ error: "Toplam dosya boyutu çok büyük (Max 20MB). Lütfen fotoğrafları küçültüp tekrar deneyin." }, { status: 400 });
    }

    // Check for credentials
    console.log("Checking GMAIL_USER:", process.env.GMAIL_USER ? "Present" : "Missing");
    console.log("Checking GMAIL_PASS:", process.env.GMAIL_PASS ? "Present" : "Missing");

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("Missing Gmail credentials in .env.local. GMAIL_USER:", process.env.GMAIL_USER, "GMAIL_PASS:", process.env.GMAIL_PASS);
      return NextResponse.json({ error: "Sistem yapılandırması eksik (Email credentials)." }, { status: 500 });
    }

    // Email Setup
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log("SMTP Connection verified successfully.");
    } catch (verifyError: any) {
      console.error("SMTP Verification Error Details:", {
        message: verifyError.message,
        stack: verifyError.stack,
        code: verifyError.code,
        command: verifyError.command
      });
      return NextResponse.json({
        error: "Mail sunucusuna bağlanılamadı.",
        details: verifyError.message
      }, { status: 500 });
    }

    const userTypeLabel = userType === "student" ? "Öğrenci" : "Personel";
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "inlhalk@gmail.com",
      subject: `[Yarışma Başvurusu] - ${userTypeLabel} - ${idNumber} - ${fullName}`,
      text: `
        Ad Soyad: ${fullName}
        Kullanıcı Tipi: ${userTypeLabel}
        ${userType === 'student' ? 'Okul Numarası' : 'Sicil Numarası'}: ${idNumber}
        E-posta: ${email}
        Eser Adları: ${photoTitles.join(", ")}
      `,
      attachments,
    };

    console.log("Sending mail to admin...");
    await transporter.sendMail(mailOptions).catch(err => {
      console.error("Admin mail sending failed:", err);
      throw new Error(`Admin maili gönderilemedi: ${err.message}`);
    });
    console.log("Admin mail sent successfully!");

    // 2. Auto-reply to the Applicant
    const autoReplyOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Başvurunuz Alındı - DPÜ Ramazan Fotoğraf Yarışması",
      text: `Sayın ${fullName},
      
"Objektifimden Kütahya’da Ramazan" fotoğraf yarışması başvurunuz başarıyla sistemimize ulaşmıştır.

Başvuru Detayları:
- Kullanıcı Tipi: ${userTypeLabel}
- Numara: ${idNumber}
- Eser Sayısı: ${attachments.length}

Onaylanan Şartlar ve Beyanlar:
1. KVKK Onayı: 6698 sayılı KVKK kapsamında kişisel verilerimin işlenmesini ve fotoğraflarımın sergi/sosyal medya amaçlı kullanımını kabul ediyorum. (ONAYLANDI)
2. Özgünlük Taahhüdü: Fotoğrafların tamamen şahsıma ait olduğunu, yapay zeka kullanılmadığını ve profesyonel manipülasyon (aşırı oynama) yapılmadığını taahhüt ederim. (ONAYLANDI)
3. Şartname Onayı: Yarışma şartnamesini okudum, anladım ve belirtilen tüm kurallara uymayı kabul ediyorum. (ONAYLANDI)

Yarışma Şartnamesi: https://docs.google.com/document/d/1QjkzaK2elcV69G1mm5Phm5u99VYsQg_clTXmp2k-Dy0/edit?usp=sharing

Başvurunuz jüri değerlendirmesine alınacaktır. Yarışmaya katıldığınız için teşekkür eder, başarılar dileriz.

Saygılarımızla,
Dumlupınar Üniversitesi & Yüzüncü Yıl Derneği
Fotoğraf Yarışması Düzenleme Kurulu

---
Bu e-posta, "Objektifimden Kütahya’da Ramazan" Fotoğraf Yarışması başvuru sistemi tarafından otomatik olarak oluşturulmuştur. Lütfen bu e-postayı yanıtlamayınız. Sorularınız için iletişim sayfamızdaki kanalları kullanabilirsiniz.`,
    };

    try {
      console.log(`Sending auto-reply to ${email}...`);
      await transporter.sendMail(autoReplyOptions);
      console.log("Auto-reply sent successfully!");
    } catch (replyError) {
      console.error("Auto-reply failed (Invalid Email?):", replyError);
    }

    return NextResponse.json({ message: "Başvurunuz ve fotoğraflarınız başarıyla iletilmiştir. Bilgilendirme e-postası adresinize gönderildi!" });
  } catch (error: any) {
    console.error("Full Submission Error Details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({
      error: "Bir hata oluştu. Lütfen tekrar deneyin.",
      details: error.message
    }, { status: 500 });
  }
}

