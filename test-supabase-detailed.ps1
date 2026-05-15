$supabaseUrl = "https://zizysoujrdzsqxcstilu.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppenlzb3VqcmR6c3F4Y3N0aWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTExNjYsImV4cCI6MjA5NDMyNzE2Nn0.GvUgim-TY0lZsYSmvUrAO0Y1Mkn02aNsGGFdkt_0cJE"

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "     Supabase API Connection Test" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📡 Project URL: $supabaseUrl" -ForegroundColor Yellow
Write-Host "🔑 API Type: ANON (Public)" -ForegroundColor Yellow
Write-Host ""

function Test-SupabaseConnection {
    param([string]$Endpoint, [string]$Description)
    
    Write-Host "🧪 $Description" -ForegroundColor Cyan
    Write-Host "   Endpoint: $Endpoint" -ForegroundColor Gray
    
    try {
        $headers = @{
            'apikey' = $anonKey
            'Authorization' = "Bearer $anonKey"
            'Content-Type' = 'application/json'
            'Prefer' = 'return=representation'
        }
        
        $response = Invoke-WebRequest -Uri "$supabaseUrl$Endpoint" -Method GET -Headers $headers -UseBasicParsing -TimeoutSec 10
        
        Write-Host "   ✅ Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
        
        if ($response.Content) {
            $contentLength = $response.Content.Length
            Write-Host "   📊 Response Size: $contentLength bytes" -ForegroundColor Yellow
            
            if ($contentLength -gt 0 -and $contentLength -lt 1000) {
                try {
                    $json = $response.Content | ConvertFrom-Json
                    Write-Host "   📋 Response Preview:" -ForegroundColor Cyan
                    $json | ConvertTo-Json -Depth 2 | ForEach-Object { 
                        $_ -split "`n" | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
                    }
                } catch {
                    Write-Host "   📄 Response: $($response.Content)" -ForegroundColor Gray
                }
            }
        }
        
        Write-Host ""
        return $true
        
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            Write-Host "   🔢 HTTP Status: $statusCode" -ForegroundColor Red
            
            if ($statusCode -eq 401) {
                Write-Host "   💡 Hint: Check your API keys in Supabase Dashboard" -ForegroundColor Yellow
            } elseif ($statusCode -eq 404) {
                Write-Host "   💡 Hint: Resource not found. Create tables first." -ForegroundColor Yellow
            }
        }
        Write-Host ""
        return $false
    }
}

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Connection Tests" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$test1 = Test-SupabaseConnection -Endpoint "/rest/v1/" -Description "Test 1: REST API Root"
$test2 = Test-SupabaseConnection -Endpoint "/rest/v1/?limit=1" -Description "Test 2: Query Tables"
$test3 = Test-SupabaseConnection -Endpoint "/rest/v1/users?select=*" -Description "Test 3: Check 'users' table"

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($test1 -and $test2) {
    Write-Host "🎉 Supabase API is accessible!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Go to Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor Gray
    Write-Host "  2. Create tables in your SQL Editor" -ForegroundColor Gray
    Write-Host "  3. Enable Row Level Security (RLS) policies" -ForegroundColor Gray
    Write-Host "  4. Start building your app!" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Some tests failed" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Cyan
    Write-Host "  1. Check if your Supabase project is paused/stopped" -ForegroundColor Gray
    Write-Host "  2. Verify API keys in Settings > API" -ForegroundColor Gray
    Write-Host "  3. Check network/firewall settings" -ForegroundColor Gray
    Write-Host "  4. Consider rotating your keys if they were exposed" -ForegroundColor Red
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
