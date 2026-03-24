import sys
import json
import re
import requests
from bs4 import BeautifulSoup
import waybackpy
from datetime import datetime

def scrape_ebay_and_archive(raw_url):
    # Sanitize URL: Remove backslashes and strip tracking parameters
    clean_url = raw_url.split('?')[0].replace('\\', '').strip()
    headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

    try:
        res = requests.get(clean_url, headers=headers)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, 'html.parser')

        # 'm' - Price Cleanup (removes duplicates)
        price_node = soup.select_one('.x-item-condensed-card__price .ux-textspans')
        price = "N/A"
        if price_node:
            price_raw = price_node.get_text(strip=True)
            price_match = re.search(r'\$\d+\.\d{2}', price_raw)
            price = price_match.group(0) if price_match else price_raw

        # 's' - Date Cleanup (fixes YYYY-MM-DD and leap year warnings)
        date_node = soup.select_one('.x-item-condensed-card__date .ux-textspans--SECONDARY')
        date_sold = "N/A"
        if date_node:
            date_raw = date_node.get_text(strip=True)
            # Regex to pull "Month Day" e.g., "Feb 15"
            date_match = re.search(r'[A-Z][a-z]{2}\s\d{1,2}', date_raw)
            if date_match:
                current_year = datetime.now().year
                # Add year to avoid Python 3.15 ambiguity warnings
                date_with_year = f"{date_match.group(0)} {current_year}"
                dt = datetime.strptime(date_with_year, "%b %d %Y")
                date_sold = dt.strftime("%Y-%m-%d")
            else:
                date_sold = date_raw

        # 'l' - Wayback Archiving
        wayback = waybackpy.Url(clean_url, "Mozilla/5.0 (Arch Linux Script)")
        archive = wayback.save()
        
        return json.dumps({"m": price, "s": date_sold, "l": archive.archive_url}, indent=2)

    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    while True:
        try:
            user_input = input("eBay URL: ").strip()
            if not user_input:
                continue
            
            result = scrape_ebay_and_archive(user_input)
            print(f"\n{result}\n")
            print("-" * 30)
            
        except KeyboardInterrupt:
            print("\nExiting...")
            break
