import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BMCSupport from '../components/buymeacoffee/BMCSupport';
import { bmcApi } from '../api/api';

jest.mock('../api/api', () => ({
  bmcApi: {
    getSupporters: jest.fn(),
    getExtras: jest.fn(),
  },
}));

jest.mock('@chakra-ui/toast', () => ({
  useToast: () => jest.fn(),
}));

describe('BMCSupport Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (bmcApi.getSupporters as jest.Mock).mockResolvedValue({
      supporters: [
        {
          supporter_name: 'Jane Smith',
          support_coffee_price: 5.0,
          support_email: 'jane.smith@example.com',
          support_message: 'Keep up the great work!'
        },
        {
          supporter_name: 'Bob Johnson',
          support_coffee_price: 10.0,
          support_email: 'bob.johnson@example.com',
          support_message: 'Love your content!'
        }
      ],
      total_count: 2
    });
    
    (bmcApi.getExtras as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Extras retrieved successfully',
      data: {
        total_supporters: 125,
        total_coffees: 250,
        total_revenue: 1250.0
      }
    });
  });

  it('renders the connect button when not connected', () => {
    render(<BMCSupport />);
    
    expect(screen.getByText('Buy Me a Coffee Integration')).toBeInTheDocument();
    expect(screen.getByText('Connect with Buy Me a Coffee')).toBeInTheDocument();
    expect(screen.getByText('Connect your Buy Me a Coffee account to view supporters and stats.')).toBeInTheDocument();
  });

  it('connects to BMC when button is clicked', async () => {
    render(<BMCSupport />);
    
    const connectButton = screen.getByText('Connect with Buy Me a Coffee');
    fireEvent.click(connectButton);
    
    expect(connectButton).toHaveAttribute('disabled');
    
    await waitFor(() => {
      expect(bmcApi.getSupporters).toHaveBeenCalledWith('mock_access_token');
      expect(bmcApi.getExtras).toHaveBeenCalledWith('mock_access_token');
      expect(screen.getByText('Buy Me a Coffee Dashboard')).toBeInTheDocument();
    });
  });

  it('displays supporter information when connected', async () => {
    render(<BMCSupport />);
    
    fireEvent.click(screen.getByText('Connect with Buy Me a Coffee'));
    
    await waitFor(() => {
      expect(screen.getByText('Recent Supporters')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });
  });

  it('disconnects when disconnect button is clicked', async () => {
    render(<BMCSupport />);
    
    fireEvent.click(screen.getByText('Connect with Buy Me a Coffee'));
    
    await waitFor(() => {
      expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Disconnect'));
    
    expect(screen.getByText('Connect with Buy Me a Coffee')).toBeInTheDocument();
  });
});
