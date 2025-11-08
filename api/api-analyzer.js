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
      'google': ['rest-001', 'rest-004', 'error-001', 'naming-001', 'datatypes-001', 'operations-001', 'objects-001', 'arrays-001', 'performance-003'],
      'microsoft': ['rest-002', 'pagination-001', 'validation-002', 'response-003', 'operations-003'],
      'owasp': ['security-001', 'security-002', 'security-003', 'validation-001', 'arrays-002', 'performance-006', 'strings-001'],
      'ietf': ['http-001', 'http-003', 'idempotency-001', 'performance-002', 'performance-005', 'datatypes-005', 'nulls-001', 'operations-002'],
      'jsonapi': ['filtering-001', 'sorting-001', 'response-001', 'performance-001', 'schema-002'],
      'openapi': ['doc-001', 'doc-002', 'datatypes-003', 'parameters-002', 'schema-001', 'schema-003'],
      'w3c': ['http-002', 'parameters-001'],
      'stripe': ['version-001'],
      'paypal': ['rest-005'],
      'github': ['pagination-002'],
      'aws': ['response-002'],
      'atlassian': ['error-002'],
      'jsonschema': ['schema-002', 'strings-002'],
      'iso': ['datatypes-002'],
      'ieee': ['datatypes-004'],
      'sre': ['performance-004'],
      'database': ['performance-007'],
      'hateoas': ['response-004'],
      'designpatterns': ['parameters-003']
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
      this.analyzeDataTypes();
      this.analyzeValidation();
      this.analyzeOperations();
      this.analyzeSchemas();
      this.analyzeParameters();
      this.analyzeSecurityVulnerabilities();
      this.analyzeHttpMethodSupport();

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
    const commonPaths = ['', '/users', '/posts', '/comments', '/todos', '/products', '/items', '/data'];
    
    for (const path of commonPaths) {
      try {
        const url = `${this.serviceUrl}${path}`;
        
        // First try HEAD to get headers
        const headResponse = await fetch(url, { method: 'HEAD' });
        const headers = Object.fromEntries(headResponse.headers.entries());
        
        // Then try GET to get actual data for analysis
        let responseData = null;
        try {
          const getResponse = await fetch(url, { 
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          if (getResponse.ok) {
            const contentType = getResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              responseData = await getResponse.json();
            }
          }
        } catch (err) {
          // GET might fail, that's okay
        }
        
        // Test for all HTTP methods to detect allowed operations
        const methodsToTest = ['OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'];
        const supportedMethods = ['GET']; // We know GET works
        const methodResponses = {};

        for (const method of methodsToTest) {
          try {
            const testResponse = await fetch(url, { 
              method,
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: method === 'GET' || method === 'HEAD' || method === 'OPTIONS' ? undefined : JSON.stringify({})
            });
            
            methodResponses[method] = {
              status: testResponse.status,
              headers: Object.fromEntries(testResponse.headers.entries())
            };

            // Method is supported if we don't get 405 Method Not Allowed
            if (testResponse.status !== 405) {
              supportedMethods.push(method);
            }
          } catch (err) {
            // Method test failed, likely not supported
          }
        }
        
        this.endpoints.push({
          path,
          url,
          methods: supportedMethods,
          statusCode: headResponse.status,
          headers: headers,
          responseData: responseData,
          methodResponses: methodResponses
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

  analyzeDataTypes() {
    const dataTypeRule = this.filteredRules.find(r => r.id === 'datatypes-001');
    const dateRule = this.filteredRules.find(r => r.id === 'datatypes-002');
    const booleanRule = this.filteredRules.find(r => r.id === 'datatypes-005');
    const numericRule = this.filteredRules.find(r => r.id === 'datatypes-004');
    const arrayRule = this.filteredRules.find(r => r.id === 'arrays-001');

    // Analyze actual response data
    this.endpoints.forEach(endpoint => {
      if (!endpoint.responseData) return;

      const data = endpoint.responseData;
      const items = Array.isArray(data) ? data : [data];
      
      // Check first few items for data type issues
      items.slice(0, 3).forEach((item, index) => {
        if (!item || typeof item !== 'object') return;

        // Check for inconsistent ID types
        if (item.id !== undefined && dataTypeRule) {
          const idType = typeof item.id;
          if (idType !== 'string' && idType !== 'number') {
            this.addViolation({
              rule: dataTypeRule,
              endpoint: endpoint.path,
              method: 'GET',
              details: `Field "id" in ${endpoint.path} has inconsistent type: ${idType}. IDs should consistently be strings or numbers.`
            });
          }
        }

        // Check for date format issues
        if (dateRule) {
          Object.keys(item).forEach(key => {
            const value = item[key];
            if (typeof value === 'string') {
              // Check if it looks like a date but not ISO 8601
              const datePatterns = [
                /^\d{1,2}\/\d{1,2}\/\d{4}$/,  // 11/08/2025
                /^\d{4}-\d{2}-\d{2}$/,         // 2025-11-08 (missing time)
                /^\d{10,13}$/                  // Unix timestamp only
              ];
              
              const looksLikeDate = key.toLowerCase().includes('date') || 
                                   key.toLowerCase().includes('time') ||
                                   key.toLowerCase().includes('created') ||
                                   key.toLowerCase().includes('updated');
              
              if (looksLikeDate && datePatterns.some(pattern => pattern.test(value))) {
                this.addViolation({
                  rule: dateRule,
                  endpoint: endpoint.path,
                  method: 'GET',
                  details: `Field "${key}" in ${endpoint.path} uses non-ISO 8601 format: "${value}". Use ISO 8601: "YYYY-MM-DDTHH:mm:ssZ".`
                });
              }
            }
          });
        }

        // Check for string booleans
        if (booleanRule) {
          Object.keys(item).forEach(key => {
            const value = item[key];
            const looksLikeBoolean = key.toLowerCase().includes('is') || 
                                    key.toLowerCase().includes('has') ||
                                    key.toLowerCase().includes('can') ||
                                    key.toLowerCase().includes('enabled') ||
                                    key.toLowerCase().includes('active');
            
            if (looksLikeBoolean && typeof value === 'string' && (value === 'true' || value === 'false' || value === 'yes' || value === 'no')) {
              this.addViolation({
                rule: booleanRule,
                endpoint: endpoint.path,
                method: 'GET',
                details: `Field "${key}" in ${endpoint.path} uses string boolean: "${value}". Use actual boolean type: true or false.`
              });
            }
            
            if (looksLikeBoolean && typeof value === 'number' && (value === 0 || value === 1)) {
              this.addViolation({
                rule: booleanRule,
                endpoint: endpoint.path,
                method: 'GET',
                details: `Field "${key}" in ${endpoint.path} uses numeric boolean: ${value}. Use actual boolean type: true or false.`
              });
            }
          });
        }

        // Check for currency fields using floats
        if (numericRule) {
          Object.keys(item).forEach(key => {
            const value = item[key];
            const looksLikeCurrency = key.toLowerCase().includes('price') || 
                                     key.toLowerCase().includes('amount') ||
                                     key.toLowerCase().includes('cost') ||
                                     key.toLowerCase().includes('fee');
            
            if (looksLikeCurrency && typeof value === 'number' && !Number.isInteger(value)) {
              this.addViolation({
                rule: numericRule,
                endpoint: endpoint.path,
                method: 'GET',
                details: `Field "${key}" in ${endpoint.path} uses floating point for currency: ${value}. Use string or integer cents to avoid precision errors.`
              });
            }
          });
        }
      });

      // Check if endpoint returns array for collections
      if (arrayRule && endpoint.path && endpoint.path !== '') {
        const pathSegments = endpoint.path.split('/').filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1];
        
        // If path looks like a collection but returns single object
        if (lastSegment && lastSegment.match(/s$|ies$/) && !Array.isArray(data) && data !== null) {
          this.addViolation({
            rule: arrayRule,
            endpoint: endpoint.path,
            method: 'GET',
            details: `Endpoint ${endpoint.path} appears to be a collection but returns a single object instead of an array.`
          });
        }
      }
    });
  }

  analyzeValidation() {
    const inputValidationRule = this.filteredRules.find(r => r.id === 'validation-001');
    const validationErrorRule = this.filteredRules.find(r => r.id === 'validation-002');
    const stringLimitRule = this.filteredRules.find(r => r.id === 'strings-001');
    const formatRule = this.filteredRules.find(r => r.id === 'strings-002');

    // Check actual response data for validation issues
    this.endpoints.forEach(endpoint => {
      if (!endpoint.responseData) return;

      const data = endpoint.responseData;
      const items = Array.isArray(data) ? data : [data];
      
      items.slice(0, 3).forEach((item, index) => {
        if (!item || typeof item !== 'object') return;

        // Check for email format
        if (formatRule) {
          Object.keys(item).forEach(key => {
            const value = item[key];
            if (key.toLowerCase().includes('email') && typeof value === 'string') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                this.addViolation({
                  rule: formatRule,
                  endpoint: endpoint.path,
                  method: 'GET',
                  details: `Field "${key}" in ${endpoint.path} has invalid email format: "${value}". Should match email pattern.`
                });
              }
            }

            // Check for URL format
            if ((key.toLowerCase().includes('url') || key.toLowerCase().includes('website')) && typeof value === 'string') {
              try {
                new URL(value);
              } catch {
                this.addViolation({
                  rule: formatRule,
                  endpoint: endpoint.path,
                  method: 'GET',
                  details: `Field "${key}" in ${endpoint.path} has invalid URL format: "${value}". Should be a valid URL.`
                });
              }
            }
          });
        }

        // Check for excessively long strings without limits
        if (stringLimitRule) {
          Object.keys(item).forEach(key => {
            const value = item[key];
            if (typeof value === 'string' && value.length > 10000) {
              this.addViolation({
                rule: stringLimitRule,
                endpoint: endpoint.path,
                method: 'GET',
                details: `Field "${key}" in ${endpoint.path} contains very long string (${value.length} chars). Define maxLength constraints.`
              });
            }
          });
        }
      });
    });

    // Add general recommendations if rules exist but no specific violations found
    if (inputValidationRule && this.endpoints.length > 0) {
      this.addViolation({
        rule: inputValidationRule,
        endpoint: 'All endpoints',
        method: 'POST/PUT',
        details: 'Ensure all POST/PUT endpoints implement input validation for required fields, data types, formats, and constraints.'
      });
    }

    if (validationErrorRule && this.endpoints.length > 0) {
      this.addViolation({
        rule: validationErrorRule,
        endpoint: 'All endpoints',
        method: 'POST/PUT',
        details: 'When validation fails, return structured error responses with field-level details: { errors: [{ field: "email", message: "Invalid format" }] }.'
      });
    }
  }

  analyzeOperations() {
    const bulkOpsRule = this.filteredRules.find(r => r.id === 'operations-001');
    const patchRule = this.filteredRules.find(r => r.id === 'operations-002');
    const asyncRule = this.filteredRules.find(r => r.id === 'operations-003');
    const responseRule = this.filteredRules.find(r => r.id === 'response-003');
    const hateoasRule = this.filteredRules.find(r => r.id === 'response-004');

    // Check for bulk operation support
    if (bulkOpsRule) {
      const hasBulkEndpoints = this.endpoints.some(e => e.path.includes('bulk') || e.path.includes('batch'));
      if (!hasBulkEndpoints && this.endpoints.length > 2) {
        const collectionEndpoints = this.endpoints.filter(e => e.path.match(/\/(users|posts|products|items)$/));
        if (collectionEndpoints.length > 0) {
          this.addViolation({
            rule: bulkOpsRule,
            endpoint: collectionEndpoints[0].path,
            method: 'POST',
            details: `No bulk operation endpoint found. Consider adding POST ${collectionEndpoints[0].path}/bulk for batch creates/updates.`
          });
        }
      }
    }

    // Check for PATCH support
    if (patchRule) {
      const supportsPatch = this.endpoints.some(e => e.methods && e.methods.includes('PATCH'));
      if (!supportsPatch && this.endpoints.length > 0) {
        const resourceEndpoints = this.endpoints.filter(e => e.path.match(/\/\w+\/\d+$|\/\w+\/[a-z0-9-]+$/));
        if (resourceEndpoints.length === 0 && this.endpoints.some(e => e.path)) {
          this.addViolation({
            rule: patchRule,
            endpoint: 'Resource endpoints',
            method: 'PATCH',
            details: 'No PATCH method detected. Support PATCH for partial updates (e.g., PATCH /users/1 with only changed fields).'
          });
        }
      }
    }

    // Check for HATEOAS links
    if (hateoasRule) {
      this.endpoints.forEach(endpoint => {
        if (endpoint.responseData) {
          const data = endpoint.responseData;
          const items = Array.isArray(data) ? data.slice(0, 2) : [data];
          
          items.forEach(item => {
            if (item && typeof item === 'object') {
              const hasLinks = item._links || item.links || item.href || item.self;
              if (!hasLinks) {
                this.addViolation({
                  rule: hateoasRule,
                  endpoint: endpoint.path,
                  method: 'GET',
                  details: `Response in ${endpoint.path} lacks hypermedia links. Add _links field with self, related resources (e.g., { _links: { self: "${endpoint.path}/1", posts: "/users/1/posts" } }).`
                });
              }
            }
          });
        }
      });
    }

    // General operation recommendations
    if (asyncRule && this.endpoints.length > 0) {
      this.addViolation({
        rule: asyncRule,
        endpoint: 'Long-running operations',
        method: 'POST',
        details: 'For operations taking >5 seconds, return 202 Accepted with Location header pointing to status endpoint (e.g., /operations/{id}).'
      });
    }

    if (responseRule && this.endpoints.length > 0) {
      this.addViolation({
        rule: responseRule,
        endpoint: 'All endpoints',
        method: 'ALL',
        details: 'Verify response patterns: POST → 201 + Location header + created resource, PUT → 200 + updated resource, DELETE → 204 No Content, GET → 200 + resource(s).'
      });
    }
  }

  analyzeSchemas() {
    const schemaRule = this.filteredRules.find(r => r.id === 'datatypes-003');
    const constraintsRule = this.filteredRules.find(r => r.id === 'schema-002');
    const enumRule = this.filteredRules.find(r => r.id === 'schema-003');
    const nullsRule = this.filteredRules.find(r => r.id === 'nulls-001');
    const objectsRule = this.filteredRules.find(r => r.id === 'objects-001');

    // Check actual data for schema issues
    this.endpoints.forEach(endpoint => {
      if (!endpoint.responseData) return;

      const data = endpoint.responseData;
      const items = Array.isArray(data) ? data : [data];
      
      items.slice(0, 3).forEach((item, index) => {
        if (!item || typeof item !== 'object') return;

        // Check for enum candidates (fields with limited values)
        if (enumRule) {
          Object.keys(item).forEach(key => {
            const value = item[key];
            if (key.toLowerCase().includes('status') || 
                key.toLowerCase().includes('type') || 
                key.toLowerCase().includes('role') ||
                key.toLowerCase().includes('state')) {
              if (typeof value === 'string' && !value.match(/^[A-Z_]+$/)) {
                this.addViolation({
                  rule: enumRule,
                  endpoint: endpoint.path,
                  method: 'GET',
                  details: `Field "${key}" in ${endpoint.path} with value "${value}" appears to be an enum candidate. Define allowed values in schema.`
                });
              }
            }
          });
        }

        // Check for null handling inconsistency
        if (nullsRule) {
          const nullFields = Object.keys(item).filter(key => item[key] === null);
          if (nullFields.length > 0 && nullFields.length < Object.keys(item).length / 2) {
            this.addViolation({
              rule: nullsRule,
              endpoint: endpoint.path,
              method: 'GET',
              details: `Response in ${endpoint.path} has inconsistent null handling. Fields with null: [${nullFields.join(', ')}]. Document whether to omit or include nulls.`
            });
          }
        }

        // Check nesting depth
        if (objectsRule) {
          const maxDepth = this.getMaxNestingDepth(item);
          if (maxDepth > 4) {
            this.addViolation({
              rule: objectsRule,
              endpoint: endpoint.path,
              method: 'GET',
              details: `Response in ${endpoint.path} has excessive nesting (${maxDepth} levels deep). Limit nesting to 3-4 levels for better usability.`
            });
          }
        }

        // Check for missing constraints
        if (constraintsRule) {
          Object.keys(item).forEach(key => {
            const value = item[key];
            
            // Numeric fields without documented ranges
            if (typeof value === 'number' && (key.toLowerCase().includes('age') || key.toLowerCase().includes('count') || key.toLowerCase().includes('quantity'))) {
              this.addViolation({
                rule: constraintsRule,
                endpoint: endpoint.path,
                method: 'GET',
                details: `Field "${key}" in ${endpoint.path} is numeric (value: ${value}). Define min/max constraints in schema (e.g., min=0, max=120 for age).`
              });
            }

            // String fields that should have length limits
            if (typeof value === 'string' && value.length > 0 && (key.toLowerCase().includes('name') || key.toLowerCase().includes('title') || key.toLowerCase().includes('description'))) {
              this.addViolation({
                rule: constraintsRule,
                endpoint: endpoint.path,
                method: 'GET',
                details: `Field "${key}" in ${endpoint.path} is a string (length: ${value.length}). Define minLength/maxLength in schema (e.g., minLength=1, maxLength=255).`
              });
            }
          });
        }
      });
    });

    // General schema recommendation
    if (schemaRule && this.endpoints.length > 0) {
      this.addViolation({
        rule: schemaRule,
        endpoint: 'All endpoints',
        method: 'ALL',
        details: 'Provide OpenAPI/Swagger specification with complete JSON Schema definitions for all request/response bodies.'
      });
    }
  }

  getMaxNestingDepth(obj, currentDepth = 0) {
    if (typeof obj !== 'object' || obj === null) {
      return currentDepth;
    }

    let maxDepth = currentDepth;
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const depth = this.getMaxNestingDepth(obj[key], currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    return maxDepth;
  }

  analyzeParameters() {
    const queryParamRule = this.filteredRules.find(r => r.id === 'parameters-001');
    const paramDocRule = this.filteredRules.find(r => r.id === 'parameters-002');
    const defaultsRule = this.filteredRules.find(r => r.id === 'parameters-003');
    const compressionRule = this.filteredRules.find(r => r.id === 'performance-003');
    const sizeLimitRule = this.filteredRules.find(r => r.id === 'performance-006');

    // General parameter recommendations
    if (queryParamRule && this.endpoints.length > 0) {
      this.addViolation({
        rule: queryParamRule,
        endpoint: 'GET endpoints',
        method: 'GET',
        details: 'Use query parameters for optional filters (e.g., /users?status=active&role=admin), not URL path segments or request body.'
      });
    }

    if (paramDocRule && this.endpoints.length > 0) {
      this.addViolation({
        rule: paramDocRule,
        endpoint: 'All endpoints',
        method: 'ALL',
        details: 'Document all parameters in OpenAPI spec with: type (string/integer/boolean), format (email/uuid), constraints (min/max), examples, and descriptions.'
      });
    }

    if (defaultsRule && this.endpoints.length > 0) {
      const collectionEndpoints = this.endpoints.filter(e => e.path.match(/\/(users|posts|products|items)$/));
      if (collectionEndpoints.length > 0) {
        this.addViolation({
          rule: defaultsRule,
          endpoint: collectionEndpoints[0].path,
          method: 'GET',
          details: `Collection endpoints like ${collectionEndpoints[0].path} should have default values: limit (default: 20), sort (default: created_at:desc), page (default: 1).`
        });
      }
    }

    // Check for compression
    if (compressionRule) {
      const hasCompression = this.endpoints.some(e => 
        e.headers && (e.headers['content-encoding'] || e.headers['accept-encoding'])
      );

      if (!hasCompression && this.endpoints.length > 0) {
        const largeEndpoints = this.endpoints.filter(e => e.responseData && JSON.stringify(e.responseData).length > 1000);
        if (largeEndpoints.length > 0) {
          this.addViolation({
            rule: compressionRule,
            endpoint: largeEndpoints[0].path,
            method: 'GET',
            details: `Endpoint ${largeEndpoints[0].path} returns large responses without compression. Enable gzip/brotli to reduce bandwidth.`
          });
        }
      }
    }

    // Check response sizes
    if (sizeLimitRule && this.endpoints.length > 0) {
      this.endpoints.forEach(endpoint => {
        if (endpoint.responseData) {
          const size = JSON.stringify(endpoint.responseData).length;
          if (size > 1024 * 1024) { // > 1MB
            this.addViolation({
              rule: sizeLimitRule,
              endpoint: endpoint.path,
              method: 'GET',
              details: `Endpoint ${endpoint.path} returns very large response (${(size / 1024).toFixed(0)}KB). Implement pagination or field selection.`
            });
          }
        }
      });

      // General recommendation
      this.addViolation({
        rule: sizeLimitRule,
        endpoint: 'All endpoints',
        method: 'POST/PUT',
        details: 'Set maximum request payload sizes (e.g., 1MB) and return 413 Payload Too Large for oversized requests.'
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

  analyzeSecurityVulnerabilities() {
    // Check for common security vulnerabilities
    this.endpoints.forEach(endpoint => {
      const headers = endpoint.headers || {};
      
      // Check for missing security headers
      if (!headers['strict-transport-security']) {
        const hstsRule = this.filteredRules.find(r => r.category === 'Security' && r.name.includes('HTTPS'));
        if (hstsRule) {
          this.addViolation({
            rule: hstsRule,
            endpoint: endpoint.path,
            method: 'GET',
            details: `Missing Strict-Transport-Security header. This header enforces HTTPS and protects against protocol downgrade attacks.`
          });
        }
      }

      // Check for missing X-Content-Type-Options
      if (!headers['x-content-type-options']) {
        const secRule = this.filteredRules.find(r => r.id === 'security-001');
        if (secRule) {
          this.addViolation({
            rule: secRule,
            endpoint: endpoint.path,
            method: 'GET',
            details: `Missing X-Content-Type-Options header. Set to "nosniff" to prevent MIME type sniffing attacks.`
          });
        }
      }

      // Check for missing X-Frame-Options
      if (!headers['x-frame-options']) {
        const frameRule = this.filteredRules.find(r => r.category === 'Security' && r.name.includes('Frame'));
        if (!frameRule) {
          // Create ad-hoc security violation if no specific rule
          const secRule = this.filteredRules.find(r => r.id === 'security-001');
          if (secRule) {
            this.addViolation({
              rule: secRule,
              endpoint: endpoint.path,
              method: 'GET',
              details: `Missing X-Frame-Options header. Set to "DENY" or "SAMEORIGIN" to prevent clickjacking attacks.`
            });
          }
        }
      }

      // Check for exposed error details (potential information disclosure)
      if (endpoint.responseData && typeof endpoint.responseData === 'object') {
        const dataStr = JSON.stringify(endpoint.responseData).toLowerCase();
        const sensitivePatterns = ['password', 'token', 'secret', 'apikey', 'api_key', 'private_key'];
        
        sensitivePatterns.forEach(pattern => {
          if (dataStr.includes(pattern)) {
            const secRule = this.filteredRules.find(r => r.id === 'security-002');
            if (secRule) {
              this.addViolation({
                rule: secRule,
                endpoint: endpoint.path,
                method: 'GET',
                details: `Potential information disclosure: Response contains sensitive field name "${pattern}". Ensure sensitive data is not exposed.`
              });
            }
          }
        });
      }

      // Check for SQL injection vulnerabilities in URL parameters
      if (endpoint.path.includes('?')) {
        const secRule = this.filteredRules.find(r => r.id === 'security-001');
        if (secRule) {
          this.addViolation({
            rule: secRule,
            endpoint: endpoint.path,
            method: 'GET',
            details: `Endpoint uses query parameters. Ensure proper input validation and parameterized queries to prevent SQL injection.`
          });
        }
      }
    });
  }

  analyzeHttpMethodSupport() {
    // Analyze which HTTP methods are supported and if they're appropriate
    this.endpoints.forEach(endpoint => {
      const methods = endpoint.methods || [];
      const methodResponses = endpoint.methodResponses || {};

      // Check if collection endpoints support POST for creating resources
      if (endpoint.path && endpoint.path.match(/s$|ies$/)) {
        if (!methods.includes('POST') && !methods.includes('post')) {
          const restRule = this.filteredRules.find(r => r.id === 'rest-002');
          if (restRule) {
            this.addViolation({
              rule: restRule,
              endpoint: endpoint.path,
              details: `Collection endpoint "${endpoint.path}" doesn't support POST method for creating new resources.`
            });
          }
        }
      }

      // Check if individual resource endpoints support PUT/PATCH for updates
      if (endpoint.path && endpoint.path.match(/\/\d+$/)) {
        if (!methods.includes('PUT') && !methods.includes('PATCH')) {
          const restRule = this.filteredRules.find(r => r.id === 'rest-002');
          if (restRule) {
            this.addViolation({
              rule: restRule,
              endpoint: endpoint.path,
              details: `Resource endpoint "${endpoint.path}" should support PUT or PATCH for updates.`
            });
          }
        }

        if (!methods.includes('DELETE')) {
          const restRule = this.filteredRules.find(r => r.id === 'rest-002');
          if (restRule) {
            this.addViolation({
              rule: restRule,
              endpoint: endpoint.path,
              method: 'DELETE',
              details: `Resource endpoint "${endpoint.path}" should support DELETE for removing resources.`
            });
          }
        }
      }

      // Check if OPTIONS is supported for CORS preflight
      if (!methods.includes('OPTIONS')) {
        const corsRule = this.filteredRules.find(r => r.id === 'http-002');
        if (corsRule) {
          this.addViolation({
            rule: corsRule,
            endpoint: endpoint.path,
            method: 'OPTIONS',
            details: `Endpoint "${endpoint.path}" doesn't support OPTIONS method. This is required for CORS preflight requests.`
          });
        }
      }

      // Check for proper status codes on different methods
      if (methodResponses.POST && methodResponses.POST.status === 200) {
        const httpRule = this.filteredRules.find(r => r.id === 'http-001');
        if (httpRule) {
          this.addViolation({
            rule: httpRule,
            endpoint: endpoint.path,
            method: 'POST',
            details: `POST request returns 200 OK. Should return 201 Created when a new resource is created.`
          });
        }
      }

      if (methodResponses.DELETE && methodResponses.DELETE.status === 200) {
        const httpRule = this.filteredRules.find(r => r.id === 'http-001');
        if (httpRule) {
          this.addViolation({
            rule: httpRule,
            endpoint: endpoint.path,
            method: 'DELETE',
            details: `DELETE request returns 200. Consider returning 204 No Content for successful deletions.`
          });
        }
      }

      // Check for idempotency on PUT and PATCH
      if (methods.includes('PUT') || methods.includes('PATCH')) {
        const idempotencyRule = this.filteredRules.find(r => r.id === 'idempotency-001');
        if (idempotencyRule) {
          // This is informational - remind about idempotency
          this.addViolation({
            rule: idempotencyRule,
            endpoint: endpoint.path,
            method: methods.includes('PUT') ? 'PUT' : 'PATCH',
            details: `Ensure ${methods.includes('PUT') ? 'PUT' : 'PATCH'} operations on "${endpoint.path}" are idempotent (can be repeated safely).`
          });
        }
      }
    });
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

