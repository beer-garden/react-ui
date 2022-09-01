fil = open("system_collection_dump.json")
txt = fil.read()
start = False
starting = 0
count = 0
results = []

for i in range(len(txt)):
    if txt[i] == '{':
        count += 1
        if not start:
            start = True
            starting = i
    elif txt[i] == '}':
        count -= 1
    if start and count == 0:
        slice = txt[starting:i+1]
        results.append(slice)
        start = False
    
print('[\n' + '\n,\n'.join(results) + '\n]')
