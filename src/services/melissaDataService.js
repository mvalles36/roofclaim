import axios from 'axios';

const melissaClient = axios.create({
  baseURL: 'https://reversegeo.melissadata.net/v3/web/ReverseGeoCode',
  params: {
    id: import.meta.env.VITE_MELISSA_DATA_API_KEY,
    format: 'json'
  }
});

export const fetchProspectsFromMelissaData = async (center, radius, filters = {}) => {
  try {
    const response = await melissaClient.get('/doLookup', {
      params: {
        lat: center.lat,
        lon: center.lng,
        MaxDistance: radius,
        recs: filters.limit || '100',
        opt: buildOptionsString(filters)
      }
    });

    if (!response.data?.Records) {
      throw new Error('Invalid response from Melissa Data API');
    }

    return response.data.Records.map(record => ({
      address: {
        line1: record.AddressLine1,
        city: record.City,
        state: record.State,
        postalCode: record.PostalCode
      },
      coordinates: {
        latitude: record.Latitude,
        longitude: record.Longitude
      },
      propertyType: record.PropertyType,
      buildingAge: calculateBuildingAge(record.YearBuilt),
      estimatedValue: record.EstimatedValue,
      lastSaleDate: record.LastSaleDate,
      roofAge: calculateRoofAge(record.YearBuilt, record.LastRoofPermit)
    }));
  } catch (error) {
    console.error('Error fetching data from Melissa Data API:', error);
    throw error;
  }
};

const buildOptionsString = (filters) => {
  const options = [
    filters.includeApartments ? 'IncludeApartments:on' : 'IncludeApartments:off',
    filters.includeUndeliverable ? 'IncludeUndeliverable:on' : 'IncludeUndeliverable:off',
    filters.includeEmptyLots ? 'IncludeEmptyLots:on' : 'IncludeEmptyLots:off'
  ];
  return options.join(';');
};

const calculateBuildingAge = (yearBuilt) => {
  if (!yearBuilt) return null;
  return new Date().getFullYear() - parseInt(yearBuilt);
};

const calculateRoofAge = (yearBuilt, lastRoofPermit) => {
  const referenceYear = lastRoofPermit || yearBuilt;
  return referenceYear ? new Date().getFullYear() - parseInt(referenceYear) : null;
};

export const enrichProspectData = async (address) => {
  try {
    const response = await melissaClient.get('/PropertyData', {
      params: {
        address: address.line1,
        city: address.city,
        state: address.state,
        zip: address.postalCode
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error enriching prospect data:', error);
    throw error;
  }
};