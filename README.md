# Document Summarizer

A Next.js application that allows users to upload documents and get AI-powered summaries using Google's Gemini API. Features secure authentication, MongoDB database, modern UI, and **text-to-speech capabilities** powered by Murf AI.

## Features

- 🔐 **Secure Authentication**: Email/password authentication with NextAuth.js
- 📄 **Document Upload**: Support for TXT, DOC, DOCX, and PDF files
- 🤖 **AI Summarization**: Powered by Google Gemini API
- 🔊 **Text-to-Speech**: Convert summaries to natural-sounding audio using Murf AI
- 🎵 **Audio Controls**: Playback speed, volume control, voice selection
- 💾 **Database Storage**: MongoDB with Mongoose ODM
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API
- **Text-to-Speech**: Murf AI API
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Google Gemini API key
- **Murf AI API key** (for text-to-speech features)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd document-summarizer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/document-summarizer

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Murf AI API (for text-to-speech)
MURF_API_KEY=your-murf-api-key-here
```

### 4. Set up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The database will be created automatically when you first run the app

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and replace `MONGODB_URI` in `.env.local`

### 5. Get API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

#### Murf AI API Key
1. Go to [Murf AI](https://murf.ai/api)
2. Sign up for an account
3. Generate your API key from the dashboard
4. Add it to your `.env.local` file

### 6. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Add the generated secret to `NEXTAUTH_SECRET` in your `.env.local` file.

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Sign In**: Log in to your account
3. **Upload Documents**: Click "Upload Document" and select a file
4. **View Summaries**: Your documents will be automatically summarized and displayed
5. **Listen to Summaries**: Use the audio player to convert summaries to speech with customizable voices and playback speeds

## Text-to-Speech Features

The application includes advanced text-to-speech capabilities:

- **Multiple Voices**: Choose from different AI voices (Terrell, Amy, Josh, Sarah)
- **Playback Controls**: Adjust speed from 0.5x to 2x
- **Volume Control**: Mute/unmute and adjust volume
- **Progress Tracking**: See current position and total duration
- **Auto-Save**: Generated audio URLs are automatically saved to the database

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (handled by NextAuth)
- `GET /api/documents` - Get user's documents
- `POST /api/documents/upload` - Upload and summarize document
- `PUT /api/documents/[id]/audio` - Update document with audio URL
- `POST /api/tts/generate` - Generate text-to-speech audio

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   └── signup/
│   │   ├── documents/
│   │   │   ├── upload/
│   │   │   ├── [id]/audio/
│   │   │   └── route.ts
│   │   └── tts/
│   │       └── generate/
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/
│   │   ├── summaries/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   ├── AudioPlayer.tsx
│   └── Providers.tsx
├── lib/
│   ├── auth.ts
│   ├── gemini.ts
│   ├── murf.ts
│   └── mongodb.ts
└── models/
    ├── Document.ts
    └── User.ts
```

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- API key security for external services

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
