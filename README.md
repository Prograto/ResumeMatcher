# JobMatch Pro - Resume Optimization Platform

A full-stack web application that helps job seekers optimize their resumes and cover letters using AI-powered analysis with Google Gemini.

## Features

- **Resume Optimization**: Upload DOCX resumes and get AI-optimized versions tailored to specific job descriptions
- **Cover Letter Generator**: Create personalized cover letters based on job requirements and your experience
- **ATS Scanner**: Analyze resume compatibility with ATS systems, keyword matching, and improvement recommendations

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (version 18 or higher)
2. **npm** (comes with Node.js)
3. **Google Gemini API Key** - Get one from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. **PostgreSQL Database** (optional - app uses in-memory storage by default)

## Setup Instructions for VS Code

### 1. Download and Extract Project Files

Download all project files from Replit and extract them to a folder on your computer.

### 2. Open in VS Code

```bash
# Navigate to your project folder
cd path/to/your/jobmatch-pro-folder

# Open in VS Code
code .
```

### 3. Install Dependencies

Open the integrated terminal in VS Code (`Ctrl+` ` or `View > Terminal`) and run:

```bash
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add your environment variables to `.env`:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Database configuration (if using PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/jobmatch_pro

# Development settings
NODE_ENV=development
PORT=5000
```

### 5. Database Setup (Optional)

If you want to use PostgreSQL instead of in-memory storage:

```bash
# Install PostgreSQL locally or use a cloud service
# Create a database named 'jobmatch_pro'
# Update DATABASE_URL in .env file

# Run database migrations
npm run db:push
```

### 6. Run the Application

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api

## Development Scripts

```bash
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## Project Structure

```
jobmatch-pro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
│   └── index.html
├── server/                # Express.js backend
│   ├── services/          # Business logic services
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage interface
├── shared/               # Shared TypeScript types
├── uploads/             # Temporary file uploads
├── package.json
└── README.md
```

## VS Code Extensions (Recommended)

Install these extensions for the best development experience:

1. **TypeScript and JavaScript Language Features** (built-in)
2. **ES7+ React/Redux/React-Native snippets**
3. **Tailwind CSS IntelliSense**
4. **Auto Rename Tag**
5. **Prettier - Code formatter**
6. **ESLint**

## VS Code Configuration

Create `.vscode/settings.json` for project-specific settings:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **File upload not working**
   - Ensure `uploads/` directory exists
   - Check file permissions

3. **Gemini API errors**
   - Verify your API key is correct
   - Check your API quota and billing

4. **TypeScript errors**
   ```bash
   # Clear TypeScript cache
   npx tsc --build --clean
   ```

### Environment Variables Not Loading

Make sure your `.env` file is in the root directory and restart the development server after making changes.

## Production Deployment

For production deployment:

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "jobmatch-pro" -- start
   ```

## API Documentation

### Endpoints

- `POST /api/upload-resume` - Upload resume file and job details
- `POST /api/optimize/:id` - Optimize uploaded resume
- `POST /api/generate-cover-letter` - Generate standalone cover letter
- `POST /api/scan-resume` - Analyze resume with ATS scanner
- `GET /api/application/:id` - Get job application details

### File Support

- **Supported**: DOCX files (up to 10MB)
- **Planned**: PDF file support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.