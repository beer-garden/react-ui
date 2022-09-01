import json

fil = open("system_collection_dump_fixed.json")
txt = fil.read()
data = json.loads(txt)

for rec in data:
    for key in ['_id', 'instances', 'local', 'display_name', 'icon_name', 'template', 'description', 'version', 'namespace', 'max_instances', 'metadata']:
        _ = rec.pop(key, None)

print(json.dumps(data, indent=2))
