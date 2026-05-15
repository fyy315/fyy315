$supabaseUrl = "https://zizysoujrdzsqxcstilu.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppenlzb3VqcmR6c3F4Y3N0aWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTExNjYsImV4cCI6MjA5NDMyNzE2Nn0.GvUgim-TY0lZsYSmvUrAO0Y1Mkn02aNsGGFdkt_0cJE"

Write-Host "🔄 Testing Supabase API Connection..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📡 URL: $supabaseUrl" -ForegroundColor Green
Write-Host "🔑 Using ANON key" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "🧪 Test 1: GET /rest/v1/" -ForegroundColor Cyan
    
    $headers = @{
        'apikey' = $anonKey
        'Authorization' = "Bearer $anonKey"
        'Content-Type' = 'application/json'
    }
    
    $response = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/" -Method GET -Headers $headers -UseBasicParsing
    
    Write-Host "   ✅ Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "   📄 Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Yellow
    Write-Host "   📊 Response Length: $($response.Content.Length) bytes" -ForegroundColor Yellow
    
    if ($response.Content) {
        try {
            $json = $response.Content | ConvertFrom-Json
            Write-Host "   📋 Parsed JSON successfully" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  Could not parse JSON" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "🧪 Test 2: Checking tables with ?select=*" -ForegroundColor Cyan
    
    $response2 = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/?select=*" -Method GET -Headers $headers -UseBasicParsing
    
    Write-Host "   ✅ Status: $($response2.StatusCode)" -ForegroundColor Green
    
    if ($response2.Content -and $response2.Content.StartsWith('[')) {
        $tables = $response2.Content | ConvertFrom-Json
        Write-Host "   📊 Found $($tables.Count) items" -ForegroundColor Yellow
        if ($tables.Count -gt 0) {
            Write-Host "   📝 Sample item:" -ForegroundColor Cyan
            $tables[0] | ConvertTo-Json -Depth 3 | Write-Host
        }
    } else {
        Write-Host "   📄 Response: $($response2.Content)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🧪 Test 3: Check API version" -ForegroundColor Cyan
    
    $response3 = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/" -Method GET -Headers @{ 'apikey' = $anonKey; 'Accept' = 'application/json' } -UseBasicParsing
    
    Write-Host "   ✅ Server is responding" -ForegroundColor Green
    Write-Host "   📅 Server Date: $($response3.Headers['Date'])" -ForegroundColor Yellow
    
    Write-Host ""
    Write-Host "🎉 All Supabase API tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your Supabase project is accessible and ready to use!" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "❌ Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "   HTTP Status: $statusCode" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Check if your Supabase project is running" -ForegroundColor Gray
    Write-Host "   2. Verify your API keys are correct" -ForegroundColor Gray
    Write-Host "   3. Check your internet connection" -ForegroundColor Gray
}
