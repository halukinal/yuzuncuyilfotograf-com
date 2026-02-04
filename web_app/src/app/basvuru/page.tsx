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
import { Loader2, Upload, X, GraduationCap, Briefcase, Camera } from "lucide-react";
import Image from "next/image";

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
        <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#C5B358]/50 shadow-[0_0_20px_rgba(197,179,88,0.2)]">
                        <Image src="/dernek-logo.jpeg" alt="DPU Logo" fill className="object-cover" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
                        Objektifimden Kütahya’da Ramazan
                    </h1>
                    <p className="text-neutral-400 max-w-lg mx-auto">
                        DPÜ Fotoğraf Yarışması başvuru formuna hoş geldiniz. Lütfen bilgilerinizi eksiksiz doldurunuz.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Identity Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setValue("userType", "student")}
                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${userType === "student"
                                ? "border-[#C5B358] bg-[#C5B358]/10 ring-2 ring-[#C5B358]/20"
                                : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                                }`}
                        >
                            <GraduationCap className={userType === "student" ? "text-[#C5B358]" : "text-neutral-400"} size={32} />
                            <span className="font-semibold">Öğrenciyim</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue("userType", "staff")}
                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${userType === "staff"
                                ? "border-[#C5B358] bg-[#C5B358]/10 ring-2 ring-[#C5B358]/20"
                                : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
                                }`}
                        >
                            <Briefcase className={userType === "staff" ? "text-[#C5B358]" : "text-neutral-400"} size={32} />
                            <span className="font-semibold">Akademik/İdari Personelim</span>
                        </button>
                    </div>

                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white">Kişisel Bilgiler</CardTitle>
                            <CardDescription className="text-neutral-400">
                                Lütfen kurumsal e-posta adresinizi kullanın.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Ad Soyad</Label>
                                <Input
                                    id="fullName"
                                    {...register("fullName")}
                                    className="bg-neutral-800 border-neutral-700 focus:ring-[#C5B358] focus:border-[#C5B358]"
                                    placeholder="Ahmet Yılmaz"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="idNumber">
                                        {userType === "student" ? "Okul Numarası" : "Personel Sicil No"}
                                    </Label>
                                    <Input
                                        id="idNumber"
                                        {...register("idNumber")}
                                        className="bg-neutral-800 border-neutral-700"
                                        placeholder={userType === "student" ? "2023123456" : "S12345"}
                                    />
                                    {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Kurumsal E-posta</Label>
                                    <Input
                                        id="email"
                                        {...register("email")}
                                        className="bg-neutral-800 border-neutral-700"
                                        placeholder={userType === "student" ? "isim@ogr.dpu.edu.tr" : "isim@dpu.edu.tr"}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Upload Area */}
                    <Card className="bg-neutral-900 border-neutral-800 overflow-hidden">
                        <CardHeader className="bg-neutral-900/50">
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Camera size={20} className="text-[#C5B358]" />
                                Fotoğraf Yükle
                            </CardTitle>
                            <CardDescription className="text-neutral-400">
                                En fazla 3 adet, her biri 1MB-10MB arası, .jpg formatında fotoğraf.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${selectedFiles.length >= 3
                                    ? "border-neutral-800 bg-neutral-900/50 cursor-not-allowed"
                                    : "border-neutral-700 hover:border-[#C5B358]/50 hover:bg-[#C5B358]/5"
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
                                <Upload className="mx-auto mb-4 text-neutral-500" size={40} />
                                <p className="text-neutral-300 font-medium">Fotoğrafları buraya sürükleyin veya tıklayın</p>
                                <p className="text-xs text-neutral-500 mt-2">Kalan yükleme hakkı: {3 - selectedFiles.length}</p>
                            </div>

                            {/* Previews & Titles */}
                            {selectedFiles.length > 0 && (
                                <div className="mt-8 space-y-6">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="flex flex-col md:flex-row gap-6 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                                            <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image src={preview} alt={`Preview ${index}`} fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <div className="flex-grow space-y-2">
                                                <Label>Eser Adı {index + 1}</Label>
                                                <Input
                                                    {...register(`photoTitles.${index}.value`)}
                                                    className="bg-neutral-800 border-neutral-700"
                                                    placeholder="Örn: Kütahya Kalesi'nde İftar"
                                                />
                                                {errors.photoTitles?.[index]?.value && (
                                                    <p className="text-red-500 text-sm">{errors.photoTitles[index]?.value?.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Confirmations */}
                    <div className="space-y-4 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="kvkk"
                                onCheckedChange={(checked: boolean) => setValue("kvkk", checked)}
                                className="mt-1 border-neutral-600 data-[state=checked]:bg-[#C5B358] data-[state=checked]:border-[#C5B358]"
                            />
                            <Label htmlFor="kvkk" className="text-sm font-normal text-neutral-400 leading-relaxed cursor-pointer">
                                6698 sayılı KVKK kapsamında kişisel verilerimin işlenmesini ve fotoğraflarımın sergi/sosyal medya amaçlı kullanımını kabul ediyorum.
                            </Label>
                        </div>
                        {errors.kvkk && <p className="text-red-500 text-sm ml-8">{errors.kvkk.message}</p>}

                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="authenticity"
                                onCheckedChange={(checked: boolean) => setValue("authenticity", checked)}
                                className="mt-1 border-neutral-600 data-[state=checked]:bg-[#C5B358] data-[state=checked]:border-[#C5B358]"
                            />
                            <Label htmlFor="authenticity" className="text-sm font-normal text-neutral-400 leading-relaxed cursor-pointer">
                                Fotoğrafların tamamen şahsıma ait olduğunu, yapay zeka kullanılmadığını ve profesyonel manipülasyon (aşırı oynama) yapılmadığını taahhüt ederim.
                            </Label>
                        </div>
                        {errors.authenticity && <p className="text-red-500 text-sm ml-8">{errors.authenticity.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-6 text-lg font-bold bg-[#C5B358] hover:bg-[#B3A24B] text-black rounded-2xl transition-all shadow-[0_4px_20px_rgba(197,179,88,0.3)] hover:shadow-[0_6px_25px_rgba(197,179,88,0.4)] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Gönderiliyor...
                            </>
                        ) : (
                            "Başvuruyu Tamamla"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
