import asyncio
import os
import ssl
import subprocess
from pathlib import Path
import edge_tts

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
edge_tts.constants.SSL_CTX = ctx

VOICE = "en-US-GuyNeural"
RATE = "+0%"

BASE_DIR = Path(r"C:\Users\Lenovo\.gemini\antigravity\scratch\breathewise-ai")
SCREENSHOTS_DIR = BASE_DIR / "docs" / "screenshots"
OUTPUT_DIR = BASE_DIR / "docs" / "video"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

REEL_SCENES = [
    {
        "id": "reel_01",
        "image": SCREENSHOTS_DIR / "01_landing_hero.png",
        "text": "Delhi AQI just crossed 350, and winter smog is here. But are you checking the air the right way? Most apps only give you a scary number.",
    },
    {
        "id": "reel_02",
        "image": SCREENSHOTS_DIR / "03_daily_planner.png",
        "text": "Meet BreatheWise AI, built for PromptWars Virtual 2026. It tracks temperature inversion layers so you know the exact hour to step out, and calculates your inhaled particulate bio-dose mass based on medical guidelines.",
    },
    {
        "id": "reel_03",
        "image": SCREENSHOTS_DIR / "04_indoor_assistant.png",
        "text": "It models indoor pollution infiltration and shows you safe ventilation windows, while comparing metro and road exposure to protect your commute.",
    },
    {
        "id": "reel_04",
        "image": SCREENSHOTS_DIR / "05_ai_copilot.png",
        "text": "Powered by Google Gemini 2.0 Flash. Protect your family and breathe smarter. Try BreatheWise AI live at the link in bio!",
    },
]

async def generate_audio(scene):
    audio_path = OUTPUT_DIR / f"{scene['id']}.mp3"
    print(f"Generating audio for {scene['id']}...")
    communicate = edge_tts.Communicate(scene["text"], VOICE, rate=RATE)
    await communicate.save(str(audio_path))
    return audio_path

def get_audio_duration(audio_path):
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(audio_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(result.stdout.strip())

def make_scene_video(scene, audio_path, duration):
    video_path = OUTPUT_DIR / f"{scene['id']}.mp4"
    image_path = scene["image"]
    
    # Scale image to 1080x1920 (9:16 vertical) with padding
    total_duration = duration + 0.3
    cmd = [
        r"C:\ffmpeg\bin\ffmpeg.exe",
        "-y",
        "-loop", "1",
        "-i", str(image_path),
        "-i", str(audio_path),
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0a0f1d",
        "-t", str(total_duration),
        "-shortest",
        str(video_path),
    ]
    print(f"Rendering reel scene {scene['id']} (duration {total_duration:.1f}s)...")
    subprocess.run(cmd, check=True, capture_output=True)
    return video_path

async def main():
    print("=== Generating BreatheWise AI Instagram Reel (9:16) ===")
    scene_videos = []
    for scene in REEL_SCENES:
        audio_path = await generate_audio(scene)
        duration = get_audio_duration(audio_path)
        video_path = make_scene_video(scene, audio_path, duration)
        scene_videos.append(video_path)
    
    concat_list_file = OUTPUT_DIR / "concat_reel_list.txt"
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for v in scene_videos:
            f.write(f"file '{v.name}'\n")
            
    final_output = OUTPUT_DIR / "breathewise_reel_9x16.mp4"
    print(f"Concatenating reel scenes into {final_output}...")
    concat_cmd = [
        r"C:\ffmpeg\bin\ffmpeg.exe",
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_list_file),
        "-c", "copy",
        str(final_output),
    ]
    subprocess.run(concat_cmd, check=True, capture_output=True)
    print("=== INSTAGRAM REEL GENERATION COMPLETE! ===")
    total_len = get_audio_duration(final_output)
    print(f"Final Reel Duration: {total_len:.1f} seconds")

if __name__ == "__main__":
    asyncio.run(main())
