import asyncio
import sys
from pathlib import Path
import websockets

sys.stdout.reconfigure(line_buffering=True)
VIDEO_PATH = Path(r"C:\Users\Lenovo\.gemini\antigravity\scratch\breathewise-ai\docs\video\breathewise_reel_9x16.mp4")

async def handler(websocket):
    print("Client connected to WS server!", flush=True)
    data = VIDEO_PATH.read_bytes()
    print(f"Sending video bytes: {len(data)} bytes...", flush=True)
    await websocket.send(data)
    print("Video bytes sent successfully!", flush=True)
    await asyncio.sleep(2)

async def main():
    print("Starting WebSocket server on host None (all interfaces) port 8765...", flush=True)
    async with websockets.serve(handler, host=None, port=8765):
        print("Server is listening on port 8765!", flush=True)
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
