# Ollama Setup Script for Windows
# This script helps you set up Ollama and the DeepSeek R1 1.5B model

Write-Host "🚀 Ollama Setup Script for English Learning App" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if Ollama is already installed
Write-Host "`n📋 Checking if Ollama is installed..." -ForegroundColor Yellow
try {
    $ollamaVersion = ollama --version 2>$null
    if ($ollamaVersion) {
        Write-Host "✅ Ollama is already installed: $ollamaVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Ollama is not installed or not in PATH" -ForegroundColor Red
    Write-Host "`n📥 Installing Ollama..." -ForegroundColor Yellow
    
    # Download and install Ollama
    $ollamaUrl = "https://github.com/ollama/ollama/releases/latest/download/ollama-windows-amd64.msi"
    $installerPath = "$env:TEMP\ollama-installer.msi"
    
    try {
        Write-Host "Downloading Ollama installer..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $ollamaUrl -OutFile $installerPath
        
        Write-Host "Installing Ollama..." -ForegroundColor Yellow
        Start-Process msiexec.exe -Wait -ArgumentList "/i $installerPath /quiet"
        
        Write-Host "✅ Ollama installed successfully!" -ForegroundColor Green
        
        # Clean up installer
        Remove-Item $installerPath -Force
        
        # Add Ollama to PATH for current session
        $env:PATH += ";C:\Program Files\Ollama"
        
    } catch {
        Write-Host "❌ Failed to install Ollama automatically" -ForegroundColor Red
        Write-Host "Please download and install Ollama manually from: https://ollama.ai/download" -ForegroundColor Yellow
        exit 1
    }
}

# Check if Ollama service is running
Write-Host "`n🔍 Checking if Ollama service is running..." -ForegroundColor Yellow
try {
    $service = Get-Service -Name "Ollama" -ErrorAction SilentlyContinue
    if ($service -and $service.Status -eq "Running") {
        Write-Host "✅ Ollama service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Ollama service is not running. Starting it..." -ForegroundColor Yellow
        Start-Service -Name "Ollama" -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 3
        
        $service = Get-Service -Name "Ollama" -ErrorAction SilentlyContinue
        if ($service -and $service.Status -eq "Running") {
            Write-Host "✅ Ollama service started successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to start Ollama service" -ForegroundColor Red
            Write-Host "Please start Ollama manually or restart your computer" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️ Could not check Ollama service status" -ForegroundColor Yellow
}

# Check if DeepSeek model is available
Write-Host "`n🤖 Checking for DeepSeek R1 1.5B model..." -ForegroundColor Yellow
try {
    $models = ollama list 2>$null
    if ($models -match "deepseek-r1") {
        Write-Host "✅ DeepSeek R1 1.5B model is already installed" -ForegroundColor Green
    } else {
        Write-Host "📥 DeepSeek R1 1.5B model not found. Downloading..." -ForegroundColor Yellow
        Write-Host "This may take several minutes depending on your internet connection..." -ForegroundColor Cyan
        
        ollama pull deepseek-r1:1.5b
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ DeepSeek R1 1.5B model downloaded successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to download DeepSeek model" -ForegroundColor Red
            Write-Host "You can try downloading it manually with: ollama pull deepseek-r1:1.5b" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ Error checking/downloading model" -ForegroundColor Red
    Write-Host "Make sure Ollama is running and try again" -ForegroundColor Yellow
}

# Test the setup
Write-Host "`n🧪 Testing the setup..." -ForegroundColor Yellow
try {
    Write-Host "Testing model response..." -ForegroundColor Cyan
    $testResponse = ollama run deepseek-r1:1.5b "Hello" --timeout 10s 2>$null
    
    if ($testResponse) {
        Write-Host "✅ Setup test successful!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Setup test inconclusive - model may still be working" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Could not complete setup test" -ForegroundColor Yellow
}

# Final instructions
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "================" -ForegroundColor Green
Write-Host "Your English Learning App is now ready to use with AI-powered content!" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Start your React app with: npm run dev" -ForegroundColor White
Write-Host "2. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "3. Enter your occupation and interests to generate a personalized learning plan" -ForegroundColor White
Write-Host "`n💡 Tip: If you encounter any issues, check the OLLAMA_SETUP.md file for detailed troubleshooting" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
