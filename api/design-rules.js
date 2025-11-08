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
    examples: {
      good: ['Cache-Control: max-age=3600', 'ETag: "abc123"', '304 Not Modified'],
      bad: ['No caching headers', 'Cache-Control: no-cache for everything']
    }
  }
];

module.exports = { designRules };

