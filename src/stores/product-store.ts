import { create } from 'zustand';

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    nameTh: string;
    price: number;
    description: string;
    image: string;
}

interface ProductStore {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProduct: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            set({ products: data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    addProduct: async (newProduct) => {
        set({ loading: true, error: null });
        try {
            // Generate a temp ID for optimistic update or wait for server?
            // Google Sheets requires we send ID or it generates one? 
            // My implementation allows sending ID. 
            // Let's generate ID here to be consistent with previous logic
            const id = `p-${Date.now()}`;
            const productWithId = { ...newProduct, id };

            await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productWithId),
            });

            // Refresh local state
            set(state => ({
                products: [...state.products, productWithId],
                loading: false
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    updateProduct: async (id, updatedProduct) => {
        set({ loading: true, error: null });
        try {
            await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updatedProduct }),
            });

            set(state => ({
                products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct } : p),
                loading: false
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
            await fetch(`/api/products?id=${id}`, {
                method: 'DELETE',
            });

            set(state => ({
                products: state.products.filter(p => p.id !== id),
                loading: false
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getProduct: (id) => {
        return get().products.find((p) => p.id === id);
    },
}));
