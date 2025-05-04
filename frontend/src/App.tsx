import { 
  ChakraProvider, 
  Box, 
  Stack, 
  Heading, 
  Text, 
  Container
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/tabs';
import { Divider } from '@chakra-ui/layout';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from './components/payment/StripePayment';
import PatreonConnect from './components/patreon/PatreonConnect';
import BMCSupport from './components/buymeacoffee/BMCSupport';

const stripePromise = loadStripe('pk_test_51O1MvWLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

function App() {
  return (
    <ChakraProvider theme={{}}>
      <Container maxW="container.lg" py={8}>
        <Stack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="xl">Payment Integration Demo</Heading>
            <Text mt={2} color="gray.600">
              Demonstrating Stripe, Patreon, and Buy Me a Coffee integrations
            </Text>
          </Box>
          
          <Divider />
          
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Stripe Payment</Tab>
              <Tab>Patreon</Tab>
              <Tab>Buy Me a Coffee</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <Elements stripe={stripePromise}>
                  <StripePayment />
                </Elements>
              </TabPanel>
              
              <TabPanel>
                <PatreonConnect />
              </TabPanel>
              
              <TabPanel>
                <BMCSupport />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
