import json
from pprint import pformat

fil = open("system_collection_dump_fixed_cleaned.json")
txt = fil.read()
data = json.loads(txt)
choice_types = {}

for sys in data:
    sys_name = sys.get("name", "UNNAMED")
    if "commands" in sys:
        for command in sys["commands"]:
            comm_name = command.get("name", "UNNAMED")
            for param in command["parameters"]:
                choices = param.get("choices", None)
                if choices is not None:
                    choice_type = choices['type']
                    details = choices['details']
                    if choice_type == 'command':
                        key_name = sys_name + ":" + comm_name + ":" + param.get("key", "")
                        if key_name in choice_types:
                            choice_types[key_name] += details or None
                        else:
                            choice_types[key_name] = [details or None]
# for choice_type in choice_types:
print(pformat(choice_types))
