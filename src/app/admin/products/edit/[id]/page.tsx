'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useProductStore } from '@/stores/product-store';
import { categories } from '@/lib/mock-data';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: { id: string } }) {
    // Auth handled in AdminLayout

    const router = useRouter();
    const { getProduct, updateProduct } = useProductStore();
    const [loading, setLoading] = useState(false);

    const product = getProduct(params.id);

    if (!product) {
        return <div>Product not found</div>;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            nameTh: formData.get('nameTh') as string,
            name: formData.get('name') as string,
            price: Number(formData.get('price')),
            categoryId: formData.get('categoryId') as string,
            description: formData.get('description') as string,
            image: formData.get('image') as string,
        };

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));

        updateProduct(product.id, data);
        toast.success('อัพเดทข้อมูลเรียบร้อยแล้ว');
        router.push('/admin/products');
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-heading font-bold">แก้ไขสินค้า</h1>
                    <p className="text-muted-foreground">{product.nameTh}</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ชื่อสินค้า (ไทย)</label>
                            <input
                                name="nameTh"
                                defaultValue={product.nameTh}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">ชื่อสินค้า (อังกฤษ)</label>
                            <input
                                name="name"
                                defaultValue={product.name}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ราคา (บาท)</label>
                                <input
                                    type="number"
                                    name="price"
                                    defaultValue={product.price}
                                    required
                                    min="0"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">หมวดหมู่</label>
                                <select
                                    name="categoryId"
                                    defaultValue={product.categoryId}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.nameTh}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">คำอธิบาย</label>
                            <textarea
                                name="description"
                                defaultValue={product.description}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">URL รูปภาพ</label>
                            <input
                                name="image"
                                defaultValue={product.image}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/admin/products">
                                <Button type="button" variant="outline">ยกเลิก</Button>
                            </Link>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'กำลังบันทึก...' :
                                    <><Save className="mr-2 h-4 w-4" /> บันทึกการแก้ไข</>}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
