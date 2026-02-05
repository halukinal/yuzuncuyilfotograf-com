"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function LandingNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50">
            <div className="bg-[#064E3B] h-[55px] flex items-center justify-between px-4 sm:px-8 text-white shadow-sm">
                <div className="flex items-center gap-4 text-sm font-medium overflow-hidden whitespace-nowrap">
                    <span className="hidden md:inline italic">Yüzüncü Yıl Tarih Kültür Sanat ve Fotoğraf Derneği</span>
                    <span className="md:hidden">YYTKSFD</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="#" className="text-[#F59E0B] hover:text-white transition-colors"><Facebook size={18} /></Link>
                    <Link href="#" className="text-[#F59E0B] hover:text-white transition-colors"><Twitter size={18} /></Link>
                    <Link href="#" className="text-[#F59E0B] hover:text-white transition-colors"><Instagram size={18} /></Link>
                    <Link href="#" className="text-[#F59E0B] hover:text-white transition-colors"><Youtube size={18} /></Link>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="bg-[#FFFBEB] h-[61px] flex items-center justify-between px-4 sm:px-8 text-[#1A1A1A] shadow-md border-b border-[#064E3B]/10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-white p-1 rounded-sm relative h-8 w-10 border border-neutral-100">
                        <Image src="/dernek-logo.jpeg" alt="Dernek Logo" fill className="object-contain" />
                    </div>
                    <span className="font-black tracking-tighter text-[10px] md:text-sm uppercase text-[#064E3B] leading-none">
                        Yüzüncü Yıl Tarih Kültür Sanat<br /> Ve Fotoğraf Derneği
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                    <Link href="#hakkimizda" className="hover:text-[#F59E0B] transition-colors">Hakkımızda</Link>
                    <Link href="#kurallar" className="hover:text-[#F59E0B] transition-colors">Kurallar</Link>
                    <Link href="#oduller" className="hover:text-[#F59E0B] transition-colors">Ödüller</Link>
                    <Link href="#juri" className="hover:text-[#F59E0B] transition-colors">Jüri</Link>
                    <Link href="/basvuru">
                        <Button className="bg-[#064E3B] hover:bg-[#053d2e] text-[#FFFBEB] border-none px-6 rounded-md shadow-lg shadow-[#064E3B]/20">
                            Hemen Başvur
                        </Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="lg:hidden text-[#064E3B]" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-[116px] left-0 w-full bg-[#FFFBEB] border-t border-[#064E3B]/10 flex flex-col p-6 gap-4 text-[#1A1A1A] shadow-2xl"
                    >
                        <Link href="#hakkimizda" onClick={() => setIsOpen(false)} className="py-2 border-b border-neutral-200 uppercase tracking-widest text-xs font-bold text-[#064E3B]">Hakkımızda</Link>
                        <Link href="#kurallar" onClick={() => setIsOpen(false)} className="py-2 border-b border-neutral-200 uppercase tracking-widest text-xs font-bold text-[#064E3B]">Kurallar</Link>
                        <Link href="#oduller" onClick={() => setIsOpen(false)} className="py-2 border-b border-neutral-200 uppercase tracking-widest text-xs font-bold text-[#064E3B]">Ödüller</Link>
                        <Link href="#juri" onClick={() => setIsOpen(false)} className="py-2 border-b border-neutral-200 uppercase tracking-widest text-xs font-bold text-[#064E3B]">Jüri</Link>
                        <Link href="/basvuru" onClick={() => setIsOpen(false)} className="mt-4">
                            <Button className="w-full bg-[#064E3B] hover:bg-[#053d2e] text-[#FFFBEB] py-6 text-lg font-black uppercase italic tracking-tighter">
                                Hemen Başvur
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
