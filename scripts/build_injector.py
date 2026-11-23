import base64
from pathlib import Path

video_path = Path(r"C:\Users\Lenovo\.gemini\antigravity\scratch\breathewise-ai\docs\video\breathewise_reel_9x16.mp4")
b64_data = base64.b64encode(video_path.read_bytes()).decode("ascii")

js_content = f"""(() => {{
  const b64 = "{b64_data}";
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {{
    bytes[i] = binary.charCodeAt(i);
  }}
  const blob = new Blob([bytes], {{ type: 'video/mp4' }});
  const file = new File([blob], 'breathewise_reel_9x16.mp4', {{ type: 'video/mp4', lastModified: Date.now() }});
  const dt = new DataTransfer();
  dt.items.add(file);
  
  const inputs = Array.from(document.querySelectorAll('input[type="file"]'));
  const input = inputs.find(i => i.accept && i.accept.includes('video/mp4'));
  if (!input) return {{ success: false, error: 'Input not found' }};
  
  input.files = dt.files;
  input.dispatchEvent(new Event('change', {{ bubbles: true }}));
  return {{ success: true, fileName: file.name, fileSize: file.size }};
}})()"""

out_path = Path(r"C:\Users\Lenovo\.gemini\antigravity\scratch\breathewise-ai\scripts\inject_reel.js")
out_path.write_text(js_content, encoding="utf-8")
print("inject_reel.js written:", out_path.stat().st_size)
