'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductStore } from '@/stores/product-store';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Minimal Table implementation since shadcn table wasn't installed fully
// or we can use standard divs/tables if preferred, but let's try to mimic shadcn structure simply
// actually, let's stick to standard HTML table with Tailwind for speed and reliability if component is missing
// But wait, I didn't install table component. Let me just build a responsive grid or simple table.

export default function ProductsPage() {
    const { products, deleteProduct } = useProductStore();

    const handleDelete = (id: string, name: string) => {
        if (confirm(`คุณมั้นใจหรือไม่ว่าต้องการลบเมนู "${name}"?`)) {
            deleteProduct(id);
            toast.success(`ลบเมนู ${name} เรียบร้อยแล้ว`);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold">จัดการสินค้า</h1>
                    <p className="text-muted-foreground">รายการเมนูอาหารและเครื่องดื่มทั้งหมด ({products.length})</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> เพิ่มสินค้าใหม่
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">รูปภาพ</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">ชื่อสินค้า</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">หมวดหมู่</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">ราคา</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            ยังไม่มีสินค้าในระบบ
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-12 w-12 rounded-md object-cover"
                                                />
                                            </td>
                                            <td className="p-4 align-middle font-medium">
                                                <div>{product.nameTh}</div>
                                                <div className="text-xs text-muted-foreground">{product.name}</div>
                                            </td>
                                            <td className="p-4 align-middle capitalize">{product.categoryId}</td>
                                            <td className="p-4 align-middle">฿{product.price}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/products/edit/${product.id}`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleDelete(product.id, product.nameTh)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
