import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    shopName: string;
    phone: string;
    address: string;
    currency: string;
    heroTitle: string;
    heroDescription: string;
    heroImage: string;
    tableCount: number;
    updateSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            shopName: 'Coffee House',
            phone: '02-123-4567',
            address: '123 ถนนสุขุมวิท เขตวัฒนา กรุงเทพฯ 10110',
            currency: 'THB',
            heroTitle: 'Coffee House',
            heroDescription: 'สัมผัสรสชาติกาแฟแท้ พร้อมขนมอบสดใหม่ทุกวัน ในบรรยากาศที่อบอุ่นเหมือนบ้าน',
            heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1600',
            tableCount: 5,
            updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
        }),
        {
            name: 'coffee-shop-settings',
        }
    )
);

