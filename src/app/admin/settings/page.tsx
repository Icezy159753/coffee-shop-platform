'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';

export default function SettingsPage() {
    const { shopName, phone, address, heroTitle, heroDescription, heroImage, updateSettings } = useSettingsStore();

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        updateSettings({
            shopName: formData.get('shopName') as string,
            phone: formData.get('phone') as string,
            address: formData.get('address') as string,
            heroTitle: formData.get('heroTitle') as string,
            heroDescription: formData.get('heroDescription') as string,
            heroImage: formData.get('heroImage') as string,
        });

        toast.success('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-heading font-bold">ตั้งค่าร้านค้า</h1>
                <p className="text-muted-foreground">จัดการข้อมูลทั่วไปของร้าน</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>ข้อมูลทั่วไป</CardTitle>
                        <CardDescription>ข้อมูลที่จะแสดงบนหน้าเว็บไซต์หลัก</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="shopName">ชื่อร้าน</Label>
                            <Input name="shopName" id="shopName" defaultValue={shopName} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                            <Input name="phone" id="phone" defaultValue={phone} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">ที่อยู่</Label>
                            <Input name="address" id="address" defaultValue={address} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>ปรับแต่งหน้าแรก (Home Page)</CardTitle>
                        <CardDescription>ข้อความและรูปภาพ Banner หลัก</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>หัวข้อหลัก (Hero Title)</Label>
                            <Input name="heroTitle" defaultValue={heroTitle} placeholder="ข้อความตัวใหญ่..." />
                        </div>
                        <div className="space-y-2">
                            <Label>คำบรรยาย (Hero Description)</Label>
                            <Input name="heroDescription" defaultValue={heroDescription} placeholder="คำบรรยายสั้นๆ..." />
                        </div>
                        <div className="space-y-2">
                            <Label>ลิงก์รูปภาพ (Hero Image URL)</Label>
                            <Input name="heroImage" defaultValue={heroImage} placeholder="https://..." />
                            <p className="text-xs text-muted-foreground">แนะนำรูปจาก Unsplash (แนวนอน)</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>ภาษาและสกุลเงิน</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ภาษาหลัก</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option>ไทย (Thai)</option>
                                    <option>อังกฤษ (English)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>สกุลเงิน</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option>THB (฿)</option>
                                    <option>USD ($)</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pb-8">
                    <Button type="submit" size="lg">
                        <Save className="mr-2 h-4 w-4" /> บันทึกทั้งหมด
                    </Button>
                </div>
            </form>
        </div>
    );
}
