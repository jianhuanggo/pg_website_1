import React, { useState } from 'react';
import { Box, Heading, Text, Flex, Badge } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/layout';
import { List, ListItem } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

interface ListIconProps {
  as: React.ElementType;
  color?: string;
  [key: string]: any;
}

const ListIcon = ({ as: Icon, color, ...props }: ListIconProps) => (
  <Box display="inline-block" mr={2} verticalAlign="middle">
    <Icon color={color} {...props} />
  </Box>
);
import { patreonApi } from '../../api/api';

interface PatreonUser {
  id: string;
  full_name: string;
  email?: string;
  is_patron: boolean;
  patron_status?: string;
}

const PatreonConnect: React.FC = () => {
  const toast = useToast();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<PatreonUser | null>(null);
  
  const handleConnect = async () => {
    setIsLoading(true);
    
    try {
      
      setTimeout(async () => {
        const tokenResponse = await patreonApi.getToken('mock_auth_code', 'http://localhost:3000/patreon/callback');
        
        const userInfo = await patreonApi.getUserInfo(tokenResponse.access_token);
        
        setUserData(userInfo);
        setIsConnected(true);
        
        toast({
          title: 'Connected to Patreon',
          description: `Successfully connected as ${userInfo.full_name}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Patreon connection error:', error);
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = () => {
    setUserData(null);
    setIsConnected(false);
    toast({
      title: 'Disconnected from Patreon',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4}>Patreon Integration</Heading>
      
      {!isConnected ? (
        <Stack spacing={4} align="stretch">
          <Text>Connect your Patreon account to access exclusive content and benefits.</Text>
          <Button
            colorScheme="orange"
            isLoading={isLoading}
            loadingText="Connecting..."
            onClick={handleConnect}
          >
            Connect with Patreon
          </Button>
        </Stack>
      ) : (
        <Stack spacing={4} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="sm">{userData?.full_name}</Heading>
            <Badge colorScheme={userData?.is_patron ? 'green' : 'gray'}>
              {userData?.is_patron ? 'Active Patron' : 'Not a Patron'}
            </Badge>
          </Flex>
          
          <Divider />
          
          <List spacing={2}>
            <ListItem>
              <ListIcon as={userData?.is_patron ? CheckCircleIcon : WarningIcon} color={userData?.is_patron ? 'green.500' : 'orange.500'} />
              Patron Status: {userData?.patron_status || 'Not a patron'}
            </ListItem>
            {userData?.email && (
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Email: {userData.email}
              </ListItem>
            )}
          </List>
          
          <Button colorScheme="red" variant="outline" onClick={handleDisconnect} mt={2}>
            Disconnect
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default PatreonConnect;
