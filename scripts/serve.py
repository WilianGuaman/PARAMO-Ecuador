from __future__ import annotations

import argparse
import http.server
import socket
import socketserver
import threading
import webbrowser
from pathlib import Path


def find_port(host: str, preferred: int, attempts: int = 20, strict: bool = False) -> int:
    """Return an available port.

    Local Windows launches may fall forward to the next available port. Cloud
    runtimes use --strict-port so the configured forwarded port remains stable.
    """
    ports = [preferred] if strict else range(preferred, preferred + attempts)
    for port in ports:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind((host, port))
            except OSError:
                continue
            return port
    if strict:
        raise RuntimeError(f"Port {preferred} is not available on {host}.")
    raise RuntimeError(f"No free port found in {preferred}..{preferred + attempts - 1} on {host}.")


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the PARAMO local results viewer.")
    parser.add_argument("--host", default="127.0.0.1", help="Bind address. Use 0.0.0.0 inside Codespaces.")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--strict-port", action="store_true", help="Fail instead of selecting the next free port.")
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    port = find_port(args.host, args.port, strict=args.strict_port)

    def handler(*hargs, **hkwargs):
        return QuietHandler(*hargs, directory=str(root), **hkwargs)

    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer((args.host, port), handler) as server:
        browser_url = f"http://127.0.0.1:{port}/index.html"
        terminal_url = f"http://localhost:{port}/index.html"
        print("=" * 72)
        print("PARAMO Ecuador Results Explorer")
        print(terminal_url)
        print("Press Ctrl+C to stop the server.")
        print("=" * 72)
        if not args.no_browser:
            threading.Timer(0.6, lambda: webbrowser.open(browser_url)).start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nPARAMO server stopped.")


if __name__ == "__main__":
    main()
