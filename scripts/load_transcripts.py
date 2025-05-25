# /// script
# dependencies = [
#   "requests<3",
# ]
# ///

import sys
import os
import requests
import glob


def parse_input_params():
    if len(sys.argv) < 4:
        print("Usage: python load_transcripts.py <host> <username> <password>")
        sys.exit(1)
    
    host = sys.argv[1]
    if host.endswith('/'):
        host = host[:-1]
    if not host.startswith('http://') and not host.startswith('https://'):
        host = 'http://' + host
    username = sys.argv[2]
    password = sys.argv[3]
    return host, username, password

def filename_to_name(filename):
    # Remove extension, split by dash, capitalize each part
    base = os.path.splitext(os.path.basename(filename))[0]
    parts = base.split('-')
    return ' '.join([p.capitalize() for p in parts])

def get_entities(host, cookie_token, org_type):
    resp = requests.get(f"{host}/entities/?type={org_type}", headers={"Cookie": cookie_token})
    resp.raise_for_status()
    return resp.json().get('results', [])

def create_entity(host, cookie_token, name, org_type):
    resp = requests.post(f"{host}/entity/", json={"name": name, "type": org_type}, headers={"Cookie": cookie_token})
    resp.raise_for_status()
    return resp.json()['entity_id']

def create_document(host, cookie_token, entity_id, content):
    resp = requests.post(f"{host}/document/", json={"entity_id": entity_id, "type": "transcript", "content": content}, headers={"Cookie": cookie_token})
    resp.raise_for_status()
    return resp.json()['document_id']

def main():
    host, username, password = parse_input_params()
    
    response = requests.post(f"{host}/login/", json={
        "email": username,
        "password": password,
    })
    response.raise_for_status()
    cookie_token = response.headers['Set-Cookie'].split(';')[0]
    print(f"Logged in successfully")

    # Load mentors
    mentor_files = glob.glob("test/transcripts/mentors/*.txt")
    existing_mentors = get_entities(host, cookie_token, "mentor")
    mentor_name_to_id = {e['name']: e['entity_id'] for e in existing_mentors}
    for file in mentor_files:
        name = filename_to_name(file)
        if name in mentor_name_to_id:
            entity_id = mentor_name_to_id[name]
            print(f"Mentor '{name}' already exists, skipping entity creation.")
        else:
            entity_id = create_entity(host, cookie_token, name, "mentor")
            print(f"Created mentor entity: {name}")
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        create_document(host, cookie_token, entity_id, content)
        print(f"Uploaded transcript for mentor: {name}")

    # Load startups
    startup_files = glob.glob("test/transcripts/startups/*.txt")
    existing_startups = get_entities(host, cookie_token, "startup")
    startup_name_to_id = {e['name']: e['entity_id'] for e in existing_startups}
    for file in startup_files:
        name = filename_to_name(file)
        if name in startup_name_to_id:
            entity_id = startup_name_to_id[name]
            print(f"Startup '{name}' already exists, skipping entity creation.")
        else:
            entity_id = create_entity(host, cookie_token, name, "startup")
            print(f"Created startup entity: {name}")
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        create_document(host, cookie_token, entity_id, content)
        print(f"Uploaded transcript for startup: {name}")
    
    
    
if __name__ == "__main__":
    main()
