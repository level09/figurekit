#!/bin/sh

set -eu

if [ "$#" -ne 2 ]; then
  echo "usage: $0 <source.png> <output.jpg>" >&2
  exit 2
fi

source_png=$1
output_jpg=$2
output_b64=${output_jpg%.*}.b64

if [ ! -f "$source_png" ]; then
  echo "source image not found: $source_png" >&2
  exit 1
fi

if command -v magick >/dev/null 2>&1; then
  magick "$source_png" -resize '1200x1200>' -background white -alpha remove \
    -alpha off -quality 80 "$output_jpg"
elif command -v sips >/dev/null 2>&1; then
  sips -Z 1200 -s format jpeg -s formatOptions 80 "$source_png" \
    --out "$output_jpg" >/dev/null
elif command -v ffmpeg >/dev/null 2>&1; then
  ffmpeg -loglevel error -y -i "$source_png" \
    -vf 'scale=1200:1200:force_original_aspect_ratio=decrease' \
    -q:v 5 "$output_jpg"
else
  echo "image conversion requires magick, sips, or ffmpeg" >&2
  exit 1
fi

base64 < "$output_jpg" | tr -d '\n' > "$output_b64"
printf '%s\n' "$output_b64"
