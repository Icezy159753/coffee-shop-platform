import { create } from 'zustand';

export interface Order {
    id: string;
    date: string;
    total: number;
    items: any[];
    status: string;
    tableNumber?: string | null;
    orderType?: 'dine-in' | 'takeaway';
}

interface OrderStore {
    orders: Order[];
    loading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    addOrder: (order: { total: number; items: any[]; tableNumber?: string | null; orderType?: 'dine-in' | 'takeaway' }) => Promise<void>;
    stats: {
        totalRevenue: number;
        totalOrders: number;
    };
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    orders: [],
    loading: false,
    error: null,
    stats: {
        totalRevenue: 0,
        totalOrders: 0,
    },

    fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            const totalRevenue = data.reduce((acc: number, curr: Order) => acc + curr.total, 0);
            const totalOrders = data.length;

            set({
                orders: data,
                loading: false,
                stats: { totalRevenue, totalOrders }
            });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    addOrder: async (newOrder) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });

            if (!res.ok) throw new Error('Failed to create order');

            // Refresh orders to get the new one (or optimistic update)
            get().fetchOrders();
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
