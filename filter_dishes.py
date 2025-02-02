import sys
import json
import re

def filter_english_dishes(text):
    # Split by new lines
    lines = text.split("\n")

    filtered_dishes = []

    for line in lines:
        line = line.strip()

        # Remove numbers (prices) and unwanted labels
        line = re.sub(r"\b\d+\.\d+\b", "", line)  # Remove prices like 10.99
        line = re.sub(r"\b[A-Z]\d+\b", "", line)  # Remove labels like C5, E4
        line = re.sub(r"[④⑤]", "", line)  # Remove special characters
        line = re.sub(r"[^\x00-\x7F]+", "", line)  # Remove non-ASCII (Chinese characters)

        # Ensure it's a valid dish name
        if line and re.search(r"[a-zA-Z]", line):  # Must contain at least one English letter
            filtered_dishes.append(line.strip())

    return filtered_dishes

if __name__ == "__main__":
    # Read input from Node.js
    input_text = sys.stdin.read()
    input_data = json.loads(input_text)

    extracted_text = input_data.get("text", "")

    # Process and filter the dish names
    dishes = filter_english_dishes(extracted_text)

    # Return the cleaned dish names as JSON
    print(json.dumps({"dishes": dishes}))
