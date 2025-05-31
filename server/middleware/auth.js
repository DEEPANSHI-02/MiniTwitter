// Simple authentication simulation middleware (as mentioned in bonus requirements)

const simulateAuth = (req, res, next) => {
  // Simulate user authentication
  req.user = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    name: 'Demo User',
    email: 'demo@example.com',
    isAuthenticated: true
  };
  
  // Optional: Log the simulated user for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔐 Simulated Auth - User: ${req.user.name} (${req.user.id})`);
  }
  
  next();
};

// Middleware to check if user is authenticated (for future use)
const requireAuth = (req, res, next) => {
  if (!req.user?.isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required 🔒'
    });
  }
  next();
};

// Middleware to log requests (optional utility)
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`📝 [${timestamp}] ${method} ${url} - ${userAgent}`);
  next();
};

// Rate limiting simulation (basic implementation)
const rateLimiter = (() => {
  const requests = new Map();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_REQUESTS = 100; // Max requests per window

  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (!requests.has(clientId)) {
      requests.set(clientId, { count: 1, resetTime: now + WINDOW_MS });
      return next();
    }
    
    const clientData = requests.get(clientId);
    
    if (now > clientData.resetTime) {
      // Reset the window
      clientData.count = 1;
      clientData.resetTime = now + WINDOW_MS;
      return next();
    }
    
    if (clientData.count >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later. ⏰',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
})();

module.exports = {
  simulateAuth,
  requireAuth,
  logRequest,
  rateLimiter
};