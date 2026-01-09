const fs = require('fs');
const path = require('path');

/**
 * Remove null fields from objects to reduce JSON size
 */
function removeNulls(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeNulls);
  } else if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null) {
        result[key] = removeNulls(value);
      }
    }
    return result;
  }
  return obj;
}

/**
 * Optimize JSON files by removing null fields
 */
function optimizeDataFiles() {
  const dataDir = path.join(__dirname, '../data');
  
  console.log('=== Optimizing Data Files ===\n');
  
  // Files to optimize (only the ones we actually use)
  const filesToOptimize = ['by-level.json', 'by-psgc.json'];
  
  filesToOptimize.forEach(filename => {
    const filePath = path.join(dataDir, filename);
    console.log(`Processing ${filename}...`);
    
    // Read original file
    const original = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Remove null fields
    const optimized = removeNulls(original);
    
    // Write optimized file (minified JSON)
    const optimizedJson = JSON.stringify(optimized);
    fs.writeFileSync(filePath, optimizedJson, 'utf8');
    
    // Calculate savings
    const originalSize = fs.statSync(filePath).size;
    const originalJsonSize = JSON.stringify(original).length;
    const savings = ((1 - optimizedJson.length / originalJsonSize) * 100).toFixed(1);
    
    console.log(`  Original: ${(originalJsonSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Optimized: ${(optimizedJson.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Savings: ${savings}%\n`);
  });
  
  console.log('✅ Optimization complete!');
  console.log('\nNote: addresses.json and hierarchy.json are not used and can be deleted.');
}

optimizeDataFiles();

