const { designRules } = require('./design-rules');

class ApiAnalyzer {
  constructor(serviceUrl, sourceFilter = 'all') {
    this.serviceUrl = serviceUrl;
    this.sourceFilter = sourceFilter;
    this.violations = [];
    this.endpoints = [];
    this.filteredRules = this.getFilteredRules();
  }

  getFilteredRules() {
    if (this.sourceFilter === 'all') {
      return designRules;
    }

    // Define which rules belong to which source
    const sourceRuleMap = {
      'google': ['rest-001', 'rest-004', 'error-001', 'naming-001'],
      'microsoft': ['rest-002', 'pagination-001'],
      'owasp': ['security-001', 'security-002', 'security-003'],
      'ietf': ['http-001', 'http-003', 'idempotency-001', 'performance-002'],
      'jsonapi': ['filtering-001', 'sorting-001', 'response-001', 'performance-001'],
      'openapi': ['doc-001', 'doc-002'],
      'w3c': ['http-002'],
      'stripe': ['version-001'],
      'paypal': ['rest-005'],
      'github': ['pagination-002'],
      'aws': ['response-002'],
      'atlassian': ['error-002']
    };

    const ruleIds = sourceRuleMap[this.sourceFilter] || [];
    return designRules.filter(rule => ruleIds.includes(rule.id));
  }

