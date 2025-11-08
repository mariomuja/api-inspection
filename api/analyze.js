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

    // Validate URL
    try {
      new URL(serviceUrl);
    } catch (err) {
      return res.status(400).json({ 
        error: 'Invalid URL format' 
      });
    }

    // Analyze the API
    const analyzer = new ApiAnalyzer(serviceUrl);
    const result = await analyzer.analyze();

    // Return the analysis result
    return res.status(200).json(result);

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

