import uvicorn
import socket
from backend.main import app

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    local_ip = get_local_ip()
    print("=" * 60)
    print("[+] SupplyChain.AI - Enterprise Platform Server")
    print("[*] Local Access:    http://localhost:8000")
    print(f"[*] Mobile/Network:  http://{local_ip}:8000")
    print("[*] API Docs:        http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

