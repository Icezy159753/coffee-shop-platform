'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart-store';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { categories } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/stores/product-store';
import { Navbar } from '@/components/layout/Navbar';

export default function MenuPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const { products, fetchProducts } = useProductStore();
    const [activeCategory, setActiveCategory] = useState('all');
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        fetchProducts();
    }, []);

    if (!mounted) return null;

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.categoryId === activeCategory);

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-heading font-bold">เมนูของเรา</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        คัดสรรวัตถุดิบคุณภาพเยี่ยม เพื่อส่งมอบรสชาติที่ดีที่สุดให้คุณ
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                    <Button
                        variant={activeCategory === 'all' ? 'default' : 'outline'}
                        onClick={() => setActiveCategory('all')}
                        className="rounded-full"
                    >
                        ทั้งหมด
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={activeCategory === category.id ? 'default' : 'outline'}
                            onClick={() => setActiveCategory(category.id)}
                            className="rounded-full"
                        >
                            {category.nameTh}
                        </Button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden group">
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Quick Add Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                size="lg"
                                                className="rounded-full font-bold"
                                                onClick={() => {
                                                    addItem({
                                                        id: product.id,
                                                        name: product.name,
                                                        nameTh: product.nameTh,
                                                        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                                                        image: product.image,
                                                    } as any);
                                                    toast.success(`เพิ่ม ${product.nameTh} ลงตะกร้าแล้ว`);
                                                }}
                                            >
                                                <Plus className="mr-2 h-5 w-5" /> เพิ่มลงตะกร้า
                                            </Button>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <CardTitle className="text-lg">{product.nameTh}</CardTitle>
                                                <CardDescription className="text-xs font-medium text-primary mt-1">
                                                    {product.name}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="secondary" className="font-bold whitespace-nowrap">
                                                ฿{product.price}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {product.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        ไม่พบสินค้าในหมวดหมู่นี้
                    </div>
                )}
            </div>
        </>
    );
}
