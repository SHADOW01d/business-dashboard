#!/usr/bin/env python3
"""
ngrok Helper - Automatically configure ngrok tunnels for ProShop Dashboard
"""

import subprocess
import json
import time
import sys
import os
from pathlib import Path

try:
    import requests
except ImportError:
    print("❌ requests library not found. Install with: pip install requests")
    sys.exit(1)


class Colors:
    """ANSI color codes"""
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'  # No Color


def print_header():
    """Print script header"""
    print(f"{Colors.BLUE}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║    🌐 ngrok Helper - ProShop Dashboard Configuration       ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.NC}")


def check_ngrok_installed():
    """Check if ngrok is installed"""
    try:
        subprocess.run(['ngrok', '--version'], capture_output=True, check=True)
        print(f"{Colors.GREEN}✅ ngrok is installed{Colors.NC}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"{Colors.RED}❌ ngrok is not installed!{Colors.NC}")
        print()
        print("Install ngrok:")
        print("  Mac:   brew install ngrok/ngrok/ngrok")
        print("  Linux: Download from https://ngrok.com/download")
        print("  Windows: choco install ngrok")
        print()
        print("Then authenticate:")
        print("  ngrok config add-authtoken YOUR_AUTH_TOKEN")
        return False


def check_port_open(port):
    """Check if a port is open"""
    try:
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', port))
        sock.close()
        return result == 0
    except:
        return False


def check_services():
    """Check if Django and React are running"""
    print()
    print(f"{Colors.YELLOW}Checking services...{Colors.NC}")
    
    django_running = check_port_open(8000)
    react_running = check_port_open(3000)
    
    if django_running:
        print(f"{Colors.GREEN}✅ Django is running on port 8000{Colors.NC}")
    else:
        print(f"{Colors.RED}❌ Django is NOT running on port 8000{Colors.NC}")
        print(f"   Start with: {Colors.YELLOW}python manage.py runserver{Colors.NC}")
    
    if react_running:
        print(f"{Colors.GREEN}✅ React is running on port 3000{Colors.NC}")
    else:
        print(f"{Colors.RED}❌ React is NOT running on port 3000{Colors.NC}")
        print(f"   Start with: {Colors.YELLOW}cd frontend && npm start{Colors.NC}")
    
    print()
    return django_running and react_running


def get_ngrok_urls(max_retries=5):
    """Get current ngrok tunnel URLs"""
    for attempt in range(max_retries):
        try:
            response = requests.get('http://localhost:4040/api/tunnels', timeout=2)
            data = response.json()
            
            urls = {}
            for tunnel in data.get('tunnels', []):
                addr = tunnel.get('config', {}).get('addr', '')
                public_url = tunnel.get('public_url', '')
                
                if 'localhost:8000' in addr or '127.0.0.1:8000' in addr:
                    urls['backend'] = public_url
                elif 'localhost:3000' in addr or '127.0.0.1:3000' in addr:
                    urls['frontend'] = public_url
            
            if urls.get('backend') and urls.get('frontend'):
                return urls
            
            if attempt < max_retries - 1:
                print(f"{Colors.YELLOW}Waiting for tunnels to initialize... ({attempt + 1}/{max_retries}){Colors.NC}")
                time.sleep(2)
        
        except requests.exceptions.ConnectionError:
            if attempt < max_retries - 1:
                print(f"{Colors.YELLOW}Waiting for ngrok to start... ({attempt + 1}/{max_retries}){Colors.NC}")
                time.sleep(2)
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"{Colors.YELLOW}Retrying... ({attempt + 1}/{max_retries}){Colors.NC}")
                time.sleep(2)
    
    return None


def extract_domain(url):
    """Extract domain from URL"""
    return url.replace('https://', '').replace('http://', '')


def update_django_settings(backend_url):
    """Generate Django settings update instructions"""
    settings_file = Path('config/settings.py')
    
    if not settings_file.exists():
        print(f"{Colors.RED}❌ config/settings.py not found{Colors.NC}")
        return False
    
    backend_domain = extract_domain(backend_url)
    
    print(f"{Colors.BLUE}Django Settings Update:{Colors.NC}")
    print()
    print(f"Edit: {Colors.YELLOW}config/settings.py{Colors.NC}")
    print()
    print(f"1. Add to {Colors.CYAN}ALLOWED_HOSTS{Colors.NC}:")
    print(f"   {Colors.GREEN}'{backend_domain}',{Colors.NC}")
    print()
    
    return True


def update_cors_settings(frontend_url):
    """Generate CORS settings update instructions"""
    print(f"2. Add to {Colors.CYAN}CORS_ALLOWED_ORIGINS{Colors.NC}:")
    print(f"   {Colors.GREEN}'{frontend_url}',{Colors.NC}")
    print()


def update_react_config(backend_url):
    """Generate React config update instructions"""
    config_file = Path('frontend/src/config.js')
    
    if not config_file.exists():
        print(f"{Colors.YELLOW}⚠️  frontend/src/config.js not found{Colors.NC}")
        print(f"   Update your API_BASE_URL manually")
        return False
    
    print(f"{Colors.BLUE}React Config Update:{Colors.NC}")
    print()
    print(f"Edit: {Colors.YELLOW}frontend/src/config.js{Colors.NC}")
    print()
    print(f"Set {Colors.CYAN}API_BASE_URL{Colors.NC}:")
    print(f"   {Colors.GREEN}const API_BASE_URL = '{backend_url}';{Colors.NC}")
    print()
    
    return True


