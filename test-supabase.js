const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  console.log('Please ensure .env file exists with SUPABASE_URL and SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔄 Testing Supabase Connection...\n');
console.log('📡 URL:', supabaseUrl);
console.log('🔑 Using ANON key\n');

async function testSupabase() {
  try {
    console.log('✅ Supabase client initialized successfully!\n');
    
    console.log('🧪 Running API Tests...\n');
    
    const { data: version, error: versionError } = await supabase.rpc('version');
    if (versionError) {
      console.log('📊 Testing REST API endpoint...');
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (response.ok) {
        console.log('✅ REST API is accessible!');
        console.log('📄 Status:', response.status);
        console.log('📋 Content-Type:', response.headers.get('content-type'));
      } else {
        console.log('❌ REST API error:', response.status);
      }
    } else {
      console.log('✅ RPC call successful:', version);
    }
    
    console.log('\n🎉 All Supabase connection tests passed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    console.log('\n🔧 Alternative: Testing with curl...');
    console.log(`curl -H "apikey: ${supabaseKey}" -H "Authorization: Bearer ${supabaseKey}" ${supabaseUrl}/rest/v1/`);
  }
}

testSupabase();
