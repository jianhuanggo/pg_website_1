import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from '../components/payment/StripePayment';
import { stripeApi } from '../api/api';

jest.mock('../api/api', () => ({
  stripeApi: {
    createPaymentIntent: jest.fn(),
  },
}));

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => children,
  useStripe: () => ({
    confirmCardPayment: jest.fn().mockResolvedValue({
      paymentIntent: { status: 'succeeded' },
    }),
  }),
  useElements: () => ({
    getElement: jest.fn().mockReturnValue({}),
  }),
  CardElement: () => <div data-testid="card-element" />,
}));

describe('StripePayment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (stripeApi.createPaymentIntent as jest.Mock).mockResolvedValue({
      client_secret: 'test_client_secret',
    });
  });

  it('renders the payment form correctly', () => {
    render(<StripePayment />);
    
    expect(screen.getByText('Make a Payment with Stripe')).toBeInTheDocument();
    expect(screen.getByText('Amount (USD)')).toBeInTheDocument();
    expect(screen.getByText('Description (optional)')).toBeInTheDocument();
    expect(screen.getByText('Card Details')).toBeInTheDocument();
    expect(screen.getByText('Pay $10')).toBeInTheDocument();
  });

  it('updates amount when changed', () => {
    render(<StripePayment />);
    
    const amountInput = screen.getByRole('spinbutton');
    fireEvent.change(amountInput, { target: { value: '25' } });
    
    expect(screen.getByText('Pay $25')).toBeInTheDocument();
  });

  it('updates description when changed', () => {
    render(<StripePayment />);
    
    const descriptionInput = screen.getByPlaceholderText("What's this payment for?");
    fireEvent.change(descriptionInput, { target: { value: 'Test payment' } });
    
    expect(descriptionInput).toHaveValue('Test payment');
  });

  it('processes payment successfully', async () => {
    render(<StripePayment />);
    
    const submitButton = screen.getByText('Pay $10');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(stripeApi.createPaymentIntent).toHaveBeenCalledWith(
        1000, // $10 in cents
        'usd',
        ''
      );
      expect(screen.getByText('Payment successful!')).toBeInTheDocument();
    });
  });

  it('handles payment errors', async () => {
    (stripeApi.createPaymentIntent as jest.Mock).mockRejectedValue(
      new Error('Payment failed')
    );
    
    render(<StripePayment />);
    
    const submitButton = screen.getByText('Pay $10');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Payment failed. Please try again.')).toBeInTheDocument();
    });
  });
});
