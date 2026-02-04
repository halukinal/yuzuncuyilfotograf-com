"use client";

import { LandingNavbar } from "@/components/LandingNavbar";
import { LandingFooter } from "@/components/LandingFooter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Camera, Calendar, Award, Users, ChevronRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-[#FFFBEB] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#F59E0B] selection:text-white">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden pt-[116px]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-ramadan.png"
                        alt="Dumlupınar Ramadan"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B] via-[#064E3B]/60 to-[#064E3B]/40" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-4 max-w-5xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-sm font-bold uppercase tracking-widest mb-8"
                    >
                        <Camera size={16} /> 2026 Ramazan Fotoğraf Yarışmasına Hoş Geldiniz
                    </motion.div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tighter uppercase italic text-[#FFFBEB] pb-2">
                        Objektifimden <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-yellow-400">
                            Kütahya’da Ramazan
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-[#FFFBEB]/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Ramazan ayının manevi coşkusunu, geleneksel güzelliklerini ve paylaşma kültürünü Kütahya'nın her köşesinde senin gözünden görmek istiyoruz.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/basvuru">
                            <Button size="lg" className="bg-[#F59E0B] hover:bg-[#D97706] text-[#064E3B] px-10 py-8 text-xl font-black rounded-xl shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all hover:scale-105 border-none">
                                Başvuru Yap <ChevronRight className="ml-2" />
                            </Button>
                        </Link>
                        <Link href="#kurallar">
                            <Button size="lg" variant="outline" className="border-[#FFFBEB]/30 hover:bg-[#FFFBEB]/10 px-10 py-8 text-xl font-bold rounded-xl text-[#FFFBEB]">
                                Kuralları Oku
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <div className="absolute bottom-0 left-0 w-full bg-[#064E3B]/80 backdrop-blur-md border-t border-[#F59E0B]/20 py-6 text-[#FFFBEB]">
                    <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center border-r border-[#FFFBEB]/10 last:border-none">
                            <span className="text-[#F59E0B] font-black text-2xl md:text-3xl tracking-tighter italic">13 MART 2026</span>
                            <span className="text-xs uppercase text-[#FFFBEB]/60 font-bold tracking-widest">Son Başvuru</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-[#FFFBEB]/10 last:border-none">
                            <span className="text-[#F59E0B] font-black text-2xl md:text-3xl tracking-tighter italic">50.000 TL+</span>
                            <span className="text-xs uppercase text-[#FFFBEB]/60 font-bold tracking-widest">Toplam Ödül</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-[#FFFBEB]/10 last:border-none">
                            <span className="text-[#F59E0B] font-black text-2xl md:text-3xl tracking-tighter italic">DİJİTAL</span>
                            <span className="text-xs uppercase text-[#FFFBEB]/60 font-bold tracking-widest">Kategori</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-[#FFFBEB]/10 last:border-none">
                            <span className="text-[#F59E0B] font-black text-2xl md:text-3xl tracking-tighter italic">11 JÜRİ</span>
                            <span className="text-xs uppercase text-[#FFFBEB]/60 font-bold tracking-widest">Seçici Kurul</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="hakkimizda" className="py-24 px-4 sm:px-8 bg-[#FFFBEB]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="space-y-8"
                    >
                        <motion.div variants={itemVariants} className="inline-block px-3 py-1 bg-[#064E3B]/10 border border-[#064E3B]/20 rounded text-[#064E3B] font-bold text-xs uppercase italic tracking-tighter">
                            Bize Dair
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-[#1A1A1A]">
                            Yarışma <br /> <span className="text-[#064E3B]">Hakkında</span>
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-lg text-[#1A1A1A]/70 leading-relaxed italic">
                            Yarışma kapsamında; Ramazan ayının geleneksel güzellikleri, camilerdeki manevi atmosfer, iftar öncesi pide kuyrukları, akşam vakti mahya ve kandillerin renkli ışıltıları, Ramazan’ın manevi coşkusu ve paylaşma kültürü fotoğraf kareleriyle yansıtılacaktır.
                        </motion.p>
                        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                "Manevi Atmosfer",
                                "Geleneksel Güzellikler",
                                "Toplumsal Yardımlaşma",
                                "30 Eserlik Özel Sergi"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-[#1A1A1A] font-bold italic uppercase tracking-tighter border-l-2 border-[#F59E0B] pl-4">
                                    {item}
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                    <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden border-4 border-[#064E3B]/10 shadow-2xl">
                        <Image src="/about-ramadan.png" alt="Contest Traditions" fill className="object-cover" />
                    </div>
                </div>
            </section>

            <section id="kurallar" className="py-24 bg-[#064E3B] px-4 sm:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-[#FFFBEB]">Yarışma Kuralları</h2>
                        <div className="w-24 h-1 bg-[#F59E0B] mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Kapsam", content: "Kütahya Dumlupınar Üniversitesi öğrencileri, akademik ve idari personeline açıktır.", icon: <Users size={32} className="text-[#F59E0B]" /> },
                            { title: "Ekipman", content: "Fotoğraf makinesi, drone, tablet ve cep telefonu ile çekilmiş fotoğraflar kabul edilir.", icon: <Camera size={32} className="text-[#F59E0B]" /> },
                            { title: "E-Posta", content: "Başvuru için @ogr.dpu.edu.tr veya @dpu.edu.tr uzantılı kurumsal e-posta adresi zorunludur.", icon: <Calendar size={32} className="text-[#F59E0B]" /> },
                            { title: "Sayı", content: "Her katılımcı en fazla 3 (üç) adet eserle katılabilir.", icon: <ChevronRight size={32} className="text-[#F59E0B]" /> },
                            { title: "Etik", content: "Yapay zeka ile üretilen veya manipüle edilmiş fotoğraflar kesinlikle kabul edilmez.", icon: <ChevronRight size={32} className="text-[#F59E0B]" /> },
                            { title: "Kısıtlama", content: "Eser üzerinde isim, numara, imza veya logo gibi görsel özellikler bulunmamalıdır.", icon: <CheckCircle2 size={32} className="text-[#F59E0B]" /> },
                        ].map((rule, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 bg-[#FFFBEB] border-none rounded-3xl shadow-xl transition-all hover:-translate-y-2 group"
                            >
                                <div className="mb-6">{rule.icon}</div>
                                <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter text-[#064E3B]">{rule.title}</h3>
                                <p className="text-[#1A1A1A]/60 text-sm leading-relaxed font-bold">{rule.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="oduller" className="py-24 bg-[#FFFBEB] px-4 sm:px-8 relative overflow-hidden border-t border-[#064E3B]/10">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tightest leading-none text-[#1A1A1A]">
                            Büyük <span className="text-[#064E3B]">Ödüller</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                        {/* 2.lik */}
                        <div className="order-2 md:order-1 flex flex-col items-center">
                            <div className="w-full bg-[#FFFBEB] border-4 border-[#064E3B]/10 rounded-t-3xl p-8 text-center space-y-4 shadow-xl">
                                <Award size={48} className="text-neutral-400 mx-auto" />
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#1A1A1A]">İkincilik Ödülü</h3>
                                <p className="text-[#064E3B] text-3xl font-black">15.000 TL</p>
                            </div>
                            <div className="w-full h-16 bg-[#064E3B]/5" />
                        </div>

                        {/* 1.lik */}
                        <div className="order-1 md:order-2 flex flex-col items-center scale-105 z-20">
                            <div className="w-full bg-[#064E3B] rounded-t-3xl p-10 text-center space-y-6 shadow-2xl shadow-[#064E3B]/40">
                                <div className="relative">
                                    <Award size={64} className="text-[#F59E0B] mx-auto animate-bounce" />
                                    <div className="absolute inset-0 blur-2xl bg-[#F59E0B]/20" />
                                </div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tightest text-[#FFFBEB]">Birincilik Ödülü</h3>
                                <div className="space-y-1">
                                    <p className="text-[#F59E0B] text-5xl font-black tracking-tighter">20.000 TL</p>
                                    <p className="text-[#FFFBEB]/60 text-xs uppercase font-bold tracking-widest">+ Başarı Belgesi</p>
                                </div>
                            </div>
                            <div className="w-full h-24 bg-[#064E3B]/90" />
                        </div>

                        {/* 3.lük */}
                        <div className="order-3 md:order-3 flex flex-col items-center">
                            <div className="w-full bg-[#FFFBEB] border-4 border-[#064E3B]/10 rounded-t-3xl p-8 text-center space-y-4 shadow-xl">
                                <Award size={48} className="text-amber-800 mx-auto" />
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#1A1A1A]">Üçüncülük Ödülü</h3>
                                <p className="text-[#064E3B] text-3xl font-black">10.000 TL</p>
                            </div>
                            <div className="w-full h-12 bg-[#064E3B]/5" />
                        </div>
                    </div>

                    <div className="mt-12 bg-[#1A1A1A] p-6 rounded-xl text-center italic text-[#FFFBEB] font-bold">
                        Ayrıca Mansiyon Ödülleri (3.000 TL her biri) ve tüm katılımcılara Katılım Sertifikası verilecektir.
                    </div>
                </div>
            </section>

            <section id="juri" className="py-24 bg-[#064E3B] px-4 sm:px-8 border-t border-[#F59E0B]/10">
                <div className="max-w-7xl mx-auto text-[#FFFBEB]">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Seçici <span className="text-[#F59E0B]">Kurul</span></h2>
                            <p className="text-[#FFFBEB]/70 font-medium italic mt-2 italic">Değerli akademisyenler ve sanatçılardan oluşan jürimiz.</p>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-widest text-[#F59E0B] mb-8 border-l-4 border-[#F59E0B] pl-4">Düzenleme Kurulu</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: "Prof. Dr. Süleyman KIZILTOPRAK", role: "DPÜ Rektörü" },
                                    { name: "Öğr. Gör. Mustafa Çağrı DEMİR", role: "Düzenleme Kurulu Üyesi" },
                                    { name: "Yaşar SAYGILI", role: "Dernek Başkanı" }
                                ].map((member, idx) => (
                                    <div key={idx} className="p-6 bg-[#FFFBEB]/5 rounded-2xl border border-[#FFFBEB]/10 hover:border-[#F59E0B]/30 transition-colors">
                                        <h4 className="font-black text-lg uppercase italic tracking-tighter text-[#F59E0B]">{member.name}</h4>
                                        <p className="text-[#FFFBEB]/50 text-xs uppercase font-bold tracking-widest mt-1">{member.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-widest text-[#F59E0B] mb-8 border-l-4 border-[#F59E0B] pl-4">Jüri Üyeleri</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { name: "Amil ÜÇBAŞ", role: "Jüri Başkanı / Fotoğraf Sanatçısı" },
                                    { name: "Mehmet Sabri TEZCAN", role: "KÜSAD Üyesi" },
                                    { name: "Doç. Dr. Gökhan KUZUCANLI", role: "Akademisyen" },
                                    { name: "Dr. Öğr. Üyesi İrem Aksoy", role: "Akademisyen" },
                                    { name: "Doç. Dr. Pınar YAZKAÇ", role: "Akademisyen" },
                                    { name: "Haluk İNAL", role: "Videograf / Dernek Üyesi" },
                                    { name: "Abdulkadir AKTAŞ", role: "Grafik Tasarımcı / Dernek Üyesi" },
                                    { name: "Yusuf ARSLAN", role: "Fotoğraf Sanatçısı" },
                                    { name: "Mehmet YAYLIOĞLU", role: "Gazeteci" }
                                ].map((juror, idx) => (
                                    <div key={idx} className="p-6 bg-[#FFFBEB]/5 rounded-2xl border border-[#FFFBEB]/10 hover:border-[#F59E0B]/30 transition-colors">
                                        <h4 className="font-black text-lg uppercase italic tracking-tighter">{juror.name}</h4>
                                        <p className="text-[#FFFBEB]/50 text-xs uppercase font-bold tracking-widest mt-1">{juror.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#F59E0B] px-4 sm:px-8">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-7xl font-black text-[#064E3B] uppercase italic tracking-tighter leading-none">
                        Yarışmaya Katılmak <br /> İçin Hazır mısın?
                    </h2>
                    <div className="space-y-4">
                        <div className="flex flex-col items-center gap-2">
                            <Link
                                href="https://docs.google.com/document/d/1QjkzaK2elcV69G1mm5Phm5u99VYsQg_clTXmp2k-Dy0/edit?usp=sharing"
                                target="_blank"
                                className="inline-flex items-center gap-2 bg-[#FFFBEB] text-[#064E3B] px-6 py-3 rounded-full font-black uppercase text-xs hover:bg-white transition-all shadow-lg italic"
                            >
                                Yarışma Şartnamesini Oku
                            </Link>
                            <p className="text-[#064E3B] font-black text-xs uppercase italic tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={14} /> Şartnameyi okudum ve kabul ediyorum.
                            </p>
                        </div>

                        <Link href="/basvuru" className="inline-block">
                            <Button size="lg" className="bg-[#064E3B] hover:bg-[#053d2e] text-[#FFFBEB] px-12 py-10 text-2xl font-black uppercase rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 italic tracking-tighter border-none">
                                BAŞVURU FORMUNA GİT
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
