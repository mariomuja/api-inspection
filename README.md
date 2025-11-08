# API Design Inspector

A comprehensive web application for analyzing public web service APIs against industry best practices and design guidelines.

## Features

- **Service Selection**: Choose from a curated list of public APIs or enter a custom URL
- **Comprehensive Analysis**: Evaluate APIs against 25+ design rules covering:
  - REST Principles
  - HTTP Standards
  - Security Best Practices
  - Versioning
  - Data Management
  - Error Handling
  - Performance Optimization
  - Naming Conventions
  
- **Detailed Reports**: Get actionable insights with:
  - Overall API quality score
  - Categorized violations and warnings
  - Detailed recommendations
  - Impact analysis for each issue
  
- **PDF Export**: Export analysis results to professionally formatted PDF reports

## Technology Stack

### Frontend
- **Angular 20** with standalone components
- **Angular Material** for UI components
- **TypeScript** for type safety
- **SCSS** for styling
- **jsPDF** for PDF export

### Backend
- **Node.js** serverless functions
- **Vercel** for hosting
- Comprehensive API design rules catalog

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Angular CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mariomuja/api-inspection.git
cd api-inspection
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install root dependencies:
```bash
cd ..
npm install
```

### Development

Run the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:4200`

### Testing

Run frontend tests:
```bash
cd frontend
npm test
```

### Building for Production

Build the frontend:
```bash
cd frontend
npm run build -- --configuration=production
```

## Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Deploy!

The application is live at: [Your Vercel URL]

## API Design Rules

The analyzer checks APIs against 25+ design rules including:

- **REST Principles**: Resource naming, HTTP methods, nesting
- **Security**: HTTPS, authentication, rate limiting
- **Versioning**: API version management
- **Data Management**: Pagination, filtering, sorting
- **Error Handling**: Consistent error formats
- **Performance**: Caching, field selection
- **Documentation**: API docs, examples

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

---

**Live Demo**: Coming soon on Vercel!

