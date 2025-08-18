# VHASS Platform

A comprehensive e-learning platform for cybersecurity and entrepreneurship courses, built with React frontend and Node.js backend.

## Project Structure

```
Vhass-Frontend-main/
├── src/                    # Frontend React application
│   ├── Components/         # Reusable UI components
│   ├── Pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── backend/               # Backend Node.js server
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── ...
└── README.md
```

## Features

### Frontend Features
- **Modern UI/UX**: Beautiful, responsive design with 3D effects and animations
- **Authentication**: Sign up, sign in, Google OAuth, password reset
- **Course Management**: Browse courses, enroll, track progress
- **Workshop Management**: Join workshops and track participation
- **Payment Integration**: PhonePe payment gateway integration
- **Responsive Design**: Works on desktop, tablet, and mobile

### Backend Features
- **User Authentication**: JWT-based authentication with session management
- **Google OAuth**: Social login integration
- **Course Management**: CRUD operations for courses and lectures
- **Workshop Management**: Workshop creation and enrollment
- **Payment Processing**: PhonePe payment gateway integration
- **File Upload**: Course materials and workshop content
- **Email Services**: Password reset and verification emails
- **Progress Tracking**: User learning progress management

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google OAuth credentials
- PhonePe merchant credentials

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Open [http://localhost:5173](http://localhost:5173)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/vhass_db
   JWT_SECRET=your-super-secret-jwt-key
   SESSION_SECRET=your-super-secret-session-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   PHONEPE_MERCHANT_ID=your-phonepe-merchant-id
   PHONEPE_MERCHANT_KEY=your-phonepe-merchant-key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-email-password
   PORT=5001
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Access the API**
   - API Base URL: [http://localhost:5001/api](http://localhost:5001/api)
   - Health Check: [http://localhost:5001/health](http://localhost:5001/health)

## API Documentation

### Authentication Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout
- `POST /api/user/verify` - Email verification
- `POST /api/user/forgot` - Forgot password
- `POST /api/user/reset` - Reset password
- `GET /api/user/me` - Get user profile
- `GET /auth/google` - Google OAuth
- `GET /auth/google/callback` - Google OAuth callback

### Course Endpoints
- `GET /api/course/all` - Get all courses
- `GET /api/course/:id` - Get single course
- `POST /api/course/new` - Create new course (admin only)
- `POST /api/course/:id` - Add lectures to course (admin only)
- `DELETE /api/course/:id` - Delete course (admin only)
- `GET /api/lectures/:id` - Get course lectures
- `GET /api/lecture/:id` - Get single lecture
- `GET /api/mycourse` - Get user's enrolled courses
- `POST /api/course/phonepe/checkout/:id` - PhonePe checkout for course
- `POST /api/course/phonepe/status/:merchantOrderId` - PhonePe payment status

### Workshop Endpoints
- `GET /api/workshop/all` - Get all workshops
- `GET /api/workshop/:id` - Get single workshop
- `POST /api/workshop/new` - Create new workshop (admin only)
- `DELETE /api/workshop/:id` - Delete workshop (admin only)
- `GET /api/myworkshop` - Get user's enrolled workshops
- `POST /api/workshop/phonepe/checkout/:id` - PhonePe checkout for workshop
- `POST /api/workshop/phonepe/status/:transactionId` - PhonePe payment status

## Available Courses

1. **Certified Ethical Hacker (CEH)**
   - Duration: 28 Hours
   - Price: ₹25,000
   - Advanced cybersecurity training

2. **Awareness of Cyber Crime And Threats**
   - Duration: 20 Hours
   - Price: ₹1,000
   - Basic cybersecurity awareness

3. **Cyber Suraksha – 30-Day Cybersecurity Empowerment for Small Businesses**
   - Duration: 45 Hours
   - Price: ₹8,000
   - Business-focused cybersecurity

4. **Zero to Founder (Entrepreneurship Edition)**
   - Duration: 40 Hours
   - Price: ₹12,999
   - Complete entrepreneurship course

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Passport.js** - OAuth authentication
- **Multer** - File upload handling
- **Nodemailer** - Email services
- **PhonePe SDK** - Payment gateway

## Development

### Running Both Frontend and Backend

1. **Terminal 1 - Frontend**
   ```bash
   npm run dev
   ```

2. **Terminal 2 - Backend**
   ```bash
   cd backend
   npm run dev
   ```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/vhass_db
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PHONEPE_MERCHANT_ID=your-phonepe-merchant-id
PHONEPE_MERCHANT_KEY=your-phonepe-merchant-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
PORT=5001
```

## Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

### Backend Deployment
The backend is configured for deployment on Render.com. See `backend/render.yaml` for configuration details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software owned by VHASS SOFTWARES PRIVATE LIMITED.

## Support

For support and questions, please contact the development team at VHASS SOFTWARES PRIVATE LIMITED.
