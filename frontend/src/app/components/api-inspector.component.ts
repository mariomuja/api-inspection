import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ApiAnalysisService } from '../services/api-analysis.service';
import { PdfExportService } from '../services/pdf-export.service';
import { WebService, ApiAnalysisResult, Violation } from '../models/web-service.model';

@Component({
  selector: 'app-api-inspector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './api-inspector.component.html',
  styleUrls: ['./api-inspector.component.scss']
})
export class ApiInspectorComponent implements OnInit {
  services = signal<WebService[]>([]);
  selectedService = signal<string>('');
  customUrl = signal<string>('');
  useCustomUrl = signal<boolean>(false);
  isAnalyzing = signal<boolean>(false);
  analysisResult = signal<ApiAnalysisResult | null>(null);
  error = signal<string>('');

  constructor(
    private apiAnalysisService: ApiAnalysisService,
    private pdfExportService: PdfExportService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.apiAnalysisService.getAvailableServices().subscribe({
      next: (services) => {
        this.services.set(services);
      },
      error: (err) => {
        this.error.set('Failed to load services');
        console.error('Error loading services:', err);
      }
    });
  }

  onServiceSelectionChange(): void {
    if (this.selectedService()) {
      this.useCustomUrl.set(false);
      this.customUrl.set('');
    }
  }

  onCustomUrlChange(): void {
    if (this.customUrl()) {
      this.useCustomUrl.set(true);
      this.selectedService.set('');
    } else {
      this.useCustomUrl.set(false);
    }
  }

  analyzeApi(): void {
    const urlToAnalyze = this.useCustomUrl() ? this.customUrl() : this.selectedService();
    
    if (!urlToAnalyze) {
      this.snackBar.open('Please select a service or enter a custom URL', 'Close', {
        duration: 3000
      });
      return;
    }

    // Validate URL format
    try {
      new URL(urlToAnalyze);
    } catch {
      this.snackBar.open('Please enter a valid URL (e.g., https://api.example.com)', 'Close', {
        duration: 4000
      });
      return;
    }

    this.isAnalyzing.set(true);
    this.error.set('');
    this.analysisResult.set(null);

    this.apiAnalysisService.analyzeApi(urlToAnalyze).subscribe({
      next: (result) => {
        this.analysisResult.set(result);
        this.isAnalyzing.set(false);
        this.snackBar.open('Analysis completed successfully', 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        this.error.set('Failed to analyze API: ' + (err.error?.message || err.message));
        this.isAnalyzing.set(false);
        this.snackBar.open('Analysis failed', 'Close', {
          duration: 3000
        });
        console.error('Analysis error:', err);
      }
    });
  }

  async exportToPdf(): Promise<void> {
    const result = this.analysisResult();
    if (!result) {
      return;
    }

    try {
      await this.pdfExportService.exportToPdf(result);
      this.snackBar.open('PDF exported successfully', 'Close', {
        duration: 3000
      });
    } catch (err) {
      this.snackBar.open('Failed to export PDF', 'Close', {
        duration: 3000
      });
      console.error('PDF export error:', err);
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'error':
        return 'warn';
      case 'warning':
        return 'accent';
      case 'info':
        return 'primary';
      default:
        return '';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'warn';
      case 'medium':
        return 'accent';
      case 'low':
        return 'primary';
      default:
        return '';
    }
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  }

  getViolationsByCategory(): { [key: string]: Violation[] } {
    const result = this.analysisResult();
    if (!result || !result.violations) {
      return {};
    }

    return result.violations.reduce((acc, violation) => {
      if (!acc[violation.category]) {
        acc[violation.category] = [];
      }
      acc[violation.category].push(violation);
      return acc;
    }, {} as { [key: string]: Violation[] });
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.getViolationsByCategory());
  }

  getServiceIcon(serviceId: string): string {
    const iconMap: { [key: string]: string } = {
      '1': 'description',        // JSONPlaceholder
      '2': 'science',            // REQ|RES
      '3': 'pets',               // Dog API
      '4': 'shopping_cart',      // Fake Store API
      '5': 'public',             // REST Countries
      '6': 'sentiment_satisfied',// The Cat API
      '7': 'sports_esports',     // Bored API
      '8': 'code',               // GitHub API
      '9': 'menu_book',          // Open Library API
      '10': 'currency_bitcoin',  // CoinGecko API
      '11': 'person',            // Random User API
      '12': 'format_quote',      // Quote Garden API
      '13': 'catching_pokemon',  // PokéAPI
      '14': 'tips_and_updates',  // Advice Slip API
      '15': 'storage',           // JSON Server API
      '16': 'router',            // IP API
      '17': 'tag',               // Numbers API
      '18': 'location_on',       // Zippopotam.us
      '19': 'cake',              // Agify.io
      '20': 'wc'                 // Genderize.io
    };
    return iconMap[serviceId] || 'api';
  }
}

