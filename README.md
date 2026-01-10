# latest-ph-address

[![npm version](https://img.shields.io/npm/v/latest-ph-address-thanks-to-anehan.svg)](https://www.npmjs.com/package/latest-ph-address-thanks-to-anehan)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Complete Philippine addresses database with 43,769+ addresses. Perfect for building address forms and cascading dropdowns.

**Features:**
- ✅ **43,769+ addresses** - Complete coverage (18 Regions, 82 Provinces, 149 Cities, 1,493 Municipalities, 42,011 Barangays)
- ✅ **Official PSGC codes** - Philippine Standard Geographic Code support
- ✅ **NCR support** - Automatic handling of National Capital Region (no provinces)
- ✅ **HUC support** - Highly Urbanized Cities with geographic province mapping
- ✅ **Zero dependencies** - Lightweight (~1.2 MB)
- ✅ **Latest data** - 3Q 2025 PSGC data
- ✅ **React Native/Expo compatible** - Works in Node.js, React, React Native, and Expo projects

All thanks to the [anehan.online](https://anehan.online) Tech Team! 🇵🇭

## 📦 Installation

```bash
npm install latest-ph-address-thanks-to-anehan
```

## 🚀 Quick Start

### Import

The package exports an object with functions. You can name the imported object anything you want:

```typescript
// ES6 Import (Recommended)
// 'phAddress' is just a variable name - you can use any name you prefer
import phAddress from 'latest-ph-address-thanks-to-anehan';
// OR: import address from 'latest-ph-address-thanks-to-anehan';
// OR: import philippines from 'latest-ph-address-thanks-to-anehan';

// ES6 Named Imports (Import specific functions)
import { getRegions, getProvincesByRegion, getBarangaysByCityOrMun } from 'latest-ph-address-thanks-to-anehan';

// CommonJS (Node.js)
const phAddress = require('latest-ph-address-thanks-to-anehan');
// OR: const address = require('latest-ph-address-thanks-to-anehan');
```

**Note:** `phAddress` stands for "Philippine Address" - it's just a suggested variable name. You can use any name you prefer!

### Basic Usage

```typescript
// Using default import (object with all functions)
import phAddress from 'latest-ph-address-thanks-to-anehan';

// Get all regions
const regions = phAddress.getRegions();
// Returns: Array of 18 regions (sorted A-Z)
// Type: Array<{ psgc: string; name: string; correspondenceCode: string; geographicLevel: string }>

// Get provinces for a region
const provinces = phAddress.getProvincesByRegion('1400000000'); // CAR
// Returns: Array of provinces (sorted A-Z)
// Type: Array<{ psgc: string; name: string; ... }>

// Get provinces for NCR
const ncrProvinces = phAddress.getProvincesByRegion('1300000000');
// Returns: "-NO PROVINCE-" (string)
// Type: string

// Get all provinces (includes "-NO PROVINCE-" option)
const allProvinces = phAddress.getProvincesByRegion();
// Returns: Array of 83 items ("-NO PROVINCE-" appears first)
// Type: Array<{ psgc: string; name: string; ... }>

// Get cities and municipalities for a province
const cities = phAddress.getCitiesAndMunsByProvince('1401100000'); // Benguet
// Returns: Array including City of Baguio (HUC) + all municipalities
// Type: Array<{ psgc: string; name: string; cityClass?: string; ... }>

// Get cities for NCR
const ncrCities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', '1300000000');
// Returns: Array of NCR cities and municipalities
// Type: Array<{ psgc: string; name: string; ... }>

// Get barangays
const barangays = phAddress.getBarangaysByCityOrMun('1430300000'); // Baguio City
// Returns: Array of barangays (sorted A-Z)
// Type: Array<{ psgc: string; name: string; ... }>
```

## 📋 Cascading Dropdown Example

```typescript
import phAddress from 'latest-ph-address-thanks-to-anehan';

// Step 1: Load regions
const regions = phAddress.getRegions();

// Step 2: User selects region → Get provinces
const regionPsgc: string = '1400000000'; // Example: CAR
const provinces = phAddress.getProvincesByRegion(regionPsgc);

if (provinces === '-NO PROVINCE-') {
  // NCR case: Skip province dropdown
  const cities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', regionPsgc);
} else {
  // Regular region: Show provinces
  // Step 3: User selects province → Get cities
  const provincePsgc: string = '1401100000'; // Example: Benguet
  const cities = phAddress.getCitiesAndMunsByProvince(provincePsgc);
}

// Step 4: User selects city → Get barangays
const cityMunPsgc: string = '1430300000'; // Example: Baguio City
const barangays = phAddress.getBarangaysByCityOrMun(cityMunPsgc);
```

### Province-First Flow (Auto-detect Region)

```typescript
import phAddress from 'latest-ph-address-thanks-to-anehan';

// User selects province first
const provinces = phAddress.getProvincesByRegion(); // All provinces + "-NO PROVINCE-"
const provincePsgc: string = '1401100000'; // Example: Benguet

if (provincePsgc === '-NO PROVINCE-') {
  // NCR case
  const cities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', '1300000000');
} else {
  // Auto-detect region
  const region = phAddress.getRegionByProvince(provincePsgc);
  if (region) {
    const cities = phAddress.getCitiesAndMunsByProvince(provincePsgc);
  }
}
```

## 📚 API Reference

### `getRegions()`

Get all regions in the Philippines.

**Returns:** Array of 18 regions (sorted A-Z)

```typescript
import phAddress from 'latest-ph-address-thanks-to-anehan';

const regions = phAddress.getRegions();
// Type: Array<{ psgc: string; name: string; correspondenceCode: string; geographicLevel: string }>
```

---

### `getProvincesByRegion(regionPsgc)`

Get provinces in a selected region.

**Parameters:**
- `regionPsgc` (string, optional): Region PSGC code

**Returns:**
- Array of provinces (sorted A-Z) when region is provided
- Array of all provinces + "-NO PROVINCE-" (83 items) when no parameter
- `"-NO PROVINCE-"` (string) when region is NCR

```typescript
import phAddress from 'latest-ph-address-thanks-to-anehan';

const provinces = phAddress.getProvincesByRegion('1400000000'); // CAR
// Type: Array<{ psgc: string; name: string; ... }>

const allProvinces = phAddress.getProvincesByRegion(); // All + "-NO PROVINCE-"
// Type: Array<{ psgc: string; name: string; ... }>

const ncr = phAddress.getProvincesByRegion('1300000000'); // Returns "-NO PROVINCE-"
// Type: string
```

---

### `getCitiesAndMunsByProvince(provincePsgc, regionPsgc)`

Get all cities and municipalities geographically located in selected province. Includes HUCs.

**Parameters:**
- `provincePsgc` (string): Province PSGC code or `"-NO PROVINCE-"`
- `regionPsgc` (string, optional): Region PSGC code (required when `provincePsgc` is `"-NO PROVINCE-"`)

**Returns:** Array of cities and municipalities (sorted A-Z)

```typescript
import phAddress from 'latest-ph-address-thanks-to-anehan';

const cities = phAddress.getCitiesAndMunsByProvince('1401100000'); // Benguet
// Type: Array<{ psgc: string; name: string; cityClass?: string; ... }>

const ncrCities = phAddress.getCitiesAndMunsByProvince('-NO PROVINCE-', '1300000000');
// Type: Array<{ psgc: string; name: string; ... }>
```

---

### `getBarangaysByCityOrMun(cityMunPsgc)`

Get all barangays located in selected city or municipality.

**Parameters:**
- `cityMunPsgc` (string): City/Municipality PSGC code

**Returns:** Array of barangays (sorted A-Z)

```typescript
import phAddress from 'latest-ph-address-thanks-to-anehan';

const barangays = phAddress.getBarangaysByCityOrMun('1430300000'); // Baguio City
// Type: Array<{ psgc: string; name: string; ... }>
```

---

### `getRegionByProvince(provincePsgc)`

Get the region for a given province. Useful for auto-selecting region when user chooses province first.

**Parameters:**
- `provincePsgc` (string): Province PSGC code

**Returns:** Region object or null if not found

```typescript
import phAddress from 'latest-ph-address-thanks-to-anehan';

const region = phAddress.getRegionByProvince('1401100000'); // Benguet
// Returns: { psgc: '1400000000', name: 'Cordillera Administrative Region (CAR)', ... }
// Type: { psgc: string; name: string; ... } | null
```

## ⚠️ Important Notes

- **NCR Handling:** When region is NCR, `getProvincesByRegion()` returns `"-NO PROVINCE-"` (string) instead of an array
- **"-NO PROVINCE-" Option:** Appears first in sorted lists when getting all provinces
- **HUCs:** Highly Urbanized Cities (like Baguio, Manila) are included in their geographic province
- **All Lists:** Returned arrays are sorted A-Z by name
- **PSGC Format:** Uses 10-digit PSGC codes (PSGC Revision 1)

## 📐 Data Structure

Each address object contains:

```typescript
interface Address {
  psgc: string;                    // 10-digit PSGC code
  name: string;                     // Name
  correspondenceCode: string;       // Correspondence code
  geographicLevel: 'Reg' | 'Prov' | 'City' | 'Mun' | 'Bgy';
  cityClass?: string | null;       // City class (HUC, CC, ICC) for cities
}

// Example:
const address: Address = {
  psgc: '1380100001',
  name: 'Barangay 1',
  correspondenceCode: '137501001',
  geographicLevel: 'Bgy',
  cityClass: null
};
```

## 🔢 PSGC Code Structure

10-digit PSGC code format: `XX` (Region) + `XXX` (Province) + `XX` (City/Mun) + `XXX` (Barangay)

**Example:** `1400101001`
- Digits 1-2: `14` = CAR
- Digits 3-5: `001` = Abra Province
- Digits 6-7: `01` = Bangued Municipality
- Digits 8-10: `001` = Agtangao Barangay

## 💼 Use Cases

- E-commerce & Delivery - Address forms, shipping validation
- Government Services - Public forms, voter registration
- Financial Services - KYC forms, address verification
- Real Estate - Property listings, location search
- Healthcare - Patient registration, medical records
- Logistics - Shipping management, delivery tracking

## 🙏 Credits

Data from **Philippine Standard Geographic Code (PSGC) database (3Q 2025)**.

Special thanks to the [anehan.online](https://anehan.online) Tech Team! 🇵🇭

## 📄 License

ISC © [Anehan Tech Team by Aldrin](https://github.com/aldrinPA)

## 🔗 Links

- **Repository:** [https://github.com/aldrinPA/latest-ph-address](https://github.com/aldrinPA/latest-ph-address)
- **NPM Package:** [https://www.npmjs.com/package/latest-ph-address-thanks-to-anehan](https://www.npmjs.com/package/latest-ph-address-thanks-to-anehan)
- **Thanks to:** [anehan.online](https://anehan.online)
