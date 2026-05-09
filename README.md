# Vendora - AI Marketplace

Vendora is a modern AI-powered marketplace platform built with React.js, Node.js, Express.js, and MongoDB. The platform provides a complete multi-role eCommerce experience where sellers can manage products, customers can purchase and review products, and administrators can manage the entire system.

The application also includes an AI chatbot integrated with RAG (Retrieval-Augmented Generation) to provide store-related assistance and real-time notifications using Socket.io.

---

# Features

## Authentication & Authorization

* User Registration & Login
* Secure Authentication System
* Role-Based Access Control
* Google OAuth Authentication
* Protected Routes

## Roles

### Super Admin

* Manage users
* Manage sellers
* Manage products
* Monitor marketplace activity
* Control platform operations

### Seller

* Add new products
* Update products
* Delete products
* Manage inventory
* View orders

### Customer

* Browse products
* Add products to cart
* Place orders
* Review delivered products
* Manage profile

---

# AI Chatbot

Vendora includes an AI-powered chatbot with RAG (Retrieval-Augmented Generation) implementation.

The chatbot:

* Answers only marketplace/store-related questions
* Provides product and platform assistance
* Improves customer support experience
* Uses contextual data retrieval for accurate responses

---

# Real-Time Notifications

Socket.io is integrated for real-time functionality.

Features include:

* Instant notifications
* Order updates
* Product activity alerts
* Improved real-time user engagement

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB

## Additional Technologies

* Socket.io
* JWT Authentication
* Cloudinary
* AI/RAG Integration

---

# Project Structure

```bash
vendora-marketplace/
│
├── client/
│   ├── components/
│   ├── api/
│   ├── pages/
│   ├── context/
│   ├── utils/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── utils/
│
├── package.json
└── README.md
```

---

# Installation Guide

## Clone the Repository

```bash
git clone https://github.com/saqibhussain789/vendora-marketplace.git
```

## Move into Project Directory

```bash
cd vendora-marketplace
```

---

# Install Dependencies

## Frontend

```bash
cd client
npm install
```

## Backend

```bash
cd ../server
npm install
```

---

# Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_api_key
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
SMTP_FROM=Vendora <no-reply@vendora.com>
```

---

# Run the Project

## Start Backend Server

```bash
cd server
npm run dev
```

## Start Frontend

```bash
cd client
npm run dev
```

---

# Main Functionalities

* Multi-role marketplace system
* Product management
* Shopping cart system
* Order management
* Customer reviews
* AI-powered chatbot
* RAG-based intelligent responses
* Real-time notifications
* Authentication & Authorization
* Responsive design

---

# Future Improvements

* Stripe payment integration
* Advanced analytics dashboard
* Recommendation system
* Seller performance reports
* Multi-language support
* Advanced AI product suggestions

---

# Deployment

The project can be deployed using:

* Vercel (Frontend)
* Render / Railway / AWS (Backend)
* MongoDB Atlas (Database)

---

# Author

Saqib Hussain

Full Stack Web Developer

---

# License

This project is licensed for educational and portfolio purposes.
