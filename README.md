# latest-ph-address

[![npm version](https://img.shields.io/npm/v/latest-ph-address-thanks-to-anehan.svg)](https://www.npmjs.com/package/latest-ph-address-thanks-to-anehan)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

The latest Philippine addresses database with complete coverage of all Regions, Provinces, Cities, Municipalities, and Barangays. Perfect for building address forms, dropdowns, and location-based applications.

**Features:**
- ✅ **43,769+ addresses** - Complete coverage of the Philippines
- ✅ **Official PSGC codes** - Philippine Standard Geographic Code support
- ✅ **Cascading dropdowns** - Built-in helpers for Region → Province → City/Municipality → Barangay
- ✅ **NCR support** - Automatic handling of National Capital Region (no provinces)
- ✅ **HUC support** - Highly Urbanized Cities with geographic province mapping
- ✅ **Two flexible flows** - Start with Region or Province
- ✅ **Zero dependencies** - Lightweight and fast
- ✅ **Latest data** - 3Q 2025 PSGC data

All thanks to the [anehan.online](https://anehan.online) Tech Team! 🇵🇭

## 📦 Installation

```bash
npm install latest-ph-address-thanks-to-anehan
```

## 📊 Data Coverage

- **18 Regions**
- **82 Provinces**
- **149 Cities** (including HUC, CC, ICC)
- **1,493 Municipalities**
- **42,011 Barangays**
- **Total: 43,769 addresses**

## 🚀 Quick Start

### Basic Usage

```javascript
const phAddress = require('latest-ph-address-thanks-to-anehan');

// Get all regions
const regions = phAddress.getRegions();
// Returns: Array of 18 regions (sorted A-Z)

// Get provinces (all provinces + "-NO PROVINCE-" option)
const provinces = phAddress.getProvincesByRegion();
// Returns: Array of 82 provinces + "-NO PROVINCE-" (83 items, sorted A-Z)
// "-NO PROVINCE-" appears first in the list

// Get provinces in a specific region
const carProvinces = phAddress.getProvincesByRegion('1400000000'); // CAR
// Returns: Array of provinces in CAR (sorted A-Z)

// Get provinces for NCR
const ncrProvinces = phAddress.getProvincesByRegion('1300000000'); // NCR
// Returns: "-NO PROVINCE-" (string)

// Get cities and municipalities in a province (includes HUCs geographically located)
const cities = phAddress.getCitiesAndMunsByProvince('1401100000'); // Benguet
// Returns: Array of cities and municipalities (sorted A-Z)
// Includes: City of Baguio (HUC) + all municipalities

// Get cities and municipalities for NCR (when "-NO PROVINCE-" is selected)
const ncrCities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', '1300000000');
// Returns: Array of NCR cities and municipalities (sorted A-Z)

// Get barangays in a city/municipality
const barangays = phAddress.getBarangaysByCityOrMun('1430300000'); // Baguio City
// Returns: Array of barangays (sorted A-Z)
// Works for all cities including HUCs (Manila, Baguio, etc.)
```

### Complete Dropdown Flow

```javascript
// Step 1: Load regions
const regions = phAddress.getRegions();

// Step 2: User selects region → Get provinces
const provinces = phAddress.getProvincesByRegion(regionPsgc);
// For NCR: Returns "-NO PROVINCE-" (string)
// For other regions: Returns array of provinces

// Step 3: User selects province → Get cities/municipalities
// If user selected "-NO PROVINCE-" (NCR case):
const ncrCities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', '1300000000');
// If user selected a regular province:
const cities = phAddress.getCitiesAndMunsByProvince(provincePsgc);
// Includes all cities (HUC, CC, ICC) and municipalities geographically in province

// Step 4: User selects city/municipality → Get barangays
const barangays = phAddress.getBarangaysByCityOrMun(cityMunPsgc);
```

## 📋 Main Use Case: Cascading Dropdowns

This package is designed for building cascading dropdowns with two flexible flows:

**Flow 1: Region → Province → City/Municipality → Barangay**  
**Flow 2: Province → City/Municipality → Barangay** (when user doesn't know region)

### Key Features:
- ✅ Automatically handles **NCR** (returns "-NO PROVINCE-" instead of provinces)
- ✅ Shows **all city types** (HUC, CC, ICC) geographically located in selected province
- ✅ Includes **HUCs** in their geographic province (e.g., Baguio appears in Benguet)
- ✅ **"-NO PROVINCE-"** appears first in province list (sorted A-Z)
- ✅ Works for all HUCs including Manila, Baguio, and others

### Basic Dropdown Flow

```javascript
const phAddress = require('latest-ph-address-thanks-to-anehan');

// Step 1: Load regions
const regions = phAddress.getRegions();
// Populate first dropdown with regions

// Step 2: When user selects a region
function onRegionSelected(regionPsgc) {
  const provinces = phAddress.getProvincesByRegion(regionPsgc);
  
  if (provinces === '-NO PROVINCE-') {
    // NCR case: Skip province dropdown, show cities/municipalities directly
    const cities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', regionPsgc);
    // Populate city/municipality dropdown (skip province dropdown)
  } else {
    // Regular region: Show provinces
    // Populate province dropdown with provinces array
  }
}

// Step 3: When user selects a province (if applicable)
function onProvinceSelected(provincePsgc, regionPsgc) {
  // Get all cities (including HUCs) and municipalities geographically in province
  const cities = phAddress.getCitiesAndMunsByProvince(provincePsgc);
  // Populate city/municipality dropdown
}

// Step 4: When user selects a city/municipality
function onCityMunSelected(cityMunPsgc) {
  const barangays = phAddress.getBarangaysByCityOrMun(cityMunPsgc);
  // Populate barangay dropdown
}
```

### Alternative Flow: Province First (No Region)

```javascript
// Step 1: Load all provinces (includes "-NO PROVINCE-" option)
const provinces = phAddress.getProvincesByRegion();
// "-NO PROVINCE-" appears first in the list

// Step 2: When user selects "-NO PROVINCE-"
if (provincePsgc === '-NO PROVINCE-') {
  const cities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', '1300000000');
  // Show NCR cities/municipalities
} else {
  // User selected a regular province
  const cities = phAddress.getCitiesAndMunsByProvince(provincePsgc);
  // Show cities/municipalities for that province
}
```

### React Example

```jsx
import React, { useState } from 'react';
const phAddress = require('latest-ph-address-thanks-to-anehan');

function AddressDropdown() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCityMun, setSelectedCityMun] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityMunOptions, setCityMunOptions] = useState([]);
  const [barangayOptions, setBarangayOptions] = useState([]);
  
  const [showProvince, setShowProvince] = useState(false);
  
  // Load regions on mount
  const regions = phAddress.getRegions();
  
  const handleRegionChange = (regionPsgc) => {
    setSelectedRegion(regionPsgc);
    setSelectedProvince(null);
    setSelectedCityMun(null);
    setSelectedBarangay(null);
    
    const provinces = phAddress.getProvincesByRegion(regionPsgc);
    
    if (provinces === '-NO PROVINCE-') {
      // NCR case - skip province dropdown
      const cities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', regionPsgc);
      setCityMunOptions(cities);
      setShowProvince(false);
    } else {
      // Regular region - show province dropdown
      setProvinceOptions(provinces);
      setShowProvince(true);
      setCityMunOptions([]);
    }
    setBarangayOptions([]);
  };
  
  const handleProvinceChange = (provincePsgc, regionPsgc) => {
    setSelectedProvince(provincePsgc);
    setSelectedCityMun(null);
    setSelectedBarangay(null);
    
    // Get cities and municipalities for selected province
    const cities = phAddress.getCitiesAndMunsByProvince(provincePsgc, regionPsgc);
    setCityMunOptions(cities);
    setBarangayOptions([]);
  };
  
  const handleCityMunChange = (cityMunPsgc) => {
    setSelectedCityMun(cityMunPsgc);
    setSelectedBarangay(null);
    
    const barangays = phAddress.getBarangaysByCityOrMun(cityMunPsgc);
    setBarangayOptions(barangays);
  };
  
  return (
    <div>
      <select onChange={(e) => handleRegionChange(e.target.value)}>
        <option value="">Select Region</option>
        {regions.map(r => (
          <option key={r.psgc} value={r.psgc}>{r.name}</option>
        ))}
      </select>
      
      {showProvince && (
        <select onChange={(e) => handleProvinceChange(e.target.value, selectedRegion)}>
          <option value="">Select Province</option>
          {provinceOptions.map(p => (
            <option key={p.psgc} value={p.psgc}>{p.name}</option>
          ))}
        </select>
      )}
      
      <select onChange={(e) => handleCityMunChange(e.target.value)}>
        <option value="">Select City/Municipality</option>
        {cityMunOptions.map(cm => (
          <option key={cm.psgc} value={cm.psgc}>
            {cm.name}{cm.cityClass ? ` (${cm.cityClass})` : ''}
          </option>
        ))}
      </select>
      
      <select onChange={(e) => setSelectedBarangay(e.target.value)}>
        <option value="">Select Barangay</option>
        {barangayOptions.map(b => (
          <option key={b.psgc} value={b.psgc}>{b.name}</option>
        ))}
      </select>
    </div>
  );
}
```

## 📚 API Reference

This package provides **4 simple functions** for cascading dropdowns:

### `getRegions()`

Get all regions in the Philippines.

**Parameters:** None

**Returns:** Array of 18 regions (sorted A-Z)

**Example:**
```javascript
const regions = phAddress.getRegions();
// Returns: [{ psgc: '1300000000', name: 'National Capital Region (NCR)', ... }, ...]
```

---

### `getProvincesByRegion(regionPsgc)`

Get provinces in a selected region. If no region is provided, returns all provinces plus "-NO PROVINCE-" option.

**Parameters:**
- `regionPsgc` (string, optional): Region PSGC code

**Returns:** 
- Array of provinces (sorted A-Z) when region is provided
- Array of all provinces + "-NO PROVINCE-" (83 items, sorted A-Z) when no parameter
- `"-NO PROVINCE-"` (string) when region is NCR

**Special Notes:**
- `-NO PROVINCE-` appears first in the list (sorted A-Z)
- NCR region returns `"-NO PROVINCE-"` string instead of array

**Example:**
```javascript
// Get all provinces (for users who don't know their region)
const allProvinces = phAddress.getProvincesByRegion();
// Returns: [{ psgc: '-NO PROVINCE-', name: '-NO PROVINCE-' }, { psgc: '1400100000', name: 'Abra' }, ...]

// Get provinces for a specific region
const carProvinces = phAddress.getProvincesByRegion('1400000000'); // CAR
// Returns: [{ psgc: '1400100000', name: 'Abra' }, ...]

// Get provinces for NCR
const ncrProvinces = phAddress.getProvincesByRegion('1300000000'); // NCR
// Returns: "-NO PROVINCE-" (string)
```

---

### `getCitiesAndMunsByProvince(provincePsgc, regionPsgc)`

Get all cities and municipalities geographically located in selected province. Includes HUCs that are geographically located in the province.

**Parameters:**
- `provincePsgc` (string): Province PSGC code or `"-NO PROVINCE-"`
- `regionPsgc` (string, optional): Region PSGC code (required when `provincePsgc` is `"-NO PROVINCE-"`)

**Returns:** Array of cities and municipalities (sorted A-Z)

**Special Notes:**
- When `provincePsgc` is `"-NO PROVINCE-"`, returns cities/municipalities for NCR Region
- Includes HUCs geographically located in the province (e.g., Baguio City appears in Benguet)
- Works for all city types: HUC, CC, ICC, and municipalities
- Returns empty array if no parameters provided

**Example:**
```javascript
// Get cities/municipalities for a province
const cities = phAddress.getCitiesAndMunsByProvince('1401100000'); // Benguet
// Returns: [City of Baguio (HUC), Atok, Bakun, Bokod, ...]

// Get cities/municipalities for NCR (when "-NO PROVINCE-" is selected)
const ncrCities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', '1300000000');
// Returns: [City of Caloocan, City of Las Piñas, City of Makati, ...]
```

---

### `getBarangaysByCityOrMun(cityMunPsgc)`

Get all barangays located in selected city or municipality.

**Parameters:**
- `cityMunPsgc` (string): City/Municipality PSGC code

**Returns:** Array of barangays (sorted A-Z)

**Special Notes:**
- Works for all cities and municipalities including HUCs (Manila, Baguio, etc.)
- Handles different PSGC patterns automatically (7-digit and 6-digit fallback)

**Example:**
```javascript
// Get barangays for a regular city/municipality
const barangays = phAddress.getBarangaysByCityOrMun('1400101000'); // Bangued, Abra
// Returns: [Agtangao, Angad, Bañacao, ...]

// Get barangays for HUC (Manila)
const manilaBarangays = phAddress.getBarangaysByCityOrMun('1380600000'); // Manila City
// Returns: [Barangay 1, Barangay 10, ...] (655 barangays)

// Get barangays for HUC (Baguio)
const baguioBarangays = phAddress.getBarangaysByCityOrMun('1430300000'); // Baguio City
// Returns: [A. Bonifacio-Caguioa-Rimando, Abanao-Zandueta-Kayong-Chugum-Otek, ...] (129 barangays)
```

---

### `getRegionByProvince(provincePsgc)`

Get the region for a given province. Useful for auto-selecting region when user chooses province first.

**Parameters:**
- `provincePsgc` (string): Province PSGC code

**Returns:** Region object or null if not found

**Special Notes:**
- Automatically determines the region based on province PSGC
- Returns `null` if province PSGC is invalid or if `"-NO PROVINCE-"` is provided
- Perfect for province-first flow to auto-select region in UI

**Example:**
```javascript
// Get region for Benguet province
const region = phAddress.getRegionByProvince('1401100000'); // Benguet
// Returns: { psgc: '1400000000', name: 'Cordillera Administrative Region (CAR)', ... }

// Auto-select region when user selects province
function onProvinceSelected(provincePsgc) {
  if (provincePsgc === '-NO PROVINCE-') {
    // NCR case
    const regionPsgc = '1300000000';
  } else {
    // Auto-detect region
    const region = phAddress.getRegionByProvince(provincePsgc);
    if (region) {
      // Auto-select region in UI
      // region.psgc = '1400000000'
      // region.name = 'Cordillera Administrative Region (CAR)'
    }
  }
}
```

## 📐 Data Structure

Each address object contains:

```javascript
{
  psgc: '1380100001',              // 10-digit PSGC code
  name: 'Barangay 1',               // Name
  correspondenceCode: '137501001',  // Correspondence code
  geographicLevel: 'Bgy',           // Reg, Prov, City, Mun, or Bgy
  oldNames: null,                   // Old names (if any)
  cityClass: null                   // City class (HUC, etc.) for cities
}
```

## 🗺️ Geographic Levels

- **Reg**: Region
- **Prov**: Province
- **City**: City
- **Mun**: Municipality
- **Bgy**: Barangay

## 🔢 PSGC Code Structure (Revision 1)

The 10-digit PSGC code follows **PSGC Revision 1** structure:

| Component | Digits | Structure | Example |
|-----------|--------|----------|---------|
| **Region** | 1-2 | `XX00000000` | `14` = CAR |
| **Province/HUC** | 3-5 | `XXXXX00000` | `011` = Benguet |
| **City/Municipality** | 6-7 | `XXXXXXX000` | `01` = Bangued |
| **Barangay** | 8-10 | `XXXXXXXXXX` | `001` = Agtangao |

**Full Structure:** `XX` (Region) + `XXX` (Province) + `XX` (City/Mun) + `XXX` (Barangay)

**Example:** `1400101001`
- Digits 1-2: `14` = Cordillera Administrative Region (CAR)
- Digits 3-5: `001` = Abra Province
- Digits 6-7: `01` = Bangued Municipality
- Digits 8-10: `001` = Agtangao Barangay

## 🙏 Credits

This package uses data from the **Philippine Standard Geographic Code (PSGC) database (3Q 2025)**. 

Special thanks to the [anehan.online](https://anehan.online) Tech Team for making this data available! Mabuhay! 🇵🇭

## 🔄 Two Flexible Usage Flows

This package supports **two flexible flows** for address selection:

### Flow 1: Region First (Standard)
**Region → Province → City/Municipality → Barangay**

```javascript
// 1. Load regions
const regions = phAddress.getRegions();

// 2. User selects region → Get provinces
const provinces = phAddress.getProvincesByRegion(regionPsgc);
// For NCR: Returns "-NO PROVINCE-" (string)
// For other regions: Returns array of provinces

// 3. User selects province → Get cities/municipalities
if (provincePsgc === '-NO PROVINCE-') {
  // NCR case
  const cities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', regionPsgc);
} else {
  // Regular province
  const cities = phAddress.getCitiesAndMunsByProvince(provincePsgc);
}

// 4. User selects city/municipality → Get barangays
const barangays = phAddress.getBarangaysByCityOrMun(cityMunPsgc);
```

### Flow 2: Province First (Alternative)
**Province → City/Municipality → Barangay** (when user doesn't know region)

```javascript
// 1. Load all provinces (includes "-NO PROVINCE-" option)
const allProvinces = phAddress.getProvincesByRegion();
// "-NO PROVINCE-" appears first in the list

// 2. User selects province → Auto-select region
let selectedRegion = null;
if (provincePsgc === '-NO PROVINCE-') {
  // User selected "-NO PROVINCE-" (NCR)
  selectedRegion = '1300000000'; // Auto-select NCR
  const cities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', selectedRegion);
} else {
  // User selected a regular province → Auto-detect region
  const region = phAddress.getRegionByProvince(provincePsgc);
  selectedRegion = region ? region.psgc : null;
  
  // Get cities/municipalities for the selected province
  const cities = phAddress.getCitiesAndMunsByProvince(provincePsgc);
}

// 3. User selects city/municipality → Get barangays
const barangays = phAddress.getBarangaysByCityOrMun(cityMunPsgc);
```

**Auto-Select Region Example:**
```javascript
// When user selects a province, automatically determine the region
function onProvinceSelected(provincePsgc) {
  if (provincePsgc === '-NO PROVINCE-') {
    // NCR case - region is automatically NCR
    const regionPsgc = '1300000000';
    const cities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', regionPsgc);
    // Update UI: Set region to NCR, show cities
  } else {
    // Regular province - auto-detect region
    const region = phAddress.getRegionByProvince(provincePsgc);
    if (region) {
      // Auto-select the region in the UI
      // region.psgc = region PSGC code
      // region.name = region name (e.g., "Cordillera Administrative Region (CAR)")
      
      const cities = phAddress.getCitiesAndMunsByProvince(provincePsgc);
      // Update UI: Set region to detected region, show cities
    }
  }
}
```

## 💼 Use Cases

This package is perfect for:

- **E-commerce & Delivery** - Address forms, shipping validation, delivery services
- **Government Services** - Public forms, voter registration, census data
- **Financial Services** - KYC forms, bank applications, address verification
- **Real Estate** - Property listings, location search, address display
- **Healthcare** - Patient registration, medical records, service delivery
- **Logistics** - Shipping management, route optimization, delivery tracking
- **Mobile Apps** - Address selection, location-based features
- **Data Analysis** - Geographic reporting, user distribution, market research

See [USE_CASES.md](./USE_CASES.md) for detailed use cases and integration examples.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/aldrinPA/latest-ph-address/issues).

## 📄 License

ISC © [Anehan Tech Team by Aldrin](https://github.com/aldrinPA)

## 🔗 Links

- **Repository:** [https://github.com/aldrinPA/latest-ph-address](https://github.com/aldrinPA/latest-ph-address)
- **NPM Package:** [https://www.npmjs.com/package/latest-ph-address-thanks-to-anehan](https://www.npmjs.com/package/latest-ph-address-thanks-to-anehan)
- **Thanks to:** [anehan.online](https://anehan.online)
