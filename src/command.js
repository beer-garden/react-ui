//hard coded command for testing form builder
function systemService() {
  let system = {
                       "local": true,
                       "display_name": null,
                       "instances": [
                           {
                               "queue_info": {
                                   "admin": {
                                       "name": "admin.default.echo.1-0-0-dev0.default.9vfh6ughe3"
                                   },
                                   "request": {"name": "default.echo.1-0-0-dev0.default"},
                                   "connection": {
                                       "host": "localhost",
                                       "port": 5672,
                                       "user": "beer_garden",
                                       "password": "password",
                                       "virtual_host": "/",
                                       "ssl": {"enabled": false},
                                   },
                               },
                               "status": "RUNNING",
                               "status_info": {"heartbeat": 1616606557770},
                               "metadata": {"runner_id": "kOpoBYiCSG"},
                               "description": null,
                               "icon_name": null,
                               "id": "6054ae2579793a00d1ce7b2e",
                               "name": "default",
                               "queue_type": "rabbitmq",
                           }
                       ],
                       "metadata": {},
                       "namespace": "default",
                       "description": "Annoying plugin that just repeats stuff.",
                       "icon_name": null,
                       "id": "6054ae2579793a00d1ce7b2f",
                       "commands": [
                           {
                               "parameters": [
                                   {
                                       "type_info": {},
                                       "default": false,
                                       "parameters": [],
                                       "minimum": null,
                                       "multi": false,
                                       "key": "loud",
                                       "display_name": "loud",
                                       "optional": true,
                                       "regex": null,
                                       "description": "Determines if Exclamation marks are added",
                                       "nullable": false,
                                       "maximum": null,
                                       "form_input_type": null,
                                       "choices": null,
                                       "type": "Boolean",
                                   },
                                   {
                                       "type_info": {},
                                       "default": "Hello, World!",
                                       "parameters": [],
                                       "minimum": null,
                                       "multi": false,
                                       "key": "message",
                                       "display_name": "message",
                                       "optional": true,
                                       "regex": null,
                                       "description": "The Message to be Echoed",
                                       "nullable": false,
                                       "maximum": null,
                                       "form_input_type": null,
                                       "choices": null,
                                       "type": "String",
                                   },
                               ],
                               "hidden": false,
                               "output_type": "STRING",
                               "description": "Echos!",
                               "icon_name": null,
                               "template": null,
                               "schema": {},
                               "name": "say",
                               "form": {},
                               "command_type": "ACTION",
                           },

                       ],
                       "name": "echo",
                       "version": "1.0.0.dev0",
                       "max_instances": -1,
               };


  return system;
};

const item = systemService();

   export default item