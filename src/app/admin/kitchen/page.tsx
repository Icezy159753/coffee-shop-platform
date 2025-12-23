'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChefHat, Clock, RefreshCw, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
    name: string;
    nameTh: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    date: string;
    total: number;
    items: OrderItem[];
    status: string;
    tableNumber: string;
}

export default function KitchenPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchOrders();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            const pendingOrders = data.filter((order: Order) => order.status === 'pending');
            setOrders(pendingOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const markOrderComplete = async (orderId: string) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: 'cooking-done' }),
            });

            if (res.ok) {
                toast.success('ทำอาหารเสร็จแล้ว!');
                setOrders(prev => prev.filter(o => o.id !== orderId));
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาด');
        }
    };

    if (!mounted) return null;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    };

    const getTimeSince = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'เมื่อสักครู่';
        if (mins < 60) return `${mins} นาทีที่แล้ว`;
        return `${Math.floor(mins / 60)} ชม. ${mins % 60} นาที`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
                        <ChefHat className="h-8 w-8" />
                        ครัว
                    </h1>
                    <p className="text-muted-foreground">ออเดอร์ที่รอทำ ({orders.length} รายการ)</p>
                </div>
                <Button onClick={fetchOrders} variant="outline" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    รีเฟรช
                </Button>
            </div>

            {orders.length === 0 ? (
                <Card className="py-16 text-center">
                    <CardContent>
                        <UtensilsCrossed className="h-20 w-20 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <p className="text-2xl font-bold text-muted-foreground">ไม่มีออเดอร์ที่รอทำ</p>
                        <p className="text-muted-foreground mt-2">ระบบจะรีเฟรชอัตโนมัติทุก 10 วินาที</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {orders.map((order) => (
                        <Card
                            key={order.id}
                            className="border-2 hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                        >
                            {/* Header with Table Number */}
                            <CardHeader className="bg-primary text-primary-foreground py-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl font-bold">
                                        โต๊ะ {order.tableNumber || '?'}
                                    </CardTitle>
                                    <Badge variant="secondary" className="text-sm">
                                        #{order.id.slice(-4)}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-primary-foreground/80 text-sm mt-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(order.date)} ({getTimeSince(order.date)})
                                </div>
                            </CardHeader>

                            {/* Order Items */}
                            <CardContent className="flex-1 p-4">
                                <div className="space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                                        >
                                            <span className="text-3xl font-bold text-primary min-w-[50px]">
                                                x{item.quantity}
                                            </span>
                                            <span className="font-medium text-lg">
                                                {item.nameTh || item.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            {/* Footer with Complete Button */}
                            <CardFooter className="p-4 pt-0">
                                <Button
                                    className="w-full h-14 text-lg font-bold"
                                    size="lg"
                                    onClick={() => markOrderComplete(order.id)}
                                >
                                    <Check className="mr-2 h-6 w-6" />
                                    เสร็จแล้ว
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
