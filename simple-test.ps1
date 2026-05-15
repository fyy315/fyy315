$supabaseUrl = "https://zizysoujrdzsqxcstilu.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppenlzb3VqcmR6c3F4Y3N0aWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTExNjYsImV4cCI6MjA5NDMyNzE2Nn0.GvUgim-TY0lZsYSmvUrAO0Y1Mkn02aNsGGFdkt_0cJE"

Write-Host "Supabase API Connection Test"
Write-Host "================================"
Write-Host "URL: $supabaseUrl"
Write-Host ""

try {
    Write-Host "Test 1: REST API Root"
    
    $headers = @{
        'apikey' = $anonKey
        'Authorization' = "Bearer $anonKey"
    }
    
    $response = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/" -Method GET -Headers $headers -UseBasicParsing
    
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Content: $($response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)))"
    Write-Host ""
    
    Write-Host "Test 2: Query with limit"
    $response2 = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/?limit=5" -Method GET -Headers $headers -UseBasicParsing
    Write-Host "Status: $($response2.StatusCode)"
    Write-Host "Response: $($response2.Content)"
    Write-Host ""
    
    Write-Host "All tests passed!"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        Write-Host "HTTP Status: $statusCode"
        
        if ($statusCode -eq 401) {
            Write-Host "401 Unauthorized - Check your API keys"
        } elseif ($statusCode -eq 404) {
            Write-Host "404 Not Found - Resource may not exist or RLS blocking access"
        }
    }
}
