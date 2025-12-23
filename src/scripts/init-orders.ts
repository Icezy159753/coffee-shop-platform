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

const jwt = new JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: SCOPES,
});

const doc = new GoogleSpreadsheet(SHEET_ID, jwt);

async function run() {
    console.log('Connecting to Google Sheet...');
    await doc.loadInfo();

    // Delete existing orders sheet if it exists
    const existingSheet = doc.sheetsByTitle['orders'];
    if (existingSheet) {
        console.log('Deleting old orders sheet...');
        await existingSheet.delete();
    }

    console.log('Creating new "orders" sheet with updated columns...');
    const sheet = await doc.addSheet({ title: 'orders' });

    console.log('Setting header row...');
    await sheet.setHeaderRow(['id', 'date', 'total', 'items', 'status', 'tableNumber', 'orderType']);

    console.log('✅ Orders sheet recreated successfully with new columns!');
    console.log('Columns: id, date, total, items, status, tableNumber, orderType');
}

run().catch(console.error);
