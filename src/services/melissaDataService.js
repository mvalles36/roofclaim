// services/melissaData.js

const MELISSA_API_KEY = 'YOUR_MELISSA_API_KEY';
const MELISSA_BASE_URL = 'https://property.melissadata.net/v4/WEB/LookupProperty';

export const fetchPropertiesInBounds = async (bounds) => {
  const { northEast, southWest } = bounds;
  
  // Calculate the center point of the rectangle
  const centerLat = (northEast.lat + southWest.lat) / 2;
  const centerLng = (northEast.lng + southWest.lng) / 2;
  
  // Calculate the radius in miles (approximate)
  const latDiff = Math.abs(northEast.lat - southWest.lat);
  const lngDiff = Math.abs(northEast.lng - southWest.lng);
  const radiusMiles = Math.max(
    latDiff * 69, // 1 degree lat ≈ 69 miles
    lngDiff * 69 * Math.cos(centerLat * Math.PI / 180)
  );

  // Build the API URL with parameters
  const params = new URLSearchParams({
    id: MELISSA_API_KEY,
    format: 'json',
    lat: centerLat.toString(),
    lng: centerLng.toString(),
    radius: radiusMiles.toString(),
    // Add additional Melissa Data parameters as needed
  });

  try {
    const response = await fetch(`${MELISSA_BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Melissa Data API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter properties within the actual rectangle bounds
    return data.Records?.filter(property => {
      const lat = parseFloat(property.Latitude);
      const lng = parseFloat(property.Longitude);
      
      return lat >= southWest.lat && 
             lat <= northEast.lat && 
             lng >= southWest.lng && 
             lng <= northEast.lng;
    }).map(property => ({
      id: property.RecordID,
      address: `${property.AddressLine1}, ${property.City}, ${property.State} ${property.PostalCode}`,
      lat: property.Latitude,
      lng: property.Longitude,
      details: {
        ownerName: property.OwnerName,
        propertyType: property.PropertyType,
        yearBuilt: property.YearBuilt,
        lotSize: property.LotSize,
        buildingArea: property.BuildingArea,
        bedrooms: property.Bedrooms,
        bathrooms: property.Bathrooms,
        assessed: property.AssessedValue,
      }
    })) || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};
