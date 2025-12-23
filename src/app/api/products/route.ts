import { NextResponse } from 'next/server';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/google-sheets';

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (e: any) {
        console.error('GET /api/products error:', e);
        return NextResponse.json({ error: e.message || 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await addProduct(body);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('POST /api/products error:', e);
        return NextResponse.json({ error: e.message || 'Failed to add product' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;
        await updateProduct(id, updates);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('PUT /api/products error:', e);
        return NextResponse.json({ error: e.message || 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (id) {
            await deleteProduct(id);
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    } catch (e: any) {
        console.error('DELETE /api/products error:', e);
        return NextResponse.json({ error: e.message || 'Failed to delete product' }, { status: 500 });
    }
}
