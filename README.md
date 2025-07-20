# DroidBRB 🤖

A peer-to-peer platform connecting robotics enthusiasts to share, rent, and collaborate around robotic devices.

## 🚀 Mission

To democratize access to robotics technology while building the world's largest community of robotics enthusiasts.

## ✨ Features

### Phase 1 (MVP) - Community Marketplace
- **User Management**: Registration, profiles, verification system
- **Robot Listings**: Create and browse robot listings with photos and specifications
- **Discovery & Search**: Advanced filtering by category, location, and price
- **Community Features**: Discussion forums, local groups, events
- **Communication**: Real-time messaging and notifications

### Phase 2 - Enhanced Platform
- **Trust & Safety**: Rating system, reviews, dispute resolution
- **Meetup Coordination**: Event creation and management
- **Mobile Experience**: Progressive Web App (PWA)

### Phase 3 - Rental Marketplace
- **Payment Processing**: Stripe integration
- **Rental Management**: Digital agreements, tracking
- **Insurance & Liability**: Coverage options and claims

## 🛠 Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **Database**: Firestore (NoSQL with real-time sync)
- **Authentication**: Firebase Auth with OAuth
- **File Storage**: Firebase Storage
- **Real-time**: Firestore real-time listeners
- **Hosting**: Netlify (Frontend) + Firebase Hosting
- **Payments**: Stripe integration

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd droidbrb-v3
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Firebase Setup**
   ```bash
   # Install Firebase CLI globally
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase project
   cd client
   firebase init
   ```

4. **Environment Setup**
   ```bash
   # Copy environment files
   cp client/.env.example client/.env.local
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## 🌐 Access

- **Frontend**: http://localhost:3000
- **Firebase Console**: https://console.firebase.google.com
- **Netlify Dashboard**: https://app.netlify.com

## 📁 Project Structure

```
droidbrb-v3/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # Firebase services
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── context/       # React context providers
│   ├── public/            # Static assets
│   ├── firebase/          # Firebase configuration
│   └── functions/         # Cloud Functions (if needed)
├── shared/                # Shared types and utilities
└── docs/                  # Documentation
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run firebase:serve` - Serve Firebase locally
- `npm run firebase:deploy` - Deploy to Firebase
- `npm run netlify:deploy` - Deploy to Netlify

### Firebase Services Used

- **Firestore**: Database for users, robots, communities, messages
- **Authentication**: User registration, login, OAuth
- **Storage**: File uploads for robot images and avatars
- **Cloud Functions**: Serverless backend logic
- **Hosting**: Optional hosting (using Netlify instead)

## 🧪 Testing

```bash
# Run frontend tests
cd client && npm test

# Run Firebase emulators
cd client && firebase emulators:start
```

## 📊 Database Schema (Firestore)

### Collections

- **users**: User profiles and authentication data
- **robots**: Robot listings with specifications
- **communities**: Community groups and forums
- **posts**: Community posts and discussions
- **messages**: Real-time messaging between users
- **rentals**: Rental bookings and transactions
- **events**: Community events and meetups
- **reviews**: User and robot reviews

## 🔐 Environment Variables

### Frontend (.env.local)
```
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

## 🚀 Deployment

### Netlify Deployment
```bash
# Connect to Netlify
netlify login
netlify init

# Deploy
npm run build
netlify deploy --prod
```

### Firebase Deployment
```bash
# Deploy to Firebase
firebase deploy
```

## 📈 Success Metrics

### Phase 1 (6 months)
- 1,000+ registered users
- 500+ robot listings
- 50+ active community discussions per month
- 10+ local meetups organized

### Phase 2 (12 months)
- 5,000+ registered users
- 2,000+ robot listings
- 4.5+ average platform rating
- 25+ cities with active communities

### Phase 3 (18 months)
- 15,000+ registered users
- $100,000+ monthly GMV
- 80%+ rental completion rate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Community**: [Discord](link-to-discord)

---

Built with ❤️ by the DroidBRB Team 