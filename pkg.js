const fs = require('fs');

// Step 1: Read the package-lock.json file
fs.readFile('package-lock.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading package-lock.json:', err);
    return;
  }

  // Step 2: Parse the JSON content
  const packageLock = JSON.parse(data);

  // Step 3: Extract necessary fields to create package.json
  const packageJson = {
    name: packageLock.name || '',
    version: packageLock.version || '',
    description: packageLock.description || '',
    main: packageLock.main || 'index.js',
    scripts: packageLock.scripts || {},
    repository: packageLock.repository || {},
    keywords: packageLock.keywords || [],
    author: packageLock.author || '',
    license: packageLock.license || 'ISC',
    dependencies: packageLock.dependencies || {}
  };

  // Step 4: Write the new package.json file
  fs.writeFile('package.json', JSON.stringify(packageJson, null, 2), (err) => {
    if (err) {
      console.error('Error writing package.json:', err);
      return;
    }
    console.log('package.json has been generated successfully.');
  });
});