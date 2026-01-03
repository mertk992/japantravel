
import os
import json
import re

# Configuration
PHOTOS_DIR = "photos"
OUTPUT_FILE = "journal/photo_map.json"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic"} 

def scan_photos():
    photo_map = {}
    
    # Ensure output dir exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    # 1. Scan for Day_X folders
    if os.path.exists(PHOTOS_DIR):
        for entry in os.listdir(PHOTOS_DIR):
            folder_path = os.path.join(PHOTOS_DIR, entry)
            
            # Check if it's a directory and matches "Day_N"
            if os.path.isdir(folder_path) and entry.startswith("Day_"):
                try:
                    day_id = entry.split("_")[1]
                    # Verify ID is a number
                    int(day_id)
                    
                    # 2. Collect images in this folder
                    images = []
                    for filename in sorted(os.listdir(folder_path)):
                        if not filename.startswith('.'): # Ignore hidden files
                            ext = os.path.splitext(filename)[1].lower()
                            if ext in ALLOWED_EXTENSIONS:
                                # Store relative path for frontend usage
                                # e.g. "photos/Day_1/image.jpg"
                                relative_path = f"{PHOTOS_DIR}/{entry}/{filename}"
                                images.append(relative_path)
                    
                    if images:
                        photo_map[day_id] = images
                        print(f"Found {len(images)} photos for Day {day_id}")
                        
                except ValueError:
                    continue

    # 3. Write to JSON
    with open(OUTPUT_FILE, "w") as f:
        json.dump(photo_map, f, indent=4)
    
    print(f"✅ Photo map generated at {OUTPUT_FILE}")

if __name__ == "__main__":
    scan_photos()
