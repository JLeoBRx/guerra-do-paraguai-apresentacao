"""Crop, tone and resize the raw historical images into the exact boxes the deck uses.

usage: python3 -I prep_images.py images.json raw_dir out_dir
"""
import json
import os
import sys

from PIL import Image, ImageOps, ImageEnhance

DPI = 220          # target density on the slide
MAX_PX = 2933      # 13.333 in * 220 dpi

INK = (34, 25, 18)
PAPER = (240, 229, 208)


def sepia(im):
    g = ImageOps.grayscale(im)
    g = ImageOps.autocontrast(g, cutoff=0.6)
    return ImageOps.colorize(g, black=INK, white=PAPER, mid=(140, 116, 88))


def crop_to(im, aspect, fx, fy, zoom=1.0):
    w, h = im.size
    if w / h > aspect:            # too wide: crop width
        ch = h / zoom
        cw = ch * aspect
    else:                         # too tall: crop height
        cw = w / zoom
        ch = cw / aspect
    cx = min(max(fx * w, cw / 2), w - cw / 2)
    cy = min(max(fy * h, ch / 2), h - ch / 2)
    return im.crop((round(cx - cw / 2), round(cy - ch / 2), round(cx + cw / 2), round(cy + ch / 2)))


def main(spec_path, raw_dir, out_dir):
    spec = json.load(open(spec_path))
    os.makedirs(out_dir, exist_ok=True)
    for slot, s in spec.items():
        src = os.path.join(raw_dir, s["src"])
        if not os.path.exists(src):
            print("missing", slot, s["src"])
            continue
        im = Image.open(src)
        im = ImageOps.exif_transpose(im)
        png = s["src"].lower().endswith(".png") and slot.endswith("flag")
        if im.mode in ("RGBA", "LA", "P") and not png:
            bg = Image.new("RGB", im.size, (255, 255, 255))
            im = im.convert("RGBA")
            bg.paste(im, mask=im.split()[-1])
            im = bg
        if not png:
            im = im.convert("RGB")
        box = s.get("box")          # optional manual crop box in source pixels [l, t, r, b]
        if box:
            im = im.crop(tuple(box))
        im = crop_to(im, s["w"] / s["h"], s.get("fx", 0.5), s.get("fy", 0.5), s.get("zoom", 1.0))
        if s.get("tone") == "sepia":
            im = sepia(im)
        if s.get("contrast"):
            im = ImageEnhance.Contrast(im).enhance(s["contrast"])
        tw = min(MAX_PX, round(s["w"] * DPI))
        if im.width > tw:
            im = im.resize((tw, round(tw * im.height / im.width)), Image.LANCZOS)
        ext = ".png" if png else ".jpg"
        out = os.path.join(out_dir, slot + ext)
        if png:
            im.save(out)
        else:
            im.save(out, quality=86, optimize=True, progressive=True)
        print(f"{slot}: {s['src']} -> {im.size}")


if __name__ == "__main__":
    main(*sys.argv[1:4])
