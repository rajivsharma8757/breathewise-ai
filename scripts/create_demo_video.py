import asyncio
import os
import ssl
import subprocess
from pathlib import Path
import edge_tts

# Configure unverified SSL for edge-tts
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
edge_tts.constants.SSL_CTX = ctx

VOICE = "en-US-GuyNeural"
RATE = "+0%"
PITCH = "+0Hz"

BASE_DIR = Path(r"C:\Users\Lenovo\.gemini\antigravity\scratch\breathewise-ai")
SCREENSHOTS_DIR = BASE_DIR / "docs" / "screenshots"
OUTPUT_DIR = BASE_DIR / "docs" / "video"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SCENES = [
    {
        "id": "scene_01",
        "image": SCREENSHOTS_DIR / "01_landing_hero.png",
        "text": "Hello judges and developers! Welcome to BreatheWise AI, built for PromptWars Virtual 2026 Challenge 06: Urban Air Quality Assistant. Winter in Indian cities brings catastrophic smog, trapping toxic particulate matter. Families are left guessing when to step outside, whether their children are safe, or when to seal their windows. BreatheWise AI transforms complex atmospheric data into actionable daily decisions.",
    },
    {
        "id": "scene_02",
        "image": SCREENSHOTS_DIR / "02_live_dashboard.png",
        "text": "Here on our live dashboard, BreatheWise AI pulls real-time environmental telemetry across major Indian cities using Open-Meteo and Copernicus Atmosphere Monitoring. Instead of a single raw number, we track PM2.5, PM10, nitrogen dioxide, and temperature inversion layers, pinpointing exact optimal windows when pollution disperses.",
    },
    {
        "id": "scene_03",
        "image": SCREENSHOTS_DIR / "03_daily_planner.png",
        "text": "Our personalized daily routine planner adapts to student, professional, parent, and senior profiles. Grounded in the International Commission on Radiological Protection respiratory tract model, it calculates actual inhaled bio-dose mass in micrograms rather than misleading cigarette claims, guiding safe outdoor exercise hours.",
    },
    {
        "id": "scene_04",
        "image": SCREENSHOTS_DIR / "04_indoor_assistant.png",
        "text": "Most people spend 90% of their day indoors, unaware that outdoor pollution infiltrates homes. BreatheWise AI calculates real-time atmospheric infiltration and identifies strict micro-ventilation windows during afternoon solar mixing, alongside affordable DIY air filtration hacks.",
    },
    {
        "id": "scene_05",
        "image": SCREENSHOTS_DIR / "06_sustainable_commute.png",
        "text": "For daily transit, BreatheWise compares private cars, auto-rickshaws, and the Delhi Metro. It calculates cabin exposure risk alongside kilograms of carbon dioxide prevented, incentivizing green transit through environmental impact rewards.",
    },
    {
        "id": "scene_06",
        "image": SCREENSHOTS_DIR / "08_pollution_trends.png",
        "text": "The 24-hour inversion trend visualizer displays diurnal particulate curves, warning citizens hours before nighttime thermal inversions trap surface plumes.",
    },
    {
        "id": "scene_07",
        "image": SCREENSHOTS_DIR / "09_family_safety.png",
        "text": "Our Family Safety Matrix provides tailored protection protocols for infants, expectant mothers, asthmatic patients, and senior citizens, detailing certified mask standards and indoor purifications.",
    },
    {
        "id": "scene_08",
        "image": SCREENSHOTS_DIR / "05_ai_copilot.png",
        "text": "Our GenAI Copilot is powered by Google Gemini 2.0 Flash with system prompts strictly grounded in verified CPCB and WHO guidelines, providing contextual, hallucination-free guidance.",
    },
    {
        "id": "scene_09",
        "image": SCREENSHOTS_DIR / "10_daily_report_modal.png",
        "text": "To ensure universal accessibility, BreatheWise AI supports full English and Hindi localization, alongside a one-click printable daily health advisory card for households and housing societies.",
    },
    {
        "id": "scene_10",
        "image": SCREENSHOTS_DIR / "01_landing_hero.png",
        "text": "BreatheWise AI is fully open source on GitHub and deployed live on GitHub Pages. Thank you Google for Developers and Hack2skill for this incredible challenge!",
    },
]

async def generate_audio(scene):
    audio_path = OUTPUT_DIR / f"{scene['id']}.mp3"
    print(f"Generating audio for {scene['id']}...")
    communicate = edge_tts.Communicate(scene["text"], VOICE, rate=RATE, pitch=PITCH)
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
    
    # Scale image to 1920x1080 with padding, and loop for audio duration + 0.5s padding
    total_duration = duration + 0.5
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
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0a0f1d",
        "-t", str(total_duration),
        "-shortest",
        str(video_path),
    ]
    print(f"Rendering scene video {scene['id']} (duration {total_duration:.1f}s)...")
    subprocess.run(cmd, check=True, capture_output=True)
    return video_path

async def main():
    print("=== Generating BreatheWise AI Demo Video ===")
    scene_videos = []
    for scene in SCENES:
        audio_path = await generate_audio(scene)
        duration = get_audio_duration(audio_path)
        video_path = make_scene_video(scene, audio_path, duration)
        scene_videos.append(video_path)
    
    # Concat list
    concat_list_file = OUTPUT_DIR / "concat_list.txt"
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for v in scene_videos:
            f.write(f"file '{v.name}'\n")
            
    final_output = OUTPUT_DIR / "breathewise_ai_demo.mp4"
    print(f"Concatenating all scenes into {final_output}...")
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
    print("=== DEMO VIDEO GENERATION COMPLETE! ===")
    total_len = get_audio_duration(final_output)
    print(f"Final Video Duration: {total_len:.1f} seconds ({total_len/60:.2f} minutes)")

if __name__ == "__main__":
    asyncio.run(main())
