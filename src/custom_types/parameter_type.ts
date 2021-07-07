import Choice from "./choice_type";

type Parameter = {
  key: string;
  type: string;
  multi: boolean;
  display_name: string;
  optional: boolean;
  default: string;
  description: string;
  choices: Choice[];
  parameters: Parameter;
  nullable: boolean;
  maximum: number;
  minimum: number;
  regex: string;
  form_input_type: any;
  type_info: any;
};

export default Parameter;
