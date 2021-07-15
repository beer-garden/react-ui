import Instance from "./instance_type";
import Command from "./command_type";

type System_type = {
  name: string;
  description: string;
  version: string;
  id: string;
  max_instances: number;
  instances: Instance[];
  commands: Command[];
  icon_name: string;
  display_name: string;
  metadata: any;
  namespace: string;
  local: boolean;
  template: string;
};

export default System_type;
