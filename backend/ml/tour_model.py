import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import sys
import os
import random

class TourMLRecommender:
    def __init__(self, model_path):
        try:
            print(f"Loading model from: {model_path}", file=sys.stderr)
            # Load the saved model
            model_components = joblib.load(model_path)
            self.mlb = model_components['mlb']
            self.activity_vectors = model_components['activity_vectors']
            self.tour_data = model_components['tour_data']
            print("Model loaded successfully", file=sys.stderr)
        except Exception as e:
            print(json.dumps({"error": f"Error loading model: {str(e)}"}))
            sys.exit(1)

    def distribute_times(self, num_activities):
        times = []
        start_hour = 9  # Start at 9 AM
        end_hour = 20   # End at 8 PM
        total_minutes = (end_hour - start_hour) * 60
        interval = total_minutes // (num_activities + 1)

        for i in range(num_activities):
            minutes = start_hour * 60 + (i + 1) * interval
            hour = minutes // 60
            minute = minutes % 60
            times.append(f"{hour:02d}:{minute:02d}")

        return times

    def calculate_duration(self, start_time, end_time):
        start_hour, start_minute = map(int, start_time.split(':'))
        end_hour, end_minute = map(int, end_time.split(':'))
        
        duration = (end_hour - start_hour) * 60 + (end_minute - start_minute)
        if duration < 0:
            duration += 24 * 60
        
        hours = duration // 60
        minutes = duration % 60
        
        return f"{hours}h {minutes}m"

    def generate_tour_plan(self, selected_tags, tour_days, budget, travelers, transport=None):
        try:
            print(f"Generating tour plan for tags: {selected_tags}", file=sys.stderr)
            if not selected_tags or len(selected_tags) == 0:
                raise ValueError("No tags selected")
            
            if tour_days < 3:
                raise ValueError("Tour must be at least 3 days")
            
            if tour_days > 11:
                raise ValueError("Please enter less than 12 days")

            # Create user preference vector
            user_vector = self.mlb.transform([selected_tags])[0]
            print("User preference vector created", file=sys.stderr)

            # Split schedules by day type
            arrivals = [t for t in self.tour_data if t['day_type'] == 'arrival' and t['location'] == 'Negombo']
            departures = [t for t in self.tour_data if t['day_type'] == 'departure' and t['location'] == 'Colombo']
            mids = [t for t in self.tour_data if t['day_type'] == 'mid']

            # Calculate similarity scores for mid-days
            mid_scores = []
            for tour in mids:
                tour_tags = []
                for activity in tour['activities']:
                    tour_tags.extend(activity['tags'])
                
                similarity = len(set(selected_tags) & set(tour_tags)) / len(set(selected_tags) | set(tour_tags))
                mid_scores.append((tour, similarity))

            print(f"Found {len(mid_scores)} potential mid-days", file=sys.stderr)
            
            # Sort by similarity score
            mid_scores.sort(key=lambda x: x[1], reverse=True)
            
            # Select top matching mid-days with randomization
            num_mid_days = tour_days - 2
            selected_mids = []
            
            # Take top 3 most similar days
            top_matches = [score[0] for score in mid_scores[:3]]
            if top_matches:
                selected_mids.append(random.choice(top_matches))
            
            # Fill remaining days with random selection
            remaining = [m for m in mids if m not in selected_mids]
            while len(selected_mids) < num_mid_days and remaining:
                selected_mids.append(random.choice(remaining))
                remaining = [m for m in mids if m not in selected_mids]

            # Randomly select arrival and departure
            arrival_day = random.choice(arrivals)
            departure_day = random.choice(departures)

            # Shuffle the mid-days
            random.shuffle(selected_mids)

            # Combine all days
            tour_plan = [arrival_day] + selected_mids + [departure_day]

            # Format response
            response = {
                'dailyItinerary': [],
                'accommodation': [],
                'transportation': [],
                'budget': {
                    'accommodation': 0,
                    'transportation': 0,
                    'activities': 0,
                    'food': 0
                },
                'tips': []
            }

            # Process each day
            for day in tour_plan:
                day_activities = []
                activities = day['activities']
                
                # Get distributed times
                times = self.distribute_times(len(activities))
                
                for i, activity in enumerate(activities):
                    start_time = times[i]
                    end_time = times[i + 1] if i + 1 < len(times) else "20:00"
                    duration = self.calculate_duration(start_time, end_time)
                    
                    day_activities.append({
                        'time': start_time,
                        'name': activity['description'],
                        'description': activity['description'],
                        'location': day['location'],
                        'duration': duration
                    })
                
                response['dailyItinerary'].append({
                    'location': day['location'],
                    'dayType': day['day_type'],
                    'activities': day_activities
                })

            # Add tips
            response['tips'] = [
                "Best time to visit temples is early morning to avoid crowds",
                "Dress modestly when visiting religious sites",
                "Carry water and sunscreen during outdoor activities",
                "Book accommodation in advance during peak season",
                "Consider hiring a local guide for better cultural insights"
            ]

            return response

        except Exception as e:
            raise Exception(f"Error generating tour plan: {str(e)}")

if __name__ == "__main__":
    try:
        # Get input from command line
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided"}))
            sys.exit(1)

        # Parse input
        input_data = json.loads(sys.argv[1])
        selected_tags = input_data.get('selectedTags', [])
        tour_days = input_data.get('tourDays', 5)
        budget = input_data.get('budget', 'Mid-range')
        travelers = input_data.get('travelers', 2)
        transport = input_data.get('transport')

        # Initialize the recommender with the saved model
        model_path = os.path.join(os.path.dirname(__file__), 'models/tour_recommender.joblib')
        recommender = TourMLRecommender(model_path)
        
        # Generate tour plan
        tour_plan = recommender.generate_tour_plan(selected_tags, tour_days, budget, travelers, transport)
        
        # Print only the final result as JSON
        print(json.dumps(tour_plan))
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid input JSON format"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1) 