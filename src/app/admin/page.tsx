'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductStore } from '@/stores/product-store';
import { useOrderStore } from '@/stores/order-store';
import { Coffee, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminDashboard() {
    const products = useProductStore((state) => state.products);
    const { stats, fetchOrders } = useOrderStore();

    useEffect(() => {
        fetchOrders();
    }, []);

    const totalProducts = products.length;
    const { totalOrders, totalRevenue } = stats;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
                <p className="text-muted-foreground">ภาพรวมข้อมูลและสถิติสำคัญ</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">รายได้เดือนนี้</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">฿{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground text-green-600">
                            +100% (ข้อมูลจริง)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ออเดอร์ทั้งหมด</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalOrders}</div>
                        <p className="text-xs text-muted-foreground text-green-600">
                            (ออเดอร์ล่าสุด)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">สินค้าทั้งหมด</CardTitle>
                        <Coffee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            มี {products.filter(p => p.price > 100).length} รายการพรีเมียม
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
