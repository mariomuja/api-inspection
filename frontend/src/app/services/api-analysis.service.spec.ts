import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiAnalysisService } from './api-analysis.service';
import { ApiAnalysisResult, WebService } from '../models/web-service.model';

describe('ApiAnalysisService', () => {
  let service: ApiAnalysisService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiAnalysisService]
    });
    service = TestBed.inject(ApiAnalysisService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvailableServices', () => {
    it('should return a list of web services', (done) => {
      service.getAvailableServices().subscribe({
        next: (services: WebService[]) => {
          expect(services).toBeDefined();
          expect(services.length).toBeGreaterThan(0);
          expect(services[0].id).toBeDefined();
          expect(services[0].name).toBeDefined();
          expect(services[0].url).toBeDefined();
          expect(services[0].description).toBeDefined();
          done();
        }
      });
    });

    it('should return services with valid properties', (done) => {
      service.getAvailableServices().subscribe({
        next: (services: WebService[]) => {
          services.forEach(service => {
            expect(service.id).toBeTruthy();
            expect(service.name).toBeTruthy();
            expect(service.url).toBeTruthy();
            expect(service.description).toBeTruthy();
            expect(service.url).toMatch(/^https?:\/\//);
          });
          done();
        }
      });
    });

    it('should include JSONPlaceholder service', (done) => {
      service.getAvailableServices().subscribe({
        next: (services: WebService[]) => {
          const jsonPlaceholder = services.find(s => s.name === 'JSONPlaceholder');
          expect(jsonPlaceholder).toBeDefined();
          expect(jsonPlaceholder?.url).toBe('https://jsonplaceholder.typicode.com');
          done();
        }
      });
    });
  });

  describe('analyzeApi', () => {
    it('should make POST request to analyze endpoint', () => {
      const serviceUrl = 'https://api.example.com';
      const mockResult: ApiAnalysisResult = {
        serviceName: 'Example API',
        serviceUrl: serviceUrl,
        analyzedAt: new Date(),
        overallScore: 85,
        violations: [],
        recommendations: [],
        summary: {
          totalRules: 25,
          passedRules: 20,
          failedRules: 3,
          warningRules: 2
        }
      };

      service.analyzeApi(serviceUrl).subscribe({
        next: (result) => {
          expect(result).toEqual(mockResult);
        }
      });

      const req = httpMock.expectOne('/api/analyze');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ serviceUrl });
      req.flush(mockResult);
    });

    it('should handle analysis with violations', () => {
      const serviceUrl = 'https://api.example.com';
      const mockResult: ApiAnalysisResult = {
        serviceName: 'Example API',
        serviceUrl: serviceUrl,
        analyzedAt: new Date(),
        overallScore: 60,
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
            examples: ['/users', '/products']
          }
        ],
        recommendations: [
          {
            title: 'Improve REST Principles',
            description: 'Fix REST violations',
            priority: 'high',
            category: 'REST Principles',
            actionItems: ['Use plural nouns']
          }
        ],
        summary: {
          totalRules: 25,
          passedRules: 15,
          failedRules: 8,
          warningRules: 2
        }
      };

      service.analyzeApi(serviceUrl).subscribe({
        next: (result) => {
          expect(result.violations.length).toBeGreaterThan(0);
          expect(result.violations[0].severity).toBe('error');
          expect(result.recommendations.length).toBeGreaterThan(0);
        }
      });

      const req = httpMock.expectOne('/api/analyze');
      req.flush(mockResult);
    });

    it('should handle error responses', () => {
      const serviceUrl = 'https://api.example.com';
      const errorMessage = 'Failed to analyze API';

      service.analyzeApi(serviceUrl).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('/api/analyze');
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });
});

