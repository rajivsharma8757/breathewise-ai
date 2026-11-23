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
RATE = "+10%"

BASE_DIR = Path(r"C:\Users\Lenovo\.gemini\antigravity\scratch\breathewise-ai")
SCREENSHOTS_DIR = BASE_DIR / "docs" / "screenshots"
OUTPUT_DIR = BASE_DIR / "docs" / "video"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FONT_FILE = r"C\:/Windows/Fonts/segoeui.ttf"

REEL_SCENES = [
    {
        "id": "reel_40s_01",
        "image": SCREENSHOTS_DIR / "01_landing_hero.png",
        "title": "DELHI WINTER SMOG: AQI 350+",
        "subtitle": "Most apps only give a number... Not solutions.",
        "text": "Delhi AQI just crossed 350. But most weather apps only show scary numbers without real answers. Meet BreatheWise AI.",
    },
    {
        "id": "reel_40s_02",
        "image": SCREENSHOTS_DIR / "02_live_dashboard.png",
        "title": "BREATHEWISE AI: LIVE INVERSION TELEMETRY",
        "subtitle": "Google for Developers x Hack2skill PromptWars 2026",
        "text": "Built for PromptWars Virtual 2026 with Google Gemini. It tracks diurnal temperature inversions to pinpoint the exact midday window when winter smog clears.",
    },
    {
        "id": "reel_40s_03",
        "image": SCREENSHOTS_DIR / "03_daily_planner.png",
        "title": "SMART DAILY PLANNER & BIO-DOSE",
        "subtitle": "ICRP Lung Deposition: Micrograms Inhaled vs WHO Limits",
        "text": "Our planner implements the ICRP lung model, calculating actual inhaled micrograms across student and senior profiles to time safe exercise.",
    },
    {
        "id": "reel_40s_04",
        "image": SCREENSHOTS_DIR / "04_indoor_assistant.png",
        "title": "INDOOR INFILTRATION & TRANSIT SWAPS",
        "subtitle": "Safe Ventilation Windows & Metro vs Road Exposure",
        "text": "It models indoor particulate infiltration, alerts you to safe ventilation hours, and compares metro versus road transit exposure.",
    },
    {
        "id": "reel_40s_05",
        "image": SCREENSHOTS_DIR / "05_ai_copilot.png",
        "title": "GROUNDED GEMINI COPILOT • BREATHE SMARTER",
        "subtitle": "Open Source on GitHub • Try Live at Link in Bio!",
        "text": "With an AI copilot grounded in CPCB guidelines. Understand your air, protect your day, breathe smarter. Try BreatheWise AI live at the link in bio!",
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
    total_duration = duration + 0.2
    
    title_text = scene["title"].replace(":", "\\:").replace("'", "")
    sub_text = scene["subtitle"].replace(":", "\\:").replace("'", "")
    
    vf_filters = [
        "scale=1080:1920:force_original_aspect_ratio=decrease",
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0a0f1d",
        f"drawtext=fontfile='{FONT_FILE}':text='{title_text}':fontcolor=0x38bdf8:fontsize=36:x=(w-text_w)/2:y=120:box=1:boxcolor=0x0a0f1d@0.9:boxborderw=18",
        f"drawtext=fontfile='{FONT_FILE}':text='{sub_text}':fontcolor=0xffffff:fontsize=28:x=(w-text_w)/2:y=1800:box=1:boxcolor=0x0a0f1d@0.9:boxborderw=16",
    ]
    vf_arg = ",".join(vf_filters)
    
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
        "-vf", vf_arg,
        "-t", str(total_duration),
        "-shortest",
        str(video_path),
    ]
    print(f"Rendering scene {scene['id']} (duration {total_duration:.1f}s)...")
    subprocess.run(cmd, check=True, capture_output=True)
    return video_path

async def main():
    print("=== Generating Master 40s Instagram Reel (9:16) ===")
    scene_videos = []
    for scene in REEL_SCENES:
        audio_path = await generate_audio(scene)
        duration = get_audio_duration(audio_path)
        video_path = make_scene_video(scene, audio_path, duration)
        scene_videos.append(video_path)
    
    concat_list_file = OUTPUT_DIR / "concat_40s_reel.txt"
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for v in scene_videos:
            f.write(f"file '{v.name}'\n")
            
    final_output = OUTPUT_DIR / "breathewise_pro_reel_9x16.mp4"
    print(f"Concatenating into {final_output}...")
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
    
    total_len = get_audio_duration(final_output)
    print(f"=== MASTER 40s PRO REEL COMPLETE! ===")
    print(f"Output File: {final_output}")
    print(f"Duration: {total_len:.1f} seconds (Target: 35-50s)")
    
    # Also update canonical breathewise_reel_9x16.mp4
    canonical = OUTPUT_DIR / "breathewise_reel_9x16.mp4"
    import shutil
    shutil.copyfile(final_output, canonical)
    print(f"Updated canonical reel at {canonical}")

if __name__ == "__main__":
    asyncio.run(main())
