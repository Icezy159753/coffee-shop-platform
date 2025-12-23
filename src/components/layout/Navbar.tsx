'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart-store'; // Ensure path is correct
import { useSettingsStore } from '@/stores/settings-store';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function Navbar() {
    const pathname = usePathname();
    const cartTotal = useCartStore((state) => state.totalItems());
    const shopName = useSettingsStore((state) => state.shopName);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Menu', href: '/menu' },
        // { name: 'About', href: '/about' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <Coffee className="h-6 w-6 text-primary" />
                            <span className="text-xl font-heading font-bold text-foreground">
                                {mounted ? shopName : 'Coffee House'}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href
                                        ? "text-primary font-bold"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" className="text-xs text-muted-foreground hover:text-primary">
                                จัดการร้าน
                            </Button>
                        </Link>

                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {mounted && cartTotal > 0 && (
                                    <Badge
                                        variant="default"
                                        className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]"
                                    >
                                        {cartTotal}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {/* Mobile Menu Trigger (Simple placeholder) */}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
