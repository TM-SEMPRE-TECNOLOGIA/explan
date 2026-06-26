import os
import glob

folder = r"C:\Users\thiag\Desktop\Explan\.LP-ORÇAMENTO\_VERCEL"
html_files = glob.glob(os.path.join(folder, "*.html"))

replacements = {
    "â• ": "═",
    "â† ": "←",
    "âœ…": "✅",
    "ðŸŽ¨": "🎨",
    "”“": "—"
}

for file in html_files:
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()

        for bad, good in replacements.items():
            content = content.replace(bad, good)

        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fix applied to {os.path.basename(file)}")
    except Exception as e:
        print(f"Error processing {file}: {e}")
