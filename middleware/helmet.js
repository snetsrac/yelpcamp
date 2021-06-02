const helmet = require('helmet');

module.exports = helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'connect-src': [
        "https://api.mapbox.com",
        "https://events.mapbox.com"
      ],
      'img-src': [
        "'self'",
        "data:",
        "https://res.cloudinary.com/da8gaqzfc/",
        "https://source.unsplash.com",
        "https://images.unsplash.com"
      ],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "blob:",
        "https://cdn.jsdelivr.net",
        "https://api.mapbox.com"
      ]
    }
  }
})
