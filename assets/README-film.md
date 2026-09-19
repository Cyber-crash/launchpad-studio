# Higgsfield 15s scroll film — single-shot slot (Launchpad Studio)

Status: **canvas fallback live** (rocket rises with scroll). No MP4s — account `7091331316neeraj@gmail.com — free plan, 0 credits`.

## Generate (ONE film, ~15s, no cuts)
Style: night launchpad, rocket rising slow and steady, dark sky, pad glow, locked exposure, no flicker, no text/logos, center-safe.

```bash
higgsfield model list --json
higgsfield model get seedance_2_5 --json

# 1. Storyboard (ONE 6-keyframe grid image — style ref, NOT start frame)
higgsfield generate create gpt_image_2_5 --prompt "ONE continuous camera move, 6-panel keyframe grid, rocket liftoff at night, dark sky, orange pad glow, slow vertical rise progression, no text, no watermark" --aspect_ratio 16:9 --resolution 2k --wait

# 2. Film (ONE take, storyboard as STYLE reference)
higgsfield generate create seedance_2_5 --prompt "single continuous slow vertical rocket liftoff at night, dark sky, glowing pad, locked exposure, no flicker, no cuts, no shake, no text" --image ./storyboard.png --duration 15 --resolution 1080p --wait

# 3. Encode (ffmpeg) — ≤32MiB desktop / ≤16MiB mobile
ffmpeg -y -i source.mp4 -an -vf "unsharp=5:5:0.8:5:5:0.0" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart assets/film-desktop.mp4
ffmpeg -y -i source.mp4 -an -vf "scale=-2:'min(720,ih)',unsharp=5:5:0.6:5:5:0.0" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart assets/film-mobile.mp4
ffmpeg -y -ss 0 -i assets/film-desktop.mp4 -frames:v 1 -q:v 2 assets/film-poster.png
```

Drop the 3 files into `assets/` — the page auto-upgrades (video scrubs, canvas hides). Chapters: Ignition 0–4s → Liftoff 4–8s → Orbit 8–12s → Touchdown 12–15s.
