import datetime
import uuid
import os

# Create a 'results' folder if it doesn't exist
results_folder = 'results'
if not os.path.exists(results_folder):
    os.makedirs(results_folder)

run_id = uuid.uuid4()
current_time = datetime.datetime.now()
timestamp = current_time.strftime("%Y%m%d_%H%M%S")

# Create an empty file with timestamp as name
file_name = f"{timestamp}.txt"
file_path = os.path.join(results_folder, file_name)
with open(file_path, 'w') as f:
    pass  # This creates an empty file

print(f"Script executed at: {current_time}")
print(f"Unique run ID: {run_id}")
#print(f"Empty file created: {file_path}")
#print("Hello from script.py!")
#print("This is the output of the Python script.")