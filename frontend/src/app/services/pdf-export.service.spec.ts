import { TestBed } from '@angular/core/testing';
import { PdfExportService } from './pdf-export.service';
import { ApiAnalysisResult } from '../models/web-service.model';

describe('PdfExportService', () => {
  let service: PdfExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PdfExportService]
    });
    service = TestBed.inject(PdfExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('exportToPdf', () => {
    let mockResult: ApiAnalysisResult;

    beforeEach(() => {
      mockResult = {
        serviceName: 'Test API',
        serviceUrl: 'https://api.test.com',
        analyzedAt: new Date('2025-01-01T00:00:00Z'),
        overallScore: 75,
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
            details: 'The endpoint uses singular form',
            recommendation: 'Use /users instead of /user',
            impact: 'This can confuse API consumers',
            examples: ['/users', '/products']
          },
          {
            id: 'v2',
            ruleId: 'security-001',
            ruleName: 'Use HTTPS',
            severity: 'error',
            category: 'Security',
            description: 'All endpoints should use HTTPS',
            endpoint: '/api',
            method: 'GET',
            details: 'HTTP protocol detected',
            recommendation: 'Switch to HTTPS',
            impact: 'Data is not encrypted in transit'
          }
        ],
        recommendations: [
          {
            title: 'Improve REST Principles',
            description: 'Address REST API design issues',
            priority: 'high',
            category: 'REST Principles',
            actionItems: ['Use plural nouns', 'Avoid verbs in URLs']
          },
          {
            title: 'Enhance Security',
            description: 'Implement security best practices',
            priority: 'high',
            category: 'Security',
            actionItems: ['Use HTTPS', 'Implement authentication']
          }
        ],
        summary: {
          totalRules: 25,
          passedRules: 18,
          failedRules: 5,
          warningRules: 2
        }
      };
    });

    it('should export PDF without errors', async () => {
      await expectAsync(service.exportToPdf(mockResult)).toBeResolved();
    });

    it('should handle result with no violations', async () => {
      const cleanResult: ApiAnalysisResult = {
        ...mockResult,
        violations: [],
        recommendations: [],
        overallScore: 100,
        summary: {
          totalRules: 25,
          passedRules: 25,
          failedRules: 0,
          warningRules: 0
        }
      };

      await expectAsync(service.exportToPdf(cleanResult)).toBeResolved();
    });

    it('should handle result with many violations', async () => {
      const manyViolations = Array(50).fill(null).map((_, i) => ({
        id: `v${i}`,
        ruleId: `rule-${i}`,
        ruleName: `Rule ${i}`,
        severity: (i % 3 === 0 ? 'error' : i % 3 === 1 ? 'warning' : 'info') as 'error' | 'warning' | 'info',
        category: 'Test Category',
        description: `Description for rule ${i}`,
        endpoint: `/endpoint${i}`,
        method: 'GET',
        details: `Details for violation ${i}`,
        recommendation: `Recommendation ${i}`,
        impact: `Impact ${i}`,
        examples: [`example${i}`]
      }));

      const largeResult: ApiAnalysisResult = {
        ...mockResult,
        violations: manyViolations
      };

      await expectAsync(service.exportToPdf(largeResult)).toBeResolved();
    });

    it('should handle long text content', async () => {
      const longTextResult: ApiAnalysisResult = {
        ...mockResult,
        violations: [{
          id: 'v1',
          ruleId: 'test-001',
          ruleName: 'Test Rule',
          severity: 'error',
          category: 'Test',
          description: 'A'.repeat(500),
          endpoint: '/test',
          method: 'GET',
          details: 'B'.repeat(500),
          recommendation: 'C'.repeat(500),
          impact: 'D'.repeat(500),
          examples: []
        }]
      };

      await expectAsync(service.exportToPdf(longTextResult)).toBeResolved();
    });
  });
});

