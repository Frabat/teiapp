# TEI App - Advanced XML Document Viewer

A modern, responsive web application for viewing and analyzing TEI (Text Encoding Initiative) XML documents with advanced features including parallel column display, interactive annotations, and comprehensive file management.

## 🚀 Features

### 🔐 Authentication System
- **Firebase Authentication**: Secure user management
- **Google SSO**: One-click sign-in with Google accounts
- **User Profiles**: Extended profile information (First Name, Last Name, Address, University)
- **Protected Routes**: Authentication-based access control

### 📄 File Management
- **Multiple Formats**: Support for TXT, MD, JSON, XML, HTML, PDF, DOC, DOCX, Images
- **Firebase Storage**: Secure cloud file storage
- **Drag & Drop**: Intuitive file upload interface
- **File Organization**: Grid-based file display with metadata

### 🔍 TEI XML Viewer
- **Parallel Columns**: Side-by-side display of source, translation, and commentary
- **Interactive Annotations**: Hover tooltips for word-level annotations
- **Critical Apparatus**: Display of scholarly annotations and variants
- **Segment Alignment**: Smart matching of corresponding text sections
- **Responsive Design**: Mobile-optimized viewing experience

### 🎨 Modern UI/UX
- **Material-UI v7**: Professional design system
- **Crextio Theme**: Custom aesthetic with consistent styling
- **Responsive Layout**: Works on all device sizes
- **Dark/Light Mode**: Theme-aware interface

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7.0.0
- **UI Library**: Material-UI v7 + Emotion
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v7
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage + Firestore
- **Styling**: CSS-in-JS with Material-UI theming

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Setup
```bash
# Clone the repository
git clone https://github.com/francescobattista/teiapp.git
cd teiapp

# Install dependencies
cd apps/fe
npm install

# Set up environment variables
cp firebase-config.example .env.local
# Edit .env.local with your Firebase configuration

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the `apps/fe` directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password + Google)
3. Enable Storage and Firestore
4. Configure security rules
5. Add your web app to the project

## 🚀 Deployment

### GitHub Pages (Recommended)

The application is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**: Go to repository Settings → Pages → Source: GitHub Actions
2. **Push to Main**: Automatic deployment on push to main/master branch
3. **Access**: Your app will be available at `https://username.github.io/teiapp`

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Other Platforms

The application can be deployed to any static hosting service:
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload `dist` contents to S3 bucket
- **Firebase Hosting**: Use Firebase CLI for deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📱 Usage

### Authentication
1. Navigate to the application
2. Click "Sign Up" to create an account
3. Fill in your profile information
4. Or use "Sign in with Google" for quick access

### File Management
1. **Upload Files**: Drag and drop files or use the upload button
2. **View Files**: Click on file cards to view details
3. **Download**: Use the download button to save files locally
4. **Delete**: Remove files you no longer need

### TEI XML Viewing
1. **Upload TEI XML**: Upload any TEI-compliant XML document
2. **Parallel View**: See source, translation, and commentary side by side
3. **Interactive Elements**: Hover over annotated words for details
4. **Navigation**: Click segments to highlight corresponding content

## 🔍 Development

### Project Structure
```
src/
├── components/     # Reusable UI components
├── features/       # Main application views
├── auth/          # Authentication system
├── store/         # Redux state management
├── utils/         # Utility functions (TEI parser)
├── App.tsx        # Main application component
└── theme.ts       # Custom Material-UI theme
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run deploy       # Deploy to GitHub Pages
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Modern linting configuration
- **Prettier**: Code formatting (if configured)
- **Error Boundaries**: Global error handling

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**: Test sign-up, sign-in, and sign-out
2. **File Operations**: Test upload, view, download, and delete
3. **TEI Viewer**: Test with various TEI XML documents
4. **Responsive Design**: Test on different screen sizes

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Responsive design for all devices

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build
```

#### Firebase Issues
- Verify environment variables are set correctly
- Check Firebase project configuration
- Ensure security rules allow necessary operations

#### Routing Issues
- Verify base path configuration for deployment
- Check 404.html file is in public directory
- Ensure React Router basename is set correctly

### Getting Help
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review GitHub Actions logs for deployment issues
3. Verify environment variable configuration
4. Test locally with production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use Material-UI components consistently
- Maintain responsive design principles
- Add proper error handling
- Include TypeScript types for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **TEI Consortium**: For the Text Encoding Initiative standards
- **Material-UI**: For the excellent component library
- **Firebase**: For the robust backend services
- **Vite**: For the fast build tooling

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the deployment guide
- Review troubleshooting section
- Test with minimal reproduction case

---

**Version**: 1.0.0  
**Last Updated**: August 2024  
**Maintainer**: Francesco Battista
