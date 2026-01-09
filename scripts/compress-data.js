const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Compress JSON data files to reduce package size
 */
function compressDataFiles() {
  const dataDir = path.join(__dirname, '../data');
  
  console.log('=== Compressing Data Files ===\n');
  
  const filesToCompress = ['by-level.json', 'by-psgc.json'];
  
  filesToCompress.forEach(filename => {
    const filePath = path.join(dataDir, filename);
    const compressedPath = filePath + '.gz';
    
    console.log(`Compressing ${filename}...`);
    
    // Read JSON file
    const data = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(data, 'utf8');
    
    // Compress using gzip
    const compressed = zlib.gzipSync(data);
    fs.writeFileSync(compressedPath, compressed);
    
    const compressedSize = compressed.length;
    const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Savings: ${savings}%\n`);
  });
  
  console.log('✅ Compression complete!');
  console.log('\nNote: The .json.gz files will be used instead of .json files.');
  console.log('Original .json files are kept for development but excluded from npm package.');
}

compressDataFiles();

