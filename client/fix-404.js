const fs = require('fs');
const path = require('path');

const html404Content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>BeyondGPA - Redirecting...</title>
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    // This script takes the current url and converts the path and query
    // string into just a query string, and then redirects the browser
    // to the new url with just a query string and hash fragment,
    // e.g., https://www.foo.tld/one/two?a=b&c=d#qwe, becomes
    // https://www.foo.tld/?/one/two&a=b~and~c=d#qwe
    // Note: this 404.html file must be at least 512 bytes for it to work
    // with Internet Explorer (it is currently > 512 bytes)

    // If you're creating a Project Pages site and NOT using a custom domain,
    // then set pathSegmentsToKeep to 1 (enterprise users may need to set it to > 1).
    // This way the code will only replace the route part and not the real folder.
    // For example, if your GitHub Pages URL is https://username.github.io/repo-name,
    // and you want to redirect https://username.github.io/repo-name/one/two to
    // https://username.github.io/repo-name/?/one/two then use pathSegmentsToKeep = 1;
    // For a User Pages site (where the GitHub Pages URL is https://username.github.io),
    // set pathSegmentsToKeep to 0
    var pathSegmentsToKeep = 0;

    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
  <p>Redirecting to BeyondGPA... If you are not redirected automatically, <a href="https://beyondgpa.github.io/">click here</a>.</p>
  <!-- This padding is needed to ensure the file is at least 512 bytes for Internet Explorer -->
  <!-- padding padding padding padding padding padding padding padding padding padding -->
  <!-- padding padding padding padding padding padding padding padding padding padding -->
  <!-- padding padding padding padding padding padding padding padding padding padding -->
  <!-- padding padding padding padding padding padding padding padding padding padding -->
  <!-- padding padding padding padding padding padding padding padding padding padding -->
</body>
</html>`;

const homeHtmlContent = `<!doctype html>
<html lang="en" data-critters-container>
<head>
  <meta charset="utf-8">
  <meta name="google-site-verification" content="FY4TkChu-98nOGul6TmnxwfZ8nikPrTVYWEJ-yWNu94">

  <!-- Primary SEO Meta Tags -->
  <title>Data Visualizations - BeyondGPA | Interactive Education Analytics</title>
  <meta name="title" content="Data Visualizations - BeyondGPA | Interactive Education Analytics">
  <meta name="description" content="Explore interactive data visualizations showing the relationship between GPA, career success, internships, and professional growth. Discover insights through advanced analytics and D3.js visualizations.">
  <meta name="keywords" content="data visualization, education analytics, career success metrics, GPA analysis, D3.js charts, interactive visualizations, student success data, career development insights">
  <meta name="author" content="BeyondGPA Team">
  <meta name="robots" content="index, follow">
  
  <!-- Technical Meta Tags -->
  <base href="https://beyondgpa.github.io/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="https://beyondgpa.github.io/home">
  
  <!-- Favicon and Icons -->
  <link rel="icon" type="image/x-icon" href="../assets/beyondGPA.png">
  <link rel="shortcut icon" href="../assets/beyondGPA.png">
  <link rel="apple-touch-icon" href="../assets/beyondGPA.png">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://beyondgpa.github.io/home">
  <meta property="og:title" content="Data Visualizations - BeyondGPA">
  <meta property="og:description" content="Explore interactive data visualizations showing the relationship between GPA, career success, internships, and professional growth.">
  <meta property="og:image" content="https://beyondgpa.github.io/assets/beyondGPA.png">
  <meta property="og:site_name" content="BeyondGPA">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://beyondgpa.github.io/home">
  <meta property="twitter:title" content="Data Visualizations - BeyondGPA">
  <meta property="twitter:description" content="Explore interactive data visualizations showing the relationship between GPA, career success, internships, and professional growth.">
  <meta property="twitter:image" content="https://beyondgpa.github.io/assets/beyondGPA.png">
  
  <!-- Additional SEO Meta Tags -->
  <meta name="theme-color" content="#191034">
  <meta name="msapplication-TileColor" content="#191034">
  <meta name="application-name" content="BeyondGPA">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Data Visualizations - BeyondGPA",
    "url": "https://beyondgpa.github.io/home",
    "description": "Explore interactive data visualizations showing the relationship between GPA, career success, internships, and professional growth. Discover insights through advanced analytics and D3.js visualizations.",
    "isPartOf": {
      "@type": "WebSite",
      "name": "BeyondGPA",
      "url": "https://beyondgpa.github.io/"
    },
    "author": {
      "@type": "Organization",
      "name": "BeyondGPA Team"
    },
    "mainEntity": {
      "@type": "DataVisualization",
      "name": "Education Career Success Analytics",
      "description": "Interactive charts and graphs analyzing the relationship between education metrics and career outcomes"
    }
  }
  </script>
  
  <!-- Auto-redirect to correct Angular route -->
  <script type="text/javascript">
    // Immediately redirect to the Angular app with the correct route
    if (window.location.pathname === '/home' || window.location.pathname === '/home/') {
      window.history.replaceState(null, null, '/home');
    }
  </script>
