"""Gera as texturas de fundo (papel antigo, verde imperial, tinta) e os degradês usados no deck.

uso: python3 make_textures.py <pasta-de-saida>
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = sys.argv[1] if len(sys.argv) > 1 else "assets"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)
W, H = 3200, 1800


def lowfreq(scale, amp):
    small = rng.normal(0, 1, (H // scale + 2, W // scale + 2)).astype(np.float32)
    im = Image.fromarray(((small - small.min()) / (small.max() - small.min()) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return (np.asarray(im).astype(np.float32) / 255 - 0.5) * amp


yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
vig = np.clip(r - 0.35, 0, None) ** 1.6
glow = np.exp(-((xx - W * 0.35) ** 2 / (W * 0.55) ** 2 + (yy - H * 0.4) ** 2 / (H * 0.7) ** 2))

# papel antigo
img = np.array([239, 230, 212], np.float32)[None, None, :] + (lowfreq(160, 14) + lowfreq(40, 6) + rng.normal(0, 3.2, (H, W)))[:, :, None] * np.array([1, 1, 1.1])
img -= (vig * 38)[:, :, None] * np.array([0.9, 1.0, 1.25])
fib = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(fib)
for _ in range(900):
    x, y = rng.uniform(0, W), rng.uniform(0, H)
    a, L = rng.uniform(0, np.pi), rng.uniform(8, 40)
    d.line([(x, y), (x + L * np.cos(a), y + L * np.sin(a))], fill=int(rng.uniform(20, 60)), width=1)
img -= (np.asarray(fib.filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255 * 10)[:, :, None]
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(OUT, "paper.jpg"), quality=88)

# verde imperial
img = np.array([18, 46, 36], np.float32)[None, None, :] + (glow * 14)[:, :, None] * np.array([0.6, 1, 0.8])
img += (lowfreq(120, 7) + rng.normal(0, 2.2, (H, W)))[:, :, None]
img -= (vig * 20)[:, :, None]
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(OUT, "green.jpg"), quality=90)

# tinta (marrom-preto)
img = np.array([22, 17, 13], np.float32)[None, None, :] + (glow * 10)[:, :, None] * np.array([1, 0.8, 0.6])
img += (lowfreq(120, 5) + rng.normal(0, 2.0, (H, W)))[:, :, None]
img -= (vig * 12)[:, :, None]
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(OUT, "ink.jpg"), quality=90)


def save(name, alpha, axis, rgb=(14, 11, 9), size=(1600, 900)):
    w, h = size
    A = np.tile(alpha[:, None], (1, w)) if axis == "y" else np.tile(alpha[None, :], (h, 1))
    arr = np.zeros((A.shape[0], A.shape[1], 4), np.uint8)
    arr[..., :3] = rgb
    arr[..., 3] = (np.clip(A, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(arr, "RGBA").save(os.path.join(OUT, name))


def smooth(t):
    return t * t * (3 - 2 * t)


ty = np.linspace(0, 1, 900)
tx = np.linspace(0, 1, 1600)
save("fade_ink_bottom.png", ty, "y")                       # transparente em cima, opaco embaixo
save("fade_ink_top.png", 1 - ty, "y")
strong = smooth(np.clip(ty / 0.5, 0, 1))
save("fade_ink_bottom_strong.png", strong, "y")
save("fade_ink_top_strong.png", strong[::-1], "y")
save("fade_ink_left_strong.png", 1 - smooth(np.clip((tx - 0.55) / 0.45, 0, 1)), "x")
band = np.where(tx < 0.2, smooth(tx / 0.2), np.where(tx < 0.3, 1.0, 1 - smooth((tx - 0.3) / 0.7)))
save("fade_green_band.png", band, "x", rgb=(18, 46, 36))
print("texturas em", OUT)
