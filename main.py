import requests
import re

def fetch_google_search_results(query, location, platform, site):
    search_query = f'site:{site} "{query}" "{location}" "{platform}"'
    search_url = f"https://www.google.com/search?q={requests.utils.quote(search_query)}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    
    try:
        response = requests.get(search_url, headers=headers)
        
        # Regex pattern for email extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        
        # Find all email matches in the response text
        emails = re.findall(email_pattern, response.text)
        
        # Print extracted emails
        if emails:
            print("Extracted emails:")
            for email in emails:
                print(email)
        else:
            print("No emails found in the search results.")
    
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")

# Example usage
query = "gmail.com"
location = "agency"
platform = "India"
site = "instagram.com"
fetch_google_search_results(query, location, platform, site)