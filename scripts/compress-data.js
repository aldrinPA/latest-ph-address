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
    
    // Skip if uncompressed file doesn't exist (already compressed or deleted)
    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(compressedPath)) {
        console.log(`Skipping ${filename} (already compressed: ${filename}.gz exists)`);
      } else {
        console.log(`⚠️  Warning: ${filename} not found and no compressed version exists`);
      }
      return;
    }
    
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
  console.log('\nNote: Both .json and .json.gz files are included in the package:');
  console.log('  - .json files: Required for React Native/Expo compatibility');
  console.log('  - .json.gz files: Used by Node.js for smaller package size');
}

compressDataFiles();

