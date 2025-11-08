import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ApiInspectorComponent } from './api-inspector.component';
import { ApiAnalysisService } from '../services/api-analysis.service';
import { PdfExportService } from '../services/pdf-export.service';
import { ApiAnalysisResult, WebService } from '../models/web-service.model';

describe('ApiInspectorComponent', () => {
  let component: ApiInspectorComponent;
  let fixture: ComponentFixture<ApiInspectorComponent>;
  let apiAnalysisService: jasmine.SpyObj<ApiAnalysisService>;
  let pdfExportService: jasmine.SpyObj<PdfExportService>;

  const mockServices: WebService[] = [
    {
      id: '1',
      name: 'Test API 1',
      url: 'https://api1.test.com',
      description: 'Test API 1 description'
    },
    {
      id: '2',
      name: 'Test API 2',
      url: 'https://api2.test.com',
      description: 'Test API 2 description'
    }
  ];

  const mockAnalysisResult: ApiAnalysisResult = {
    serviceName: 'Test API',
    serviceUrl: 'https://api.test.com',
    analyzedAt: new Date(),
    overallScore: 80,
    violations: [
      {
        id: 'v1',
        ruleId: 'rest-001',
        ruleName: 'Use Plural Nouns',
        severity: 'error',
        category: 'REST Principles',
        description: 'Resources should use plural nouns',
        endpoint: '/user',
        method: 'GET',
        details: 'Endpoint uses singular form',
        recommendation: 'Use /users instead',
        impact: 'Confuses developers',
        examples: ['/users']
      },
      {
        id: 'v2',
        ruleId: 'http-001',
        ruleName: 'HTTP Status Codes',
        severity: 'warning',
        category: 'HTTP Standards',
        description: 'Use appropriate status codes',
        endpoint: '/api',
        method: 'GET',
        details: 'Incorrect status code usage',
        recommendation: 'Use standard codes',
        impact: 'Breaks client error handling'
      }
    ],
    recommendations: [
      {
        title: 'Improve REST Principles',
        description: 'Fix REST violations',
        priority: 'high',
        category: 'REST Principles',
        actionItems: ['Use plural nouns', 'Avoid verbs']
      }
    ],
    summary: {
      totalRules: 25,
      passedRules: 18,
      failedRules: 5,
      warningRules: 2
    }
  };

  beforeEach(async () => {
    const apiAnalysisServiceSpy = jasmine.createSpyObj('ApiAnalysisService', ['getAvailableServices', 'analyzeApi']);
    const pdfExportServiceSpy = jasmine.createSpyObj('PdfExportService', ['exportToPdf']);

    await TestBed.configureTestingModule({
      imports: [
        ApiInspectorComponent,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ApiAnalysisService, useValue: apiAnalysisServiceSpy },
        { provide: PdfExportService, useValue: pdfExportServiceSpy }
      ]
    }).compileComponents();

    apiAnalysisService = TestBed.inject(ApiAnalysisService) as jasmine.SpyObj<ApiAnalysisService>;
    pdfExportService = TestBed.inject(PdfExportService) as jasmine.SpyObj<PdfExportService>;

    apiAnalysisService.getAvailableServices.and.returnValue(of(mockServices));

    fixture = TestBed.createComponent(ApiInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should load services on init', () => {
      expect(apiAnalysisService.getAvailableServices).toHaveBeenCalled();
      expect(component.services().length).toBe(2);
    });

    it('should start with no selected service', () => {
      expect(component.selectedService()).toBe('');
    });

    it('should start with no analysis result', () => {
      expect(component.analysisResult()).toBeNull();
    });

    it('should not be analyzing initially', () => {
      expect(component.isAnalyzing()).toBe(false);
    });
  });

  describe('Service Loading', () => {
    it('should handle service loading errors', () => {
      const errorComponent = fixture.componentInstance;
      apiAnalysisService.getAvailableServices.and.returnValue(
        throwError(() => new Error('Failed to load'))
      );

      errorComponent.loadServices();

      expect(errorComponent.error()).toBeTruthy();
      expect(errorComponent.error()).toContain('Failed to load services');
    });
  });

  describe('API Analysis', () => {
    beforeEach(() => {
      component.selectedService.set('https://api.test.com');
    });

    it('should analyze API when service is selected', (done) => {
      apiAnalysisService.analyzeApi.and.returnValue(of(mockAnalysisResult));

      component.analyzeApi();

      expect(component.isAnalyzing()).toBe(true);
      expect(apiAnalysisService.analyzeApi).toHaveBeenCalledWith('https://api.test.com');

      setTimeout(() => {
        expect(component.analysisResult()).toEqual(mockAnalysisResult);
        expect(component.isAnalyzing()).toBe(false);
        done();
      }, 100);
    });

    it('should not analyze if no service is selected', () => {
      component.selectedService.set('');

      component.analyzeApi();

      expect(apiAnalysisService.analyzeApi).not.toHaveBeenCalled();
      expect(component.isAnalyzing()).toBe(false);
    });

    it('should handle analysis errors', (done) => {
      apiAnalysisService.analyzeApi.and.returnValue(
        throwError(() => ({ error: { message: 'Analysis failed' } }))
      );

      component.analyzeApi();

      setTimeout(() => {
        expect(component.error()).toBeTruthy();
        expect(component.error()).toContain('Failed to analyze API');
        expect(component.isAnalyzing()).toBe(false);
        expect(component.analysisResult()).toBeNull();
        done();
      }, 100);
    });

    it('should clear previous results when starting new analysis', () => {
      component.analysisResult.set(mockAnalysisResult);
      component.error.set('Previous error');
      apiAnalysisService.analyzeApi.and.returnValue(of(mockAnalysisResult));

      component.analyzeApi();

      expect(component.error()).toBe('');
      expect(component.analysisResult()).toBeNull();
    });
  });

  describe('PDF Export', () => {
    beforeEach(() => {
      component.analysisResult.set(mockAnalysisResult);
    });

    it('should export result to PDF', async () => {
      pdfExportService.exportToPdf.and.returnValue(Promise.resolve());

      await component.exportToPdf();

      expect(pdfExportService.exportToPdf).toHaveBeenCalledWith(mockAnalysisResult);
    });

    it('should not export if no result available', async () => {
      component.analysisResult.set(null);

      await component.exportToPdf();

      expect(pdfExportService.exportToPdf).not.toHaveBeenCalled();
    });

    it('should handle export errors', async () => {
      pdfExportService.exportToPdf.and.returnValue(Promise.reject(new Error('Export failed')));

      await component.exportToPdf();

      expect(pdfExportService.exportToPdf).toHaveBeenCalled();
      // Error should be caught and handled gracefully
    });
  });

  describe('Helper Methods', () => {
    it('should return correct severity color', () => {
      expect(component.getSeverityColor('error')).toBe('warn');
      expect(component.getSeverityColor('warning')).toBe('accent');
      expect(component.getSeverityColor('info')).toBe('primary');
      expect(component.getSeverityColor('unknown')).toBe('');
    });

    it('should return correct priority color', () => {
      expect(component.getPriorityColor('high')).toBe('warn');
      expect(component.getPriorityColor('medium')).toBe('accent');
      expect(component.getPriorityColor('low')).toBe('primary');
      expect(component.getPriorityColor('unknown')).toBe('');
    });

    it('should return correct score color', () => {
      expect(component.getScoreColor(90)).toBe('#4caf50'); // green
      expect(component.getScoreColor(70)).toBe('#ff9800'); // orange
      expect(component.getScoreColor(50)).toBe('#f44336'); // red
    });

    it('should group violations by category', () => {
      component.analysisResult.set(mockAnalysisResult);

      const grouped = component.getViolationsByCategory();

      expect(Object.keys(grouped).length).toBe(2);
      expect(grouped['REST Principles']).toBeDefined();
      expect(grouped['HTTP Standards']).toBeDefined();
      expect(grouped['REST Principles'].length).toBe(1);
      expect(grouped['HTTP Standards'].length).toBe(1);
    });

    it('should return empty object when no violations', () => {
      component.analysisResult.set({
        ...mockAnalysisResult,
        violations: []
      });

      const grouped = component.getViolationsByCategory();

      expect(Object.keys(grouped).length).toBe(0);
    });

    it('should get category keys', () => {
      component.analysisResult.set(mockAnalysisResult);

      const keys = component.getCategoryKeys();

      expect(keys.length).toBe(2);
      expect(keys).toContain('REST Principles');
      expect(keys).toContain('HTTP Standards');
    });
  });

  describe('UI Integration', () => {
    it('should display service selector', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled.querySelector('mat-select');
      expect(select).toBeTruthy();
    });

    it('should display analyze button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.textContent).toContain('Analyze');
    });

    it('should show loading spinner when analyzing', () => {
      component.isAnalyzing.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const spinner = compiled.querySelector('mat-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should show results when analysis is complete', () => {
      component.analysisResult.set(mockAnalysisResult);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const results = compiled.querySelector('.results-section');
      expect(results).toBeTruthy();
    });

    it('should show error message when analysis fails', () => {
      component.error.set('Test error message');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorElement = compiled.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toContain('Test error message');
    });

    it('should show summary card with score', () => {
      component.analysisResult.set(mockAnalysisResult);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const summaryCard = compiled.querySelector('.summary-card');
      expect(summaryCard).toBeTruthy();

      const scoreValue = compiled.querySelector('.score-value');
      expect(scoreValue).toBeTruthy();
      expect(scoreValue?.textContent?.trim()).toBe('80');
    });

    it('should show violations card when violations exist', () => {
      component.analysisResult.set(mockAnalysisResult);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const violationsCard = compiled.querySelector('.violations-card');
      expect(violationsCard).toBeTruthy();
    });

    it('should show recommendations card', () => {
      component.analysisResult.set(mockAnalysisResult);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const recommendationsCard = compiled.querySelector('.recommendations-card');
      expect(recommendationsCard).toBeTruthy();
    });

    it('should show export button in results', () => {
      component.analysisResult.set(mockAnalysisResult);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const exportButton = compiled.querySelector('.export-section button');
      expect(exportButton).toBeTruthy();
      expect(exportButton?.textContent).toContain('Export to PDF');
    });
  });
});

