import axios from 'axios';

const roboflowClient = axios.create({
  baseURL: 'https://detect.roboflow.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_ROBOFLOW_API_KEY}`
  }
});

export const processImageWithRoboflow = async (imageUrl) => {
  try {
    const response = await roboflowClient.post('/roof-damage-b3lgl/3', {
      image: imageUrl
    });

    const predictions = response.data.predictions.map(prediction => ({
      class: prediction.class,
      confidence: prediction.confidence,
      bbox: {
        x: prediction.x,
        y: prediction.y,
        width: prediction.width,
        height: prediction.height
      }
    }));

    return {
      predictions,
      summary: generateDamageSummary(predictions),
      severity: calculateDamageSeverity(predictions)
    };
  } catch (error) {
    console.error('Error processing image with Roboflow:', error);
    throw error;
  }
};

const generateDamageSummary = (predictions) => {
  const damageTypes = predictions.reduce((acc, pred) => {
    acc[pred.class] = (acc[pred.class] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(damageTypes)
    .map(([type, count]) => `${count} instances of ${type}`)
    .join(', ');
};

const calculateDamageSeverity = (predictions) => {
  const severityScore = predictions.reduce((score, pred) => {
    return score + (pred.confidence * getDamageSeverityMultiplier(pred.class));
  }, 0);

  if (severityScore > 8) return 'Critical';
  if (severityScore > 5) return 'Severe';
  if (severityScore > 3) return 'Moderate';
  return 'Minor';
};

const getDamageSeverityMultiplier = (damageClass) => {
  const severityMap = {
    'hole': 2.0,
    'crack': 1.5,
    'water_damage': 1.8,
    'missing_shingle': 1.2
  };
  return severityMap[damageClass] || 1.0;
};