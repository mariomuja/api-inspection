import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './api-inspector.component.html',
  styleUrls: ['./api-inspector.component.scss']
})
export class ApiInspectorComponent implements OnInit {
  services = signal<WebService[]>([]);
  selectedService = signal<string>('');
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

  analyzeApi(): void {
    const selectedUrl = this.selectedService();
    if (!selectedUrl) {
      this.snackBar.open('Please select a service to analyze', 'Close', {
        duration: 3000
      });
      return;
    }

    this.isAnalyzing.set(true);
    this.error.set('');
    this.analysisResult.set(null);

    this.apiAnalysisService.analyzeApi(selectedUrl).subscribe({
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
}

