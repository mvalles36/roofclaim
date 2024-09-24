import axios from 'axios';

export const fetchLeadsFromMelissaData = async (center, radius) => {
  const apiUrl = `https://reversegeo.melissadata.net/v3/web/ReverseGeoCode/doLookup`;
  const params = {
    id: import.meta.env.VITE_MELISSA_DATA_API_KEY,
    format: 'json',
    recs: '100',
    opt: 'IncludeApartments:off;IncludeUndeliverable:off;IncludeEmptyLots:off',
    lat: center.lat,
    lon: center.lng,
    MaxDistance: radius
  };

  try {
    const response = await axios.get(apiUrl, { params });
    if (response.data && response.data.Records) {
      return response.data.Records.map(record => ({
        AddressLine1: record.AddressLine1,
        City: record.City,
        State: record.State,
        PostalCode: record.PostalCode,
        Latitude: record.Latitude,
        Longitude: record.Longitude
      }));
    } else {
      throw new Error('Invalid response from Melissa Data API');
    }
  } catch (error) {
    console.error('Error fetching data from Melissa Data API:', error);
    throw error;
  }
};
