"use client";

import { useState } from "react";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false); // Kayıt modu kontrolü
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useStore();

    // Giriş veya Kayıt İşlemi
    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let userCredential;
            
            if (isRegister) {
                // KAYIT OLMA İŞLEMİ
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                toast.success("Hesap başarıyla oluşturuldu!");
            } else {
                // GİRİŞ YAPMA İŞLEMİ
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                toast.success("Giriş başarılı!");
            }

            setUser(userCredential.user);
            router.push("/"); // Ana sayfaya yönlendir

        } catch (error: any) {
            console.error(error);
            let message = "Bir hata oluştu.";
            
            // Kullanıcı dostu hata mesajları
            if (error.code === 'auth/email-already-in-use') message = "Bu e-mail zaten kullanımda.";
            else if (error.code === 'auth/invalid-credential') message = "E-mail veya şifre hatalı.";
            else if (error.code === 'auth/weak-password') message = "Şifre çok zayıf (en az 6 karakter olmalı).";
            
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            toast.success("Google ile giriş başarılı!");
            router.push("/");
        } catch (error: any) {
            console.error(error);
            toast.error("Google girişi başarısız: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-950 px-4">
            <Card className="w-full max-w-md border-neutral-800 bg-neutral-900 text-neutral-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">
                        {isRegister ? "Hesap Oluştur" : "Giriş Yap"}
                    </CardTitle>
                    <CardDescription className="text-neutral-400">
                        {isRegister 
                            ? "Fotoğraf oylamasına katılmak için kayıt olun" 
                            : "Oylamaya devam etmek için giriş yapın"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleAuthAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-neutral-950 border-neutral-800 focus:ring-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="bg-neutral-950 border-neutral-800 focus:ring-white"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-neutral-200"
                            disabled={loading}
                        >
                            {loading 
                                ? "İşlem yapılıyor..." 
                                : (isRegister ? "Kayıt Ol" : "Giriş Yap")}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-neutral-400 mt-4">
                        {isRegister ? "Zaten hesabın var mı? " : "Hesabın yok mu? "}
                        <button 
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-white hover:underline font-medium"
                        >
                            {isRegister ? "Giriş Yap" : "Kayıt Ol"}
                        </button>
                    </div>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-neutral-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-neutral-900 px-2 text-neutral-400">
                                Veya
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full border-neutral-800 hover:bg-neutral-800 hover:text-white"
                        disabled={loading}
                    >
                        Google ile Devam Et
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}