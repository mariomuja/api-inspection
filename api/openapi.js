const { ApiAnalyzer } = require('./api-analyzer');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { serviceUrl } = req.body;

    if (!serviceUrl) {
      return res.status(400).json({ 
        error: 'Missing required parameter: serviceUrl' 
      });
    }

    // Try to fetch existing OpenAPI spec from common locations
    const specUrls = [
      `${serviceUrl}/openapi.json`,
      `${serviceUrl}/swagger.json`,
      `${serviceUrl}/api-docs`,
      `${serviceUrl}/v1/openapi.json`,
      `${serviceUrl}/v2/openapi.json`,
      `${serviceUrl}/v3/openapi.json`,
      `${serviceUrl}/docs/openapi.json`,
      `${serviceUrl}/api/openapi.json`
    ];

    let spec = null;

    // Try each URL
    for (const url of specUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          spec = await response.json();
          if (spec && (spec.openapi || spec.swagger)) {
            return res.status(200).json(spec);
          }
        }
      } catch (err) {
        // Continue to next URL
      }
    }

    // If no spec found, generate one from discovered endpoints using ApiAnalyzer
    const analyzer = new ApiAnalyzer(serviceUrl);
    await analyzer.discoverEndpoints();
    
    const generatedSpec = generateOpenApiSpecFromAnalyzer(serviceUrl, analyzer.endpoints);
    return res.status(200).json(generatedSpec);

  } catch (error) {
    console.error('OpenAPI fetch error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch or generate OpenAPI specification',
      message: error.message 
    });
  }
};

function generateOpenApiSpecFromAnalyzer(serviceUrl, endpoints) {
  const paths = {};

  // Convert analyzer endpoints to OpenAPI paths
  endpoints.forEach(endpoint => {
    if (!endpoint.path) return;
    
    const pathKey = endpoint.path || '/';
    paths[pathKey] = {};

    // Add all discovered methods
    const methods = endpoint.methods || ['GET'];
    const methodResponses = endpoint.methodResponses || {};
    
    methods.forEach(method => {
      const methodLower = method.toLowerCase();
      
      // Build response object
      const responses = {};
      const statusCode = methodResponses[method]?.status || endpoint.statusCode || 200;
      
      responses[statusCode.toString()] = {
        description: getResponseDescription(methodLower, statusCode),
        content: endpoint.responseData ? {
          'application/json': {
            schema: {
              type: Array.isArray(endpoint.responseData) ? 'array' : 'object',
              example: Array.isArray(endpoint.responseData) 
                ? endpoint.responseData.slice(0, 2) 
                : endpoint.responseData
            }
          }
        } : undefined
      };

      // Add common error responses
      if (methodLower === 'post' || methodLower === 'put' || methodLower === 'patch') {
        responses['400'] = { description: 'Bad Request - Invalid input' };
        responses['404'] = { description: 'Not Found - Resource does not exist' };
      }
      if (methodLower === 'delete') {
        responses['404'] = { description: 'Not Found - Resource does not exist' };
      }

      paths[pathKey][methodLower] = {
        summary: generateSummary(methodLower, pathKey),
        description: generateDescription(methodLower, pathKey),
        operationId: `${methodLower}${pathKey.replace(/\//g, '_')}`,
        tags: [pathKey.split('/')[1] || 'default'],
        responses: responses,
        parameters: generateParameters(pathKey, endpoint.responseData)
      };
    });
  });

  // Ensure we have at least one endpoint
  if (Object.keys(paths).length === 0) {
    paths['/'] = {
      get: {
        summary: 'Root endpoint',
        description: 'No endpoints were discovered. The API may require authentication or use non-standard paths.',
        responses: {
          '200': { description: 'Successful response' }
        },
        tags: ['default']
      }
    };
  }

  const serviceName = extractServiceName(serviceUrl);
  const allTags = [...new Set(
    Object.values(paths)
      .flatMap(p => Object.values(p))
      .flatMap(m => m.tags || [])
  )];

  return {
    openapi: '3.0.0',
    info: {
      title: `${serviceName} API`,
      version: '1.0.0',
      description: `Auto-generated OpenAPI specification for ${serviceName}. Generated by API Design Inspector based on actual endpoint discovery and testing.`,
      contact: {
        name: 'API Design Inspector',
        url: 'https://github.com/mariomuja/api-inspection'
      }
    },
    servers: [
      {
        url: serviceUrl,
        description: 'API Server'
      }
    ],
    paths: paths,
    components: {
      schemas: {}
    },
    tags: allTags.map(tag => ({ 
      name: tag, 
      description: `${tag} operations` 
    }))
  };
}

function generateSummary(method, path) {
  const resource = path.replace(/^\//, '') || 'root';
  switch (method) {
    case 'get': return `Get ${resource}`;
    case 'post': return `Create ${resource}`;
    case 'put': return `Update ${resource}`;
    case 'patch': return `Partially update ${resource}`;
    case 'delete': return `Delete ${resource}`;
    case 'options': return `Get options for ${resource}`;
    default: return `${method.toUpperCase()} ${resource}`;
  }
}

function generateDescription(method, path) {
  const resource = path.replace(/^\//, '') || 'root endpoint';
  switch (method) {
    case 'get': return `Retrieve data from ${path}`;
    case 'post': return `Create a new resource at ${path}`;
    case 'put': return `Replace resource at ${path}`;
    case 'patch': return `Partially update resource at ${path}`;
    case 'delete': return `Remove resource at ${path}`;
    case 'options': return `Get communication options for ${path}`;
    default: return `Perform ${method.toUpperCase()} operation on ${path}`;
  }
}

function getResponseDescription(method, statusCode) {
  if (statusCode >= 200 && statusCode < 300) {
    switch (method) {
      case 'post': return statusCode === 201 ? 'Resource created successfully' : 'Successful response';
      case 'put': return 'Resource updated successfully';
      case 'patch': return 'Resource partially updated successfully';
      case 'delete': return statusCode === 204 ? 'Resource deleted successfully (No Content)' : 'Resource deleted';
      default: return 'Successful response';
    }
  }
  if (statusCode >= 400 && statusCode < 500) {
    return 'Client error';
  }
  if (statusCode >= 500) {
    return 'Server error';
  }
  return 'Response';
}

function generateParameters(path, responseData) {
  const params = [];
  
  // Add path parameters (e.g., /users/{id})
  const pathParams = path.match(/\{([^}]+)\}/g);
  if (pathParams) {
    pathParams.forEach(param => {
      const paramName = param.replace(/[{}]/g, '');
      params.push({
        name: paramName,
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: `The ${paramName} identifier`
      });
    });
  }

  // Infer query parameters from response data if it's an array
  if (Array.isArray(responseData) && responseData.length > 0) {
    params.push({
      name: 'limit',
      in: 'query',
      required: false,
      schema: { type: 'integer', default: 10 },
      description: 'Maximum number of items to return'
    });
    params.push({
      name: 'offset',
      in: 'query',
      required: false,
      schema: { type: 'integer', default: 0 },
      description: 'Number of items to skip'
    });
  }

  return params.length > 0 ? params : undefined;
}

function extractServiceName(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^(www\.|api\.)/, '').split('.')[0];
  } catch {
    return 'Unknown Service';
  }
}

