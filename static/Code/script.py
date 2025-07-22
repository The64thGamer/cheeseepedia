import os
import csv
import re

# Use the current directory where the script is being run
INPUT_DIR = os.getcwd()
OUTPUT_CSV = "locations_output.csv"

def extract_frontmatter_and_body(text):
    match = re.match(r"\+\+\+\n(.*?)\n\+\+\+\n(.*)", text, re.DOTALL)
    if not match:
        return None, None
    frontmatter, body = match.groups()
    return frontmatter.strip(), body.strip()

def parse_frontmatter(raw):
    params = {}
    for line in raw.splitlines():
        if "=" in line:
            key, val = line.split("=", 1)
            key = key.strip()
            val = val.strip()
            params[key] = val
    return params

def main():
    rows = []
    all_keys = set()

    for filename in os.listdir(INPUT_DIR):
        if not filename.endswith(".md"):
            continue

        with open(os.path.join(INPUT_DIR, filename), encoding="utf-8") as f:
            content = f.read()

        frontmatter_raw, body = extract_frontmatter_and_body(content)
        if not frontmatter_raw:
            continue

        params = parse_frontmatter(frontmatter_raw)

        # Only include files with tags = ["Locations"]
        if "tags" not in params or params["tags"] != '["Locations"]':
            continue

        params["__body"] = f'"{body.replace("\"", "\"\"")}"'  # escape quotes for CSV

        all_keys.update(params.keys())
        rows.append(params)

    if not rows:
        print("⚠️ No matching files with tags = [\"Locations\"] found.")
        return

    # Order keys so body is last
    fieldnames = sorted(all_keys - {"__body"}) + ["__body"]

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for row in rows:
            writer.writerow({k: row.get(k, "") for k in fieldnames})

    print(f"✅ Wrote {len(rows)} row(s) to {OUTPUT_CSV} in {INPUT_DIR}")

if __name__ == "__main__":
    main()
