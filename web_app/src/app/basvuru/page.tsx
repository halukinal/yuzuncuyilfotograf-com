"use client";

import { useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Upload, X, GraduationCap, Briefcase, Camera, Phone, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    idNumber: z.string().min(1, "Bu alan zorunludur"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    userType: z.enum(["student", "staff"]),
    photoTitles: z.array(z.object({
        value: z.string().min(1, "Eser adı zorunludur")
    })).min(1, "En az bir fotoğraf yüklenmelidir"),
    kvkk: z.boolean().refine(val => val === true, "KVKK onayını kabul etmelisiniz"),
    authenticity: z.boolean().refine(val => val === true, "Taahhütnameyi onaylamalısınız"),
    specsRead: z.boolean().refine(val => val === true, "Yarışma şartnamesini okuduğunuzu onaylamalısınız"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplicationPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userType: "student",
            photoTitles: [],
            kvkk: false,
            authenticity: false,
            specsRead: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "photoTitles",
    });

    const userType = watch("userType");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        addFiles(files);
    };

    const addFiles = (files: File[]) => {
        const validFiles = files.filter((file) => {
            const isJpg = file.type === "image/jpeg" || file.type === "image/jpg";
            const isSizeOk = file.size >= 1024 * 1024 && file.size <= 10 * 1024 * 1024;

            if (!isJpg) toast.error(`${file.name} sadece JPG/JPEG formatında olmalıdır.`);
            if (!isSizeOk) toast.error(`${file.name} boyutu 1MB ile 10MB arasında olmalıdır.`);

            return isJpg && isSizeOk;
        });

        const combined = [...selectedFiles, ...validFiles].slice(0, 3);
        setSelectedFiles(combined);

        // Update previews
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews].slice(0, 3));

        // Update form field array
        validFiles.forEach(() => {
            if (fields.length < 3) {
                append({ value: "" });
            }
        });
    };

    const removeFile = (index: number) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);

        remove(index);
    };

    const onSubmit = async (data: FormValues) => {
        if (selectedFiles.length === 0) {
            toast.error("Lütfen en az bir fotoğraf yükleyin.");
            return;
        }

        // Domain validation
        const domain = data.email.split("@")[1];
        if (data.userType === "student" && domain !== "ogr.dpu.edu.tr") {
            toast.error("Öğrenciler için @ogr.dpu.edu.tr uzantılı mail zorunludur.");
            return;
        }
        if (data.userType === "staff" && domain !== "dpu.edu.tr") {
            toast.error("Personel için @dpu.edu.tr uzantılı mail zorunludur.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("idNumber", data.idNumber);
        formData.append("email", data.email);
        formData.append("userType", data.userType);
        formData.append("photoTitles", JSON.stringify(data.photoTitles.map(t => t.value)));

        selectedFiles.forEach((file) => {
            formData.append("photos", file);
        });

        try {
            const response = await fetch("/api/basvuru", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                // Reset state or redirect
                window.location.reload();
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Sunucu bağlantısı kurulamadı.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBEB] text-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[#1A1A1A]/40 hover:text-[#064E3B] transition-colors font-bold uppercase text-xs tracking-widest italic"
                    >
                        <ArrowLeft size={16} /> Ana Sayfaya Dön
                    </Link>
                </div>
                <div className="text-center mb-12">
                    <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#064E3B]/10 shadow-xl">
                        <Image src="/dernek-logo.jpeg" alt="DPU Logo" fill className="object-cover" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-[#064E3B] uppercase italic">
                        Objektifimden Kütahya’da Ramazan
                    </h1>
                    <p className="text-[#1A1A1A]/60 max-w-lg mx-auto font-medium italic">
                        DPÜ Fotoğraf Yarışması başvuru formuna hoş geldiniz. Lütfen bilgilerinizi eksiksiz doldurunuz.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Identity Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setValue("userType", "student")}
                            className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${userType === "student"
                                ? "border-[#064E3B] bg-[#064E3B] text-white shadow-xl scale-105"
                                : "border-[#064E3B]/5 bg-white text-[#1A1A1A]/40 hover:border-[#064E3B]/20"
                                }`}
                        >
                            <GraduationCap className={userType === "student" ? "text-[#F59E0B]" : "text-[#1A1A1A]/40"} size={32} />
                            <span className="font-black uppercase italic tracking-tighter">Öğrenciyim</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue("userType", "staff")}
                            className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${userType === "staff"
                                ? "border-[#064E3B] bg-[#064E3B] text-white shadow-xl scale-105"
                                : "border-[#064E3B]/5 bg-white text-[#1A1A1A]/40 hover:border-[#064E3B]/20"
                                }`}
                        >
                            <Briefcase className={userType === "staff" ? "text-[#F59E0B]" : "text-[#1A1A1A]/40"} size={32} />
                            <span className="font-black uppercase italic tracking-tighter text-center">Akademik/İdari Personelim</span>
                        </button>
                    </div>

                    <Card className="bg-white border-[#064E3B]/10 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-[#064E3B]">
                        <CardHeader>
                            <CardTitle className="text-[#064E3B] font-black uppercase italic tracking-tighter">Kişisel Bilgiler</CardTitle>
                            <CardDescription className="text-[#1A1A1A]/50 italic">
                                Lütfen kurumsal e-posta adresinizi kullanın.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="font-bold text-[#1A1A1A] uppercase text-xs tracking-widest italic">Ad Soyad</Label>
                                <Input
                                    id="fullName"
                                    {...register("fullName")}
                                    className="bg-white border-neutral-200 focus:ring-[#064E3B] focus:border-[#064E3B] text-[#1A1A1A] placeholder:text-neutral-300"
                                    placeholder="Ahmet Yılmaz"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm font-bold mt-1">{errors.fullName.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="idNumber" className="font-bold text-[#1A1A1A] uppercase text-xs tracking-widest italic">
                                        {userType === "student" ? "Okul Numarası" : "Personel Sicil No"}
                                    </Label>
                                    <Input
                                        id="idNumber"
                                        {...register("idNumber")}
                                        className="bg-white border-neutral-200 text-[#1A1A1A] placeholder:text-neutral-300 focus:ring-[#064E3B] focus:border-[#064E3B]"
                                        placeholder={userType === "student" ? "2023123456" : "S12345"}
                                    />
                                    {errors.idNumber && <p className="text-red-500 text-sm font-bold mt-1">{errors.idNumber.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-bold text-[#1A1A1A] uppercase text-xs tracking-widest italic">Kurumsal E-posta</Label>
                                    <Input
                                        id="email"
                                        {...register("email")}
                                        className="bg-white border-neutral-200 text-[#1A1A1A] placeholder:text-neutral-300 focus:ring-[#064E3B] focus:border-[#064E3B]"
                                        placeholder={userType === "student" ? "isim@ogr.dpu.edu.tr" : "isim@dpu.edu.tr"}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm font-bold mt-1">{errors.email.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Upload Area */}
                    <Card className="bg-white border-[#064E3B]/10 shadow-lg hover:shadow-xl transition-shadow overflow-hidden border-t-4 border-t-[#064E3B]">
                        <CardHeader className="bg-[#064E3B]/5">
                            <CardTitle className="flex items-center gap-2 text-[#064E3B] font-black uppercase italic tracking-tighter">
                                <Camera size={20} className="text-[#F59E0B]" />
                                Fotoğraf Yükle
                            </CardTitle>
                            <CardDescription className="text-[#1A1A1A]/50 italic">
                                En fazla 3 adet, kısa kenarı min 2400px, 150-300 DPI ve 1MB-10MB arası .jpg dosyası. <br />
                                Dosya adı formatı: Ad_Soyad_EserinAdı_No.jpg
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${selectedFiles.length >= 3
                                    ? "border-neutral-100 bg-[#064E3B]/5 cursor-not-allowed opacity-50"
                                    : "border-[#064E3B]/20 hover:border-[#F59E0B] hover:bg-[#F59E0B]/5 bg-[#064E3B]/5"
                                    }`}
                                onClick={() => selectedFiles.length < 3 && document.getElementById("file-upload")?.click()}
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={selectedFiles.length >= 3}
                                />
                                <Upload className="mx-auto mb-4 text-[#064E3B]/40" size={40} />
                                <p className="text-[#064E3B] font-black uppercase italic tracking-tighter">Fotoğrafları buraya sürükleyin veya tıklayın</p>
                                <p className="text-xs text-[#1A1A1A]/40 font-bold italic mt-2">Kalan yükleme hakkı: {3 - selectedFiles.length}</p>
                            </div>

                            {/* Previews & Titles */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-8 space-y-6">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="flex flex-col md:flex-row gap-6 p-4 bg-white rounded-xl border-2 border-[#064E3B]/10 shadow-md">
                                            <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 border-2 border-[#064E3B]/5">
                                                <Image src={preview} alt={`Preview ${index}`} fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 shadow-lg"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <div className="flex-grow space-y-2">
                                                <Label className="font-bold text-[#1A1A1A] uppercase text-xs tracking-widest italic">Eser Adı {index + 1}</Label>
                                                <Input
                                                    {...register(`photoTitles.${index}.value`)}
                                                    className="bg-white border-neutral-200 text-[#1A1A1A] placeholder:text-neutral-300 focus:ring-[#064E3B] focus:border-[#064E3B]"
                                                    placeholder="Örn: Kütahya Kalesi'nde İftar"
                                                />
                                                {errors.photoTitles?.[index]?.value && (
                                                    <p className="text-red-500 text-sm font-bold mt-1">{errors.photoTitles[index]?.value?.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Confirmations */}
                    <div className="space-y-4 bg-white p-6 rounded-2xl border-4 border-[#064E3B]/5 shadow-lg">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="kvkk"
                                onCheckedChange={(checked: boolean) => setValue("kvkk", checked)}
                                className="mt-1 border-neutral-300 data-[state=checked]:bg-[#064E3B] data-[state=checked]:border-[#064E3B]"
                            />
                            <Label htmlFor="kvkk" className="text-sm font-medium text-[#1A1A1A]/70 leading-relaxed cursor-pointer italic">
                                6698 sayılı KVKK kapsamında kişisel verilerimin işlenmesini ve fotoğraflarımın sergi/sosyal medya amaçlı kullanımını kabul ediyorum.
                            </Label>
                        </div>
                        {errors.kvkk && <p className="text-red-500 text-sm font-bold ml-8">{errors.kvkk.message}</p>}

                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="authenticity"
                                onCheckedChange={(checked: boolean) => setValue("authenticity", checked)}
                                className="mt-1 border-neutral-300 data-[state=checked]:bg-[#064E3B] data-[state=checked]:border-[#064E3B]"
                            />
                            <Label htmlFor="authenticity" className="text-sm font-medium text-[#1A1A1A]/70 leading-relaxed cursor-pointer italic">
                                Fotoğrafların tamamen şahsıma ait olduğunu, yapay zeka kullanılmadığını ve profesyonel manipülasyon (aşırı oynama) yapılmadığını taahhüt ederim.
                            </Label>
                        </div>
                        {errors.authenticity && <p className="text-red-500 text-sm font-bold ml-8">{errors.authenticity.message}</p>}

                        <div className="pt-4 border-t border-neutral-100 space-y-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <a
                                    href="https://docs.google.com/document/d/1QjkzaK2elcV69G1mm5Phm5u99VYsQg_clTXmp2k-Dy0/edit?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-neutral-50 text-[#064E3B] text-sm font-black uppercase italic tracking-tighter transition-all border-2 border-[#064E3B]/10 shadow-sm"
                                >
                                    Yarışma Şartnamesini Oku
                                </a>
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="specsRead"
                                        onCheckedChange={(checked: boolean) => setValue("specsRead", checked)}
                                        className="border-neutral-300 data-[state=checked]:bg-[#064E3B] data-[state=checked]:border-[#064E3B]"
                                    />
                                    <Label htmlFor="specsRead" className="text-sm font-black text-[#064E3B] leading-relaxed cursor-pointer uppercase italic tracking-tighter underline decoration-[#F59E0B] decoration-2 underline-offset-4">
                                        Şartnameyi Okudum, Anladım ve Kabul Ediyorum
                                    </Label>
                                </div>
                            </div>
                            {errors.specsRead && <p className="text-red-500 text-sm font-bold">{errors.specsRead.message}</p>}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-8 text-xl font-black bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-2xl transition-all shadow-xl shadow-[#F59E0B]/20 hover:shadow-2xl hover:shadow-[#F59E0B]/40 disabled:opacity-50 uppercase italic tracking-widest"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Gönderiliyor...
                            </>
                        ) : (
                            "Başvuruyu Tamamla"
                        )}
                    </Button>

                    <div className="pt-8 text-center pb-12">
                        <div className="inline-flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#064E3B] italic">Teknik Destek:</span>
                            <a
                                href="https://wa.me/905357120918"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#064E3B] hover:text-[#F59E0B] transition-colors"
                                title="WhatsApp ile iletişime geçin"
                            >
                                <Phone size={16} />
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
