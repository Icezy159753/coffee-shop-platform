import { NextResponse } from 'next/server';
import { getOrders, addOrder, updateOrderStatus, getOrdersByTable } from '@/lib/google-sheets';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tableNumber = searchParams.get('table');

        let orders;
        if (tableNumber) {
            orders = await getOrdersByTable(tableNumber);
        } else {
            orders = await getOrders();
        }

        return NextResponse.json(orders, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (e: any) {
        console.error('GET /api/orders error:', e);
        return NextResponse.json({ error: e.message || 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const orderId = `ord-${Date.now()}`;

        await addOrder({
            id: orderId,
            ...body
        });

        return NextResponse.json({ success: true, id: orderId });
    } catch (e: any) {
        console.error('POST /api/orders error:', e);
        return NextResponse.json({ error: e.message || 'Failed to create order' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ error: 'orderId and status are required' }, { status: 400 });
        }

        const result = await updateOrderStatus(orderId, status);

        if (result) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
    } catch (e: any) {
        console.error('PATCH /api/orders error:', e);
        return NextResponse.json({ error: e.message || 'Failed to update order' }, { status: 500 });
    }
}

