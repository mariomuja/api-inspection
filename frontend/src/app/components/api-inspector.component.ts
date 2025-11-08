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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

import { ApiAnalysisService } from '../services/api-analysis.service';
import { PdfExportService } from '../services/pdf-export.service';
import { ExportService } from '../services/export.service';
import { CustomRulesService } from '../services/custom-rules.service';
import { WebService, ApiAnalysisResult, Violation } from '../models/web-service.model';
import { RuleSource, RULE_SOURCES } from '../models/rule-source.model';
import { OpenApiDialogComponent } from './openapi-dialog.component';
import { CustomRulesDialogComponent } from './custom-rules-dialog.component';
import { AuthDialogComponent } from './auth-dialog.component';
import { AboutDialogComponent } from './about-dialog.component';

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
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatMenuModule
  ],
  templateUrl: './api-inspector.component.html',
  styleUrls: ['./api-inspector.component.scss']
})
export class ApiInspectorComponent implements OnInit {
  services = signal<WebService[]>([]);
  ruleSources = signal<RuleSource[]>(RULE_SOURCES);
  selectedService = signal<string>('');
  selectedSource = signal<string>('all');
  customUrl = signal<string>('');
  useCustomUrl = signal<boolean>(false);
  isAnalyzing = signal<boolean>(false);
  analysisResult = signal<ApiAnalysisResult | null>(null);
  error = signal<string>('');
  
  // Filters
  filterSeverity = signal<string[]>(['error', 'warning', 'info']);
  filterSource = signal<string[]>([]);
  availableSources = signal<string[]>([]);

