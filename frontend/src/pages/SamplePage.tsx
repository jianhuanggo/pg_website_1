import React, { useState } from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/tabs';
import { Divider } from '@chakra-ui/layout';
import { Code } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/alert';
import { Link } from '@chakra-ui/layout';
import { UnorderedList, ListItem } from '@chakra-ui/layout';
import { useColorMode } from '@chakra-ui/color-mode';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from '../components/payment/StripePayment';
import PatreonConnect from '../components/patreon/PatreonConnect';
import BMCSupport from '../components/buymeacoffee/BMCSupport';

const stripePromise = loadStripe('pk_test_51O1MvWLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

const SamplePage: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="2xl" mb={4}>Payment Integration Demo</Heading>
        <Text fontSize="xl" color="gray.600">
          Sample implementation of Stripe, Patreon, and Buy Me a Coffee integrations
        </Text>
        <Button onClick={toggleColorMode} size="sm" mt={4}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </Box>

      <Tabs variant="enclosed" colorScheme="blue" index={activeTab} onChange={(index) => setActiveTab(index)}>
        <TabList>
          <Tab>Getting Started</Tab>
          <Tab>Stripe Payment</Tab>
          <Tab>Patreon</Tab>
          <Tab>Buy Me a Coffee</Tab>
          <Tab>Deployment Guide</Tab>
        </TabList>
        
        <TabPanels>
          {/* Getting Started Tab */}
          <TabPanel>
            <Box>
              <Heading as="h2" size="lg" mb={4}>Getting Started</Heading>
              <Text mb={4}>
                This sample application demonstrates how to integrate payment systems into your web application.
                Follow the instructions below to run the application locally.
              </Text>
              
              <Heading as="h3" size="md" mt={6} mb={3}>Prerequisites</Heading>
              <UnorderedList spacing={2} mb={4}>
                <ListItem>Node.js (v16+)</ListItem>
                <ListItem>Python (v3.8+)</ListItem>
                <ListItem>npm or yarn</ListItem>
                <ListItem>pip</ListItem>
              </UnorderedList>
              
              <Heading as="h3" size="md" mt={6} mb={3}>Running the Frontend</Heading>
              <Code p={4} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
{`# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start the development server
npm run dev

# Open your browser at http://localhost:3000`}
              </Code>
              
              <Heading as="h3" size="md" mt={6} mb={3}>Running the Backend</Heading>
              <Code p={4} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
{`# Navigate to the backend directory
cd backend/payment_api

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -e .

# Start the FastAPI server
uvicorn app.main:app --reload

# API will be available at http://localhost:8000
# API documentation at http://localhost:8000/docs`}
              </Code>
              
              <Alert status="info" mt={6}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Explore the Tabs</AlertTitle>
                  <AlertDescription>
                    Click on the tabs above to see each payment integration in action and learn how to implement them in your own projects.
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>
          </TabPanel>
          
          {/* Stripe Payment Tab */}
          <TabPanel>
            <Box mb={6}>
              <Heading as="h2" size="lg" mb={4}>Stripe Payment Integration</Heading>
              <Text mb={4}>
                This example demonstrates how to process payments using Stripe. Enter an amount, provide a description (optional),
                and enter your card details to simulate a payment.
              </Text>
              
              <Alert status="warning" mb={4}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Test Mode</AlertTitle>
                  <AlertDescription>
                    This is a demonstration using Stripe's test mode. No real payments will be processed.
                    Use test card number: 4242 4242 4242 4242 with any future expiration date and any CVC.
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>
            
            <Divider mb={6} />
            
            <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Elements stripe={stripePromise}>
                <StripePayment />
              </Elements>
            </Box>
            
            <Divider my={6} />
            
            <Box>
              <Heading as="h3" size="md" mb={4}>Implementation Guide</Heading>
              <Text mb={4}>
                To implement Stripe payments in your application, follow these steps:
              </Text>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>1. Install Dependencies</Heading>
              <Code p={3} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
                npm install @stripe/react-stripe-js @stripe/stripe-js
              </Code>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>2. Set Up Stripe Elements</Heading>
              <Code p={3} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
{`import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key');

function App() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}`}
              </Code>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>3. Create Payment Form</Heading>
              <Text mb={2}>
                See the <Code>StripePayment.tsx</Code> component for a complete implementation example.
              </Text>
              
              <Link color="blue.500" href="https://stripe.com/docs/payments/accept-a-payment" isExternal>
                View Stripe Documentation
              </Link>
            </Box>
          </TabPanel>
          
          {/* Patreon Tab */}
          <TabPanel>
            <Box mb={6}>
              <Heading as="h2" size="lg" mb={4}>Patreon Integration</Heading>
              <Text mb={4}>
                This example demonstrates how to connect your application with Patreon to access creator and patron information.
              </Text>
              
              <Alert status="info" mb={4}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Demo Mode</AlertTitle>
                  <AlertDescription>
                    This is a demonstration using mock data. In a real implementation, users would be redirected to Patreon for authentication.
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>
            
            <Divider mb={6} />
            
            <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <PatreonConnect />
            </Box>
            
            <Divider my={6} />
            
            <Box>
              <Heading as="h3" size="md" mb={4}>Implementation Guide</Heading>
              <Text mb={4}>
                To implement Patreon integration in your application, follow these steps:
              </Text>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>1. Register Your Application</Heading>
              <Text mb={4}>
                Register your application on the <Link color="blue.500" href="https://www.patreon.com/portal/registration/register-clients" isExternal>Patreon Developer Portal</Link> to get your client ID and secret.
              </Text>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>2. Implement OAuth Flow</Heading>
              <Code p={3} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
{`// Redirect users to Patreon for authorization
const clientId = 'your_client_id';
const redirectUri = 'your_redirect_uri';
const scope = 'identity campaigns';

const authUrl = \`https://www.patreon.com/oauth2/authorize?response_type=code&client_id=\${clientId}&redirect_uri=\${redirectUri}&scope=\${scope}\`;


const tokenResponse = await patreonApi.getToken(authCode, redirectUri);

const userInfo = await patreonApi.getUserInfo(tokenResponse.access_token);`}
              </Code>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>3. Display User Information</Heading>
              <Text mb={2}>
                See the <Code>PatreonConnect.tsx</Code> component for a complete implementation example.
              </Text>
              
              <Link color="blue.500" href="https://docs.patreon.com/" isExternal>
                View Patreon Documentation
              </Link>
            </Box>
          </TabPanel>
          
          {/* Buy Me a Coffee Tab */}
          <TabPanel>
            <Box mb={6}>
              <Heading as="h2" size="lg" mb={4}>Buy Me a Coffee Integration</Heading>
              <Text mb={4}>
                This example demonstrates how to connect your application with Buy Me a Coffee to view supporter statistics and donations.
              </Text>
              
              <Alert status="info" mb={4}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Demo Mode</AlertTitle>
                  <AlertDescription>
                    This is a demonstration using mock data. In a real implementation, users would authenticate with their Buy Me a Coffee account.
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>
            
            <Divider mb={6} />
            
            <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <BMCSupport />
            </Box>
            
            <Divider my={6} />
            
            <Box>
              <Heading as="h3" size="md" mb={4}>Implementation Guide</Heading>
              <Text mb={4}>
                To implement Buy Me a Coffee integration in your application, follow these steps:
              </Text>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>1. Get API Access</Heading>
              <Text mb={4}>
                Create a Buy Me a Coffee account and request API access from their support team.
              </Text>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>2. Authenticate and Fetch Data</Heading>
              <Code p={3} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
{`// Get supporters list
const supportersData = await bmcApi.getSupporters(accessToken);

const extrasData = await bmcApi.getExtras(accessToken);

console.log(\`Total supporters: \${extrasData.data.total_supporters}\`);
console.log(\`Total coffees: \${extrasData.data.total_coffees}\`);
console.log(\`Total revenue: \${extrasData.data.total_revenue}\`);`}
              </Code>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>3. Display Supporter Information</Heading>
              <Text mb={2}>
                See the <Code>BMCSupport.tsx</Code> component for a complete implementation example.
              </Text>
              
              <Link color="blue.500" href="https://developers.buymeacoffee.com/" isExternal>
                View Buy Me a Coffee Documentation
              </Link>
            </Box>
          </TabPanel>
          
          {/* Deployment Guide Tab */}
          <TabPanel>
            <Box>
              <Heading as="h2" size="lg" mb={4}>Deployment Guide</Heading>
              <Text mb={4}>
                Follow these instructions to deploy your application to production environments.
              </Text>
              
              <Heading as="h3" size="md" mt={6} mb={3}>Frontend Deployment</Heading>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>Deploying to Vercel</Heading>
              <Code p={3} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
{`# Install Vercel CLI
npm install -g vercel

# Navigate to the frontend directory
cd frontend

# Build the application
npm run build

# Deploy to Vercel
vercel

# Follow the prompts to complete the deployment`}
              </Code>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>Deploying to Netlify</Heading>
              <Code p={3} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
{`# Install Netlify CLI
npm install -g netlify-cli

# Navigate to the frontend directory
cd frontend

# Build the application
npm run build

# Deploy to Netlify
netlify deploy

# Follow the prompts to complete the deployment`}
              </Code>
              
              <Heading as="h3" size="md" mt={6} mb={3}>Backend Deployment</Heading>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>Deploying to Heroku</Heading>
              <Code p={3} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
{`# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Create a Procfile in the backend directory
echo "web: uvicorn app.main:app --host=0.0.0.0 --port=\$PORT" > Procfile

# Deploy to Heroku
git subtree push --prefix backend/payment_api heroku main`}
              </Code>
              
              <Heading as="h4" size="sm" mt={4} mb={2}>Deploying to AWS</Heading>
              <Code p={3} borderRadius="md" display="block" whiteSpace="pre" mb={4}>
{`# Install AWS CLI and configure your credentials
pip install awscli
aws configure

# Create an Elastic Beanstalk application
eb init -p python-3.8 your-app-name

# Create an environment
eb create your-env-name

# Deploy the application
eb deploy`}
              </Code>
              
              <Alert status="warning" mt={6}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Remember to set up environment variables in your production environment for API keys and other sensitive information.
                    Never commit API keys or secrets to your repository.
                  </AlertDescription>
                </Box>
              </Alert>
              
              <Box mt={6}>
                <Heading as="h3" size="md" mb={3}>Configuration for Production</Heading>
                <Text mb={4}>
                  Before deploying to production, make sure to:
                </Text>
                <UnorderedList spacing={2}>
                  <ListItem>Replace test API keys with production keys</ListItem>
                  <ListItem>Set up proper error handling and logging</ListItem>
                  <ListItem>Configure CORS settings for your domains</ListItem>
                  <ListItem>Set up SSL certificates for secure connections</ListItem>
                  <ListItem>Implement proper authentication and authorization</ListItem>
                </UnorderedList>
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default SamplePage;
