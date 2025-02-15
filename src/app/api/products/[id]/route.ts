import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[id] - Get a single product
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: params.id
            }
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const formData = await request.formData();
        const product = {
            name: formData.get('name') as string,
            price: parseFloat(formData.get('price') as string),
            description: formData.get('description') as string,
            image: formData.get('image') as string,
            category: formData.get('category') as string,
        };

        const updatedProduct = await prisma.product.update({
            where: {
                id: params.id
            },
            data: product
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.product.delete({
            where: {
                id: params.id
            }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
} 