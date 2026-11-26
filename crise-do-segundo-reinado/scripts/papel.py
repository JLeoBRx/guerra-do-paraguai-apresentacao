"""Gera assets/img/papel.jpg: textura de papel antigo (fibras, manchas e bordas escurecidas), feita só com ruído.

uso: python3 scripts/papel.py
"""
import os

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "assets", "img", "papel.jpg")
W, H = 1600, 900
rng = np.random.default_rng(1889)


def blur_noise(scale, radius):
    small = rng.random((H // scale + 2, W // scale + 2))
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32) / 255


mottle = 0.55 * blur_noise(60, 40) + 0.3 * blur_noise(18, 10) + 0.15 * blur_noise(4, 1.2)
fibers = np.asarray(Image.fromarray((rng.random((H, W)) * 255).astype(np.uint8))
                    .filter(ImageFilter.GaussianBlur(0.6)).resize((W, H)), dtype=np.float32) / 255
yy, xx = np.mgrid[0:H, 0:W]
d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
vignette = np.clip(1 - 0.28 * np.maximum(0, d - 0.55) ** 1.6, 0, 1)
base = np.array([236, 223, 196], dtype=np.float32)   # bege de documento
stain = np.array([196, 168, 120], dtype=np.float32)  # manchas de idade
t = np.clip((mottle - 0.45) * 2.2, 0, 1)[..., None] * 0.45
rgb = base * (1 - t) + stain * t
rgb *= (0.96 + 0.06 * fibers)[..., None]
rgb *= vignette[..., None]
Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(OUT, quality=78, optimize=True, progressive=True)
print(OUT, os.path.getsize(OUT) // 1024, "KB")
