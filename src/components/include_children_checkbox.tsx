import React, { FC } from "react";
import Checkbox from "@material-ui/core/Checkbox";

interface CheckboxesProps {
  self: any;
}

const Checkboxes: FC<CheckboxesProps> = ({ self }: CheckboxesProps) => {
  const [checked, setChecked] = React.useState(
    self.state.data.include_children
  );

  const handleChange = (event: any) => {
    let state = self.state;
    setChecked(event.target.checked);
    state.data.include_children = !state.data.include_children;
    self.searchDataAPI.include_children = state.data.include_children;
    state.page = 0;
    self.updateData();
  };

  return (
    <div>
      <Checkbox checked={checked} onChange={handleChange} />
      Include Children
    </div>
  );
};

export default Checkboxes;
