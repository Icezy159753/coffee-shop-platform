import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3, Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair'
})

const sourceSans = Source_Sans_3({
    subsets: ['latin'],
    variable: '--font-source-sans'
})

const notoSansThai = Noto_Sans_Thai({
    subsets: ['thai'],
    variable: '--font-thai'
})

export const metadata: Metadata = {
    title: 'Coffee House | Authentic Artisan Coffee',
    description: 'Experience the best coffee in town. Order online for pickup or delivery.',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="th" className="scroll-smooth">
            <body className={cn(
                "min-h-screen bg-background font-body antialiased",
                playfair.variable,
                sourceSans.variable,
                notoSansThai.variable
            )}>
                {children}
                <Toaster richColors position="top-center" />
            </body>
        </html>
    )
}
