import sys
import json
import re

def filter_english_dishes(text):
    # Split by new lines
    lines = text.split("\n")

    filtered_dishes = []
    
    # Common non-dish words and categories to filter out
    non_dish_words = {
        'menu', 'appetizer', 'appetizers', 'desserts', 'drinks', 'beverages',
        'special', 'specials', 'side', 'sides', 'es', 'main', 'mains', 'entree', 'entrees',
          'desert', 'soups'
    }
    
    for line in lines:
        line = line.strip()

        # Skip empty lines
        if not line:
            continue

        # Remove numbers (prices) and unwanted labels
        line = re.sub(r"\b\d+\.\d+\b", "", line)  # Remove prices like 10.99
        line = re.sub(r"\b[A-Z]\d+\b", "", line)  # Remove labels like C5, E4
        line = re.sub(r"[④⑤]", "", line)  # Remove special characters
        line = re.sub(r"[^\x00-\x7F]+", "", line)  # Remove non-ASCII (Chinese characters)
        line = line.strip()  # Clean up any remaining whitespace

        # Convert to lowercase for category checking
        line_lower = line.lower()
        
        # Skip if the line is too short or matches any category/section words
        if (len(line) < 3 or 
            any(word in line_lower for word in non_dish_words) or
            any(line_lower.endswith(f" {word}") for word in non_dish_words)):
            continue

        # Ensure it's a valid dish name
        if (line and 
            re.search(r"[a-zA-Z]{3,}", line) and  # Must contain at least 3 consecutive letters
            not re.match(r"^[A-Z\d\s]{1,3}$", line)):  # Skip short uppercase codes
            # Convert to basic dish object structure expected by server
            filtered_dishes.append({
                "name": line.strip(),
                "description": "",
                "allergens": []
            })

    return filtered_dishes

if __name__ == "__main__":
    try:
        # Read input from Node.js
        input_text = sys.stdin.read()
        input_data = json.loads(input_text)

        extracted_text = input_data.get("text", "")

        # Process and filter the dish names
        dishes = filter_english_dishes(extracted_text)

        # Ensure we always return a valid JSON array of dishes
        if not dishes:
            dishes = []  # Return empty array if no dishes found

        # Return the cleaned dish objects as JSON
        print(json.dumps({"dishes": dishes}))

    except Exception as e:
        # Return error response in JSON format
        print(json.dumps({
            "dishes": [],
            "error": str(e)
        }))
