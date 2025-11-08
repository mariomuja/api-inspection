const { ApiAnalyzer } = require('./api-analyzer');
const { designRules } = require('./design-rules');

describe('ApiAnalyzer', () => {
  describe('constructor', () => {
    it('should create an analyzer instance', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      expect(analyzer).toBeDefined();
      expect(analyzer.serviceUrl).toBe('https://api.example.com');
      expect(analyzer.violations).toEqual([]);
      expect(analyzer.endpoints).toEqual([]);
    });
  });

  describe('extractServiceName', () => {
    it('should extract service name from URL', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      const name = analyzer.extractServiceName();
      expect(name).toBe('example');
    });

    it('should handle www prefix', () => {
      const analyzer = new ApiAnalyzer('https://www.example.com');
      const name = analyzer.extractServiceName();
      expect(name).toBe('example');
    });

    it('should handle api prefix', () => {
      const analyzer = new ApiAnalyzer('https://api.test.com');
      const name = analyzer.extractServiceName();
      expect(name).toBe('test');
    });

    it('should handle invalid URLs', () => {
      const analyzer = new ApiAnalyzer('invalid-url');
      const name = analyzer.extractServiceName();
      expect(name).toBe('Unknown Service');
    });
  });

  describe('calculateScore', () => {
    it('should return 100 for no violations', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      const score = analyzer.calculateScore();
      expect(score).toBe(100);
    });

    it('should deduct 10 points per error', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = [
        { severity: 'error' },
        { severity: 'error' }
      ];
      const score = analyzer.calculateScore();
      expect(score).toBe(80); // 100 - 2*10
    });

    it('should deduct 5 points per warning', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = [
        { severity: 'warning' },
        { severity: 'warning' }
      ];
      const score = analyzer.calculateScore();
      expect(score).toBe(90); // 100 - 2*5
    });

    it('should deduct 2 points per info', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = [
        { severity: 'info' },
        { severity: 'info' }
      ];
      const score = analyzer.calculateScore();
      expect(score).toBe(96); // 100 - 2*2
    });

    it('should handle mixed severity violations', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = [
        { severity: 'error' },
        { severity: 'warning' },
        { severity: 'info' }
      ];
      const score = analyzer.calculateScore();
      expect(score).toBe(83); // 100 - 10 - 5 - 2
    });

    it('should not go below 0', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = Array(20).fill({ severity: 'error' });
      const score = analyzer.calculateScore();
      expect(score).toBe(0);
    });

    it('should not go above 100', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      const score = analyzer.calculateScore();
      expect(score).toBe(100);
    });
  });

  describe('addViolation', () => {
    it('should add violation with all properties', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      const rule = designRules[0];
      
      analyzer.addViolation({
        rule,
        endpoint: '/users',
        method: 'GET',
        details: 'Test details'
      });

      expect(analyzer.violations.length).toBe(1);
      expect(analyzer.violations[0].ruleId).toBe(rule.id);
      expect(analyzer.violations[0].ruleName).toBe(rule.name);
      expect(analyzer.violations[0].severity).toBe(rule.severity);
      expect(analyzer.violations[0].category).toBe(rule.category);
      expect(analyzer.violations[0].endpoint).toBe('/users');
      expect(analyzer.violations[0].method).toBe('GET');
      expect(analyzer.violations[0].details).toBe('Test details');
    });

    it('should not add violation if rule is undefined', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      
      analyzer.addViolation({
        rule: undefined,
        endpoint: '/users',
        method: 'GET',
        details: 'Test details'
      });

      expect(analyzer.violations.length).toBe(0);
    });

    it('should use empty strings for optional fields', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      const rule = designRules[0];
      
      analyzer.addViolation({ rule });

      expect(analyzer.violations[0].endpoint).toBe('');
      expect(analyzer.violations[0].method).toBe('');
    });

    it('should auto-increment violation IDs', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      const rule = designRules[0];
      
      analyzer.addViolation({ rule });
      analyzer.addViolation({ rule });

      expect(analyzer.violations[0].id).toContain('-0');
      expect(analyzer.violations[1].id).toContain('-1');
    });
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations from violations', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = [
        {
          severity: 'error',
          category: 'REST Principles',
          ruleName: 'Use Plural Nouns'
        },
        {
          severity: 'warning',
          category: 'REST Principles',
          ruleName: 'Avoid Verbs'
        }
      ];

      const recommendations = analyzer.generateRecommendations();

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toHaveProperty('title');
      expect(recommendations[0]).toHaveProperty('description');
      expect(recommendations[0]).toHaveProperty('priority');
      expect(recommendations[0]).toHaveProperty('category');
      expect(recommendations[0]).toHaveProperty('actionItems');
    });

    it('should set high priority for categories with errors', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = [
        {
          severity: 'error',
          category: 'Security',
          ruleName: 'Use HTTPS'
        }
      ];

      const recommendations = analyzer.generateRecommendations();

      expect(recommendations[0].priority).toBe('high');
    });

    it('should set medium priority for categories with only warnings', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = [
        {
          severity: 'warning',
          category: 'Performance',
          ruleName: 'Use Caching'
        }
      ];

      const recommendations = analyzer.generateRecommendations();

      expect(recommendations[0].priority).toBe('medium');
    });

    it('should set low priority for categories with only info', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = [
        {
          severity: 'info',
          category: 'Documentation',
          ruleName: 'Add Examples'
        }
      ];

      const recommendations = analyzer.generateRecommendations();

      expect(recommendations[0].priority).toBe('low');
    });

    it('should group violations by category', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = [
        { severity: 'error', category: 'Security', ruleName: 'Use HTTPS' },
        { severity: 'error', category: 'Security', ruleName: 'Use Auth' },
        { severity: 'warning', category: 'REST', ruleName: 'Use Plural' }
      ];

      const recommendations = analyzer.generateRecommendations();

      expect(recommendations.length).toBe(2);
    });

    it('should limit action items to 3 per recommendation', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.violations = Array(10).fill(null).map((_, i) => ({
        severity: 'error',
        category: 'Test',
        ruleName: `Rule ${i}`
      }));

      const recommendations = analyzer.generateRecommendations();

      expect(recommendations[0].actionItems.length).toBeLessThanOrEqual(3);
    });
  });

  describe('analyzeRestPrinciples', () => {
    it('should detect singular nouns in endpoints', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.endpoints = [
        { path: '/user', url: 'https://api.example.com/user' }
      ];

      analyzer.analyzeRestPrinciples();

      const singularViolations = analyzer.violations.filter(v => 
        v.ruleId === 'rest-001'
      );
      expect(singularViolations.length).toBeGreaterThan(0);
    });

    it('should not flag plural endpoints', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.endpoints = [
        { path: '/users', url: 'https://api.example.com/users' }
      ];

      const initialViolations = analyzer.violations.length;
      analyzer.analyzeRestPrinciples();

      const singularViolations = analyzer.violations.filter(v => 
        v.ruleId === 'rest-001'
      );
      expect(singularViolations.length).toBe(0);
    });

    it('should detect verbs in endpoints', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.endpoints = [
        { path: '/getUsers', url: 'https://api.example.com/getUsers' }
      ];

      analyzer.analyzeRestPrinciples();

      const verbViolations = analyzer.violations.filter(v => 
        v.ruleId === 'rest-003'
      );
      expect(verbViolations.length).toBeGreaterThan(0);
    });

    it('should detect underscores in endpoints', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.endpoints = [
        { path: '/user_profiles', url: 'https://api.example.com/user_profiles' }
      ];

      analyzer.analyzeRestPrinciples();

      const hyphenViolations = analyzer.violations.filter(v => 
        v.ruleId === 'rest-004'
      );
      expect(hyphenViolations.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeSecurity', () => {
    it('should flag HTTP URLs', () => {
      const analyzer = new ApiAnalyzer('http://api.example.com');
      analyzer.endpoints = [{ path: '/', url: 'http://api.example.com' }];

      analyzer.analyzeSecurity();

      const httpsViolations = analyzer.violations.filter(v => 
        v.ruleId === 'security-001'
      );
      expect(httpsViolations.length).toBeGreaterThan(0);
    });

    it('should not flag HTTPS URLs', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.endpoints = [{ path: '/', url: 'https://api.example.com' }];

      analyzer.analyzeSecurity();

      const httpsViolations = analyzer.violations.filter(v => 
        v.ruleId === 'security-001'
      );
      expect(httpsViolations.length).toBe(0);
    });

    it('should check for rate limiting headers', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.endpoints = [
        { path: '/', url: 'https://api.example.com', headers: {} }
      ];

      analyzer.analyzeSecurity();

      const rateLimitViolations = analyzer.violations.filter(v => 
        v.ruleId === 'security-003'
      );
      expect(rateLimitViolations.length).toBeGreaterThan(0);
    });

    it('should not flag if rate limit headers present', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.endpoints = [
        { 
          path: '/', 
          url: 'https://api.example.com', 
          headers: { 'x-ratelimit-limit': '1000' } 
        }
      ];

      analyzer.analyzeSecurity();

      const rateLimitViolations = analyzer.violations.filter(v => 
        v.ruleId === 'security-003'
      );
      expect(rateLimitViolations.length).toBe(0);
    });
  });

  describe('analyzeVersioning', () => {
    it('should detect missing API version', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.endpoints = [
        { path: '/users', url: 'https://api.example.com/users', headers: {} }
      ];

      analyzer.analyzeVersioning();

      const versionViolations = analyzer.violations.filter(v => 
        v.ruleId === 'version-001'
      );
      expect(versionViolations.length).toBeGreaterThan(0);
    });

    it('should detect version in URL', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com/v1');
      analyzer.endpoints = [
        { path: '/v1/users', url: 'https://api.example.com/v1/users', headers: {} }
      ];

      analyzer.analyzeVersioning();

      const versionViolations = analyzer.violations.filter(v => 
        v.ruleId === 'version-001'
      );
      expect(versionViolations.length).toBe(0);
    });

    it('should detect version in headers', () => {
      const analyzer = new ApiAnalyzer('https://api.example.com');
      analyzer.endpoints = [
        { 
          path: '/users', 
          url: 'https://api.example.com/users', 
          headers: { 'api-version': '1' } 
        }
      ];

      analyzer.analyzeVersioning();

      const versionViolations = analyzer.violations.filter(v => 
        v.ruleId === 'version-001'
      );
      expect(versionViolations.length).toBe(0);
    });
  });
});