<style>*{margin:0;padding:0;box-sizing:border-box;-webkit-user-select:none;user-select:none}*:focus{outline:none;box-shadow:none}:root{transition:all .3s ease-in-out}:root{--primary-color:#191034;--secondary-color:#424597;--tertiary-color:#1c1656;--quaternary-color:#393c7d;--background-color:#2c177283;--viz-background-color:#0000006f;--viz-section-color:#ffffff0d;--text-color:#cbcbcb;--highlight-color:#e94560;--footer-text:#888}html,app-root,body{width:-webkit-fill-available;margin:0;padding:0}body{font-family:Lucida Console,Monaco,monospace;background-color:var(--primary-color);background-image:linear-gradient(135deg,var(--primary-color),var(--secondary-color),var(--tertiary-color),var(--quaternary-color));background-size:300% 300%;background-repeat:no-repeat;animation:gradientAnimation 12s ease infinite;color:var(--text-color)}body::-webkit-scrollbar{display:none}@keyframes gradientAnimation{0%{background-position:0% 50%}50%{background-position:100% 50%}to{background-position:0% 50%}}:root{--landing-background-color:#212121;--landing-gradient-start:#691ba4;--landing-gradient-mid1:#fe53bb;--landing-gradient-mid2:#8f51ea;--landing-gradient-end:#0044ff;--landing-text-color:#cbcbcb;--landing-highlight-color:#e94560;--btn-hover-bg-color:#212121;--btn-active-border-color:#fe53bb;--circle-color-1:rgba(254, 83, 186, .636);--circle-color-2:rgba(142, 81, 234, .704);--stars-color:#ffffff;--button-hover-bg-color:#ffffff4e;--button-shadow-color:rgba(0, 0, 0, .1)}</style><link rel="stylesheet" href="../styles.42fdffe4c7aa9151.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="../styles.42fdffe4c7aa9151.css"></noscript></head>
<body>
  <app-root></app-root>
<script src="../runtime.1e70f244cc06fa31.js" type="module"></script><script src="../polyfills.21e794c06d92d81e.js" type="module"></script><script src="../main.fdbffeae64954ba7.js" type="module"></script></body>
</html>`;

const aboutHtmlContent = `<!doctype html>
<html lang="en" data-critters-container>
<head>
  <meta charset="utf-8">
  <meta name="google-site-verification" content="FY4TkChu-98nOGul6TmnxwfZ8nikPrTVYWEJ-yWNu94">

  <!-- Primary SEO Meta Tags -->
  <title>About BeyondGPA - Education Analytics Team | Data Visualization Project</title>
  <meta name="title" content="About BeyondGPA - Education Analytics Team | Data Visualization Project">
  <meta name="description" content="Learn about the BeyondGPA team and our mission to explore the relationship between education and career success through innovative data visualization and analytics.">
  <meta name="keywords" content="BeyondGPA team, education research, data visualization team, academic analytics, career success research, student success metrics, about us">
  <meta name="author" content="BeyondGPA Team">
  <meta name="robots" content="index, follow">
  
  <!-- Technical Meta Tags -->
  <base href="https://beyondgpa.github.io/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="https://beyondgpa.github.io/about">
  
  <!-- Favicon and Icons -->
  <link rel="icon" type="image/x-icon" href="../assets/beyondGPA.png">
  <link rel="shortcut icon" href="../assets/beyondGPA.png">
  <link rel="apple-touch-icon" href="../assets/beyondGPA.png">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://beyondgpa.github.io/about">
  <meta property="og:title" content="About BeyondGPA - Education Analytics Team">
  <meta property="og:description" content="Learn about the BeyondGPA team and our mission to explore the relationship between education and career success through innovative data visualization and analytics.">
  <meta property="og:image" content="https://beyondgpa.github.io/assets/beyondGPA.png">
  <meta property="og:site_name" content="BeyondGPA">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://beyondgpa.github.io/about">
  <meta property="twitter:title" content="About BeyondGPA - Education Analytics Team">
  <meta property="twitter:description" content="Learn about the BeyondGPA team and our mission to explore the relationship between education and career success through innovative data visualization and analytics.">
  <meta property="twitter:image" content="https://beyondgpa.github.io/assets/beyondGPA.png">
  
  <!-- Additional SEO Meta Tags -->
  <meta name="theme-color" content="#191034">
  <meta name="msapplication-TileColor" content="#191034">
  <meta name="application-name" content="BeyondGPA">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About BeyondGPA",
    "url": "https://beyondgpa.github.io/about",
    "description": "Learn about the BeyondGPA team and our mission to explore the relationship between education and career success through innovative data visualization and analytics.",
    "isPartOf": {
      "@type": "WebSite",
      "name": "BeyondGPA",
      "url": "https://beyondgpa.github.io/"
    },
    "author": {
      "@type": "Organization",
      "name": "BeyondGPA Team"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "BeyondGPA Team",
      "description": "Team of data scientists and researchers focused on education analytics"
    }
  }
  </script>
  
  <!-- Auto-redirect to correct Angular route -->
  <script type="text/javascript">
    // Immediately redirect to the Angular app with the correct route
    if (window.location.pathname === '/about' || window.location.pathname === '/about/') {
      window.history.replaceState(null, null, '/about');
    }
  </script>
