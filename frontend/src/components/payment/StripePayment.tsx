import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripeApi } from '../../api/api';

const StripePayment: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  
  const [amount, setAmount] = useState<number>(10);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    setPaymentStatus('');
    
    try {
      const { client_secret } = await stripeApi.createPaymentIntent(
        amount * 100, // Convert to cents
        'usd',
        description
      );
      
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Test User',
          },
        },
      });
      
      if (error) {
        throw new Error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentStatus('Payment successful!');
        toast({
          title: 'Payment successful!',
          description: `Payment of $${amount} was processed successfully.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('Payment failed. Please try again.');
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4}>Make a Payment with Stripe</Heading>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="amount" isRequired>
            <FormLabel>Amount (USD)</FormLabel>
            <NumberInput
              min={1}
              max={1000}
              value={amount}
              onChange={(_, value) => setAmount(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          
          <FormControl id="description">
            <FormLabel>Description (optional)</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this payment for?"
            />
          </FormControl>
          
          <FormControl id="card-element" isRequired>
            <FormLabel>Card Details</FormLabel>
            <Box p={3} borderWidth="1px" borderRadius="md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </Box>
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            isDisabled={!stripe || isLoading}
            loadingText="Processing..."
            mt={4}
          >
            Pay ${amount}
          </Button>
          
          {paymentStatus && (
            <Text
              color={paymentStatus.includes('successful') ? 'green.500' : 'red.500'}
              fontWeight="bold"
              textAlign="center"
            >
              {paymentStatus}
            </Text>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default StripePayment;
