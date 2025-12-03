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

const distPath = path.join(__dirname, 'dist', 'client');
const html404Path = path.join(distPath, '404.html');
const homeDir = path.join(distPath, 'home');
const aboutDir = path.join(distPath, 'about');
const homeIndexPath = path.join(homeDir, 'index.html');
const aboutIndexPath = path.join(aboutDir, 'index.html');
const indexHtmlPath = path.join(distPath, 'index.html');

// Helper function to replace meta tags
function replaceMeta(html, key, value, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  const regex = new RegExp(`<meta ${attr}="${key}" content="[^"]*">`, 'g');
  const replacement = `<meta ${attr}="${key}" content="${value}">`;
  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }
  // If not found, insert it before </head> (simplified)
  return html.replace('</head>', `  ${replacement}\n</head>`);
}

function replaceTitle(html, newTitle) {
  return html.replace(/<title>.*<\/title>/, `<title>${newTitle}</title>`);
}

function replaceCanonical(html, url) {
    const regex = /<link rel="canonical" href="[^"]*">/;
    const replacement = `<link rel="canonical" href="${url}">`;
    if (regex.test(html)) {
        return html.replace(regex, replacement);
    }
    return html.replace('</head>', `  ${replacement}\n</head>`);
}


try {
  // 1. Create 404.html
  fs.writeFileSync(html404Path, html404Content);
  console.log('✅ 404.html file has been fixed for SPA routing on GitHub Pages');

  // Check if index.html exists
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error('dist/client/index.html not found. Make sure to run the build first.');
  }

  let baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // 2. Prepare Base HTML for subdirectories
  // Update asset paths to be relative (prepend ../)
  // We target src="..." and href="..." that do not start with http, //, or data:
  baseHtml = baseHtml.replace(/(src|href)="((?!http|\/\/|data:)[^"]+)"/g, '$1="../$2"');
  
  // Update base href
  baseHtml = baseHtml.replace('<base href="/">', '<base href="https://beyondgpa.github.io/">');

  // 3. Generate Home Page
  if (!fs.existsSync(homeDir)) {
    fs.mkdirSync(homeDir, { recursive: true });
  }
  
  let homeHtml = baseHtml;
  // Customize Home SEO (Already mostly in index.html, but ensuring it's correct)
  homeHtml = replaceTitle(homeHtml, 'Data Visualizations - BeyondGPA | Interactive Education Analytics');
  homeHtml = replaceMeta(homeHtml, 'title', 'Data Visualizations - BeyondGPA | Interactive Education Analytics');
  homeHtml = replaceMeta(homeHtml, 'description', 'Explore interactive data visualizations showing the relationship between GPA, career success, internships, and professional growth. Discover insights through advanced analytics and D3.js visualizations.');
  homeHtml = replaceMeta(homeHtml, 'keywords', 'data visualization, education analytics, career success metrics, GPA analysis, D3.js charts, interactive visualizations, student success data, career development insights');
  homeHtml = replaceCanonical(homeHtml, 'https://beyondgpa.github.io/home');
  homeHtml = replaceMeta(homeHtml, 'og:url', 'https://beyondgpa.github.io/home', true);
  homeHtml = replaceMeta(homeHtml, 'og:title', 'Data Visualizations - BeyondGPA', true);
  homeHtml = replaceMeta(homeHtml, 'og:description', 'Explore interactive data visualizations showing the relationship between GPA, career success, internships, and professional growth.', true);
  homeHtml = replaceMeta(homeHtml, 'twitter:url', 'https://beyondgpa.github.io/home', true);
  homeHtml = replaceMeta(homeHtml, 'twitter:title', 'Data Visualizations - BeyondGPA', true);
  homeHtml = replaceMeta(homeHtml, 'twitter:description', 'Explore interactive data visualizations showing the relationship between GPA, career success, internships, and professional growth.', true);

  // Add redirect script for Home
  const homeRedirectScript = `
  <script type="text/javascript">
    if (window.location.pathname === '/home' || window.location.pathname === '/home/') {
      window.history.replaceState(null, null, '/home');
    }
  </script>`;
  homeHtml = homeHtml.replace('</head>', `${homeRedirectScript}\n</head>`);

  fs.writeFileSync(homeIndexPath, homeHtml);
  console.log('✅ /home/index.html created from build artifacts');


  // 4. Generate About Page
  if (!fs.existsSync(aboutDir)) {
    fs.mkdirSync(aboutDir, { recursive: true });
  }

  let aboutHtml = baseHtml;
  // Customize About SEO
  aboutHtml = replaceTitle(aboutHtml, 'About BeyondGPA - Education Analytics Team | Data Visualization Project');
  aboutHtml = replaceMeta(aboutHtml, 'title', 'About BeyondGPA - Education Analytics Team | Data Visualization Project');
  aboutHtml = replaceMeta(aboutHtml, 'description', 'Learn about the BeyondGPA team and our mission to explore the relationship between education and career success through innovative data visualization and analytics.');
  aboutHtml = replaceMeta(aboutHtml, 'keywords', 'BeyondGPA team, education research, data visualization team, academic analytics, career success research, student success metrics, about us');
  aboutHtml = replaceCanonical(aboutHtml, 'https://beyondgpa.github.io/about');
  aboutHtml = replaceMeta(aboutHtml, 'og:url', 'https://beyondgpa.github.io/about', true);
  aboutHtml = replaceMeta(aboutHtml, 'og:title', 'About BeyondGPA - Education Analytics Team', true);
  aboutHtml = replaceMeta(aboutHtml, 'og:description', 'Learn about the BeyondGPA team and our mission to explore the relationship between education and career success through innovative data visualization and analytics.', true);
  aboutHtml = replaceMeta(aboutHtml, 'twitter:url', 'https://beyondgpa.github.io/about', true);
  aboutHtml = replaceMeta(aboutHtml, 'twitter:title', 'About BeyondGPA - Education Analytics Team', true);
  aboutHtml = replaceMeta(aboutHtml, 'twitter:description', 'Learn about the BeyondGPA team and our mission to explore the relationship between education and career success through innovative data visualization and analytics.', true);

  // Add redirect script for About
  const aboutRedirectScript = `
  <script type="text/javascript">
    if (window.location.pathname === '/about' || window.location.pathname === '/about/') {
      window.history.replaceState(null, null, '/about');
    }
  </script>`;
  aboutHtml = aboutHtml.replace('</head>', `${aboutRedirectScript}\n</head>`);

  fs.writeFileSync(aboutIndexPath, aboutHtml);
  console.log('✅ /about/index.html created from build artifacts');

} catch (error) {
  console.error('❌ Error fixing files:', error);
  process.exit(1);
}
