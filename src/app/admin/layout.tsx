'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Coffee, Settings, LogOut, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/stores/product-store';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    // Prepare state to avoid hydration mismatch
    useEffect(() => {
        setIsClient(true);
    }, []);

    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        useProductStore.getState().fetchProducts();
    }, []);

    useEffect(() => {
        if (!isClient) return;

        // Allow access to login page
        if (isLoginPage) {
            setAuthorized(true);
            return;
        }

        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin/login');
        } else {
            setAuthorized(true);
        }
    }, [isClient, isLoginPage, router]);

    // Avoid hydration mismatch by rendering nothing until mounted
    // Or render children if we are server-side (optional, but handling client auth usually needs a loader)
    if (!isClient) return null; // Simple loader approach

    // If not authorized yet and not login page, show nothing (or loader)
    if (!authorized && !isLoginPage) return null;

    // If it is Login Page, render without Sidebar
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex bg-muted/20">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    <span className="font-heading font-bold">Admin</span>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin"><Button variant="ghost" size="sm"><LayoutDashboard className="h-4 w-4" /></Button></Link>
                    <Link href="/admin/products"><Button variant="ghost" size="sm"><Coffee className="h-4 w-4" /></Button></Link>
                    <Link href="/admin/kitchen"><Button variant="ghost" size="sm">🍳</Button></Link>
                    <Link href="/admin/settings"><Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button></Link>
                </div>
            </div>

            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-card border-r hidden md:flex flex-col fixed inset-y-0">
                <div className="p-6 border-b flex items-center gap-2">
                    <Store className="h-6 w-6 text-primary" />
                    <span className="font-heading font-bold text-xl">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant={pathname === '/admin' ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/products">
                        <Button variant={pathname.startsWith('/admin/products') ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                            <Coffee className="h-4 w-4" />
                            จัดการสินค้า
                        </Button>
                    </Link>
                    <Link href="/admin/tables">
                        <Button variant={pathname.startsWith('/admin/tables') ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            จัดการโต๊ะ
                        </Button>
                    </Link>
                    <Link href="/admin/kitchen">
                        <Button variant={pathname.startsWith('/admin/kitchen') ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                            <Coffee className="h-4 w-4" />
                            ครัว
                        </Button>
                    </Link>
                    <Link href="/admin/settings">
                        <Button variant={pathname === '/admin/settings' ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            ตั้งค่าร้าน
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <Button
                        variant="outline"
                        className="w-full gap-2 border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => {
                            localStorage.removeItem('isAdmin');
                            document.cookie = "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                            router.push('/');
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        ออกจากระบบ
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-16 md:pt-8">
                {children}
            </main>
        </div>
    );
}