<style>*{margin:0;padding:0;box-sizing:border-box;-webkit-user-select:none;user-select:none}*:focus{outline:none;box-shadow:none}:root{transition:all .3s ease-in-out}:root{--primary-color:#191034;--secondary-color:#424597;--tertiary-color:#1c1656;--quaternary-color:#393c7d;--background-color:#2c177283;--viz-background-color:#0000006f;--viz-section-color:#ffffff0d;--text-color:#cbcbcb;--highlight-color:#e94560;--footer-text:#888}html,app-root,body{width:-webkit-fill-available;margin:0;padding:0}body{font-family:Lucida Console,Monaco,monospace;background-color:var(--primary-color);background-image:linear-gradient(135deg,var(--primary-color),var(--secondary-color),var(--tertiary-color),var(--quaternary-color));background-size:300% 300%;background-repeat:no-repeat;animation:gradientAnimation 12s ease infinite;color:var(--text-color)}body::-webkit-scrollbar{display:none}@keyframes gradientAnimation{0%{background-position:0% 50%}50%{background-position:100% 50%}to{background-position:0% 50%}}:root{--landing-background-color:#212121;--landing-gradient-start:#691ba4;--landing-gradient-mid1:#fe53bb;--landing-gradient-mid2:#8f51ea;--landing-gradient-end:#0044ff;--landing-text-color:#cbcbcb;--landing-highlight-color:#e94560;--btn-hover-bg-color:#212121;--btn-active-border-color:#fe53bb;--circle-color-1:rgba(254, 83, 186, .636);--circle-color-2:rgba(142, 81, 234, .704);--stars-color:#ffffff;--button-hover-bg-color:#ffffff4e;--button-shadow-color:rgba(0, 0, 0, .1)}</style><link rel="stylesheet" href="../styles.42fdffe4c7aa9151.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="../styles.42fdffe4c7aa9151.css"></noscript></head>
<body>
  <app-root></app-root>
<script src="../runtime.1e70f244cc06fa31.js" type="module"></script><script src="../polyfills.21e794c06d92d81e.js" type="module"></script><script src="../main.fdbffeae64954ba7.js" type="module"></script></body>
</html>`;

const distPath = path.join(__dirname, 'dist', 'client');
const html404Path = path.join(distPath, '404.html');
const homeDir = path.join(distPath, 'home');
const aboutDir = path.join(distPath, 'about');
const homeIndexPath = path.join(homeDir, 'index.html');
const aboutIndexPath = path.join(aboutDir, 'index.html');

try {
  // Create 404.html
  fs.writeFileSync(html404Path, html404Content);
  console.log('✅ 404.html file has been fixed for SPA routing on GitHub Pages');

  // Create directories if they don't exist
  if (!fs.existsSync(homeDir)) {
    fs.mkdirSync(homeDir, { recursive: true });
  }
  if (!fs.existsSync(aboutDir)) {
    fs.mkdirSync(aboutDir, { recursive: true });
  }

  // Create static route files
  fs.writeFileSync(homeIndexPath, homeHtmlContent);
  console.log('✅ /home/index.html created for direct Google indexing');

  fs.writeFileSync(aboutIndexPath, aboutHtmlContent);
  console.log('✅ /about/index.html created for direct Google indexing');

} catch (error) {
  console.error('❌ Error fixing files:', error);
  process.exit(1);
}
