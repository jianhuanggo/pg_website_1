import React, { useState } from 'react';
import { Box, Heading, Text, Flex, Badge } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Stack } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/layout';
import { List, ListItem } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import { SimpleGrid } from '@chakra-ui/layout';
import { Link } from '@chakra-ui/layout';
import { Stat, StatLabel, StatNumber, StatGroup } from '@chakra-ui/stat';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { bmcApi } from '../../api/api';

interface Supporter {
  supporter_name: string;
  support_coffee_price: number;
  support_email?: string;
  support_message?: string;
}

interface Extras {
  total_supporters: number;
  total_coffees: number;
  total_revenue: number;
}

const BMCSupport: React.FC = () => {
  const toast = useToast();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [extras, setExtras] = useState<Extras | null>(null);
  
  const handleConnect = async () => {
    setIsLoading(true);
    
    try {
      setTimeout(async () => {
        const supportersResponse = await bmcApi.getSupporters('mock_access_token');
        setSupporters(supportersResponse.supporters);
        
        const extrasResponse = await bmcApi.getExtras('mock_access_token');
        setExtras(extrasResponse.data);
        
        setIsConnected(true);
        
        toast({
          title: 'Connected to Buy Me a Coffee',
          description: 'Successfully retrieved supporter data',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('BMC connection error:', error);
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
    setSupporters([]);
    setExtras(null);
    setIsConnected(false);
    toast({
      title: 'Disconnected from Buy Me a Coffee',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4}>Buy Me a Coffee Integration</Heading>
      
      {!isConnected ? (
        <Stack spacing={4} align="stretch">
          <Text>Connect your Buy Me a Coffee account to view supporters and stats.</Text>
          <Button
            colorScheme="yellow"
            isLoading={isLoading}
            loadingText="Connecting..."
            onClick={handleConnect}
          >
            Connect with Buy Me a Coffee
          </Button>
        </Stack>
      ) : (
        <Stack spacing={4} align="stretch">
          <Heading size="sm">Buy Me a Coffee Dashboard</Heading>
          
          {extras && (
            <StatGroup>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} width="100%">
                <Stat>
                  <StatLabel>Total Supporters</StatLabel>
                  <StatNumber>{extras.total_supporters}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Total Coffees</StatLabel>
                  <StatNumber>{extras.total_coffees}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Total Revenue</StatLabel>
                  <StatNumber>${extras.total_revenue.toFixed(2)}</StatNumber>
                </Stat>
              </SimpleGrid>
            </StatGroup>
          )}
          
          <Divider />
          
          <Heading size="sm" mt={2}>Recent Supporters</Heading>
          <List spacing={2}>
            {supporters.map((supporter, index) => (
              <ListItem key={index} p={2} borderWidth="1px" borderRadius="md">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">{supporter.supporter_name}</Text>
                  <Badge colorScheme="green">${supporter.support_coffee_price.toFixed(2)}</Badge>
                </Flex>
                {supporter.support_message && (
                  <Text fontSize="sm" mt={1} color="gray.600">
                    "{supporter.support_message}"
                  </Text>
                )}
              </ListItem>
            ))}
          </List>
          
          <Link href="https://www.buymeacoffee.com" isExternal color="blue.500">
            Visit Buy Me a Coffee <ExternalLinkIcon mx="2px" />
          </Link>
          
          <Button colorScheme="red" variant="outline" onClick={handleDisconnect} mt={2}>
            Disconnect
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default BMCSupport;
