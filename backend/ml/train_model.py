import json
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

def load_data(data_path):
    with open(data_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def prepare_training_data(tour_data):
    # Extract all unique activities and their tags
    all_activities = set()
    activity_vectors = {}
    
    for tour in tour_data:
        for activity in tour['activities']:
            all_activities.update(activity['tags'])
    
    # Create and fit the binarizer
    mlb = MultiLabelBinarizer()
    mlb.fit([list(all_activities)])
    
    # Create activity vectors for each tour
    for tour in tour_data:
        activities = []
        for activity in tour['activities']:
            activities.extend(activity['tags'])
        activity_vectors[tour['title']] = mlb.transform([activities])[0]
    
    return mlb, activity_vectors

def train_model(data_path):
    # Load the data
    tour_data = load_data(data_path)
    
    # Prepare training data
    mlb, activity_vectors = prepare_training_data(tour_data)
    
    # Save the model components
    model_components = {
        'mlb': mlb,
        'activity_vectors': activity_vectors,
        'tour_data': tour_data
    }
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Save the model
    joblib.dump(model_components, 'models/tour_recommender.joblib')
    print("Model saved successfully!")

if __name__ == "__main__":
    data_path = '../data/tour_schedules_dataset_full.json'
    train_model(data_path) 