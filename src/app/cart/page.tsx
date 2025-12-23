'use client';

import { Navbar } from '@/components/layout/Navbar';
import { useCartStore } from '@/stores/cart-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { useOrderStore } from '@/stores/order-store';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
    const addOrder = useOrderStore((state) => state.addOrder);
    const total = totalPrice();

    const handleCheckout = async () => {
        toast.promise(
            async () => {
                await addOrder({
                    total: Math.round(total * 1.07),
                    items: items
                });
                clearCart();
            },
            {
                loading: 'กำลังบันทึกออเดอร์...',
                success: 'สั่งซื้อสำเร็จ! บันทึกลง Database เรียบร้อย',
                error: 'เกิดข้อผิดพลาดในการสั่งซื้อ',
            }
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container px-4 md:px-6 py-10 max-w-4xl mx-auto">
                <h1 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-primary" />
                    ตะกร้าสินค้า
                </h1>

                {items.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <div className="rounded-full bg-secondary/10 w-20 h-20 mx-auto flex items-center justify-center mb-6 text-secondary">
                                <ShoppingBag className="h-10 w-10" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">ตะกร้าของคุณยังว่างอยู่</h2>
                            <p className="text-muted-foreground mb-6">เริ่มสั่งอาหารและเครื่องดื่มอร่อยๆ ได้เลย</p>
                            <Link href="/menu">
                                <Button size="lg">ดูเมนูอาหาร</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <Card key={item.id} className="overflow-hidden">
                                    <div className="flex p-4 gap-4">
                                        <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                                    <p className="text-sm text-primary font-bold">฿{item.price}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center border rounded-md">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex-1 text-right text-sm font-medium">
                                                    รวม: ฿{item.price * item.quantity}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24 shadow-lg border-t-4 border-t-primary">
                                <CardHeader>
                                    <CardTitle>สรุปยอดคำสั่งซื้อ</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">ยอดรวมสินค้า ({items.reduce((a, b) => a + b.quantity, 0)} ชิ้น)</span>
                                        <span>฿{total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">VAT (7%)</span>
                                        <span>฿{Math.round(total * 0.07)}</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between items-end">
                                        <span className="font-bold text-lg">ยอดสุทธิ</span>
                                        <span className="font-bold text-2xl text-primary">฿{Math.round(total * 1.07)}</span>
                                    </div>

                                    <Button
                                        className="w-full mt-6 h-12 text-lg font-bold shadow-md"
                                        size="lg"
                                        onClick={handleCheckout}
                                    >
                                        ชำระเงิน <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
