import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Use environment variables for production, fallback to JSON file for local dev
let creds: any;
try {
    creds = require('../../google-sheets-creds.json');
} catch {
    creds = null;
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID || creds?.GOOGLE_SHEET_ID || '';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || creds?.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || creds?.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Singleton connection
let doc: GoogleSpreadsheet | null = null;

async function getDoc() {
    if (doc) return doc;

    const jwt = new JWT({
        email: SERVICE_ACCOUNT_EMAIL,
        key: PRIVATE_KEY,
        scopes: SCOPES,
    });

    const newDoc = new GoogleSpreadsheet(SHEET_ID, jwt);
    await newDoc.loadInfo();
    doc = newDoc;
    return doc;
}

export async function getOrders() {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows.map((row) => ({
        id: row.get('id'),
        date: row.get('date'),
        total: Number(row.get('total')),
        items: JSON.parse(row.get('items') || '[]'),
        status: row.get('status'),
        tableNumber: row.get('tableNumber') || '',
        orderType: row.get('orderType') || '',
    }));
}

export async function addOrder(order: any) {
    const doc = await getDoc();
    let sheet = doc.sheetsByTitle['orders'];
    if (!sheet) {
        sheet = await doc.addSheet({ title: 'orders' });
        await sheet.setHeaderRow(['id', 'date', 'total', 'items', 'status', 'tableNumber', 'orderType']);
    }

    await sheet.addRow({
        id: order.id,
        date: new Date().toISOString(),
        total: String(order.total),
        items: JSON.stringify(order.items),
        status: order.status || 'pending',
        tableNumber: order.tableNumber || '',
        orderType: order.orderType || 'dine-in'
    });
}

export async function updateOrderStatus(orderId: string, status: string) {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return null;

    const rows = await sheet.getRows();
    const row = rows.find(r => r.get('id') === orderId);

    if (row) {
        row.set('status', status);
        await row.save();
        return true;
    }
    return false;
}

export async function getOrdersByTable(tableNumber: string) {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['orders'];
    if (!sheet) return [];

    const rows = await sheet.getRows();
    return rows
        .filter(row => row.get('tableNumber') === tableNumber &&
            (row.get('status') === 'pending' || row.get('status') === 'cooking-done'))
        .map((row) => ({
            id: row.get('id'),
            date: row.get('date'),
            total: Number(row.get('total')),
            items: JSON.parse(row.get('items') || '[]'),
            status: row.get('status'),
            tableNumber: row.get('tableNumber'),
        }));
}


export async function getProducts() {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    return rows.map((row) => ({
        id: row.get('id'),
        categoryId: row.get('categoryId'),
        name: row.get('name'),
        nameTh: row.get('nameTh'),
        price: Number(row.get('price')),
        description: row.get('description'),
        image: row.get('image'),
    }));
}

export async function addProduct(product: any) {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({
        id: product.id,
        categoryId: product.categoryId,
        name: product.name,
        nameTh: product.nameTh,
        price: String(product.price),
        description: product.description,
        image: product.image,
    });
}

export async function updateProduct(id: string, updates: any) {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const row = rows.find(r => r.get('id') === id);

    if (row) {
        if (updates.name) row.assign({ name: updates.name });
        if (updates.nameTh) row.assign({ nameTh: updates.nameTh });
        if (updates.price) row.assign({ price: String(updates.price) });
        if (updates.description) row.assign({ description: updates.description });
        if (updates.categoryId) row.assign({ categoryId: updates.categoryId });
        if (updates.image) row.assign({ image: updates.image });
        await row.save();
    }
}

export async function deleteProduct(id: string) {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const row = rows.find(r => r.get('id') === id);

    if (row) {
        await row.delete();
    }
}
