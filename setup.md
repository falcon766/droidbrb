# DroidBRB Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "droidbrb" (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

#### Enable Services
1. **Authentication**: Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)
   - Enable GitHub (optional)

2. **Firestore Database**: Go to Firestore Database
   - Create database in production mode
   - Choose a location close to your users

3. **Storage**: Go to Storage
   - Get started
   - Choose a location

4. **Hosting** (optional, since we're using Netlify):
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize: `cd client && firebase init`

#### Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register app with name "DroidBRB Web"
5. Copy the config object

### 3. Environment Configuration

Create `client/.env.local`:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Optional: Stripe (for Phase 3)
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key

# Optional: Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### 4. Start Development
```bash
npm run dev
```

Visit http://localhost:3000

## 🌐 Deployment

### Netlify Deployment

1. **Connect to Netlify**:
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=client/build
   ```

3. **Connect to Git** (recommended):
   - Push your code to GitHub
   - Connect Netlify to your GitHub repo
   - Set build command: `cd client && npm run build`
   - Set publish directory: `client/build`

### Firebase Deployment (Alternative)

```bash
cd client
firebase deploy
```

## 🔧 Development Workflow

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run firebase:serve` - Serve Firebase locally
- `npm run firebase:deploy` - Deploy to Firebase

### Project Structure
```
droidbrb-v3/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── firebase/      # Firebase configuration
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── firebase/          # Firebase config files
└── shared/                # Shared types and utilities
```

## 🔐 Security Rules

The Firebase security rules are already configured in:
- `client/firestore.rules` - Database security
- `client/storage.rules` - File upload security

Deploy them with:
```bash
cd client
firebase deploy --only firestore:rules,storage
```

## 📱 Progressive Web App

The app is configured as a PWA with:
- Service worker for offline functionality
- App manifest for installability
- Responsive design for all devices

## 🎨 Customization

### Colors
Edit `client/tailwind.config.js` to customize the color scheme:
- Primary: Blue theme
- Secondary: Gray theme  
- Accent: Orange theme

### Branding
Update the following files:
- `client/public/manifest.json` - App metadata
- `client/src/pages/HomePage.tsx` - Hero content
- `client/public/logo192.png` - App icon

## 🚀 Next Steps

### Phase 1 Features to Implement
1. **User Registration/Login** ✅ (Basic structure)
2. **Robot Listings** - Create, edit, browse
3. **Search & Filtering** - Location, category, price
4. **User Profiles** - Bio, expertise, verification
5. **Messaging System** - Real-time chat
6. **Community Features** - Forums, groups

### Phase 2 Features
1. **Rating & Reviews** - User and robot reviews
2. **Advanced Search** - AI recommendations
3. **Meetup Coordination** - Event management
4. **Mobile App** - React Native

### Phase 3 Features
1. **Payment Processing** - Stripe integration
2. **Rental Management** - Booking system
3. **Insurance** - Liability coverage
4. **Analytics** - Business insights

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Config Errors**:
   - Check `.env.local` file exists
   - Verify all Firebase config values
   - Ensure Firebase services are enabled

2. **Build Errors**:
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`

3. **Deployment Issues**:
   - Verify environment variables in Netlify
   - Check build logs for errors
   - Ensure all dependencies are in package.json

### Support
- Check the [README.md](README.md) for more details
- Review Firebase documentation
- Check Netlify deployment logs

---

Happy coding! 🤖 