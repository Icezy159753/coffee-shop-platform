export const categories = [
  {
    id: 'coffee',
    name: 'Coffee',
    nameTh: 'กาแฟ',
    description: 'Freshly brewed artisan coffee',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'non-coffee',
    name: 'Non-Coffee',
    nameTh: 'เครื่องดื่มอื่นๆ',
    description: 'Refreshing tea, milk, and sodas',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'bakery',
    name: 'Bakery',
    nameTh: 'เบเกอรี่',
    description: 'Fresh homemade pastries',
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&q=80&w=800'
  }
];

export const products = [
  {
    id: 'c1',
    categoryId: 'coffee',
    name: 'Hot Latte',
    nameTh: 'ลาเต้ร้อน',
    price: 65,
    description: 'Espresso with steamed milk and a thin layer of foam',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80'
  },
  {
    id: 'c2',
    categoryId: 'coffee',
    name: 'Iced Americano',
    nameTh: 'อเมริกาโน่เย็น',
    price: 70,
    description: 'Espresso shot over ice and water',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7dd90?auto=format&fit=crop&q=80'
  },
  {
    id: 'c3',
    categoryId: 'coffee',
    name: 'Caramel Macchiato',
    nameTh: 'คาราเมลมัคคิอาโต้',
    price: 85,
    description: 'Espresso with vanilla syrup, steamed milk and caramel drizzle',
    image: 'https://images.unsplash.com/photo-1485808191679-5f8c7c41f7bc?auto=format&fit=crop&q=80'
  },
  {
    id: 'n1',
    categoryId: 'non-coffee',
    name: 'Iced Matcha Latte',
    nameTh: 'มัทฉะลาเต้เย็น',
    price: 80,
    description: 'Premium Japanese matcha green tea with milk',
    image: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?auto=format&fit=crop&q=80'
  },
  {
    id: 'n2',
    categoryId: 'non-coffee',
    name: 'Thai Tea',
    nameTh: 'ชาไทยเย็น',
    price: 65,
    description: 'Authentic Thai tea with condensed milk',
    image: 'https://images.unsplash.com/photo-1626801994276-803260be55dc?auto=format&fit=crop&q=80'
  },
  {
    id: 'b1',
    categoryId: 'bakery',
    name: 'Plain Croissant',
    nameTh: 'ครัวซองต์เนยสด',
    price: 55,
    description: 'Buttery, flaky, and golden brown',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80'
  },
  {
    id: 'b2',
    categoryId: 'bakery',
    name: 'Blueberry Cheesecake',
    nameTh: 'บลูเบอรี่ชีสเค้ก',
    price: 120,
    description: 'Rich cream cheese base topped with blueberry compote',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80'
  }
];

export const stats = [
  { label: 'สาขา', value: '12', suffix: '+' },
  { label: 'ลูกค้าประจำ', value: '5000', suffix: '+' },
  { label: 'ปีแห่งความอร่อย', value: '5', suffix: ' ปี' },
];
