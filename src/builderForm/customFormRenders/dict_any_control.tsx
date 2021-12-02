import React from "react";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { DictionaryAny } from "./dict_any_form";
import { ControlProps } from "@jsonforms/core";

const DictionaryAnyControl = (props: ControlProps) => (
  <DictionaryAny controlProps={props} />
);

export default withJsonFormsControlProps(DictionaryAnyControl);
