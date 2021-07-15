import Parameter from "./parameter_type";

type Command = {
  name: string;
  description: string;
  parameters: Parameter[];
  command_type: string;
  output_type: string;
  schema: any;
  form: any;
  template: string;
  icon_name: string;
  hidden: boolean;
  metadata: any;
};

export default Command;
