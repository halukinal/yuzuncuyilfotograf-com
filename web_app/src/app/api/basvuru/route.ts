import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const submissionSchema = z.object({
  fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
  idNumber: z.string().min(1, "Numara girilmesi zorunludur"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  userType: z.enum(["student", "staff"]),
  photoTitles: z.array(z.string().min(1, "Eser adı zorunludur")),
});

export async function POST(req: NextRequest) {
  console.log("Submission request received...");
  try {
    const formData = await req.formData();

    const fullName = formData.get("fullName") as string;
    const idNumber = formData.get("idNumber") as string;
    const email = formData.get("email") as string;
    const userType = formData.get("userType") as "student" | "staff";
    const photoTitles = JSON.parse(formData.get("photoTitles") as string);

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

      // Basic file validation
      if (!file.type.match(/image\/jpeg/)) {
        return NextResponse.json({ error: "Sadece .jpg ve .jpeg formatları kabul edilmektedir." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      if (buffer.length < 1024 * 1024 || buffer.length > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Her dosya 1MB - 10MB arasında olmalıdır." }, { status: 400 });
      }

      attachments.push({
        filename: `${photoTitles[i] || `Eser-${i + 1}`}.jpg`,
        content: buffer,
      });
    }

    // Check for credentials
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("Missing Gmail credentials in .env.local");
      return NextResponse.json({ error: "Sistem yapılandırması eksik (Email credentials)." }, { status: 500 });
    }

    // Email Setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password
      },
      // Using 587 (STARTTLS) is often safer for local dev environments
      secure: false,
      tls: {
        rejectUnauthorized: false // Helps in some local dev scenarios
      }
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log("SMTP Connection verified successfully.");
    } catch (verifyError) {
      console.error("SMTP Verification Error:", verifyError);
      return NextResponse.json({ error: "Mail sunucusuna bağlanılamadı. Lütfen internet bağlantınızı veya mail şifrenizi kontrol edin." }, { status: 500 });
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
    await transporter.sendMail(mailOptions);
    console.log("Admin mail sent successfully!");

    // 2. Auto-reply to the Applicant
    const autoReplyOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Başvurunuz Alındı - DPÜ Ramazan Fotoğraf Yarışması",
      text: ` Sayın ${fullName},
      
"Objektifimden Kütahya’da Ramazan" fotoğraf yarışması başvurunuz başarıyla sistemimize ulaşmıştır.

Başvuru Detayları:
- Kullanıcı Tipi: ${userTypeLabel}
- Numara: ${idNumber}
- Eser Sayısı: ${attachments.length}

Başvurunuz jüri değerlendirmesine alınacaktır. Yarışmaya katıldığınız için teşekkür eder, başarılar dileriz.

Saygılarımızla,
Dumlupınar Üniversitesi Fotoğraf Yarışması Düzenleme Kurulu`,
    };

    try {
      console.log(`Sending auto-reply to ${email}...`);
      await transporter.sendMail(autoReplyOptions);
      console.log("Auto-reply sent successfully!");
    } catch (replyError) {
      console.error("Auto-reply failed (Invalid Email?):", replyError);
      // We still return success because the admin got the main mail, 
      // but we log that the applicant's mail might be invalid.
    }

    return NextResponse.json({ message: "Başvurunuz ve fotoğraflarınız başarıyla iletilmiştir. Bilgilendirme e-postası adresinize gönderildi!" });
  } catch (error: any) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
