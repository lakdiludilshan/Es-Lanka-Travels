# ES Lanka Travels - AI-Powered Tour Planning System

A comprehensive tour planning system that uses machine learning to generate personalized travel itineraries for Sri Lanka. The system combines user preferences, budget constraints, and local expertise to create optimal travel plans.

## Features

- **AI-Powered Tour Planning**: Machine learning model generates personalized itineraries based on user preferences
- **Smart Activity Matching**: Matches activities with user preferences using content-based filtering
- **Dynamic Itinerary Generation**: Creates day-by-day plans with optimal time distribution
- **Budget Management**: Calculates and manages costs for accommodation, transportation, activities, and food
- **User Preference System**: Saves and processes user preferences for better recommendations
- **Responsive Design**: Modern UI with mobile-first approach using Tailwind CSS

## Tech Stack

### Backend
- Node.js with Express
- MongoDB for data storage
- Python for ML model
- scikit-learn for machine learning
- joblib for model persistence

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

## Project Structure

```
├── backend/
│   ├── controllers/     # Request handlers
│   ├── data/           # Training data and datasets
│   ├── middleware/     # Authentication and other middleware
│   ├── ml/            # Machine learning model and scripts
│   │   ├── models/    # Trained model files
│   │   └── data/      # ML training data
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── server.js      # Main server file
│
├── frontend/
│   ├── public/        # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   ├── hooks/      # Custom hooks
│   │   └── utils/      # Utility functions
│   └── package.json   # Frontend dependencies
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd es-lanka-travels
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Install Python dependencies
   cd ml
   pip install -r requirements.txt
   # Train the model
   python train_model.py
   cd ..
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Setup**
   - Create `.env` file in backend directory
   - Add necessary environment variables (MongoDB URI, JWT secret, etc.)

5. **Start the Application**
   ```bash
   # Start backend (from backend directory)
   npm start
   
   # Start frontend (from frontend directory)
   npm run dev
   ```

## ML Model Details

The system uses a content-based filtering approach with the following components:
- MultiLabelBinarizer for activity matching
- Cosine similarity for preference matching
- Pre-trained model saved in `.joblib` format
- Dynamic itinerary generation based on user preferences

## API Endpoints

- `POST /api/tour/generate` - Generate tour plan
- `POST /api/preferences/save` - Save user preferences
- `GET /api/preferences/:email` - Get user preferences
- `GET /api/places` - Get available places
- `GET /api/hotels` - Get available hotels

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact [contact information] 