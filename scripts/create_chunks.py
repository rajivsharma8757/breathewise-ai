import base64
from pathlib import Path

video_path = Path(r"C:\Users\Lenovo\.gemini\antigravity\scratch\breathewise-ai\docs\video\breathewise_reel_9x16.mp4")
b64_data = base64.b64encode(video_path.read_bytes()).decode("ascii")

chunk_size = 180000
chunks_dir = Path(r"C:\Users\Lenovo\.gemini\antigravity\scratch\breathewise-ai\scripts\chunks")
chunks_dir.mkdir(parents=True, exist_ok=True)

total_chunks = (len(b64_data) + chunk_size - 1) // chunk_size

for i in range(total_chunks):
    chunk = b64_data[i*chunk_size : (i+1)*chunk_size]
    content = f"() => {{ window._b64 = (window._b64 || '') + '{chunk}'; return {{ index: {i}, len: window._b64.length }}; }}"
    (chunks_dir / f"chunk_{i}.js").write_text(content, encoding="utf-8")

print(f"Generated {total_chunks} chunks.")
