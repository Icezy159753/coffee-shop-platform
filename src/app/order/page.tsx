'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart-store';
import { useProductStore } from '@/stores/product-store';
import { categories } from '@/lib/mock-data';
import { ShoppingCart, Home, Coffee, ArrowRight, Receipt, Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface PendingOrder {
    id: string;
    total: number;
    items: any[];
    status: string;
}

function OrderPageContent() {
    const searchParams = useSearchParams();
    const tableNumber = searchParams.get('table');

    const [mounted, setMounted] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const { products, fetchProducts } = useProductStore();
    const { items, addItem, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

    const fetchPendingOrders = async () => {
        if (!tableNumber) return;
        try {
            const res = await fetch(`/api/orders?table=${tableNumber}`);
            const data = await res.json();
            setPendingOrders(data);
        } catch (error) {
            console.error('Failed to fetch pending orders:', error);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchProducts();
        fetchPendingOrders();
    }, []);

    if (!mounted) return null;

    if (!tableNumber) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="max-w-md mx-auto text-center p-8">
                    <CardTitle className="mb-4">กรุณาแสกน QR Code ที่โต๊ะ</CardTitle>
                    <p className="text-muted-foreground mb-4">หน้านี้สำหรับลูกค้าที่นั่งในร้านเท่านั้น</p>
                    <Link href="/"><Button>กลับหน้าหลัก</Button></Link>
                </Card>
            </div>
        );
    }

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.categoryId === activeCategory);

    const cartTotal = items.reduce((acc, item) => acc + item.quantity, 0);
    const total = totalPrice();
    const pendingTotal = pendingOrders.reduce((acc, order) => acc + order.total, 0);
    const grandTotal = pendingTotal + Math.round(total * 1.07);

    // Combine all items from pending orders for display
    const allOrderedItems = pendingOrders.flatMap(order => order.items);

    const handleAddOrder = async () => {
        if (items.length === 0) {
            toast.error('กรุณาเลือกสินค้าก่อนสั่ง');
            return;
        }

        setIsCheckingOut(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    total: Math.round(total * 1.07),
                    items: items,
                    tableNumber: tableNumber,
                    orderType: 'dine-in',
                    status: 'pending'
                }),
            });

            if (res.ok) {
                toast.success('สั่งอาหารเรียบร้อย!');
                clearCart();
                fetchPendingOrders();
            } else {
                toast.error('เกิดข้อผิดพลาด');
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาด');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleCheckBill = async () => {
        if (pendingOrders.length === 0 && items.length === 0) {
            toast.error('ไม่มีรายการที่ต้องชำระ');
            return;
        }

        // Check if any orders are still being cooked (pending)
        const stillCooking = pendingOrders.filter(order => order.status === 'pending');
        if (stillCooking.length > 0) {
            toast.error('ยังมีอาหารที่ครัวกำลังทำอยู่ กรุณารอสักครู่', {
                description: `${stillCooking.length} รายการยังไม่เสร็จ`,
                duration: 5000,
            });
            return;
        }

        // If there are items in cart, order them first
        if (items.length > 0) {
            toast.error('กรุณากดส่งออเดอร์ก่อน');
            return;
        }

        setIsCheckingOut(true);
        try {
            for (const order of pendingOrders) {
                await fetch('/api/orders', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: order.id, status: 'completed' }),
                });
            }

            toast.success(`เช็คบิลสำเร็จ! ยอดรวม ฿${grandTotal.toLocaleString()}`);
            setPendingOrders([]);
        } catch (error) {
            toast.error('เกิดข้อผิดพลาด');
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                                <Home className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Coffee className="h-5 w-5" />
                            <span className="font-heading font-bold text-lg">Coffee House</span>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                        โต๊ะ {tableNumber}
                    </Badge>
                </div>
            </header>

            <div className="flex">
                {/* Left Side - Menu */}
                <div className="flex-1 p-4 pb-20 lg:pb-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Button
                            variant={activeCategory === 'all' ? 'default' : 'outline'}
                            onClick={() => setActiveCategory('all')}
                            className="rounded-full"
                            size="sm"
                        >
                            ทั้งหมด
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={activeCategory === category.id ? 'default' : 'outline'}
                                onClick={() => setActiveCategory(category.id)}
                                className="rounded-full"
                                size="sm"
                            >
                                {category.nameTh}
                            </Button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => {
                                    addItem({
                                        id: product.id,
                                        name: product.name,
                                        nameTh: product.nameTh,
                                        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                                        image: product.image,
                                    } as any);
                                    toast.success(`เพิ่ม ${product.nameTh}`);
                                }}
                            >
                                <div className="aspect-square relative overflow-hidden">
                                    <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                                </div>
                                <CardContent className="p-2">
                                    <h3 className="font-bold text-sm truncate">{product.nameTh}</h3>
                                    <p className="text-primary font-bold text-sm">฿{product.price}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Side - Bill (Desktop) */}
                <div className="hidden lg:block w-80 border-l bg-card sticky top-[60px] h-[calc(100vh-60px)] overflow-auto">
                    <div className="p-4 border-b">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            บิลของคุณ
                        </h2>
                        <p className="text-sm text-muted-foreground">โต๊ะ {tableNumber}</p>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Already Ordered Items */}
                        {allOrderedItems.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">สั่งแล้ว</p>
                                {allOrderedItems.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-dashed">
                                        <span>{item.nameTh || item.name} x{item.quantity}</span>
                                        <span>฿{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-medium pt-1">
                                    <span>รวม (สั่งแล้ว)</span>
                                    <span>฿{pendingTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* Current Cart Items */}
                        {items.length > 0 && (
                            <div className="space-y-2 pt-2 border-t">
                                <p className="text-xs text-muted-foreground font-medium">กำลังจะสั่ง</p>
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm py-1">
                                        <div className="flex-1">
                                            <span>{item.nameTh || item.name}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity - 1); }}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-6 text-center">{item.quantity}</span>
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <span className="font-medium">฿{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-medium pt-1">
                                    <span>รวม (รอสั่ง)</span>
                                    <span>฿{Math.round(total * 1.07).toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {allOrderedItems.length === 0 && items.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                <p>ยังไม่มีรายการ</p>
                                <p className="text-xs">กดที่เมนูเพื่อเพิ่มรายการ</p>
                            </div>
                        )}
                    </div>

                    {/* Bill Footer */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t space-y-2">
                        <div className="flex justify-between text-lg font-bold">
                            <span>ยอดรวมทั้งหมด</span>
                            <span className="text-primary">฿{grandTotal.toLocaleString()}</span>
                        </div>

                        {items.length > 0 && (
                            <Button className="w-full" onClick={handleAddOrder} disabled={isCheckingOut}>
                                <ArrowRight className="mr-2 h-4 w-4" /> ส่งออเดอร์
                            </Button>
                        )}

                        <Button
                            className="w-full"
                            variant={items.length > 0 ? "outline" : "default"}
                            onClick={handleCheckBill}
                            disabled={isCheckingOut || (pendingOrders.length === 0 && items.length === 0)}
                        >
                            <Receipt className="mr-2 h-4 w-4" /> เช็คบิล
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg p-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                            {cartTotal > 0 ? `${cartTotal} รายการในตะกร้า` : `${allOrderedItems.length} รายการที่สั่งแล้ว`}
                        </p>
                        <p className="font-bold text-lg">฿{grandTotal.toLocaleString()}</p>
                    </div>
                    {items.length > 0 ? (
                        <Button onClick={handleAddOrder} disabled={isCheckingOut}>
                            ส่งออเดอร์ <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleCheckBill} disabled={isCheckingOut || pendingOrders.length === 0}>
                            <Receipt className="mr-2 h-4 w-4" /> เช็คบิล
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <OrderPageContent />
        </Suspense>
    );
}
