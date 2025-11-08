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

    // If no spec found, generate one from discovered endpoints
    const generatedSpec = await generateOpenApiSpec(serviceUrl);
    return res.status(200).json(generatedSpec);

  } catch (error) {
    console.error('OpenAPI fetch error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch or generate OpenAPI specification',
      message: error.message 
    });
  }
};

async function generateOpenApiSpec(serviceUrl) {
  const commonPaths = ['', '/users', '/posts', '/comments', '/todos', '/products', '/items', '/data', '/api'];
  const paths = {};

  for (const path of commonPaths) {
    try {
      const url = `${serviceUrl}${path}`;
      const response = await fetch(url, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          let data;
          try {
            data = await response.json();
          } catch {
            continue;
          }

          const pathKey = path || '/';
          paths[pathKey] = {
            get: {
              summary: `Get ${pathKey.replace(/^\//, '') || 'root'}`,
              description: `Retrieve data from ${pathKey}`,
              responses: {
                '200': {
                  description: 'Successful response',
                  content: {
                    'application/json': {
                      schema: {
                        type: Array.isArray(data) ? 'array' : 'object',
                        example: Array.isArray(data) ? data.slice(0, 1) : data
                      }
                    }
                  }
                }
              },
              tags: [pathKey.split('/')[1] || 'default']
            }
          };

          // Check for common methods
          try {
            const headResponse = await fetch(url, { method: 'HEAD' });
            const allow = headResponse.headers.get('allow');
            if (allow) {
              const methods = allow.split(',').map(m => m.trim().toLowerCase());
              
              if (methods.includes('post')) {
                paths[pathKey].post = {
                  summary: `Create ${pathKey.replace(/^\//, '')}`,
                  description: `Create a new resource at ${pathKey}`,
                  responses: {
                    '201': { description: 'Created' },
                    '400': { description: 'Bad Request' }
                  }
                };
              }

              if (methods.includes('put')) {
                paths[pathKey].put = {
                  summary: `Update ${pathKey.replace(/^\//, '')}`,
                  description: `Update resource at ${pathKey}`,
                  responses: {
                    '200': { description: 'Updated' },
                    '404': { description: 'Not Found' }
                  }
                };
              }

              if (methods.includes('delete')) {
                paths[pathKey].delete = {
                  summary: `Delete ${pathKey.replace(/^\//, '')}`,
                  description: `Delete resource at ${pathKey}`,
                  responses: {
                    '204': { description: 'No Content' },
                    '404': { description: 'Not Found' }
                  }
                };
              }

              if (methods.includes('patch')) {
                paths[pathKey].patch = {
                  summary: `Partially update ${pathKey.replace(/^\//, '')}`,
                  description: `Partially update resource at ${pathKey}`,
                  responses: {
                    '200': { description: 'Updated' },
                    '404': { description: 'Not Found' }
                  }
                };
              }
            }
          } catch {
            // HEAD request failed, that's okay
          }
        }
      }
    } catch (err) {
      // Endpoint doesn't exist, continue
    }
  }

  const serviceName = extractServiceName(serviceUrl);

  return {
    openapi: '3.0.0',
    info: {
      title: `${serviceName} API`,
      version: '1.0.0',
      description: `Auto-generated OpenAPI specification for ${serviceName} based on discovered endpoints. This specification was created by the API Design Inspector tool.`,
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
    paths: Object.keys(paths).length > 0 ? paths : {
      '/': {
        get: {
          summary: 'Root endpoint',
          description: 'No endpoints were discovered. The API may require authentication or use non-standard paths.',
          responses: {
            '200': { description: 'Successful response' }
          }
        }
      }
    },
    components: {
      schemas: {}
    },
    tags: [...new Set(Object.values(paths).flatMap(p => 
      Object.values(p).map(m => m.tags).flat()
    ))].map(tag => ({ name: tag, description: `${tag} operations` }))
  };
}

function extractServiceName(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^(www\.|api\.)/, '').split('.')[0];
  } catch {
    return 'Unknown Service';
  }
}