  constructor(
    private apiAnalysisService: ApiAnalysisService,
    private pdfExportService: PdfExportService,
    private exportService: ExportService,
    private customRulesService: CustomRulesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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

    const sourceFilter = this.selectedSource();

    this.apiAnalysisService.analyzeApi(urlToAnalyze, sourceFilter).subscribe({
      next: (result) => {
        this.analysisResult.set(result);
        this.isAnalyzing.set(false);
        
        // Extract unique sources from violations
        const sources = [...new Set(result.violations.map(v => v.source).filter(s => s))] as string[];
        this.availableSources.set(sources);
        this.filterSource.set(sources); // Initially show all
        
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
    if (!result) return;

    try {
      await this.pdfExportService.exportToPdf(result);
      this.snackBar.open('PDF exported successfully', 'Close', { duration: 3000 });
    } catch (err) {
      this.snackBar.open('Failed to export PDF', 'Close', { duration: 3000 });
      console.error('PDF export error:', err);
    }
  }

  exportToMarkdown(): void {
    const result = this.analysisResult();
    if (!result) return;
    this.exportService.exportToMarkdown(result);
    this.snackBar.open('Markdown exported successfully', 'Close', { duration: 3000 });
  }

  exportToHtml(): void {
    const result = this.analysisResult();
    if (!result) return;
    this.exportService.exportToHtml(result);
    this.snackBar.open('HTML exported successfully', 'Close', { duration: 3000 });
  }

  exportToCsv(): void {
    const result = this.analysisResult();
    if (!result) return;
    this.exportService.exportToCsv(result);
    this.snackBar.open('CSV exported successfully', 'Close', { duration: 3000 });
  }

  exportToJson(): void {
    const result = this.analysisResult();
    if (!result) return;
    this.exportService.exportToJson(result);
    this.snackBar.open('JSON exported successfully', 'Close', { duration: 3000 });
  }

  exportToGitHub(): void {
    const result = this.analysisResult();
    if (!result) return;
    this.exportService.exportToGitHubIssues(result);
    this.snackBar.open('GitHub issues format exported', 'Close', { duration: 3000 });
  }

  exportToJira(): void {
    const result = this.analysisResult();
    if (!result) return;
    this.exportService.exportToJira(result);
    this.snackBar.open('JIRA format exported successfully', 'Close', { duration: 3000 });
  }

  copyBadgeMarkdown(): void {
    const result = this.analysisResult();
    if (!result) return;
    
    const badgeUrl = this.exportService.generateBadgeUrl(result);
    const markdown = `![API Quality](${badgeUrl})`;
    
    navigator.clipboard.writeText(markdown).then(() => {
      this.snackBar.open('Badge markdown copied to clipboard!', 'Close', { duration: 3000 });
    });
  }

  openCustomRulesDialog(): void {
    const dialogRef = this.dialog.open(CustomRulesDialogComponent, {
      width: '800px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(rules => {
      if (rules) {
        this.snackBar.open(`${rules.length} custom rules active`, 'Close', { duration: 3000 });
      }
    });
  }

  openAuthDialog(): void {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      width: '600px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(authConfig => {
      if (authConfig) {
        this.snackBar.open('Authentication configured', 'Close', { duration: 3000 });
      }
    });
  }

  openAboutDialog(): void {
    this.dialog.open(AboutDialogComponent, {
      width: '800px',
      maxHeight: '90vh'
    });
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

  getFilteredViolations(): Violation[] {
    const result = this.analysisResult();
    if (!result || !result.violations) {
      return [];
    }

    return result.violations.filter(v => {
      const severityMatch = this.filterSeverity().includes(v.severity);
      const sourceMatch = this.filterSource().length === 0 || 
                         (v.source && this.filterSource().includes(v.source));
      return severityMatch && sourceMatch;
    });
  }

  getViolationsByCategory(): { [key: string]: Violation[] } {
    const filtered = this.getFilteredViolations();

    return filtered.reduce((acc, violation) => {
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

  toggleSeverityFilter(severity: string): void {
    const current = this.filterSeverity();
    if (current.includes(severity)) {
      this.filterSeverity.set(current.filter(s => s !== severity));
    } else {
      this.filterSeverity.set([...current, severity]);
    }
  }

  toggleSourceFilter(source: string): void {
    const current = this.filterSource();
    if (current.includes(source)) {
      this.filterSource.set(current.filter(s => s !== source));
    } else {
      this.filterSource.set([...current, source]);
    }
  }

  openEndpointDetails(endpoint: string, serviceUrl: string): void {
    // Show loading message
    const loadingSnack = this.snackBar.open('Generating API documentation...', '', {
      duration: 0
    });

    // Fetch and display OpenAPI spec (will be generated if not available)
    this.apiAnalysisService.getOpenApiSpec(serviceUrl).subscribe({
      next: (spec) => {
        loadingSnack.dismiss();
        this.showOpenApiDialog(spec, endpoint);
      },
      error: (err) => {
        loadingSnack.dismiss();
        this.snackBar.open('Failed to load API documentation', 'Close', {
          duration: 3000
        });
        console.error('OpenAPI spec error:', err);
      }
    });
  }

  showOpenApiDialog(spec: any, endpoint: string): void {
    const dialogRef = this.dialog.open(OpenApiDialogComponent, {
      width: '90vw',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: {
        spec: spec,
        highlightEndpoint: endpoint
      },
      panelClass: 'openapi-dialog-container'
    });
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
      '20': 'wc',                // Genderize.io
      '21': 'flag',              // Nationalize.io
      '22': 'cloud',             // JSONServe
      '23': 'shuffle',           // Random Data API
      '24': 'data_object',       // DummyJSON
      '25': 'show_chart',        // CoinCap API
      '26': 'language',          // REST Countries v2
      '27': 'star',              // Star Wars API
      '28': 'science_fiction',   // Rick and Morty API
      '29': 'sports_martial_arts', // Chuck Norris API
      '30': 'local_pharmacy',    // Breaking Bad API
      '31': 'castle',            // Game of Thrones API
      '32': 'animation',         // Studio Ghibli API
      '33': 'superhero',         // Marvel API
      '34': 'quiz',              // Open Trivia DB
      '35': 'sentiment_very_satisfied', // Jokes API
      '36': 'pets',              // Cat Facts API
      '37': 'pets',              // Dog Facts API
      '38': 'format_quote',      // Quotes API
      '39': 'mic',               // Kanye Rest
      '40': 'face'               // Ron Swanson Quotes
    };
    return iconMap[serviceId] || 'api';
  }

  getSelectedSourceDisplay(): string {
    const source = this.ruleSources().find(s => s.id === this.selectedSource());
    if (!source) return 'Select validation source...';
    
    // Format: "Name - Organization"
    return `${source.name} - ${source.organization}`;
  }
}

