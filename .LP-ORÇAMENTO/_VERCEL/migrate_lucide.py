import os
import glob
import re

folder = r"C:\Users\thiag\Desktop\Explan\.LP-ORÇAMENTO\_VERCEL"
html_files = glob.glob(os.path.join(folder, "*.html"))

# 1. Remove duplicados
duplicates = ["login.html", "sprint-09.html"]
for dup in duplicates:
    path = os.path.join(folder, dup)
    if os.path.exists(path):
        try:
            os.remove(path)
            print(f"Removed {dup}")
        except Exception as e:
            print(f"Error removing {dup}: {e}")

html_files = [f for f in html_files if os.path.basename(f) not in duplicates]

# Mapeamentos do projeto
icon_map = {
    "ðŸ’°": '<i data-lucide="circle-dollar-sign"></i>',
    "ðŸªµ": '<i data-lucide="layers"></i>',
    "ðŸ’³": '<i data-lucide="credit-card"></i>',
    "ðŸ“…": '<i data-lucide="calendar"></i>',
    "ðŸ›¡ï¸ ": '<i data-lucide="shield-check"></i>',
    "ðŸ †": '<i data-lucide="award"></i>',
    "⚙ï¸ ": '<i data-lucide="settings"></i>',
    "ðŸ“¦": '<i data-lucide="package"></i>',
    "ðŸŽ ": '<i data-lucide="gift"></i>',
    "⭐": '<i data-lucide="star"></i>',
    "ðŸ“ ": '<i data-lucide="ruler"></i>',
    "ðŸ ­": '<i data-lucide="factory"></i>',
    "ðŸ —ï¸ ": '<i data-lucide="hammer"></i>',
    "ðŸ“‹": '<i data-lucide="clipboard-list"></i>',
    "ðŸ—“ï¸ ": '<i data-lucide="calendar-days"></i>',
    "ðŸ‘¥": '<i data-lucide="users"></i>',
    "ðŸ› ": '<i data-lucide="bed-double"></i>',
    "ðŸ‘”": '<i data-lucide="shirt"></i>',
    "ðŸš¿": '<i data-lucide="bath"></i>',
    "ðŸ’¼": '<i data-lucide="briefcase"></i>',
    "🔑¥": '<i data-lucide="flame"></i>',
    "ðŸ›‹": '<i data-lucide="sofa"></i>',
    "ðŸ ½": '<i data-lucide="utensils"></i>',
    "ðŸ¥‚": '<i data-lucide="wine"></i>',
    "ðŸ«§": '<i data-lucide="shirt"></i>',
    "ðŸªœ": '<i data-lucide="arrow-up-right"></i>',
    "ðŸšª": '<i data-lucide="door-open"></i>',
    "ðŸ ³": '<i data-lucide="chef-hat"></i>',
    "ðŸ  ": '<i data-lucide="home"></i>',
    "ðŸ ›": '<i data-lucide="bug"></i>',
    "✅": '<i data-lucide="check-circle-2"></i>',
    "🎨": '<i data-lucide="palette"></i>',
    "💡": '<i data-lucide="lightbulb"></i>',
    "Â†'": "&rarr;"
}

link_map = {
    "login.html": "index.html",
    "sprint-09.html": "painel.html"
}

lucide_script = '<script src="https://unpkg.com/lucide@latest"></script>'
lucide_init = '<script>lucide.createIcons();</script>'

for file in html_files:
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()

        # Substituir ícones
        for bad, good in icon_map.items():
            content = content.replace(bad, good)
            
        # Substituir links
        for old_link, new_link in link_map.items():
            content = content.replace(f'"{old_link}"', f'"{new_link}"')
            content = content.replace(f"'{old_link}'", f"'{new_link}'")

        # Injetar CDN Lucide no head, se nao tiver
        if "lucide@latest" not in content and "</head>" in content:
            content = content.replace("</head>", f"  {lucide_script}\n</head>")

        # Injetar init no final do body
        if "lucide.createIcons();" not in content and "</body>" in content:
            content = content.replace("</body>", f"  {lucide_init}\n</body>")

        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Processed {os.path.basename(file)}")
    except Exception as e:
        print(f"Error processing {file}: {e}")
