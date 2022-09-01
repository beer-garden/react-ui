import json

fil = open("system_collection_dump_fixed_cleaned.json")
txt = fil.read()
data = json.loads(txt)


def report(param, sys_name, comm_name, key_name=":"):
    hasSubParameters = len(param["parameters"]) > 0
    isMulti = param.get("multi", None)
    hasChoices = param.get("choices", None)

    # if hasSubParameters and not hasChoices and isMulti:
        # if 'type' in param and param['type'] == 'Dictionary':
        # if 'minimum' in param:
        # if param['multi'] and param['nullable']:
        #     print(
        #         f"{sys_name}:{comm_name}{key_name} hasSubParameters AND NOT hasChoices AND isMulti"
        #     )
        

    # if hasSubParameters and not hasChoices and not isMulti:
    #     # if 'type' in param and param['type'] == 'Dictionary':
    #     # if 'minimum' in param:
    #     print(
    #         f"{sys_name}:{comm_name}:{key_name} hasSubParameters AND NOT hasChoices AND NOT isMulti"
    #     )

    # if not hasSubParameters and hasChoices and isMulti:
    #     # if 'type' in param and param['type'] == 'Dictionary':
    #     if 'minimum' in param:
    #         print(
    #             f"{sys_name}:{comm_name}:{key_name} NOT hasSubParameters AND hasChoices AND isMulti"
    #         )

    # if not hasSubParameters and hasChoices and not isMulti:
        # if 'type' in param and param['type'] == 'Dictionary':
        # if 'minimum' in param:
        # if 'default' in param and param['default']:
        #     print(
        #         f"{sys_name}:{comm_name}:{key_name} NOT hasSubParameters AND hasChoices AND NOT isMulti"
        #     )
    # if not hasSubParameters and not hasChoices and isMulti:
    #     # if 'type' in param and param['type'] == 'Dictionary':
    #     # if 'maximum' in param:
    #     if 'minimum' in param:
    #         print(
    #             f"{sys_name}:{comm_name}:{key_name} NOT hasSubParameters AND NOT hasChoices AND isMulti"
    #         )

    if not hasSubParameters and not hasChoices and not isMulti:
        if 'type' in param and param['type'] == 'Dictionary':
        # if 'default' in param and param['default']:
        # if param['nullable']:
            print(
                f"{sys_name}:{comm_name}:{key_name} NOT hasSubParameters AND NOT hasChoices AND NOT isMulti"
            )
            # print(
            #     f"{sys_name}:{comm_name}:{key_name} default = {param['default']}"
            # )
            # print(
            #     f"{sys_name}:{comm_name}:{key_name} nullable"
            # )
        # if param['type'] == 'Date':
        #         print(
        #     f"{sys_name}:{comm_name}:{key_name} Date"
        # )
    # pass


def check_param(param, sys_name, comm_name, key_name=":"):
    if len(param["parameters"]) > 0 and param.get("choices", None):
        print(
            f"ERROR {sys_name}:{comm_name}:{key_name} hasSubParameters AND hasChoices"
        )
    else:
        report(param, sys_name, comm_name, key_name)

        for sub_param in param["parameters"]:
            check_param(
                sub_param, sys_name, comm_name, key_name + sub_param["key"] + ":"
            )

def show_param_type(param, sys_name, comm_name, key_name=":"):
    # print(f"{sys_name}:{comm_name}:{key_name} TYPE = {param['type']}")
    types = [param['type']]

    for sub_param in param["parameters"]:
        types += show_param_type(sub_param, sys_name, comm_name, key_name + sub_param['key'] + ":")
    
    return types

# all_types = []

for sys in data:
    sys_name = sys.get("name", "UNNAMED")
    if "commands" in sys:
        for command in sys["commands"]:
            comm_name = command.get("name", "UNNAMED")
            for param in command["parameters"]:
                check_param(param, sys_name, comm_name)
                # all_types += show_param_type(param, sys_name, comm_name)

# print(set(all_types))
