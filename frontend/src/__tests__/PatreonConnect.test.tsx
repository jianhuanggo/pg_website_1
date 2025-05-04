import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PatreonConnect from '../components/patreon/PatreonConnect';
import { patreonApi } from '../api/api';

jest.mock('../api/api', () => ({
  patreonApi: {
    getToken: jest.fn(),
    getUserInfo: jest.fn(),
  },
}));

jest.mock('@chakra-ui/toast', () => ({
  useToast: () => jest.fn(),
}));

describe('PatreonConnect Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (patreonApi.getToken as jest.Mock).mockResolvedValue({
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    });
    (patreonApi.getUserInfo as jest.Mock).mockResolvedValue({
      id: '12345',
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      is_patron: true,
      patron_status: 'active_patron',
    });
  });

  it('renders the connect button when not connected', () => {
    render(<PatreonConnect />);
    
    expect(screen.getByText('Patreon Integration')).toBeInTheDocument();
    expect(screen.getByText('Connect with Patreon')).toBeInTheDocument();
    expect(screen.getByText('Connect your Patreon account to access exclusive content and benefits.')).toBeInTheDocument();
  });

  it('connects to Patreon when button is clicked', async () => {
    render(<PatreonConnect />);
    
    const connectButton = screen.getByText('Connect with Patreon');
    fireEvent.click(connectButton);
    
    expect(connectButton).toHaveAttribute('disabled');
    
    await waitFor(() => {
      expect(patreonApi.getToken).toHaveBeenCalledWith(
        'mock_auth_code',
        'http://localhost:3000/patreon/callback'
      );
      expect(patreonApi.getUserInfo).toHaveBeenCalledWith('mock_access_token');
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Active Patron')).toBeInTheDocument();
    });
  });

  it('displays user info when connected', async () => {
    render(<PatreonConnect />);
    
    fireEvent.click(screen.getByText('Connect with Patreon'));
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Active Patron')).toBeInTheDocument();
      expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });
  });

  it('disconnects when disconnect button is clicked', async () => {
    render(<PatreonConnect />);
    
    fireEvent.click(screen.getByText('Connect with Patreon'));
    
    await waitFor(() => {
      expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Disconnect'));
    
    expect(screen.getByText('Connect with Patreon')).toBeInTheDocument();
  });
});
