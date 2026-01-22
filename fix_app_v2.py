
import os

file_path = r"c:\Users\arsha\OneDrive\Desktop\Gravity\GDG_Hackathon\frontend\src\App.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
inserted_effect = False

for i, line in enumerate(lines):
    # Insert useEffect before handleReset
    if "const handleReset =" in line and not inserted_effect:
        new_lines.append("  useEffect(() => {\n")
        new_lines.append("    scrollToBottom();\n")
        new_lines.append("  }, [messages, loading]);\n\n")
        inserted_effect = True

    # Identify garbage block start
    if "return (" in line and "app-layout" in lines[i+1]:
        # Check if this is the garbage block by looking ahead for the marker
        is_garbage = False
        for j in range(i, min(i+10, len(lines))):
            if "[Correcting context matching]" in lines[j]:
                is_garbage = True
                break
        
        if is_garbage:
            skip = True
    
    # Identify garbage block end
    if skip and "const [isListening" in line:
        skip = False
        # We also need to dedent this line if it's indented
        new_lines.append(line.lstrip())
        continue

    if not skip:
        # Also fix the button deeper in the file
        if '<button className="nav-item active">' in line:
             new_lines.append('          <button className="nav-item active" onClick={handleReset} title="Start New Chat">\n')
        else:
             new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("App.jsx fixed.")
