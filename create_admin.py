from supabase import create_client
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')

if not url or not key:
    print("ERROR: .env file mein SUPABASE_URL aur SUPABASE_KEY add karo pehle!")
    exit()

supabase = create_client(url, key)

print("=== Principal Account Setup ===\n")
name     = input("Principal ka poora naam: ").strip()
username = input("Username (e.g. principal): ").strip()
password = input("Password set karo: ").strip()

if not name or not username or not password:
    print("ERROR: Koi bhi field khali mat chodo.")
    exit()

existing = supabase.table('users').select('id').eq('username', username).execute()
if existing.data:
    print(f"\nERROR: '{username}' already exists.")
    exit()

result = supabase.table('users').insert({
    'name': name,
    'username': username,
    'password_hash': generate_password_hash(password),
    'role': 'principal',
    'class_assigned': None
}).execute()

if result.data:
    print(f"\n✅ Principal account ready!")
    print(f"   Username: {username}")
    print(f"\nAb run karo: python app.py")
else:
    print("❌ Kuch galat hua. Supabase connection check karo.")
