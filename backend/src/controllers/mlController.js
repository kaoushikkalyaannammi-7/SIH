import axios from 'axios';

export const getPredictions = async (req, res) => {
  try {
    // Call the Python ML Service
    const mlResponse = await axios.post('http://localhost:8000/predict', req.body);
    res.json(mlResponse.data);
  } catch (error) {
    console.error('Error calling ML service', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
};

export const getExplanation = async (req, res) => {
  try {
    // Call the Python ML Service
    const mlResponse = await axios.post('http://localhost:8000/explain', req.body);
    res.json(mlResponse.data);
  } catch (error) {
    console.error('Error calling ML service explanation', error);
    res.status(500).json({ error: 'Failed to fetch explanation' });
  }
};
