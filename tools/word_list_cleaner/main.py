import re
import json

origin = open("../../vocabulary/origin/gre1.txt", "r", 1, "utf-8")
res = open("../../vocabulary/origin/library.json", "w", 1, "utf-8")

obj = {}
obj["words"] = {}
obj["list"] = []

gre_words = []
gre_library = {
    "name": "gre",
    "words": gre_words,
    "word_count": 0
}
obj["list"].append(gre_library)

word_count = 0
for line in origin:
    line = line.strip()
    if re.match(r"^[a-zA-z]+", line) and len(line):
        sh = re.search(r"\w+", line)
        span = sh.span()
        word = sh.group()

        desc = line[span[1]:len(line)].strip()
        print(word, desc)

        obj["words"][word] = {
            "id": word_count,
            "word": word,
            "desc1": desc
        }
        word_count += 1

        gre_words.append(word)

gre_library["word_count"] = word_count
str = json.dumps(obj, ensure_ascii=False)
res.write(str + "\n")
