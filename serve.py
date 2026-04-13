"""
Custom static file server for GenAI Masterclass.
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CleanHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable caching for local development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[SERVE] {format % args}")

PORT = 8999
www_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'www')
os.chdir(www_dir)

print(f"Serving GenAI Masterclass at: http://localhost:{PORT}")
print(f"Serving from: {www_dir}")
print(f"   (Press Ctrl+C to stop)\n")

httpd = HTTPServer(('', PORT), CleanHandler)
httpd.serve_forever()
