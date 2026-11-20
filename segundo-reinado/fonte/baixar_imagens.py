# Downloads Commons files via the thumbnail service, computing URLs locally (no API calls).
# usage: python3 -I dl2.py list.tsv outdir     (tsv: localname<TAB>File:Title<TAB>bucket)
import sys, os, time, hashlib, urllib.request, urllib.error, urllib.parse
UA = "SchoolHistoryDeckBuilder/1.0 (educational use)"
def thumb_url(title, bucket):
    name = title.split(":", 1)[1].replace(" ", "_")
    h = hashlib.md5(name.encode("utf-8")).hexdigest()
    q = urllib.parse.quote(name)
    ext = name.rsplit(".", 1)[-1].lower()
    base = f"https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/"
    if ext in ("tif", "tiff"):
        return base + f"lossy-page1-{bucket}px-{q}.jpg"
    if ext == "pdf":
        return base + f"page1-{bucket}px-{q}.jpg"
    if ext == "svg":
        return base + f"{bucket}px-{q}.png"
    return base + f"{bucket}px-{q}"
lst, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for line in open(lst):
    line = line.strip()
    if not line or line.startswith("#"): continue
    name, title, bucket = line.split("\t")
    dest = os.path.join(out, name)
    if os.path.exists(dest): continue
    b = bucket if bucket in ("500", "960", "1280", "1920", "3840") else "1920"
    url = thumb_url(title, b)
    import subprocess
    for i in range(5):
        r = subprocess.run(["curl", "-sS", "-A", UA, "-o", dest + ".part", "-w", "%{http_code}", url], capture_output=True, text=True)
        code = r.stdout.strip()
        if code == "200":
            os.replace(dest + ".part", dest); print("OK", name, os.path.getsize(dest), flush=True); break
        if os.path.exists(dest + ".part"): os.remove(dest + ".part")
        if code == "429": time.sleep(20 * (i + 1)); continue
        print("FAIL", name, code, url, r.stderr[-200:], flush=True); break
    time.sleep(2)
