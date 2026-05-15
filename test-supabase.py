import os
import http.client
import json

SUPABASE_URL = "https://zizysoujrdzsqxcstilu.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppenlzb3VqcmR6c3F4Y3N0aWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTExNjYsImV4cCI6MjA5NDMyNzE2Nn0.GvUgim-TY0lZsYSmvUrAO0Y1Mkn02aNsGGFdkt_0cJE"

def test_supabase_api():
    print("🔄 Testing Supabase API Connection...\n")
    print("📡 URL:", SUPABASE_URL)
    print("🔑 Using ANON key\n")
    
    try:
        conn = http.client.HTTPSConnection("zizysoujrdzsqxcstilu.supabase.co")
        
        headers = {
            'apikey': ANON_KEY,
            'Authorization': f'Bearer {ANON_KEY}',
            'Content-Type': 'application/json'
        }
        
        print("🧪 Test 1: GET /rest/v1/")
        conn.request("GET", "/rest/v1/", headers=headers)
        res = conn.getresponse()
        data = res.read()
        
        print(f"   Status: {res.status} {res.reason}")
        print(f"   Response: {data.decode('utf-8')[:200]}...")
        
        if res.status == 200:
            print("   ✅ REST API is accessible!\n")
        else:
            print(f"   ⚠️  API returned status {res.status}\n")
        
        print("🧪 Test 2: Checking tables...")
        conn.request("GET", "/rest/v1/?limit=5", headers=headers)
        res = conn.getresponse()
        data = res.read()
        
        print(f"   Status: {res.status} {res.reason}")
        if data:
            try:
                tables = json.loads(data.decode('utf-8'))
                print(f"   📊 Found {len(tables)} items")
                if tables:
                    print(f"   Sample: {json.dumps(tables[0], indent=2)[:200]}...")
            except:
                print(f"   Response: {data.decode('utf-8')[:200]}...")
        
        print("\n🧪 Test 3: Checking PostgREST version...")
        conn.request("GET", "/rest/v1/", headers={**headers, 'Accept': 'application/json'})
        res = conn.getresponse()
        
        print(f"   Status: {res.status}")
        print(f"   Headers: {dict(res.getheaders())}")
        
        print("\n🎉 Supabase API Connection Test Complete!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_supabase_api()
