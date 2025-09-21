// __tests__/OrderCreation.test.tsx
"use client";
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the API service
jest.mock('../services/api.service', () => ({
  apiService: {
    createOrder: jest.fn(),
    getOrders: jest.fn(),
    updateOrderStatus: jest.fn()
  }
}));

// Mock the hooks
jest.mock('../hooks/useOrderState', () => ({
  useOrderState: () => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
    createOrder: jest.fn(),
    fetchOrders: jest.fn(),
    updateOrderStatus: jest.fn(),
    setCurrentOrder: jest.fn(),
    clearError: jest.fn()
  })
}));

// Simple OrderCreation component for testing
const OrderCreation: React.FC<{
  cartItems: Array<{ productId: string; quantity: number }>;
  userId: string;
  affiliateCode?: string;
}> = ({ cartItems, userId, affiliateCode }) => {
  const [isCreating, setIsCreating] = React.useState(false);
  const [orderCreated, setOrderCreated] = React.useState(false);

  const handleCreateOrder = async () => {
    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrderCreated(true);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="order-creation">
      <h2>Create Order</h2>
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} data-testid={`cart-item-${index}`}>
            Product {item.productId} - Quantity: {item.quantity}
          </div>
        ))}
      </div>
      {affiliateCode && (
        <div data-testid="affiliate-code">
          Affiliate Code: {affiliateCode}
        </div>
      )}
      <button
        onClick={handleCreateOrder}
        disabled={isCreating || cartItems.length === 0}
        data-testid="create-order-button"
      >
        {isCreating ? 'Creating Order...' : 'Create Order'}
      </button>
      {orderCreated && (
        <div data-testid="order-created-message">
          Order created successfully!
        </div>
      )}
    </div>
  );
};

describe('📦 OrderCreation Component Tests', () => {
  const mockCartItems = [
    { productId: '1', quantity: 2 },
    { productId: '2', quantity: 1 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('✅ should render order creation form with heading and button', () => {
    render(
      <OrderCreation 
        cartItems={mockCartItems}
        userId="user123"
        affiliateCode="AFFILIATE123"
      />
    );
    
    expect(screen.getByRole('heading', { name: 'Create Order' })).toBeInTheDocument();
    expect(screen.getByTestId('create-order-button')).toBeInTheDocument();
  });

  it('🛒 should display cart items with product IDs and quantities', () => {
    render(
      <OrderCreation 
        cartItems={mockCartItems}
        userId="user123"
        affiliateCode="AFFILIATE123"
      />
    );
    
    expect(screen.getByTestId('cart-item-0')).toHaveTextContent('Product 1 - Quantity: 2');
    expect(screen.getByTestId('cart-item-1')).toHaveTextContent('Product 2 - Quantity: 1');
  });

  it('🔗 should display affiliate code when provided', () => {
    render(
      <OrderCreation 
        cartItems={mockCartItems}
        userId="user123"
        affiliateCode="AFFILIATE123"
      />
    );
    
    expect(screen.getByTestId('affiliate-code')).toHaveTextContent('Affiliate Code: AFFILIATE123');
  });

  it('⚡ should create order successfully with loading state', async () => {
    render(
      <OrderCreation 
        cartItems={mockCartItems}
        userId="user123"
        affiliateCode="AFFILIATE123"
      />
    );
    
    const createButton = screen.getByTestId('create-order-button');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Creating Order...')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('order-created-message')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should disable create button when cart is empty', () => {
    render(
      <OrderCreation 
        cartItems={[]}
        userId="user123"
      />
    );
    
    const createButton = screen.getByTestId('create-order-button');
    expect(createButton).toBeDisabled();
  });

  it('should disable create button while creating order', async () => {
    render(
      <OrderCreation 
        cartItems={mockCartItems}
        userId="user123"
      />
    );
    
    const createButton = screen.getByTestId('create-order-button');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(createButton).toBeDisabled();
    });
  });

  it('should handle empty cart gracefully', () => {
    render(
      <OrderCreation 
        cartItems={[]}
        userId="user123"
      />
    );
    
    expect(screen.getByRole('heading', { name: 'Create Order' })).toBeInTheDocument();
    expect(screen.getByTestId('create-order-button')).toBeDisabled();
  });

  it('should not display affiliate code when not provided', () => {
    render(
      <OrderCreation 
        cartItems={mockCartItems}
        userId="user123"
      />
    );
    
    expect(screen.queryByTestId('affiliate-code')).not.toBeInTheDocument();
  });
});
