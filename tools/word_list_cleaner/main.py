import re

origin = open("../../vocabulary/origin/gre1.txt", "r", 1, "utf-8")
res = open("../../vocabulary/origin/gre1_res.txt", "w", 1, "utf-8")
for line in origin:
    line = line.strip()
    if re.match(r"^[a-zA-z]+", line) and len(line):
        line = re.search(r"\w+", line).group()
        # line = line[span[1]:len(line)]
        # line = line.strip()
        print(line)
        res.write(line + "\n")