# JobMatch Pro - Resume Optimization Application

## Overview

JobMatch Pro is a full-stack web application designed to help job seekers optimize their resumes and cover letters for specific job applications. The application uses AI-powered analysis to improve ATS (Applicant Tracking System) compatibility and provides detailed insights to maximize the chances of getting shortlisted.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between frontend and backend components:

- **Frontend**: React.js with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini API for resume optimization and analysis
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **File Processing**: Multer for file uploads with DOCX parsing support (PDF support planned)

## Key Components

### Frontend Architecture
- **React Router**: Uses Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **File Upload**: Multer middleware for handling resume uploads
- **File Parsing**: Custom service for extracting text from PDF and DOCX files
- **AI Integration**: Google Gemini API service for resume optimization and ATS analysis
- **Storage**: In-memory storage implementation with interface for future database integration

### Database Schema
The application uses Drizzle ORM with PostgreSQL, featuring a main `job_applications` table that stores:
- Job details (company, role, description)
- Original resume text and metadata
- Optimized resume and cover letter content
- ATS analysis results (scores, keywords, recommendations)
- Timestamps and unique identifiers

## Data Flow

1. **File Upload**: User uploads resume (DOCX) and provides job details
2. **Text Extraction**: Server parses the resume file to extract plain text
3. **AI Processing**: Google Gemini API analyzes and optimizes the resume based on job description
4. **ATS Analysis**: System compares resume against job requirements and calculates match score
5. **Results Display**: Frontend presents optimized documents, ATS scores, and recommendations
6. **Document Generation**: Users can download optimized resume and cover letter

## External Dependencies

### Core Dependencies
- **@google/genai**: Google Gemini AI API integration
- **drizzle-orm**: Database ORM for PostgreSQL
- **@neondatabase/serverless**: PostgreSQL database driver
- **multer**: File upload handling
- **mammoth**: DOCX text extraction
- **pdfjs-dist**: PDF processing library (for future PDF support)

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form state management
- **zod**: Schema validation

## Deployment Strategy

The application is designed for deployment on Replit with the following configuration:

### Development Environment
- **Dev Server**: Vite development server with HMR
- **Backend**: tsx for TypeScript execution in development
- **Environment Variables**: GEMINI_API_KEY stored in Replit Secrets

### Production Build
- **Frontend Build**: Vite builds React app to `dist/public`
- **Backend Build**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Key Features
- Hot module replacement in development
- Automatic database schema synchronization with `db:push` command
- File upload handling with size and type validation
- Error handling and logging middleware
- CORS and security considerations for production deployment

## Recent Changes

### January 29, 2025
- ✓ Fixed TypeScript compilation errors and module imports
- ✓ Resolved file parser ES module compatibility issues  
- ✓ Added secure GEMINI_API_KEY handling via Replit Secrets
- ✓ Updated file upload to support DOCX only (PDF support planned)
- ✓ All core features functional: resume optimization, ATS analysis, cover letter generation
- ✓ Added separate Cover Letters and ATS Scanner pages with dedicated functionality
- ✓ Created navigation header and improved overall application structure  
- ✓ Enhanced resume formatting with professional sections and better structure
- ✓ Implemented standalone cover letter generation and comprehensive ATS scanning

## Current Status

The application now features three main sections accessible through a navigation header:
1. **Resume Optimization**: Upload & Input → Generate & Optimize → Review & Download workflow
2. **Cover Letters**: Standalone AI-powered cover letter generation based on user input
3. **ATS Scanner**: Comprehensive resume analysis with keyword matching and improvement recommendations

All features are fully functional with DOCX file support and Google Gemini AI integration providing well-formatted outputs.

## VS Code Setup

The application is ready for local development in VS Code with:
- Complete setup documentation in README.md
- Environment variable template (.env.example)
- VS Code workspace settings and extension recommendations
- Development scripts for running locally with `npm run dev`