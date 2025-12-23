'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/stores/settings-store';
import { QRCodeCanvas } from 'qrcode.react';
import { Table, QrCode, Plus, Minus, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function TablesPage() {
    const { tableCount, updateSettings } = useSettingsStore();
    const [mounted, setMounted] = useState(false);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    const handleDownloadQR = (tableNumber: number) => {
        const canvas = document.getElementById(`qr-${tableNumber}`) as HTMLCanvasElement;
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `table-${tableNumber}-qr.png`;
            link.click();
            toast.success(`ดาวน์โหลด QR Code โต๊ะ ${tableNumber} แล้ว`);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold">จัดการโต๊ะ</h1>
                <p className="text-muted-foreground">ตั้งค่าจำนวนโต๊ะและสร้าง QR Code สำหรับสั่งอาหาร</p>
            </div>

            {/* Table Count Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Table className="h-5 w-5" />
                        จำนวนโต๊ะในร้าน
                    </CardTitle>
                    <CardDescription>กำหนดจำนวนโต๊ะที่มีในร้าน (แต่ละโต๊ะจะมี QR Code เฉพาะ)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                if (tableCount > 1) {
                                    updateSettings({ tableCount: tableCount - 1 });
                                }
                            }}
                            disabled={tableCount <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-4xl font-bold w-16 text-center">{tableCount}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateSettings({ tableCount: tableCount + 1 })}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-muted-foreground">โต๊ะ</span>
                    </div>
                </CardContent>
            </Card>

            {/* QR Code Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        QR Code สำหรับแต่ละโต๊ะ
                    </CardTitle>
                    <CardDescription>ลูกค้าแสกน QR Code เพื่อสั่งอาหารจากโต๊ะของตัวเอง</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Array.from({ length: tableCount }, (_, i) => i + 1).map((tableNumber) => (
                            <Card
                                key={tableNumber}
                                className="text-center p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => setSelectedTable(tableNumber)}
                            >
                                <div className="space-y-3">
                                    <div className="text-lg font-bold">โต๊ะ {tableNumber}</div>
                                    <div className="flex justify-center">
                                        <QRCodeCanvas
                                            id={`qr-${tableNumber}`}
                                            value={`${baseUrl}/order?table=${tableNumber}`}
                                            size={100}
                                            level="H"
                                            includeMargin
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownloadQR(tableNumber);
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`${baseUrl}/order?table=${tableNumber}`, '_blank');
                                            }}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Large QR Preview Modal-like Section */}
            {selectedTable && (
                <Card className="border-2 border-primary">
                    <CardHeader>
                        <CardTitle>QR Code โต๊ะ {selectedTable} (ขนาดใหญ่สำหรับพิมพ์)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <QRCodeCanvas
                            value={`${baseUrl}/order?table=${selectedTable}`}
                            size={300}
                            level="H"
                            includeMargin
                        />
                        <p className="text-sm text-muted-foreground">
                            URL: {baseUrl}/order?table={selectedTable}
                        </p>
                        <div className="flex gap-2">
                            <Button onClick={() => handleDownloadQR(selectedTable)}>
                                <Download className="mr-2 h-4 w-4" /> ดาวน์โหลด QR
                            </Button>
                            <Button variant="outline" onClick={() => setSelectedTable(null)}>
                                ปิด
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
