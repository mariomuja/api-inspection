// Comprehensive API Design Rules Catalog
// Based on industry best practices, REST principles, and modern API design guidelines

const designRules = [
  {
    id: 'rest-001',
    name: 'Use Plural Nouns for Resource Names',
    category: 'REST Principles',
    severity: 'error',
    description: 'Resource endpoints should use plural nouns (e.g., /users, /products) instead of singular forms.',
    rationale: 'Plural nouns indicate collections and provide consistency across the API. This makes it intuitive for developers to understand that they are working with collections of resources.',
    impact: 'Using singular nouns can confuse developers and make the API less intuitive. It also breaks the convention that GET /users returns multiple users while GET /users/1 returns a single user.',
    source: 'Google Cloud API Design Guide',
    sourceUrl: 'https://cloud.google.com/apis/design/resources',
    examples: {
      good: ['/users', '/products', '/orders'],
      bad: ['/user', '/product', '/order']
    }
  },
  {
    id: 'rest-002',
    name: 'Use HTTP Methods Correctly',
    category: 'REST Principles',
    severity: 'error',
    description: 'Use appropriate HTTP methods: GET for retrieval, POST for creation, PUT/PATCH for updates, DELETE for deletion.',
    rationale: 'HTTP methods have semantic meaning. Using them correctly makes your API self-documenting and predictable.',
    impact: 'Misusing HTTP methods breaks REST principles and can lead to caching issues, security vulnerabilities, and developer confusion.',
    source: 'Microsoft REST API Guidelines',
    sourceUrl: 'https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md',
    examples: {
      good: ['GET /users (retrieve)', 'POST /users (create)', 'PUT /users/1 (update)', 'DELETE /users/1 (delete)'],
      bad: ['GET /users/delete/1', 'POST /users/get', 'GET /users/update/1']
    }
  },
  {
    id: 'rest-003',
    name: 'Avoid Verbs in Endpoint Names',
    category: 'REST Principles',
    severity: 'warning',
    description: 'Endpoints should represent resources (nouns), not actions (verbs). Use HTTP methods to indicate actions.',
    rationale: 'REST is resource-oriented. The action is conveyed through the HTTP method, not the URL.',
    impact: 'Using verbs makes the API less RESTful and harder to understand. It also leads to URL bloat and inconsistency.',
    source: 'RESTful Web Services by Leonard Richardson & Sam Ruby',
    sourceUrl: 'https://www.oreilly.com/library/view/restful-web-services/9780596529260/',
    examples: {
      good: ['POST /users (create user)', 'DELETE /users/1 (delete user)'],
      bad: ['/createUser', '/deleteUser', '/getUser', '/updateUser']
    }
  },
  {
    id: 'rest-004',
    name: 'Use Hyphens for Multi-word Resources',
    category: 'REST Principles',
    severity: 'info',
    description: 'Use hyphens (kebab-case) to separate words in URLs instead of underscores or camelCase.',
    rationale: 'Hyphens are more readable in URLs and are the standard convention. Some systems may not display underscores properly.',
    impact: 'Minor usability impact. Inconsistent naming can cause confusion.',
    source: 'Google Cloud API Design Guide',
    sourceUrl: 'https://cloud.google.com/apis/design/naming_convention',
    examples: {
      good: ['/user-profiles', '/order-items'],
      bad: ['/user_profiles', '/userProfiles', '/OrderItems']
    }
  },
  {
    id: 'rest-005',
    name: 'Implement Proper Nesting for Related Resources',
    category: 'REST Principles',
    severity: 'warning',
    description: 'Nested resources should represent relationships, but avoid deep nesting (max 2 levels).',
    rationale: 'Nesting shows relationships but deep nesting makes URLs complex and hard to manage.',
    impact: 'Deep nesting creates complexity and tight coupling between resources.',
    source: 'PayPal API Design Guidelines',
    sourceUrl: 'https://github.com/paypal/api-standards/blob/master/api-style-guide.md',
    examples: {
      good: ['/users/1/posts', '/posts/1/comments'],
      bad: ['/users/1/posts/1/comments/1/replies/1']
    }
  },
  {
    id: 'http-001',
    name: 'Return Appropriate HTTP Status Codes',
    category: 'HTTP Standards',
    severity: 'error',
    description: 'Use standard HTTP status codes: 200 for success, 201 for creation, 400 for client errors, 500 for server errors.',
    rationale: 'Status codes are standardized and have specific meanings. They help clients handle responses appropriately.',
    impact: 'Incorrect status codes can break client error handling, caching, and monitoring systems.',
    source: 'HTTP/1.1 RFC 7231 (IETF)',
    sourceUrl: 'https://tools.ietf.org/html/rfc7231',
    examples: {
      good: ['200 OK', '201 Created', '400 Bad Request', '404 Not Found', '500 Internal Server Error'],
      bad: ['Returning 200 with error message', 'Always returning 200', 'Using non-standard codes']
    }
  },
  {
    id: 'http-002',
    name: 'Implement CORS Headers',
    category: 'HTTP Standards',
    severity: 'warning',
    description: 'Include appropriate CORS headers to allow cross-origin requests from authorized domains.',
    rationale: 'CORS headers are necessary for web applications to access the API from different domains.',
    impact: 'Missing CORS headers prevent web applications from using the API.',
    source: 'W3C CORS Specification',
    sourceUrl: 'https://www.w3.org/TR/cors/',
    examples: {
      good: ['Access-Control-Allow-Origin: *', 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE'],
      bad: ['No CORS headers', 'Blocking all origins']
    }
  },
  {
    id: 'http-003',
    name: 'Support Content Negotiation',
    category: 'HTTP Standards',
    severity: 'info',
    description: 'Support Accept and Content-Type headers for content negotiation (JSON, XML, etc.).',
    rationale: 'Content negotiation allows clients to request data in their preferred format.',
    impact: 'Lack of content negotiation limits API flexibility and client compatibility.',
    source: 'HTTP/1.1 RFC 7231 (IETF)',
    sourceUrl: 'https://tools.ietf.org/html/rfc7231#section-5.3',
    examples: {
      good: ['Accept: application/json', 'Content-Type: application/json'],
      bad: ['Ignoring Accept header', 'Only supporting one format without declaring it']
    }
  },
  {
    id: 'version-001',
    name: 'Include API Version in URL or Header',
    category: 'Versioning',
    severity: 'error',
    description: 'APIs should be versioned to allow changes without breaking existing clients. Version in URL (e.g., /v1/) or header.',
    rationale: 'Versioning allows the API to evolve while maintaining backward compatibility.',
    impact: 'Without versioning, breaking changes will break all existing clients.',
    source: 'Stripe API Design Best Practices',
    sourceUrl: 'https://stripe.com/docs/api/versioning',
    examples: {
      good: ['/v1/users', '/api/v2/products', 'API-Version: 1'],
      bad: ['/users (no version)', 'Version in query param']
    }
  },
  {
    id: 'security-001',
    name: 'Use HTTPS for All Endpoints',
    category: 'Security',
    severity: 'error',
    description: 'All API endpoints must use HTTPS to encrypt data in transit.',
    rationale: 'HTTPS prevents man-in-the-middle attacks and protects sensitive data.',
    impact: 'HTTP exposes data to interception and tampering.',
    source: 'OWASP API Security Top 10',
    sourceUrl: 'https://owasp.org/www-project-api-security/',
    examples: {
      good: ['https://api.example.com'],
      bad: ['http://api.example.com']
    }
  },
  {
    id: 'security-002',
    name: 'Implement Authentication and Authorization',
    category: 'Security',
    severity: 'error',
    description: 'APIs should require authentication (OAuth, JWT, API keys) and implement authorization checks.',
    rationale: 'Authentication verifies identity; authorization controls access to resources.',
    impact: 'Missing authentication allows unauthorized access to sensitive data.',
    source: 'OWASP API Security Top 10',
    sourceUrl: 'https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/',
    examples: {
      good: ['Bearer token', 'API key', 'OAuth 2.0'],
      bad: ['No authentication', 'Authentication in URL']
    }
  },
  {
    id: 'security-003',
    name: 'Implement Rate Limiting',
    category: 'Security',
    severity: 'warning',
    description: 'APIs should implement rate limiting to prevent abuse and ensure fair usage.',
    rationale: 'Rate limiting protects against DDoS attacks and ensures service availability.',
    impact: 'Without rate limiting, the API is vulnerable to abuse and overload.',
    source: 'OWASP API Security Top 10',
    sourceUrl: 'https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/',
    examples: {
      good: ['X-RateLimit-Limit: 1000', 'X-RateLimit-Remaining: 999', '429 Too Many Requests'],
      bad: ['No rate limiting', 'No rate limit headers']
    }
  },
  {
    id: 'pagination-001',
    name: 'Implement Pagination for Collections',
    category: 'Data Management',
    severity: 'warning',
    description: 'Large collections should be paginated using limit/offset or cursor-based pagination.',
    rationale: 'Pagination prevents returning huge datasets that can overwhelm clients and servers.',
    impact: 'Without pagination, responses can be extremely large and slow.',
    source: 'Microsoft REST API Guidelines',
    sourceUrl: 'https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#97-pagination',
    examples: {
      good: ['/users?limit=20&offset=0', '/users?page=1&per_page=20', '/users?cursor=abc123'],
      bad: ['Returning all records', 'No pagination support']
    }
  },
  {
    id: 'pagination-002',
    name: 'Include Pagination Metadata',
    category: 'Data Management',
    severity: 'info',
    description: 'Paginated responses should include metadata (total count, current page, links to next/previous pages).',
    rationale: 'Metadata helps clients navigate through paginated data efficiently.',
    impact: 'Missing metadata makes it harder for clients to implement pagination UI.',
    source: 'GitHub REST API Documentation',
    sourceUrl: 'https://docs.github.com/en/rest/guides/using-pagination-in-the-rest-api',
    examples: {
      good: ['{ data: [...], total: 100, page: 1, per_page: 20 }', 'Link: <...>; rel="next"'],
      bad: ['Only returning data array', 'No navigation links']
    }
  },
  {
    id: 'filtering-001',
    name: 'Support Filtering via Query Parameters',
    category: 'Data Management',
    severity: 'info',
    description: 'Allow clients to filter collections using query parameters.',
    rationale: 'Filtering reduces data transfer and improves performance.',
    impact: 'Without filtering, clients must fetch all data and filter locally.',
    source: 'JSON:API Specification',
    sourceUrl: 'https://jsonapi.org/format/#fetching-filtering',
    examples: {
      good: ['/users?status=active', '/products?category=electronics&price_min=100'],
      bad: ['No filtering support', 'Filtering requires POST with body']
    }
  },
  {
    id: 'sorting-001',
    name: 'Support Sorting via Query Parameters',
    category: 'Data Management',
    severity: 'info',
    description: 'Allow clients to sort collections using query parameters.',
    rationale: 'Server-side sorting is more efficient than client-side sorting.',
    impact: 'Without sorting, clients must sort large datasets locally.',
    source: 'JSON:API Specification',
    sourceUrl: 'https://jsonapi.org/format/#fetching-sorting',
    examples: {
      good: ['/users?sort=name', '/products?sort=-price (descending)'],
      bad: ['No sorting support', 'Hardcoded sort order']
    }
  },
  {
    id: 'error-001',
    name: 'Return Consistent Error Response Format',
    category: 'Error Handling',
    severity: 'error',
    description: 'Errors should follow a consistent structure with error code, message, and optional details.',
    rationale: 'Consistent error format makes error handling predictable and easier for clients.',
    impact: 'Inconsistent errors make it hard for clients to handle errors properly.',
    source: 'Google Cloud API Design Guide',
    sourceUrl: 'https://cloud.google.com/apis/design/errors',
    examples: {
      good: ['{ error: { code: "INVALID_INPUT", message: "Email is required", field: "email" }}'],
      bad: ['Different formats for different errors', 'Only returning status code']
    }
  },
  {
    id: 'error-002',
    name: 'Provide Meaningful Error Messages',
    category: 'Error Handling',
    severity: 'warning',
    description: 'Error messages should be clear, actionable, and helpful for debugging.',
    rationale: 'Good error messages help developers quickly identify and fix issues.',
    impact: 'Vague errors lead to confusion and longer debugging times.',
    source: 'Atlassian REST API Design Guidelines',
    sourceUrl: 'https://developer.atlassian.com/server/framework/atlassian-sdk/rest-api-design-guidelines/',
    examples: {
      good: ['"Email address is invalid: must contain @"', '"Field \'username\' is required"'],
      bad: ['"Error"', '"Bad request"', '"Something went wrong"']
    }
  },
  {
    id: 'doc-001',
    name: 'Provide API Documentation',
    category: 'Documentation',
    severity: 'error',
    description: 'APIs should have comprehensive documentation (OpenAPI/Swagger, or similar).',
    rationale: 'Documentation is essential for developers to understand and use the API.',
    impact: 'Lack of documentation makes the API difficult to use and adopt.',
    source: 'OpenAPI Initiative Specification',
    sourceUrl: 'https://www.openapis.org/',
    examples: {
      good: ['OpenAPI/Swagger spec', 'Comprehensive API docs', 'Interactive API explorer'],
      bad: ['No documentation', 'Outdated docs', 'Incomplete docs']
    }
  },
  {
    id: 'doc-002',
    name: 'Include Examples in Documentation',
    category: 'Documentation',
    severity: 'info',
    description: 'Documentation should include request/response examples for each endpoint.',
    rationale: 'Examples help developers understand how to use the API quickly.',
    impact: 'Without examples, developers have to guess the correct request format.',
    source: 'Swagger/OpenAPI Best Practices',
    sourceUrl: 'https://swagger.io/docs/specification/adding-examples/',
    examples: {
      good: ['Request/response samples', 'Code examples in multiple languages'],
      bad: ['No examples', 'Only showing request format']
    }
  },
  {
    id: 'response-001',
    name: 'Use Consistent Response Structure',
    category: 'Response Design',
    severity: 'warning',
    description: 'All responses should follow a consistent structure (e.g., always wrapping data in a data field).',
    rationale: 'Consistency makes the API predictable and easier to use.',
    impact: 'Inconsistent responses require special handling for different endpoints.',
    source: 'JSON:API Specification',
    sourceUrl: 'https://jsonapi.org/format/#document-structure',
    examples: {
      good: ['{ data: {...} } for all successful responses'],
      bad: ['Sometimes { user: {...} }, sometimes { data: {...} }']
    }
  },
  {
    id: 'response-002',
    name: 'Include Metadata in Responses',
    category: 'Response Design',
    severity: 'info',
    description: 'Responses should include relevant metadata (timestamps, request IDs, etc.).',
    rationale: 'Metadata aids in debugging, monitoring, and tracking.',
    impact: 'Missing metadata makes troubleshooting harder.',
    source: 'AWS API Gateway Best Practices',
    sourceUrl: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html',
    examples: {
      good: ['{ data: {...}, meta: { timestamp: "...", requestId: "..." } }'],
      bad: ['Only returning data without metadata']
    }
  },
  {
    id: 'naming-001',
    name: 'Use Consistent Naming Convention',
    category: 'Naming Conventions',
    severity: 'warning',
    description: 'Field names should follow a consistent convention (camelCase or snake_case, not mixed).',
    rationale: 'Consistency improves readability and reduces errors.',
    impact: 'Mixed conventions confuse developers and require extra mapping logic.',
    source: 'Google JSON Style Guide',
    sourceUrl: 'https://google.github.io/styleguide/jsoncstyleguide.xml',
    examples: {
      good: ['userName, firstName (camelCase)', 'user_name, first_name (snake_case)'],
      bad: ['userName, first_name (mixed)', 'Inconsistent casing']
    }
  },
  {
    id: 'idempotency-001',
    name: 'Ensure Idempotency for Safe Operations',
    category: 'API Design',
    severity: 'warning',
    description: 'GET, PUT, DELETE should be idempotent. POST may not be idempotent unless using idempotency keys.',
    rationale: 'Idempotency prevents duplicate operations and ensures reliability.',
    impact: 'Non-idempotent operations can cause duplicate data or actions.',
    source: 'HTTP/1.1 RFC 7231 (IETF)',
    sourceUrl: 'https://tools.ietf.org/html/rfc7231#section-4.2.2',
    examples: {
      good: ['GET, PUT, DELETE are idempotent', 'POST with Idempotency-Key header'],
      bad: ['PUT creating new resources', 'DELETE having side effects']
    }
  },
  {
    id: 'performance-001',
    name: 'Support Field Selection/Sparse Fieldsets',
    category: 'Performance',
    severity: 'info',
    description: 'Allow clients to request only specific fields to reduce payload size.',
    rationale: 'Field selection reduces bandwidth and improves performance.',
    impact: 'Always returning full objects wastes bandwidth and slows down responses.',
    source: 'JSON:API Specification',
    sourceUrl: 'https://jsonapi.org/format/#fetching-sparse-fieldsets',
    examples: {
      good: ['/users?fields=id,name,email', '/users?select=id,name'],
      bad: ['Always returning all fields', 'No way to select fields']
    }
  },
  {
    id: 'performance-002',
    name: 'Implement Caching Headers',
    category: 'Performance',
    severity: 'warning',
    description: 'Use appropriate caching headers (Cache-Control, ETag) for cacheable resources.',
    rationale: 'Caching reduces server load and improves response times.',
    impact: 'Without caching, clients make unnecessary requests.',
    source: 'HTTP/1.1 RFC 7234 (IETF)',
    sourceUrl: 'https://tools.ietf.org/html/rfc7234',
    examples: {
      good: ['Cache-Control: max-age=3600', 'ETag: "abc123"', '304 Not Modified'],
      bad: ['No caching headers', 'Cache-Control: no-cache for everything']
    }
  },
  {
    id: 'performance-003',
    name: 'Use Compression for Responses',
    category: 'Performance',
    severity: 'warning',
    description: 'Enable gzip or brotli compression to reduce response payload sizes.',
    rationale: 'Compression significantly reduces bandwidth usage and improves load times, especially for large JSON responses.',
    impact: 'Uncompressed responses waste bandwidth and slow down client applications.',
    source: 'Google Web Fundamentals',
    sourceUrl: 'https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer',
    examples: {
      good: ['Content-Encoding: gzip', 'Content-Encoding: br', 'Accept-Encoding: gzip, deflate, br'],
      bad: ['No compression', 'Large uncompressed JSON responses']
    }
  },
  {
    id: 'performance-004',
    name: 'Implement Response Time SLA',
    category: 'Performance',
    severity: 'info',
    description: 'Define and maintain response time service level agreements (e.g., p95 < 200ms).',
    rationale: 'Consistent performance is crucial for user experience and system reliability.',
    impact: 'Slow APIs lead to poor user experience and timeouts.',
    source: 'Google Site Reliability Engineering',
    sourceUrl: 'https://sre.google/sre-book/service-level-objectives/',
    examples: {
      good: ['p50 < 100ms', 'p95 < 200ms', 'p99 < 500ms'],
      bad: ['No performance monitoring', 'Inconsistent response times']
    }
  },
  {
    id: 'performance-005',
    name: 'Use Connection Pooling and Keep-Alive',
    category: 'Performance',
    severity: 'info',
    description: 'Enable HTTP keep-alive to reuse connections and reduce latency.',
    rationale: 'Connection reuse eliminates the overhead of establishing new TCP connections for each request.',
    impact: 'Creating new connections for each request adds significant latency.',
    source: 'HTTP/1.1 RFC 7230 (IETF)',
    sourceUrl: 'https://tools.ietf.org/html/rfc7230#section-6.3',
    examples: {
      good: ['Connection: keep-alive', 'Keep-Alive: timeout=5, max=100'],
      bad: ['Connection: close', 'No keep-alive support']
    }
  },
  {
    id: 'datatypes-001',
    name: 'Use Consistent Data Types',
    category: 'Data Types & Validation',
    severity: 'error',
    description: 'Use consistent data types across the API (e.g., IDs always as strings or numbers, dates in ISO 8601).',
    rationale: 'Consistent data types prevent parsing errors and make the API predictable.',
    impact: 'Inconsistent types require special handling and can cause runtime errors.',
    source: 'Google Cloud API Design Guide',
    sourceUrl: 'https://cloud.google.com/apis/design/design_patterns',
    examples: {
      good: ['id: "123" (always string)', 'timestamp: "2025-11-08T12:00:00Z" (ISO 8601)'],
      bad: ['Sometimes id: 123, sometimes id: "123"', 'Mixed date formats']
    }
  },
  {
    id: 'datatypes-002',
    name: 'Use ISO 8601 for Dates and Times',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'All date and time values should use ISO 8601 format with timezone information.',
    rationale: 'ISO 8601 is the international standard and eliminates timezone ambiguity.',
    impact: 'Custom date formats cause parsing issues and timezone confusion.',
    source: 'ISO 8601 International Standard',
    sourceUrl: 'https://www.iso.org/iso-8601-date-and-time-format.html',
    examples: {
      good: ['2025-11-08T21:30:00Z', '2025-11-08T21:30:00+01:00'],
      bad: ['11/08/2025', '08-Nov-2025', '1699473000 (Unix timestamp only)']
    }
  },
  {
    id: 'datatypes-003',
    name: 'Define Explicit Data Schemas',
    category: 'Data Types & Validation',
    severity: 'error',
    description: 'Provide JSON Schema or OpenAPI schema definitions for all request and response bodies.',
    rationale: 'Explicit schemas enable validation, documentation generation, and client code generation.',
    impact: 'Without schemas, clients must guess data structures and types.',
    source: 'OpenAPI Specification 3.0',
    sourceUrl: 'https://spec.openapis.org/oas/v3.0.0#schema-object',
    examples: {
      good: ['JSON Schema definitions', 'OpenAPI schema components', 'Type definitions'],
      bad: ['No schema documentation', 'Undocumented data structures']
    }
  },
  {
    id: 'datatypes-004',
    name: 'Use Appropriate Numeric Types',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'Use proper numeric types: integers for counts, decimals for money, avoid floating point for currency.',
    rationale: 'Correct numeric types prevent precision errors and overflow issues.',
    impact: 'Wrong numeric types can cause calculation errors, especially with money.',
    source: 'IEEE 754 Floating Point Standard',
    sourceUrl: 'https://en.wikipedia.org/wiki/IEEE_754',
    examples: {
      good: ['price: "19.99" (string for currency)', 'count: 42 (integer)', 'amount_cents: 1999 (integer)'],
      bad: ['price: 19.99 (float precision errors)', 'Mixing integers and floats']
    }
  },
  {
    id: 'datatypes-005',
    name: 'Use Boolean Types Correctly',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'Use actual boolean values (true/false) instead of strings, numbers, or other representations.',
    rationale: 'Boolean types are clearer and prevent ambiguity.',
    impact: 'String booleans like "true" require parsing and can cause errors.',
    source: 'JSON RFC 7159 (IETF)',
    sourceUrl: 'https://tools.ietf.org/html/rfc7159',
    examples: {
      good: ['isActive: true', 'hasPermission: false'],
      bad: ['isActive: "true"', 'hasPermission: 1', 'isActive: "yes"']
    }
  },
  {
    id: 'validation-001',
    name: 'Implement Input Validation',
    category: 'Data Types & Validation',
    severity: 'error',
    description: 'Validate all input parameters: required fields, data types, formats, ranges, and constraints.',
    rationale: 'Input validation prevents security vulnerabilities and ensures data integrity.',
    impact: 'Missing validation allows invalid data, SQL injection, and other attacks.',
    source: 'OWASP API Security Top 10',
    sourceUrl: 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/',
    examples: {
      good: ['Validate email format', 'Check string length limits', 'Verify enum values', 'Range checks for numbers'],
      bad: ['Accept any input', 'No validation', 'Trust client data']
    }
  },
  {
    id: 'validation-002',
    name: 'Return Validation Errors with Field Information',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'When validation fails, return which fields failed and why in a structured format.',
    rationale: 'Field-level errors help clients highlight specific problems in forms.',
    impact: 'Generic validation errors make it hard for users to fix their input.',
    source: 'Microsoft REST API Guidelines',
    sourceUrl: 'https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#7102-error-condition-responses',
    examples: {
      good: ['{ errors: [{ field: "email", message: "Invalid format" }] }'],
      bad: ['{ error: "Validation failed" }', 'Generic error messages']
    }
  },
  {
    id: 'operations-001',
    name: 'Support Bulk Operations',
    category: 'API Operations',
    severity: 'info',
    description: 'Provide endpoints for bulk create, update, and delete operations to improve efficiency.',
    rationale: 'Bulk operations reduce network round trips and improve performance for batch operations.',
    impact: 'Without bulk operations, clients must make many individual requests.',
    source: 'Google Cloud API Design Guide',
    sourceUrl: 'https://cloud.google.com/apis/design/standard_methods#batch_get',
    examples: {
      good: ['POST /users/bulk', 'PATCH /users/bulk', 'Accepts array of items'],
      bad: ['Only single-item operations', 'No batch support']
    }
  },
  {
    id: 'operations-002',
    name: 'Implement Partial Updates with PATCH',
    category: 'API Operations',
    severity: 'warning',
    description: 'Support PATCH method for partial updates instead of requiring full resource replacement.',
    rationale: 'PATCH allows updating specific fields without sending the entire resource.',
    impact: 'Requiring full updates wastes bandwidth and can cause race conditions.',
    source: 'HTTP PATCH RFC 5789 (IETF)',
    sourceUrl: 'https://tools.ietf.org/html/rfc5789',
    examples: {
      good: ['PATCH /users/1 { "email": "new@example.com" }', 'Update only changed fields'],
      bad: ['Only PUT supported', 'Must send entire object']
    }
  },
  {
    id: 'operations-003',
    name: 'Support Asynchronous Operations',
    category: 'API Operations',
    severity: 'info',
    description: 'For long-running operations, return 202 Accepted with a status endpoint for polling.',
    rationale: 'Async operations prevent timeouts and provide better user experience.',
    impact: 'Synchronous long operations cause timeouts and poor UX.',
    source: 'Microsoft REST API Guidelines',
    sourceUrl: 'https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#13-long-running-operations',
    examples: {
      good: ['202 Accepted with Location header', 'GET /operations/{id} for status'],
      bad: ['Blocking requests', 'Request timeouts', 'No status updates']
    }
  },
  {
    id: 'schema-001',
    name: 'Use Nullable vs Optional Fields Correctly',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'Distinguish between optional fields (can be omitted) and nullable fields (can be null).',
    rationale: 'Clear distinction prevents confusion about whether to send null or omit the field.',
    impact: 'Ambiguity leads to inconsistent client implementations.',
    source: 'OpenAPI Specification 3.0',
    sourceUrl: 'https://spec.openapis.org/oas/v3.0.0#properties',
    examples: {
      good: ['Optional: field can be omitted', 'Nullable: field present but null', 'Required + nullable: must be present, can be null'],
      bad: ['Unclear if null or undefined', 'Inconsistent handling']
    }
  },
  {
    id: 'schema-002',
    name: 'Define Maximum and Minimum Constraints',
    category: 'Data Types & Validation',
    severity: 'info',
    description: 'Specify min/max values for numbers, min/max length for strings, and array size limits.',
    rationale: 'Constraints prevent resource exhaustion and validate business rules.',
    impact: 'No constraints allow unreasonable values that can break systems.',
    source: 'JSON Schema Specification',
    sourceUrl: 'https://json-schema.org/understanding-json-schema/reference/numeric.html',
    examples: {
      good: ['age: min=0, max=150', 'username: minLength=3, maxLength=50', 'items: maxItems=100'],
      bad: ['No constraints', 'Unlimited input sizes', 'No range validation']
    }
  },
  {
    id: 'schema-003',
    name: 'Use Enums for Fixed Value Sets',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'Use enumeration types for fields with a fixed set of possible values.',
    rationale: 'Enums enforce valid values and make the API self-documenting.',
    impact: 'String fields without enums allow invalid values.',
    source: 'OpenAPI Specification',
    sourceUrl: 'https://spec.openapis.org/oas/v3.0.0#schema-object',
    examples: {
      good: ['status: enum ["active", "inactive", "suspended"]', 'type: enum ["admin", "user", "guest"]'],
      bad: ['status: string (any value)', 'No validation of allowed values']
    }
  },
  {
    id: 'response-003',
    name: 'Return Appropriate Response for Each Method',
    category: 'API Operations',
    severity: 'error',
    description: 'GET returns resource, POST returns created resource with Location, PUT returns updated resource, DELETE returns 204 No Content.',
    rationale: 'Standard response patterns make APIs predictable and RESTful.',
    impact: 'Inconsistent responses confuse developers.',
    source: 'Microsoft REST API Guidelines',
    sourceUrl: 'https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#741-post',
    examples: {
      good: ['POST returns 201 + Location + created object', 'DELETE returns 204 No Content', 'GET returns 200 + resource'],
      bad: ['POST returns 200 without Location', 'DELETE returns full object', 'Inconsistent patterns']
    }
  },
  {
    id: 'response-004',
    name: 'Include Resource Links (HATEOAS)',
    category: 'API Operations',
    severity: 'info',
    description: 'Include hypermedia links to related resources and available actions.',
    rationale: 'HATEOAS makes APIs self-discoverable and reduces coupling.',
    impact: 'Without links, clients must hardcode URLs and guess available operations.',
    source: 'RESTful Web Services',
    sourceUrl: 'https://en.wikipedia.org/wiki/HATEOAS',
    examples: {
      good: ['{ id: 1, _links: { self: "/users/1", posts: "/users/1/posts" } }'],
      bad: ['No links', 'Clients hardcode URLs']
    }
  },
  {
    id: 'parameters-001',
    name: 'Use Query Parameters for Optional Filters',
    category: 'API Operations',
    severity: 'warning',
    description: 'Optional parameters should be in query string, not in URL path or request body.',
    rationale: 'Query parameters are the standard way to pass optional filters and options.',
    impact: 'Misplaced parameters make the API harder to use and cache.',
    source: 'W3C URI Design Guidelines',
    sourceUrl: 'https://www.w3.org/Provider/Style/URI',
    examples: {
      good: ['/users?status=active&role=admin', '/products?category=electronics'],
      bad: ['/users/active/admin', 'POST body for GET filters']
    }
  },
  {
    id: 'parameters-002',
    name: 'Document Parameter Types and Formats',
    category: 'Data Types & Validation',
    severity: 'error',
    description: 'Clearly document the type, format, and constraints for all parameters.',
    rationale: 'Clear parameter documentation prevents errors and reduces support burden.',
    impact: 'Undocumented parameters lead to trial-and-error development.',
    source: 'OpenAPI Specification',
    sourceUrl: 'https://spec.openapis.org/oas/v3.0.0#parameter-object',
    examples: {
      good: ['limit: integer, min=1, max=100, default=20', 'date: string, format=date-time'],
      bad: ['Undocumented parameters', 'No type information']
    }
  },
  {
    id: 'parameters-003',
    name: 'Provide Default Values for Optional Parameters',
    category: 'API Operations',
    severity: 'info',
    description: 'Optional parameters should have sensible default values documented.',
    rationale: 'Defaults make the API easier to use and reduce client code.',
    impact: 'No defaults force clients to always specify all parameters.',
    source: 'API Design Patterns by JJ Geewax',
    sourceUrl: 'https://www.manning.com/books/api-design-patterns',
    examples: {
      good: ['limit defaults to 20', 'sort defaults to created_at:desc'],
      bad: ['No defaults specified', 'Required to pass all parameters']
    }
  },
  {
    id: 'arrays-001',
    name: 'Always Return Arrays for Collections',
    category: 'Data Types & Validation',
    severity: 'error',
    description: 'Collection endpoints should always return arrays, even if empty or containing one item.',
    rationale: 'Consistent array responses simplify client code and prevent type errors.',
    impact: 'Returning single objects for one-item collections breaks client code.',
    source: 'Google JSON Style Guide',
    sourceUrl: 'https://google.github.io/styleguide/jsoncstyleguide.xml#Collections_and_Arrays',
    examples: {
      good: ['GET /users returns [] or [{...}, {...}]', 'Always array type'],
      bad: ['Returns object for single item', 'Returns null for empty']
    }
  },
  {
    id: 'arrays-002',
    name: 'Validate Array Size Limits',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'Set and enforce maximum array sizes in requests to prevent resource exhaustion.',
    rationale: 'Unlimited arrays can be used for DoS attacks and consume excessive resources.',
    impact: 'Large arrays can crash servers or consume all memory.',
    source: 'OWASP API Security Top 10',
    sourceUrl: 'https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/',
    examples: {
      good: ['maxItems: 1000 in schema', 'Reject requests with >1000 items'],
      bad: ['No array size limits', 'Accept unlimited arrays']
    }
  },
  {
    id: 'strings-001',
    name: 'Define String Length Limits',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'Set minLength and maxLength constraints on all string fields.',
    rationale: 'String limits prevent buffer overflows and resource exhaustion.',
    impact: 'Unlimited strings can cause database errors and memory issues.',
    source: 'OWASP Input Validation Cheat Sheet',
    sourceUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html',
    examples: {
      good: ['username: minLength=3, maxLength=50', 'description: maxLength=5000'],
      bad: ['No length limits', 'Accept any string length']
    }
  },
  {
    id: 'strings-002',
    name: 'Use Format Constraints for Structured Strings',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'Use format constraints (email, uri, uuid, date-time) for structured string values.',
    rationale: 'Format validation ensures data quality and prevents errors.',
    impact: 'Invalid formats cause downstream errors and data corruption.',
    source: 'JSON Schema Validation',
    sourceUrl: 'https://json-schema.org/understanding-json-schema/reference/string.html#format',
    examples: {
      good: ['email: format=email', 'website: format=uri', 'userId: format=uuid'],
      bad: ['No format validation', 'Accept invalid emails/URLs']
    }
  },
  {
    id: 'performance-006',
    name: 'Implement Request/Response Size Limits',
    category: 'Performance',
    severity: 'warning',
    description: 'Set maximum payload sizes for requests and responses to prevent resource exhaustion.',
    rationale: 'Size limits prevent DoS attacks and ensure predictable resource usage.',
    impact: 'Unlimited payloads can exhaust memory and bandwidth.',
    source: 'OWASP API Security Top 10',
    sourceUrl: 'https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/',
    examples: {
      good: ['Max request: 1MB', 'Max response: 10MB', '413 Payload Too Large'],
      bad: ['No size limits', 'Accept unlimited data']
    }
  },
  {
    id: 'performance-007',
    name: 'Use Database Query Optimization',
    category: 'Performance',
    severity: 'warning',
    description: 'Optimize database queries: use indexes, avoid N+1 queries, limit returned fields.',
    rationale: 'Query optimization is critical for API performance at scale.',
    impact: 'Slow queries cause timeouts and poor user experience.',
    source: 'Database Performance Best Practices',
    sourceUrl: 'https://use-the-index-luke.com/',
    examples: {
      good: ['Indexed fields', 'Eager loading', 'Field projection', 'Query optimization'],
      bad: ['Full table scans', 'N+1 queries', 'No indexes', 'Fetching unnecessary data']
    }
  },
  {
    id: 'nulls-001',
    name: 'Handle Null Values Consistently',
    category: 'Data Types & Validation',
    severity: 'warning',
    description: 'Define clear rules for null handling: omit nulls or include them consistently.',
    rationale: 'Consistent null handling prevents confusion and parsing errors.',
    impact: 'Inconsistent nulls complicate client code.',
    source: 'JSON RFC 7159',
    sourceUrl: 'https://tools.ietf.org/html/rfc7159#section-3',
    examples: {
      good: ['Always omit null fields', 'Always include with null', 'Document your choice'],
      bad: ['Sometimes null, sometimes omitted', 'Inconsistent handling']
    }
  },
  {
    id: 'objects-001',
    name: 'Use Nested Objects Appropriately',
    category: 'Data Types & Validation',
    severity: 'info',
    description: 'Group related fields in nested objects for clarity, but avoid excessive nesting (max 3-4 levels).',
    rationale: 'Proper nesting improves organization but too much makes data hard to access.',
    impact: 'Flat structures are hard to understand; deep nesting is hard to traverse.',
    source: 'Google JSON Style Guide',
    sourceUrl: 'https://google.github.io/styleguide/jsoncstyleguide.xml',
    examples: {
      good: ['{ address: { street, city, country } }', 'Logical grouping, 2-3 levels'],
      bad: ['All fields at root', 'Nested 5+ levels deep']
    }
  }
];

module.exports = { designRules };

