import { NextResponse } from 'next/server';
import { ClothingItem } from '@/types/virtual-try-on';

// Mock data - replace with actual database query
const mockClothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'top',
    brand: 'Basic Brand',
    price: 29.99,
    size: 'M',
    color: 'white'
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'bottom',
    brand: 'Denim Co',
    price: 79.99,
    size: '32x30',
    color: 'blue'
  },
  {
    id: '3',
    name: 'Summer Dress',
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'dress',
    brand: 'Summer Style',
    price: 89.99,
    size: 'S',
    color: 'floral'
  },
  {
    id: '4',
    name: 'Leather Jacket',
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'outerwear',
    brand: 'Urban Style',
    price: 199.99,
    size: 'L',
    color: 'black'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  try {
    // Filter items based on search query
    const filteredItems = mockClothingItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.brand?.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );

    return NextResponse.json({ items: filteredItems });
  } catch (error) {
    console.error('Error searching clothing items:', error);
    return NextResponse.json(
      { message: 'Failed to search clothing items' },
      { status: 500 }
    );
  }
} 