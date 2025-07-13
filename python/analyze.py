#!/usr/bin/env python3
import os, sys, json, subprocess, tempfile, time, re, pathlib, shutil
import whisper
from openai import OpenAI
from dotenv import load_dotenv

# -------- CONFIG --------
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
model_name = os.getenv("MODEL_NAME", "gpt-4o")
model_w = whisper.load_model("base")
HL_MAX_SECONDS = 180
SEG_PADDING = 1.0
# ------------------------

def transcribe(video_path):
    print("🎙️ Transcribing…", file=sys.stderr)
    result = model_w.transcribe(video_path, fp16=False)
    return result["text"], result["segments"]

def ask_llm(prompt, system="You are a meeting summarizer."):
    print("🤖 Calling OpenAI…", file=sys.stderr)
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1024,
        temperature=0.3
    )
    return response.choices[0].message.content.strip()

def select_highlights(llm_text):
    pattern = r"(\d\d?:\d\d?:\d\d(?:\.\d\d)?)\s*[-–]\s*(\d\d?:\d\d?:\d\d(?:\.\d\d)?)"
    highlights = []
    for line in llm_text.splitlines():
        match = re.search(pattern, line)
        if match:
            start = match.group(1)
            end = match.group(2)
            quote = re.sub(pattern, "", line).strip(" \"-–")
            highlights.append({"start": start, "end": end, "quote": quote})
    return highlights[:10]

def _to_seconds(timestamp):
    h, m, s = timestamp.split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)

def ffmpeg_cut_merge(video_path, highlights, output_path):
    print("✂️ Creating highlight reel…", file=sys.stderr)
    tmpdir = pathlib.Path(tempfile.mkdtemp())
    segments = []
    for i, h in enumerate(highlights):
        ss = max(0, _to_seconds(h["start"]) - SEG_PADDING)
        ee = _to_seconds(h["end"]) + SEG_PADDING
        dur = ee - ss
        clip = tmpdir / f"clip_{i}.mp4"
        subprocess.run([
            "ffmpeg", "-y", "-ss", str(ss), "-i", video_path,
            "-t", str(dur), "-c", "copy", str(clip)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        segments.append(clip)

    list_file = tmpdir / "segments.txt"
    with open(list_file, "w") as f:
        for seg in segments:
            f.write(f"file '{seg.as_posix()}'\n")

    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
        "-c", "copy", output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    shutil.rmtree(tmpdir)

def main():
    if len(sys.argv) != 2:
        print("Usage: analyze.py <video>", file=sys.stderr)
        sys.exit(1)

    video_path = sys.argv[1]
    transcript, segments = transcribe(video_path)

    prompt = f"""You are an assistant summarizing a public meeting.
Based on this transcript:
{transcript}
---
1. Write a 3-sentence summary of the meeting.
2. Then list exactly 10 key highlight moments with timestamps and quotes like:
00:01:12 - 00:01:42 "Important comment here"
Total highlight duration must not exceed 3 minutes.
"""

    llm_output = ask_llm(prompt)
    summary = "\n".join(llm_output.splitlines()[:3])
    highlights = select_highlights(llm_output)

    ts = int(time.time())
    output_path = f"output/highlights_{ts}.mp4"
    pathlib.Path("output").mkdir(exist_ok=True)
    ffmpeg_cut_merge(video_path, highlights, output_path)

    result = {
        "summary": summary,
        "highlights": highlights,
        "highlightVideo": output_path
    }

    print(json.dumps(result))

if __name__ == "__main__":
    main()