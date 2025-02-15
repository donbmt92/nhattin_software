import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products - Get all products
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const product = {
            name: formData.get('name') as string,
            price: parseFloat(formData.get('price') as string),
            description: formData.get('description') as string,
            image: formData.get('image') as string,
            category: formData.get('category') as string,
        };

        const newProduct = await prisma.product.create({
            data: product
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
} 