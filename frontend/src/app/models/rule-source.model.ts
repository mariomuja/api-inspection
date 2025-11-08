export interface RuleSource {
  id: string;
  name: string;
  organization: string;
  description: string;
  url: string;
  ruleIds: string[];
}

export const RULE_SOURCES: RuleSource[] = [
  {
    id: 'all',
    name: 'All Sources (Comprehensive)',
    organization: 'Mixed',
    description: 'Validate against all available design guidelines from all sources for a complete analysis.',
    url: '',
    ruleIds: [] // Empty means all rules
  },
  {
    id: 'google',
    name: 'Google Cloud API Design Guide',
    organization: 'Google',
    description: 'Industry-leading REST API design principles from Google Cloud Platform.',
    url: 'https://cloud.google.com/apis/design',
    ruleIds: ['rest-001', 'rest-004', 'error-001', 'naming-001']
  },
  {
    id: 'microsoft',
    name: 'Microsoft REST API Guidelines',
    organization: 'Microsoft',
    description: 'Comprehensive REST API guidelines from Microsoft Azure team.',
    url: 'https://github.com/microsoft/api-guidelines',
    ruleIds: ['rest-002', 'pagination-001']
  },
  {
    id: 'owasp',
    name: 'OWASP API Security Top 10',
    organization: 'OWASP Foundation',
    description: 'Critical security risks and best practices for API security.',
    url: 'https://owasp.org/www-project-api-security/',
    ruleIds: ['security-001', 'security-002', 'security-003']
  },
  {
    id: 'ietf',
    name: 'IETF HTTP/1.1 Standards (RFC)',
    organization: 'Internet Engineering Task Force',
    description: 'Official HTTP protocol specifications and standards.',
    url: 'https://tools.ietf.org/html/rfc7231',
    ruleIds: ['http-001', 'http-003', 'idempotency-001', 'performance-002']
  },
  {
    id: 'jsonapi',
    name: 'JSON:API Specification',
    organization: 'JSON:API Community',
    description: 'Specification for building APIs in JSON with consistency and efficiency.',
    url: 'https://jsonapi.org/',
    ruleIds: ['filtering-001', 'sorting-001', 'response-001', 'performance-001']
  },
  {
    id: 'openapi',
    name: 'OpenAPI Initiative',
    organization: 'Linux Foundation',
    description: 'Standard for describing and documenting REST APIs.',
    url: 'https://www.openapis.org/',
    ruleIds: ['doc-001', 'doc-002']
  },
  {
    id: 'w3c',
    name: 'W3C CORS Specification',
    organization: 'World Wide Web Consortium',
    description: 'Cross-Origin Resource Sharing standard for web APIs.',
    url: 'https://www.w3.org/TR/cors/',
    ruleIds: ['http-002']
  },
  {
    id: 'stripe',
    name: 'Stripe API Best Practices',
    organization: 'Stripe',
    description: 'Battle-tested API design patterns from the payment industry leader.',
    url: 'https://stripe.com/docs/api',
    ruleIds: ['version-001']
  },
  {
    id: 'paypal',
    name: 'PayPal API Style Guide',
    organization: 'PayPal',
    description: 'RESTful API design standards from PayPal engineering team.',
    url: 'https://github.com/paypal/api-standards',
    ruleIds: ['rest-005']
  },
  {
    id: 'github',
    name: 'GitHub REST API Best Practices',
    organization: 'GitHub',
    description: 'Proven REST API patterns from one of the most-used developer platforms.',
    url: 'https://docs.github.com/en/rest',
    ruleIds: ['pagination-002']
  },
  {
    id: 'aws',
    name: 'AWS API Best Practices',
    organization: 'Amazon Web Services',
    description: 'Cloud API design principles from the world\'s leading cloud platform.',
    url: 'https://docs.aws.amazon.com/apigateway/',
    ruleIds: ['response-002']
  },
  {
    id: 'atlassian',
    name: 'Atlassian REST API Guidelines',
    organization: 'Atlassian',
    description: 'REST API design standards from the makers of Jira and Confluence.',
    url: 'https://developer.atlassian.com/server/framework/atlassian-sdk/rest-api-design-guidelines/',
    ruleIds: ['error-002']
  }
];

