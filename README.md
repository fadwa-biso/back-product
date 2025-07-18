# PharmacyHub Frontend

A modern React frontend for the PharmacyHub platform - connecting customers with verified pharmacies and quality medicines.

## Features

### 🏠 Core Features
- **Product Browsing**: Search and filter through thousands of medicines
- **Pharmacy Discovery**: Find verified pharmacies near you
- **Shopping Cart**: Add products and manage your cart
- **Order Management**: Track your orders from placement to delivery
- **User Authentication**: Secure login/register with role-based access

### 👥 User Roles
- **Customers**: Browse products, place orders, manage profile
- **Pharmacy Owners**: Manage inventory, process orders, view analytics
- **Admins**: Manage users, pharmacies, and platform oversight

### 🛒 Shopping Experience
- Advanced product search and filtering
- Product details with medical information
- Wishlist functionality
- Multiple payment methods
- Real-time cart updates
- Order tracking

### 📱 Modern UI/UX
- Responsive design for all devices
- Clean, intuitive interface
- Loading states and error handling
- Toast notifications
- Smooth animations and transitions

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications
- **Heroicons** - Beautiful SVG icons
- **Context API** - State management

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pharmacy-hub-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Common/         # Generic components (Button, Modal, etc.)
│   ├── Layout/         # Layout components (Header, Footer)
│   └── Products/       # Product-specific components
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── CartContext.jsx # Shopping cart state
├── pages/              # Page components
│   ├── Auth/          # Login, Register pages
│   ├── Products/      # Product listing, details
│   └── ...
├── utils/              # Utility functions
│   └── api.js         # API client configuration
└── App.jsx            # Main app component
```

## Key Features Implementation

### Authentication System
- JWT token-based authentication
- Automatic token refresh
- Role-based access control
- Protected routes

### Shopping Cart
- Real-time cart updates
- Persistent cart state
- Pharmacy-specific carts
- Quantity management

### Product Management
- Advanced search and filtering
- Product categorization
- Wishlist functionality
- Availability checking

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Accessible UI components

## API Integration

The frontend integrates with the backend API for:

- **Authentication**: Login, register, token refresh
- **Products**: Search, details, categories
- **Cart**: Add, update, remove items
- **Orders**: Place orders, track status
- **User Management**: Profile, preferences
- **Pharmacy Management**: Inventory, orders

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration for code quality
- Prettier for code formatting
- Consistent component structure
- Proper error handling

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@pharmacyhub.com or create an issue in the repository.