import re
import json

origin = open("../../vocabulary/origin/gre1.txt", "r", 1, "utf-8")
res = open("../../vocabulary/origin/words.json", "w", 1, "utf-8")

obj = {}
gre_words = []
obj["words"] = []
obj["list"] = []
obj["list"].append({
    "name": "gre",
    "words": gre_words
})

for line in origin:
    line = line.strip()
    if re.match(r"^[a-zA-z]+", line) and len(line):
        sh = re.search(r"\w+", line)
        span = sh.span()
        word = sh.group()

        desc = line[span[1]:len(line)].strip()
        print(word, desc)

        obj["words"].append({
            "word": word,
            "desc1": desc
        })

        gre_words.append(word)

str = json.dumps(obj, ensure_ascii=False)
res.write(str + "\n")