def print_next_steps(backend_url, frontend_url):
    """Print next steps"""
    print(f"{Colors.BLUE}🚀 Next Steps:{Colors.NC}")
    print()
    print(f"1. Update Django settings (see above)")
    print(f"2. Update React config (see above)")
    print(f"3. Restart Django:")
    print(f"   {Colors.YELLOW}python manage.py runserver{Colors.NC}")
    print(f"4. Restart React (in frontend directory):")
    print(f"   {Colors.YELLOW}npm start{Colors.NC}")
    print()


def print_testing_info(frontend_url):
    """Print testing information"""
    print(f"{Colors.BLUE}📱 Test on Mobile:{Colors.NC}")
    print()
    print(f"1. Open on phone/tablet: {Colors.CYAN}{frontend_url}{Colors.NC}")
    print(f"2. Login with your credentials")
    print(f"3. Test all features:")
    print(f"   - Add stock")
    print(f"   - Record sales")
    print(f"   - View dashboard")
    print(f"   - Dark/light mode")
    print()


def print_monitoring_info():
    """Print monitoring information"""
    print(f"{Colors.BLUE}📊 Monitor Requests:{Colors.NC}")
    print()
    print(f"Open in browser: {Colors.CYAN}http://localhost:4040{Colors.NC}")
    print(f"View all requests, responses, headers, and body data")
    print()


def print_security_warning():
    """Print security warning"""
    print(f"{Colors.YELLOW}⚠️  Security Warning:{Colors.NC}")
    print()
    print(f"Your ngrok URLs are PUBLIC - anyone with the URL can access!")
    print()
    print(f"Best practices:")
    print(f"  1. Use STRONG passwords for your accounts")
    print(f"  2. Enable 2FA (Two-Factor Authentication)")
    print(f"  3. Don't share ngrok URLs publicly")
    print(f"  4. Change URLs periodically")
    print(f"  5. Monitor ngrok dashboard for suspicious activity")
    print()


def main():
    """Main function"""
    print_header()
    
    # Check ngrok installation
    if not check_ngrok_installed():
        sys.exit(1)
    
    # Check services
    services_ok = check_services()
    
    if not services_ok:
        print(f"{Colors.YELLOW}⚠️  Some services are not running.{Colors.NC}")
        print(f"   Start them before running ngrok tunnels.")
        print()
    
    # Get ngrok URLs
    print(f"{Colors.YELLOW}Fetching ngrok tunnel URLs...{Colors.NC}")
    print()
    
    urls = get_ngrok_urls()
    
    if not urls:
        print(f"{Colors.RED}❌ Could not fetch ngrok tunnel URLs{Colors.NC}")
        print()
        print(f"{Colors.YELLOW}Troubleshooting:{Colors.NC}")
        print(f"1. Make sure ngrok tunnels are running:")
        print(f"   {Colors.CYAN}ngrok http 8000{Colors.NC}")
        print(f"   {Colors.CYAN}ngrok http 3000{Colors.NC}")
        print()
        print(f"2. Check ngrok status:")
        print(f"   {Colors.CYAN}curl http://localhost:4040/api/tunnels{Colors.NC}")
        print()
        print(f"3. View ngrok dashboard:")
        print(f"   {Colors.CYAN}http://localhost:4040{Colors.NC}")
        sys.exit(1)
    
    backend_url = urls.get('backend')
    frontend_url = urls.get('frontend')
    
    if not backend_url or not frontend_url:
        print(f"{Colors.RED}❌ Could not find both tunnel URLs{Colors.NC}")
        print(f"   Backend: {backend_url}")
        print(f"   Frontend: {frontend_url}")
        sys.exit(1)
    
    # Print results
    print(f"{Colors.GREEN}════════════════════════════════════════════════════════════{Colors.NC}")
    print(f"{Colors.GREEN}✅ ngrok Tunnels Found!{Colors.NC}")
    print(f"{Colors.GREEN}════════════════════════════════════════════════════════════{Colors.NC}")
    print()
    
    print(f"{Colors.BLUE}📡 Tunnel URLs:{Colors.NC}")
    print(f"   Backend:  {Colors.CYAN}{backend_url}{Colors.NC}")
    print(f"   Frontend: {Colors.CYAN}{frontend_url}{Colors.NC}")
    print()
    
    # Print configuration instructions
    print(f"{Colors.BLUE}📝 Configuration Required:{Colors.NC}")
    print()
    
    update_django_settings(backend_url)
    update_cors_settings(frontend_url)
    update_react_config(backend_url)
    
    # Print next steps
    print_next_steps(backend_url, frontend_url)
    
    # Print testing info
    print_testing_info(frontend_url)
    
    # Print monitoring info
    print_monitoring_info()
    
    # Print security warning
    print_security_warning()
    
    print(f"{Colors.GREEN}════════════════════════════════════════════════════════════{Colors.NC}")
    print(f"{Colors.GREEN}✅ Configuration complete!{Colors.NC}")
    print(f"{Colors.GREEN}════════════════════════════════════════════════════════════{Colors.NC}")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print()
        print(f"{Colors.YELLOW}Interrupted by user{Colors.NC}")
        sys.exit(0)
    except Exception as e:
        print()
        print(f"{Colors.RED}❌ Error: {e}{Colors.NC}")
        sys.exit(1)
