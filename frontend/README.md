# RoomRent Frontend

A modern web application for room rental management built with React, Vite, and Tailwind CSS.

## Features

- Modern UI with responsive design
- User authentication (login/signup)
- Room listing and search
- Room booking system
- User reviews and ratings
- Admin dashboard
- Real-time notifications

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Font Awesome Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── assets/        # Static assets (images, fonts)
├── components/    # Reusable components
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── pages/         # Page components
├── services/      # API services
├── styles/        # CSS styles
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
