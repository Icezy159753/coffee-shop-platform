import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import creds from '../../google-sheets-creds.json';

const SHEET_ID = creds.GOOGLE_SHEET_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const jwt = new JWT({
    email: creds.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: creds.GOOGLE_PRIVATE_KEY,
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
