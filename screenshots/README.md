# 📸 Screenshots Guide

This directory contains screenshots for the main README.md file.

## Required Screenshots

Please take the following screenshots at **1400px width** for consistency:

### 1. main-interface.png
- **Page**: Home page before analysis
- **Content**: 
  - Header with "API Design Inspector" title
  - Validation Source dropdown showing sources
  - Public service dropdown with visible services
  - Custom URL field
  - "Analyze API" button
- **Size**: 700px width (will be resized in README)

### 2. analysis-results.png
- **Page**: After running analysis on any API
- **Content**:
  - "Issues and Violations" section
  - At least 2-3 visible violation cards
  - Show severity badges (error, warning, info)
  - Show source links
  - Show filter chips
- **Size**: 700px width

### 3. custom-rules.png
- **Page**: Custom Rules dialog (click "Custom Rules" button)
- **Content**:
  - Show "My Rules" tab with sample rules
  - OR "Create Rule" tab with form fields visible
  - Show enable/disable toggles
  - Show action buttons
- **Size**: 700px width

### 4. authentication.png
- **Page**: Authentication dialog (click "Authentication" button)
- **Content**:
  - Authentication type dropdown
  - Show one auth type selected (e.g., Bearer Token)
  - Input fields visible
  - Security notice at bottom
- **Size**: 700px width

### 5. export-menu.png
- **Page**: Export menu dropdown (click "Export Results" button in results page)
- **Content**:
  - Full dropdown menu showing all 8 export options:
    - PDF Document
    - Markdown (.md)
    - HTML Report
    - CSV Spreadsheet
    - JSON Data
    - GitHub Issues
    - JIRA Issues
    - Copy Quality Badge
- **Size**: 700px width

### 6. openapi-viewer.png
- **Page**: OpenAPI Specification dialog (click any endpoint link in violations)
- **Content**:
  - Dialog header with API title
  - Tabs visible (Highlighted Endpoint, All Endpoints, Full Specification)
  - Show endpoint details with method badges
  - Show parameters or responses section
- **Size**: 700px width

## How to Take Screenshots

1. **Open the live application**: https://api-inspection.vercel.app
2. **Use browser DevTools**: Set viewport to 1400px width
3. **Take full-page screenshots** or crop to show relevant content
4. **Save as PNG** with exact filenames listed above
5. **Place in this directory** (`api-inspection/screenshots/`)

## Screenshot Tool Recommendations

- **Windows**: Snipping Tool (Win + Shift + S), Greenshot, ShareX
- **Mac**: Command + Shift + 4
- **Browser Extension**: Awesome Screenshot, Nimbus Screenshot
- **Full Page**: Use browser DevTools → Capture full size screenshot

## Alternative: Use Placeholders

If you want to deploy without screenshots first:
- The README will show broken image links (which is fine)
- Or create placeholder images with text using any image editor
- Screenshots can be added later without redeploying

---

**Note**: These screenshots showcase the app's features and make the README more engaging for potential users and contributors.

