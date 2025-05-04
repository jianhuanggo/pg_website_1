# Payment Integration Website

A simple website built with React, Chakra UI, and FastAPI that demonstrates payment integrations with Stripe, Patreon, and Buy Me a Coffee.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
  - [Prerequisites](#prerequisites)
  - [Running the Frontend](#running-the-frontend)
  - [Running the Backend](#running-the-backend)
  - [Running Tests](#running-tests)
- [Deployment Guide](#deployment-guide)
  - [Frontend Deployment](#frontend-deployment)
  - [Backend Deployment](#backend-deployment)
- [API Documentation](#api-documentation)
- [Integration Examples](#integration-examples)

## Features

- **Stripe Payment Integration**: Process payments with credit cards
- **Patreon Integration**: Connect with Patreon for creator support
- **Buy Me a Coffee Integration**: View supporter statistics and donations
- **Responsive UI**: Built with Chakra UI components
- **API Backend**: FastAPI backend with mock endpoints for testing

## Project Structure

```
pg_website_1/
├── frontend/                 # React frontend application
│   ├── src/                  # Source code
│   │   ├── components/       # UI components
│   │   │   ├── payment/      # Stripe payment components
│   │   │   ├── patreon/      # Patreon integration components
│   │   │   └── buymeacoffee/ # Buy Me a Coffee components
│   │   ├── api/              # API client functions
│   │   └── __tests__/        # Unit tests
│   └── ...                   # Configuration files
└── backend/                  # FastAPI backend
    └── payment_api/          # Payment API service
        ├── app/              # Application code
        │   ├── api/          # API routes
        │   │   ├── stripe/   # Stripe endpoints
        │   │   ├── patreon/  # Patreon endpoints
        │   │   └── buymeacoffee/ # Buy Me a Coffee endpoints
        │   └── main.py       # FastAPI application entry point
        └── tests/            # Backend tests
```

## Local Development

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn
- pip

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend/payment_api
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -e .
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

5. The API will be available at `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`

### Running Tests

#### Frontend Tests

```bash
cd frontend
npm test
# or
yarn test
```

#### Backend Tests

```bash
cd backend/payment_api
pytest
```

## Deployment Guide

### Frontend Deployment

#### Deploying to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

4. Deploy to Vercel:
   ```bash
   vercel
   ```

5. Follow the prompts to complete the deployment.

#### Deploying to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

4. Deploy to Netlify:
   ```bash
   netlify deploy
   ```

5. Follow the prompts to complete the deployment.

### Backend Deployment

#### Deploying to Heroku

1. Install Heroku CLI:
   ```bash
   npm install -g heroku
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

4. Create a `Procfile` in the backend directory:
   ```
   web: uvicorn app.main:app --host=0.0.0.0 --port=$PORT
   ```

5. Deploy to Heroku:
   ```bash
   git subtree push --prefix backend/payment_api heroku main
   ```

#### Deploying to AWS

1. Install AWS CLI and configure your credentials:
   ```bash
   pip install awscli
   aws configure
   ```

2. Create an Elastic Beanstalk application:
   ```bash
   eb init -p python-3.8 your-app-name
   ```

3. Create an environment:
   ```bash
   eb create your-env-name
   ```

4. Deploy the application:
   ```bash
   eb deploy
   ```

## API Documentation

When the backend is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Integration Examples

### Stripe Payment

```javascript
import { stripeApi } from '../api/api';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Create a payment intent
const { client_secret } = await stripeApi.createPaymentIntent(1000, 'usd', 'Product purchase');

// Confirm the payment
const stripe = useStripe();
const elements = useElements();
const cardElement = elements.getElement(CardElement);

const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'Customer Name',
    },
  },
});

if (paymentIntent.status === 'succeeded') {
  console.log('Payment successful!');
}
```

### Patreon Integration

```javascript
import { patreonApi } from '../api/api';

// Exchange authorization code for access token
const tokenResponse = await patreonApi.getToken(authCode, redirectUri);

// Get user information
const userInfo = await patreonApi.getUserInfo(tokenResponse.access_token);

console.log(`Connected as ${userInfo.full_name}`);
console.log(`Patron status: ${userInfo.patron_status}`);
```

### Buy Me a Coffee Integration

```javascript
import { bmcApi } from '../api/api';

// Get supporters list
const supportersData = await bmcApi.getSupporters(accessToken);

// Get extra statistics
const extrasData = await bmcApi.getExtras(accessToken);

console.log(`Total supporters: ${extrasData.data.total_supporters}`);
console.log(`Total coffees: ${extrasData.data.total_coffees}`);
console.log(`Total revenue: $${extrasData.data.total_revenue}`);
```
