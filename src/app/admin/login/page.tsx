'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Coffee, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Changed to stronger password to avoid Chrome "Data Breach" warning
        if (username === 'admin' && password === 'Coffee@2024') {
            localStorage.setItem('isAdmin', 'true');
            document.cookie = "isAdmin=true; path=/";

            toast.success('ยินดีต้อนรับกลับสู่ระบบจัดการร้าน');
            router.push('/admin');
        } else {
            toast.error('รหัสผ่านไม่ถูกต้อง');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side: Hero Image */}
            <div className="relative hidden lg:block h-full">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80"
                    alt="Coffee Shop Login"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="relative z-20 h-full flex flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-2">
                        <Coffee className="h-8 w-8" />
                        <span className="text-2xl font-heading font-bold">Coffee House</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-heading font-bold mb-4">
                            Manage Your<br />Coffee Shop Empire
                        </h1>
                        <p className="text-lg opacity-90 max-w-md">
                            ระบบจัดการร้านกาแฟที่ครบครัน จัดการเมนู ออเดอร์ และการตั้งค่าร้านค้าได้ในที่เดียว
                        </p>
                    </div>
                    <div className="text-sm opacity-70">
                        © 2024 Coffee House Admin Portal
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center p-8 bg-background relative">
                <div className="absolute top-8 right-8">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
                        </Button>
                    </Link>
                </div>
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-heading font-bold tracking-tight">เข้าสู่ระบบ</h2>
                        <p className="text-muted-foreground">ป้อนข้อมูลเพื่อเข้าถึงหน้าจัดการร้านค้า</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">ชื่อผู้ใช้</Label>
                            <Input id="username" name="username" placeholder="admin" required className="h-11" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">รหัสผ่าน</Label>
                                <span className="text-xs text-muted-foreground">Coffee@2024</span>
                            </div>
                            <Input id="password" name="password" type="password" placeholder="••••••••" required className="h-11" />
                        </div>

                        <Button type="submit" className="w-full h-11 text-base group" disabled={loading}>
                            {loading ? 'กำลังเข้าสู่ระบบ...' : (
                                <>
                                    เข้าสู่ระบบ <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        <p>ติดปัญหาการใช้งาน? ติดต่อทีม Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
