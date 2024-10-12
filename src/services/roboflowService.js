import axios from 'axios';

export const processImageWithRoboflow = async (imageUrl) => {
  try {
    const response = await axios.post(
      'https://detect.roboflow.com/roof-damage-b3lgl/3',
      imageUrl,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${import.meta.env.VITE_ROBOFLOW_API_KEY}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error processing image with Roboflow:', error);
    throw error;
  }
};