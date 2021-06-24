import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

const Checkboxes = ({self}) => {
    const [checked, setChecked] = React.useState(self.state.data.include_children);

    const handleChange = (event) => {
        let state = self.state;
        setChecked(event.target.checked);
        state.data.include_children = !state.data.include_children;
        state.searchData.include_children = state.data.include_children;
        state.page = 0;
        self.updateData(self);
    };

    return (
        <div>
            <Checkbox
                checked={checked}
                onChange={handleChange}
            />Include Children
        </div>
    );
}

export default Checkboxes