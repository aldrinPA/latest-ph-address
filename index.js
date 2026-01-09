const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Load and decompress data files
function loadCompressedData(filename) {
  const filePath = path.join(__dirname, 'data', filename);
  
  // Try compressed file first, fallback to uncompressed
  try {
    const compressedPath = filePath + '.gz';
    if (fs.existsSync(compressedPath)) {
      const compressed = fs.readFileSync(compressedPath);
      const decompressed = zlib.gunzipSync(compressed);
      return JSON.parse(decompressed.toString());
    }
  } catch (e) {
    // Fallback to uncompressed if compression fails
  }
  
  // Fallback to uncompressed JSON
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const byPsgcData = loadCompressedData('by-psgc.json');
const byLevelData = loadCompressedData('by-level.json');

/**
 * Get all regions
 * @returns {Array} Array of all regions (sorted A-Z)
 */
function getRegions() {
  return [...byLevelData.regions].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get all provinces in a selected region
 * If no region is provided, returns all provinces plus "-NO PROVINCE-" option
 * Returns "-NO PROVINCE-" if the selected region is NCR
 * @param {string} regionPsgc - Optional: Region PSGC code
 * @returns {Array|string} Array of provinces (sorted A-Z) or "-NO PROVINCE-" for NCR
 */
function getProvincesByRegion(regionPsgc = null) {
  // If no region provided, return all provinces plus "-NO PROVINCE-" option
  if (!regionPsgc) {
    const allProvinces = [...byLevelData.provinces].sort((a, b) => a.name.localeCompare(b.name));
    return [{ psgc: '-NO PROVINCE-', name: '-NO PROVINCE-' }, ...allProvinces];
  }
  
  // NCR has no provinces
  if (regionPsgc === '1300000000') {
    return '-NO PROVINCE-';
  }
  
  // Filter provinces by region (first 2 digits of PSGC)
  const regionPrefix = regionPsgc.substring(0, 2);
  return byLevelData.provinces
    .filter(prov => prov.psgc.substring(0, 2) === regionPrefix)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get all cities and municipalities geographically located in selected province
 * If "-NO PROVINCE-" is provided, returns cities and municipalities in NCR Region
 * @param {string|string} provincePsgc - Province PSGC code or "-NO PROVINCE-"
 * @param {string} regionPsgc - Optional: Region PSGC code (required when provincePsgc is "-NO PROVINCE-")
 * @returns {Array} Array of cities and municipalities (sorted A-Z)
 */
function getCitiesAndMunsByProvince(provincePsgc, regionPsgc = null) {
  // Handle "-NO PROVINCE-" case (NCR) - must be explicitly "-NO PROVINCE-"
  if (provincePsgc === '-NO PROVINCE-') {
    if (!regionPsgc) {
      // Default to NCR if no region provided
      regionPsgc = '1300000000';
    }
    const regionPrefix = regionPsgc.substring(0, 2);
    const cities = byLevelData.cities
      .filter(city => city.psgc.substring(0, 2) === regionPrefix)
      .sort((a, b) => a.name.localeCompare(b.name));
    const municipalities = byLevelData.municipalities
      .filter(mun => mun.psgc.substring(0, 2) === regionPrefix)
      .sort((a, b) => a.name.localeCompare(b.name));
    return [...cities, ...municipalities].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  // If no province provided (undefined/null), return empty array
  if (!provincePsgc) {
    return [];
  }
  
  // Get regular cities and municipalities (administratively under the province)
  const provincePrefix = provincePsgc.substring(0, 5);
  const regularCities = byLevelData.cities
    .filter(city => city.psgc.substring(0, 5) === provincePrefix)
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const municipalities = byLevelData.municipalities
    .filter(mun => mun.psgc.substring(0, 5) === provincePrefix)
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Get HUCs that are geographically located in this province
  const hucsInProvince = byLevelData.cities
    .filter(city => {
      if (city.cityClass === 'HUC') {
        const geoProv = getGeographicProvince(city.psgc);
        return geoProv && geoProv.psgc === provincePsgc;
      }
      return false;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Combine all cities (regular + HUCs) and municipalities
  const allCities = [...regularCities, ...hucsInProvince].sort((a, b) => a.name.localeCompare(b.name));
  
  return [...allCities, ...municipalities].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get all barangays located in selected city or municipality
 * Works for all cities and municipalities including HUCs (Manila, Baguio, etc.)
 * @param {string} cityMunPsgc - City/Municipality PSGC code
 * @returns {Array} Array of barangays (sorted A-Z)
 */
function getBarangaysByCityOrMun(cityMunPsgc) {
  // PSGC Revision 1: City/Municipality = first 7 digits
  // Filter barangays by matching first 7 digits
  const cityMunPrefix7 = cityMunPsgc.substring(0, 7);
  let barangays = byLevelData.barangays.filter(
    bgy => bgy.psgc.substring(0, 7) === cityMunPrefix7
  );
  
  // Fallback: Some cities (like Manila) have barangays with different 7th digit
  // Try matching first 6 digits if no matches found with 7 digits
  if (barangays.length === 0) {
    const cityMunPrefix6 = cityMunPsgc.substring(0, 6);
    barangays = byLevelData.barangays.filter(
      bgy => bgy.psgc.substring(0, 6) === cityMunPrefix6
    );
  }
  
  return barangays.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get region for a given province PSGC
 * Useful when user selects province first (province-first flow)
 * @param {string} provincePsgc - Province PSGC code
 * @returns {Object|null} Region object or null if not found
 */
function getRegionByProvince(provincePsgc) {
  // Get province to verify it exists
  const province = byPsgcData[provincePsgc];
  if (!province || province.geographicLevel !== 'Prov') {
    return null;
  }
  
  // Get region PSGC (first 2 digits + 00000000)
  const regionPsgc = provincePsgc.substring(0, 2) + '00000000';
  return byPsgcData[regionPsgc] || null;
}

/**
 * Helper: Get geographic province for HUC (Highly Urbanized City)
 * HUCs are administratively independent but geographically located within a province.
 * @param {string} cityPsgc - City PSGC code
 * @returns {Object|null} Geographic province or null if not found
 */
function getGeographicProvince(cityPsgc) {
  const city = byPsgcData[cityPsgc];
  if (!city || city.cityClass !== 'HUC' || !city.correspondenceCode) {
    return null;
  }

  // Use correspondence code to find geographic province
  const corrPrefix = city.correspondenceCode.substring(0, 5);
  
  // Find province with matching correspondence code prefix
  let geographicProvince = byLevelData.provinces.find(prov => {
    if (!prov.correspondenceCode) return false;
    return prov.correspondenceCode.substring(0, 5) === corrPrefix;
  });

  // If not found with 5 digits, try 4 digits (for some edge cases)
  if (!geographicProvince) {
    const corrPrefix4 = city.correspondenceCode.substring(0, 4);
    geographicProvince = byLevelData.provinces.find(prov => {
      if (!prov.correspondenceCode) return false;
      return prov.correspondenceCode.substring(0, 4) === corrPrefix4;
    });
  }

  return geographicProvince || null;
}

module.exports = {
  getRegions,
  getProvincesByRegion,
  getCitiesAndMunsByProvince,
  getBarangaysByCityOrMun,
  getRegionByProvince
};
