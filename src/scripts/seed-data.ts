import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

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

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
];

const jwt = new JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: SCOPES,
});

const doc = new GoogleSpreadsheet(SHEET_ID, jwt);

const initialData = [
    {
        id: 'c1',
        categoryId: 'coffee',
        name: 'Hot Latte',
        nameTh: 'ลาเต้ร้อน',
        price: '65',
        description: 'Espresso with steamed milk and a thin layer of foam',
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80'
    },
    {
        id: 'c2',
        categoryId: 'coffee',
        name: 'Iced Americano',
        nameTh: 'อเมริกาโน่เย็น',
        price: '70',
        description: 'Espresso shot over ice and water',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7dd90?auto=format&fit=crop&q=80'
    },
    {
        id: 'c3',
        categoryId: 'coffee',
        name: 'Caramel Macchiato',
        nameTh: 'คาราเมลมัคคิอาโต้',
        price: '85',
        description: 'Espresso with vanilla syrup, steamed milk and caramel drizzle',
        image: 'https://images.unsplash.com/photo-1485808191679-5f8c7c41f7bc?auto=format&fit=crop&q=80'
    },
    {
        id: 'n1',
        categoryId: 'non-coffee',
        name: 'Iced Matcha Latte',
        nameTh: 'มัทฉะลาเต้เย็น',
        price: '80',
        description: 'Premium Japanese matcha green tea with milk',
        image: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?auto=format&fit=crop&q=80'
    },
    {
        id: 'n2',
        categoryId: 'non-coffee',
        name: 'Thai Tea',
        nameTh: 'ชาไทยเย็น',
        price: '65',
        description: 'Authentic Thai tea with condensed milk',
        image: 'https://images.unsplash.com/photo-1626801994276-803260be55dc?auto=format&fit=crop&q=80'
    },
    {
        id: 'b1',
        categoryId: 'bakery',
        name: 'Plain Croissant',
        nameTh: 'ครัวซองต์เนยสด',
        price: '55',
        description: 'Buttery, flaky, and golden brown',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80'
    },
    {
        id: 'b2',
        categoryId: 'bakery',
        name: 'Blueberry Cheesecake',
        nameTh: 'บลูเบอรี่ชีสเค้ก',
        price: '120',
        description: 'Rich cream cheese base topped with blueberry compote',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80'
    }
];

async function run() {
    console.log('Connecting to Google Sheet...');
    await doc.loadInfo();
    console.log(`Connected to sheet: ${doc.title}`);

    const sheet = doc.sheetsByIndex[0];

    console.log('Clearing sheet...');
    await sheet.clear();

    console.log('Setting header row...');
    await sheet.setHeaderRow(['id', 'categoryId', 'name', 'nameTh', 'price', 'description', 'image']);

    console.log('Adding rows...');
    await sheet.addRows(initialData);

    console.log('✅ Data seeding completed successfully!');
}

run().catch(console.error);
