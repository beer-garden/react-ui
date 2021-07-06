import React, { FC } from "react";
import TextField from "@material-ui/core/TextField";

interface DictProps {
  id?: string;
  value: any;
  title: string;
  updateValue: (newValue: any) => void;
}

export const Dictionary: FC<DictProps> = ({
  // id,
  value,
  updateValue,
  title,
}) => {
  const handleChange = (event: any) => {
    try {
      if (event.target.value === "") {
        updateValue(null);
      } else {
        let tempDict = JSON.parse(event.target.value);
        if (typeof tempDict === "object") {
          updateValue(tempDict);
        } else {
          throw new Error("Property is not a Dictionary!");
        }
      }
    } catch (err) {
      updateValue(event.target.value);
    }
  };

  function formatValue(value: any) {
    if (value) {
      return JSON.stringify(value);
    } else {
      return "";
    }
  }

  return (
    <TextField
      defaultValue={formatValue(value)}
      multiline={true}
      rows={3}
      rowsMax={3}
      label={title}
      variant="outlined"
      onChange={handleChange}
    />
  );
};
