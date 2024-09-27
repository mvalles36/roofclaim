// src/services/ImageUploadApi.js
import axios from 'axios';

const API_URL = '/api/upload-images'; // Adjust this based on your server setup

/**
 * Uploads images to the Roboflow API.
 * @param {File[]} files - Array of image files to upload.
 * @returns {Promise} - Axios response promise.
 */
const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Return the response data from the server
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error; // Rethrow error for further handling if necessary
    }
};

export default { uploadImages };

