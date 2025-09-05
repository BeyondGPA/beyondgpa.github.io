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

const distPath = path.join(__dirname, 'dist', 'client', '404.html');

try {
  fs.writeFileSync(distPath, html404Content);
  console.log('✅ 404.html file has been fixed for SPA routing on GitHub Pages');
} catch (error) {
  console.error('❌ Error fixing 404.html:', error);
  process.exit(1);
}
