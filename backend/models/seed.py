from .models import db, Mission, Coordinate, ImageData
from datetime import datetime
import os


def seed_database(app):
    with app.app_context():
        if Mission.query.count() == 0 and Coordinate.query.count() == 0:
            sample_mission = Mission(
                name="Sample Mission",
                schedule=datetime.utcnow(),
                priority_score=0.8,
                mode="standard",
                overlap_pct=0.2,
                vision_range=200,
                speed=10,
                flight_time=25
            )
            db.session.add(sample_mission)

            sample_coordinates = [
                {"latitude": -33.0472, "longitude": -71.6127},
                {"latitude": 40.7128, "longitude": -74.0060},
                {"latitude": 51.5074, "longitude": -0.1278},
            ]
            for coord in sample_coordinates:
                new_coordinate = Coordinate(**coord, mission=sample_mission)
                db.session.add(new_coordinate)
            
            independent_coordinates = [
                {"latitude": 35.6762, "longitude": 139.6503},
                {"latitude": -33.8688, "longitude": 151.2093}
            ]
            for coord in independent_coordinates:
                new_coordinate = Coordinate(**coord)
                db.session.add(new_coordinate)

            sample_images = [
                {"filename": "sample1.jpg", "latitude": -33.0472, "longitude": -71.6127, "classification": "fire"},
                {"filename": "sample2.jpg", "latitude": 40.7128, "longitude": -74.0060, "classification": "smoke"},
                {"filename": "sample3.jpg", "latitude": 51.5074, "longitude": -0.1278, "classification": "ok"}
            ]
            for img_data in sample_images:
                if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], img_data['filename'])):
                    new_image = ImageData(**img_data)
                    db.session.add(new_image)
                else:
                    print(f"Warning: {img_data['filename']} not found in uploads folder. Skipping this entry.")
            
            db.session.commit()
            print("Database seeded successfully!")
        else:
            print("Database already contains data, skipping seed.")


from datetime import datetime, timedelta

def seed_missions():
    with app.app_context():
        # Clear existing missions
        Mission.query.delete()

        # Create two sample missions with Chilean coordinates
        mission1 = Mission(
            schedule=datetime.utcnow() + timedelta(days=1),
            priority_score=0.8,
            mode="search",
            overlap_pct=20,
            vision_range=200,
            speed=10,
            flight_time=25,
            user_generated=False,
            starting_lat=-33.4489,  # Santiago, Chile
            starting_long=-70.6693
        )

        mission2 = Mission(
            schedule=datetime.utcnow() + timedelta(days=2),
            priority_score=0.6,
            mode="patrol",
            overlap_pct=15,
            vision_range=250,
            speed=15,
            flight_time=30,
            user_generated=True,
            starting_lat=-33.0472,  # Valparaíso, Chile
            starting_long=-71.6127
        )

        # Add missions to the session and commit
        db.session.add(mission1)
        db.session.add(mission2)
        db.session.commit()

        print("Missions seeded successfully with Chilean coordinates!")