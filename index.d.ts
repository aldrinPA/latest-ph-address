/**
 * Type definitions for latest-ph-address-thanks-to-anehan
 * Complete Philippine addresses database with PSGC codes
 */

export interface AddressItem {
  psgc: string;
  name: string;
  correspondenceCode?: string;
  geographicLevel?: string;
  cityClass?: string | null;
}

export interface PhAddress {
  /**
   * Get all regions in the Philippines
   * @returns Array of all regions (sorted A-Z)
   */
  getRegions(): AddressItem[];

  /**
   * Get provinces in a selected region
   * @param regionPsgc - Optional: Region PSGC code
   * @returns Array of provinces (sorted A-Z) when region is provided,
   *          Array of all provinces + "-NO PROVINCE-" (83 items) when no parameter,
   *          or "-NO PROVINCE-" (string) when region is NCR
   */
  getProvincesByRegion(regionPsgc?: string): AddressItem[] | string;

  /**
   * Get all cities and municipalities geographically located in selected province
   * Includes HUCs (Highly Urbanized Cities) that are geographically located in the province
   * @param provincePsgc - Province PSGC code or "-NO PROVINCE-"
   * @param regionPsgc - Optional: Region PSGC code (required when provincePsgc is "-NO PROVINCE-")
   * @returns Array of cities and municipalities (sorted A-Z)
   */
  getCitiesAndMunsByProvince(provincePsgc: string, regionPsgc?: string): AddressItem[];

  /**
   * Get all barangays located in selected city or municipality
   * Works for all cities and municipalities including HUCs (Manila, Baguio, etc.)
   * @param cityMunPsgc - City/Municipality PSGC code
   * @returns Array of barangays (sorted A-Z)
   */
  getBarangaysByCityOrMun(cityMunPsgc: string): AddressItem[];

  /**
   * Get the region for a given province
   * Useful for auto-selecting region when user chooses province first (province-first flow)
   * @param provincePsgc - Province PSGC code
   * @returns Region object or null if not found
   */
  getRegionByProvince(provincePsgc: string): AddressItem | null;
}

declare const phAddress: PhAddress;
export default phAddress;

