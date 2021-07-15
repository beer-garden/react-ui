import React from "react";
import { withJsonFormsControlProps } from "@jsonforms/react";
import Alert from "@material-ui/lab/Alert";

const AlertControl = () => <Alert severity="info">None! :)</Alert>;

export default withJsonFormsControlProps(AlertControl);