  async analyze() {
    try {
      // Fetch the API to discover endpoints
      await this.discoverEndpoints();

      // Analyze against design rules
      this.analyzeRestPrinciples();
      this.analyzeHttpStandards();
      this.analyzeVersioning();
      this.analyzeSecurity();
      this.analyzeDataManagement();
      this.analyzeErrorHandling();
      this.analyzeResponseDesign();
      this.analyzeNamingConventions();
      this.analyzePerformance();

      // Calculate overall score
      const overallScore = this.calculateScore();

      // Generate recommendations
      const recommendations = this.generateRecommendations();

      return {
        serviceName: this.extractServiceName(),
        serviceUrl: this.serviceUrl,
        analyzedAt: new Date(),
        overallScore,
        violations: this.violations,
        recommendations,
        summary: {
          totalRules: this.filteredRules.length,
          passedRules: this.filteredRules.length - this.violations.length,
          failedRules: this.violations.filter(v => v.severity === 'error').length,
          warningRules: this.violations.filter(v => v.severity === 'warning').length
        }
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw new Error(`Failed to analyze API: ${error.message}`);
    }
  }

  async discoverEndpoints() {
    // Try to fetch common endpoints to analyze
    // In a real implementation, this would try to fetch OpenAPI spec or discover endpoints
    const commonPaths = ['', '/users', '/posts', '/comments', '/todos', '/products'];
    
    for (const path of commonPaths) {
      try {
        const url = `${this.serviceUrl}${path}`;
        const response = await fetch(url, { method: 'HEAD' });
        this.endpoints.push({
          path,
          url,
          methods: this.extractAllowedMethods(response),
          statusCode: response.status,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (err) {
        // Endpoint might not exist, that's okay
      }
    }
  }

  extractAllowedMethods(response) {
    const allow = response.headers.get('allow');
    return allow ? allow.split(',').map(m => m.trim()) : ['GET'];
  }

  extractServiceName() {
    try {
      const url = new URL(this.serviceUrl);
      return url.hostname.replace(/^(www\.|api\.)/, '').split('.')[0];
    } catch {
      return 'Unknown Service';
    }
  }

  analyzeRestPrinciples() {
    const rule001 = this.filteredRules.find(r => r.id === 'rest-001');
    const rule002 = this.filteredRules.find(r => r.id === 'rest-002');
    const rule003 = this.filteredRules.find(r => r.id === 'rest-003');
    const rule004 = this.filteredRules.find(r => r.id === 'rest-004');

    this.endpoints.forEach(endpoint => {
      const path = endpoint.path.toLowerCase();

      // Check for plural nouns
      if (path && !path.includes('?') && !path.match(/s$|ies$/) && path !== '') {
        const segments = path.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1];
        if (lastSegment && !lastSegment.match(/^\d+$/) && !lastSegment.match(/s$|ies$/)) {
          this.addViolation({
            rule: rule001,
            endpoint: endpoint.path,
            method: 'GET',
            details: `The endpoint "${endpoint.path}" appears to use singular form "${lastSegment}" instead of plural.`
          });
        }
      }

      // Check for verbs in endpoints
      const commonVerbs = ['get', 'create', 'update', 'delete', 'add', 'remove', 'fetch', 'list'];
      const pathLower = path.toLowerCase();
      commonVerbs.forEach(verb => {
        if (pathLower.includes(verb)) {
          this.addViolation({
            rule: rule003,
            endpoint: endpoint.path,
            details: `The endpoint "${endpoint.path}" contains the verb "${verb}". Use HTTP methods instead.`
          });
        }
      });

      // Check for underscores or camelCase
      if (path.match(/_/) || (path.match(/[a-z][A-Z]/) && !path.includes('/'))) {
        this.addViolation({
          rule: rule004,
          endpoint: endpoint.path,
          details: `The endpoint "${endpoint.path}" uses underscores or camelCase. Use hyphens instead.`
          });
      }
    });
  }

  analyzeHttpStandards() {
    const httpRule = this.filteredRules.find(r => r.id === 'http-002');
    
    // Check for CORS headers
    let hasCorsHeaders = false;
    this.endpoints.forEach(endpoint => {
      if (endpoint.headers && endpoint.headers['access-control-allow-origin']) {
        hasCorsHeaders = true;
      }
    });

    if (!hasCorsHeaders && this.endpoints.length > 0) {
      this.addViolation({
        rule: httpRule,
        details: 'No CORS headers detected. Modern web applications require CORS support.'
      });
    }
  }

  analyzeVersioning() {
    const versionRule = this.filteredRules.find(r => r.id === 'version-001');
    
    // Check if URL contains version
    const hasVersionInUrl = this.serviceUrl.match(/\/v\d+/) || 
                           this.endpoints.some(e => e.path.match(/\/v\d+/));
    
    // Check if headers contain version
    const hasVersionHeader = this.endpoints.some(e => 
      e.headers && (e.headers['api-version'] || e.headers['version'])
    );

    if (!hasVersionInUrl && !hasVersionHeader) {
      this.addViolation({
        rule: versionRule,
        details: 'No API versioning detected in URL or headers. This makes it difficult to introduce breaking changes.'
      });
    }
  }

  analyzeSecurity() {
    const httpsRule = this.filteredRules.find(r => r.id === 'security-001');
    const rateLimitRule = this.filteredRules.find(r => r.id === 'security-003');

    // Check for HTTPS
    if (!this.serviceUrl.startsWith('https://')) {
      this.addViolation({
        rule: httpsRule,
        details: 'API is not using HTTPS. All production APIs must use HTTPS to encrypt data in transit.'
      });
    }

    // Check for rate limiting headers
    const hasRateLimitHeaders = this.endpoints.some(e => 
      e.headers && (
        e.headers['x-ratelimit-limit'] || 
        e.headers['x-rate-limit-limit'] ||
        e.headers['ratelimit-limit']
      )
    );

    if (!hasRateLimitHeaders && this.endpoints.length > 0) {
      this.addViolation({
        rule: rateLimitRule,
        details: 'No rate limiting headers detected. APIs should implement rate limiting to prevent abuse.'
      });
    }
  }

  analyzeDataManagement() {
    // These are harder to detect automatically, so we'll add informational suggestions
    const paginationRule = this.filteredRules.find(r => r.id === 'pagination-001');
    
    // Check if any endpoint returns potentially large collections
    const collectionEndpoints = this.endpoints.filter(e => 
      e.path.match(/\/(users|posts|comments|products|items|orders)$/)
    );

    if (collectionEndpoints.length > 0) {
      // In a real implementation, we'd check the response size
      // For now, we'll add an informational note
      this.addViolation({
        rule: paginationRule,
        endpoint: collectionEndpoints[0].path,
        details: `Collection endpoints like "${collectionEndpoints[0].path}" should implement pagination to handle large datasets efficiently.`
      });
    }
  }

  analyzeErrorHandling() {
    // This would require actually making failing requests
    // For demonstration, we'll note it as something to verify
    const errorRule = this.filteredRules.find(r => r.id === 'error-001');
    
    // Add as an informational note
    this.addViolation({
      rule: errorRule,
      details: 'Verify that error responses follow a consistent format with error codes, messages, and details.'
    });
  }

  analyzeResponseDesign() {
    const consistencyRule = this.filteredRules.find(r => r.id === 'response-001');
    
    // This would require fetching and comparing multiple responses
    // For now, add as informational
    this.addViolation({
      rule: consistencyRule,
      details: 'Ensure all API responses follow a consistent structure for better predictability.'
    });
  }

  analyzeNamingConventions() {
    const namingRule = this.filteredRules.find(r => r.id === 'naming-001');
    
    // This would require analyzing response bodies
    // Add as informational recommendation
    this.addViolation({
      rule: namingRule,
      details: 'Verify that all field names follow a consistent naming convention (either camelCase or snake_case).'
    });
  }

  analyzePerformance() {
    const cachingRule = this.filteredRules.find(r => r.id === 'performance-002');
    
    // Check for caching headers
    const hasCachingHeaders = this.endpoints.some(e => 
      e.headers && (e.headers['cache-control'] || e.headers['etag'])
    );

    if (!hasCachingHeaders && this.endpoints.length > 0) {
      this.addViolation({
        rule: cachingRule,
        details: 'No caching headers detected. Implement Cache-Control and ETag headers for better performance.'
      });
    }
  }

  addViolation(config) {
    const { rule, endpoint, method, details } = config;
    
    if (!rule) return;

    this.violations.push({
      id: `${rule.id}-${this.violations.length}`,
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      category: rule.category,
      description: rule.description,
      endpoint: endpoint || '',
      method: method || '',
      details: details || rule.description,
      recommendation: rule.rationale,
      impact: rule.impact || rule.rationale,
      examples: rule.examples ? rule.examples.good : [],
      source: rule.source || '',
      sourceUrl: rule.sourceUrl || ''
    });
  }

  calculateScore() {
    const errorCount = this.violations.filter(v => v.severity === 'error').length;
    const warningCount = this.violations.filter(v => v.severity === 'warning').length;
    const infoCount = this.violations.filter(v => v.severity === 'info').length;

    // Calculate score: start at 100, deduct points for violations
    let score = 100;
    score -= errorCount * 10;  // -10 points per error
    score -= warningCount * 5;  // -5 points per warning
    score -= infoCount * 2;     // -2 points per info

    return Math.max(0, Math.min(100, score));
  }

  generateRecommendations() {
    const recommendations = [];

    // Group violations by category
    const violationsByCategory = {};
    this.violations.forEach(v => {
      if (!violationsByCategory[v.category]) {
        violationsByCategory[v.category] = [];
      }
      violationsByCategory[v.category].push(v);
    });

    // Generate recommendations for each category
    Object.entries(violationsByCategory).forEach(([category, violations]) => {
      const errorCount = violations.filter(v => v.severity === 'error').length;
      const warningCount = violations.filter(v => v.severity === 'warning').length;

      let priority = 'low';
      if (errorCount > 0) priority = 'high';
      else if (warningCount > 0) priority = 'medium';

      const actionItems = violations.slice(0, 3).map(v => v.ruleName);

      recommendations.push({
        title: `Improve ${category}`,
        description: `Address ${violations.length} issue(s) in the ${category} category to improve API quality.`,
        priority,
        category,
        actionItems
      });
    });

    return recommendations;
  }
}

module.exports = { ApiAnalyzer };

