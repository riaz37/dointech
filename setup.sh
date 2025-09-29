#!/bin/bash

# Task Management System Setup Script
echo "🚀 Setting up Task Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) and try again."
    exit 1
fi

# Check if MongoDB is running (optional check)
echo "📋 Setting up backend..."

# Backend setup
cd server
if [ ! -f ".env" ]; then
    cp .env.example .env 2>/dev/null || echo "MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please-use-a-strong-random-key
PORT=3001
NODE_ENV=development" > .env
    echo "✅ Created backend .env file"
else
    echo "✅ Backend .env file already exists"
fi

echo "📦 Installing backend dependencies..."
npm install

echo "🌐 Setting up frontend..."

# Frontend setup
cd ../web
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local 2>/dev/null || echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development" > .env.local
    echo "✅ Created frontend .env.local file"
else
    echo "✅ Frontend .env.local file already exists"
fi

echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "1. Start MongoDB (if using local instance)"
echo "2. Start the backend: cd server && npm run start:dev"
echo "3. Start the frontend: cd web && npm run dev"
echo ""
echo "📚 Access points:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001"
echo "- API Documentation: http://localhost:3001/api/docs"
echo ""
echo "🎉 Happy coding!"
