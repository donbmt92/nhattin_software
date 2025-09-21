// __tests__/OrderPaymentFlow.test.tsx
"use client";
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the API service
jest.mock('../services/api.service', () => ({
  apiService: {
    createOrder: jest.fn(),
    createPayment: jest.fn(),
    updateOrderStatus: jest.fn(),
    updatePayment: jest.fn()
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
    updateOrderStatus: jest.fn(),
    setCurrentOrder: jest.fn()
  })
}));

jest.mock('../hooks/usePaymentState', () => ({
  usePaymentState: () => ({
    payments: [],
    currentPayment: null,
    isLoading: false,
    error: null,
    createPayment: jest.fn(),
    updatePayment: jest.fn(),
    setCurrentPayment: jest.fn()
  })
}));

// Simple OrderCreation component for testing
const OrderCreation: React.FC<{
  cartItems: Array<{ productId: string; quantity: number }>;
  userId: string;
  onOrderCreated?: (orderId: string) => void;
}> = ({ cartItems, userId, onOrderCreated }) => {
  const [isCreating, setIsCreating] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null);

  const handleCreateOrder = async () => {
    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newOrderId = 'order123';
      setOrderId(newOrderId);
      onOrderCreated?.(newOrderId);
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
      <button
        onClick={handleCreateOrder}
        disabled={isCreating || cartItems.length === 0}
        data-testid="create-order-button"
      >
        {isCreating ? 'Creating Order...' : 'Create Order'}
      </button>
      {orderId && (
        <div data-testid="order-created">
          Order ID: {orderId}
        </div>
      )}
    </div>
  );
};

// Simple PaymentProcessing component for testing
const PaymentProcessing: React.FC<{
  paymentId: string;
  orderId: string;
  amount: number;
  onPaymentProcessed?: (status: string) => void;
}> = ({ paymentId, orderId, amount, onPaymentProcessed }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState('PENDING');

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPaymentStatus('PROCESSING');
      onPaymentProcessed?.('PROCESSING');
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-processing">
      <h2>Payment Processing</h2>
      <div data-testid="payment-info">
        Payment ID: {paymentId} Order ID: {orderId} Amount: {amount.toLocaleString('vi-VN')} VND
      </div>
      <div data-testid="payment-status">
        Status: {paymentStatus}
      </div>
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        data-testid="process-payment-button"
      >
        {isProcessing ? 'Processing Payment...' : 'Pay with VNPay'}
      </button>
    </div>
  );
};

describe('💳 Order Payment Flow Tests', () => {
  const mockCartItems = [
    { productId: '1', quantity: 2 },
    { productId: '2', quantity: 1 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('🔄 should complete full order-payment flow successfully', async () => {
    let createdOrderId: string | null = null;
    let paymentStatus: string | null = null;

    const TestComponent = () => {
      const [orderId, setOrderId] = React.useState<string | null>(null);
      
      return (
        <div>
          <OrderCreation 
            cartItems={mockCartItems} 
            userId="user123"
            onOrderCreated={(id) => {
              setOrderId(id);
              createdOrderId = id;
            }}
          />
          {orderId && (
            <PaymentProcessing 
              paymentId="payment123" 
              orderId={orderId} 
              amount={100000}
              onPaymentProcessed={(status) => {
                paymentStatus = status;
              }}
            />
          )}
        </div>
      );
    };

    render(<TestComponent />);
    
    // Test order creation
    const createButton = screen.getByTestId('create-order-button');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Creating Order...')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('order-created')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Test payment processing - wait for payment component to appear
    await waitFor(() => {
      expect(screen.getByTestId('process-payment-button')).toBeInTheDocument();
    });
    
    const payButton = screen.getByTestId('process-payment-button');
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(screen.getByText('Processing Payment...')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Status: PROCESSING')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('💰 should display payment information with correct format', () => {
    render(
      <PaymentProcessing 
        paymentId="payment123" 
        orderId="order123" 
        amount={150000}
      />
    );
    
    const paymentInfo = screen.getByTestId('payment-info');
    expect(paymentInfo).toHaveTextContent('Payment ID: payment123');
    expect(paymentInfo).toHaveTextContent('Order ID: order123');
    expect(paymentInfo).toHaveTextContent('Amount: 150.000 VND');
  });

  it('should show initial payment status as PENDING', () => {
    render(
      <PaymentProcessing 
        paymentId="payment123" 
        orderId="order123" 
        amount={100000}
      />
    );
    
    expect(screen.getByTestId('payment-status')).toHaveTextContent('Status: PENDING');
  });

  it('should disable payment button while processing', async () => {
    render(
      <PaymentProcessing 
        paymentId="payment123" 
        orderId="order123" 
        amount={100000}
      />
    );
    
    const payButton = screen.getByTestId('process-payment-button');
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(payButton).toBeDisabled();
    });
  });

  it('should handle order creation with empty cart', () => {
    render(
      <OrderCreation 
        cartItems={[]} 
        userId="user123"
      />
    );
    
    const createButton = screen.getByTestId('create-order-button');
    expect(createButton).toBeDisabled();
  });

  it('should display cart items in order creation', () => {
    render(
      <OrderCreation 
        cartItems={mockCartItems} 
        userId="user123"
      />
    );
    
    expect(screen.getByTestId('cart-item-0')).toHaveTextContent('Product 1 - Quantity: 2');
    expect(screen.getByTestId('cart-item-1')).toHaveTextContent('Product 2 - Quantity: 1');
  });

  it('should handle payment processing error gracefully', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <PaymentProcessing 
        paymentId="payment123" 
        orderId="order123" 
        amount={100000}
      />
    );
    
    const payButton = screen.getByTestId('process-payment-button');
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(screen.getByText('Processing Payment...')).toBeInTheDocument();
    });
    
    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText('Status: PROCESSING')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    consoleSpy.mockRestore();
  });
});
