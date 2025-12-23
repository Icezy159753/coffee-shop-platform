'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { useSettingsStore } from '@/stores/settings-store';
import { useProductStore } from '@/stores/product-store';
import { useEffect, useState } from 'react';

export default function Home() {
    const { products, fetchProducts } = useProductStore();
    const featuredProducts = products.slice(0, 3);
    const { shopName, heroTitle, heroDescription, heroImage } = useSettingsStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-background py-16 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-heading font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
                                    {mounted ? heroTitle : 'Coffee House'}
                                </h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-body">
                                    {mounted ? heroDescription : 'สัมผัสรสชาติกาแฟแท้ พร้อมขนมอบสดใหม่ทุกวัน ในบรรยากาศที่อบอุ่นเหมือนบ้าน'}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Link href="/menu">
                                    <Button size="lg" className="h-12 px-8 text-lg font-bold shadow-lg hover:scale-105 transition-transform">
                                        สั่งเลย <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button variant="outline" size="lg" className="h-12 px-8 text-lg hover:bg-secondary/10">
                                        ดูเพิ่มเติม
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="mt-16 sm:mt-24">
                            <div className="relative mx-auto w-full max-w-5xl rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden aspect-[16/9] lg:aspect-[2/1]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                    src={mounted ? heroImage : "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1600"}
                                    alt="Coffee Shop Atmosphere"
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 z-20 text-white text-left">
                                    <p className="text-xl font-bold">เปิดบริการทุกวัน</p>
                                    <p className="opacity-90">07:00 - 20:00 น.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-16 md:py-24 bg-secondary/10">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {[
                                { icon: Star, title: "เมล็ดกาแฟพรีเมียม", desc: "คัดสรรเมล็ดพันธุ์ดีจากทั่วโลก" },
                                { icon: Clock, title: "สดใหม่ทุกวัน", desc: "อบขนมและคั่วกาแฟใหม่เสมอ" },
                                { icon: MapPin, title: "12 สาขาทั่วเมือง", desc: "ใกล้คุณ สะดวกทุกการเดินทาง" }
                            ].map((feature, i) => (
                                <Card key={i} className="border-none shadow-md bg-white hover:-translate-y-1 transition-transform duration-300">
                                    <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                                            <feature.icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="font-heading font-bold text-xl">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Menu Preview */}
                <section className="py-16 md:py-24 container px-4 md:px-6">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-heading font-bold tracking-tight md:text-4xl text-foreground">
                                เมนูยอดนิยม
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                คัดสรรมาเพื่อคุณโดยเฉพาะ
                            </p>
                        </div>
                        <Link href="/menu" className="hidden md:block">
                            <Button variant="ghost" className="text-primary hover:text-primary/80">
                                ดูเมนูทั้งหมด <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product) => (
                            <Card key={product.id} className="group overflow-hidden border-none shadow-lg">
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={product.image}
                                        alt={product.nameTh}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <Badge className="absolute top-4 right-4 bg-primary text-white shadow-md">
                                        ขายดี
                                    </Badge>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{product.nameTh}</h3>
                                            <p className="text-sm text-muted-foreground">{product.name}</p>
                                        </div>
                                        <span className="font-bold text-lg text-primary">฿{product.price}</span>
                                    </div>
                                    <Link href="/menu">
                                        <Button className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                            สั่งเลย
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/menu">
                            <Button variant="outline" className="w-full">
                                ดูเมนูทั้งหมด
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
