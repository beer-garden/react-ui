import {withJsonFormsControlProps} from '@jsonforms/react';
import {Dictionary} from './dictForm';

interface
DictionaryControlProps
{
    data: any;
    handleChange(path
:
    string, value
:
    any
):
    void;
    path: string;
}

const DictionaryControl = ({data, handleChange, path, label}: DictionaryControlProps) => (
    <Dictionary
        value={data}
        updateValue={(newValue: myDict) => handleChange(path, newValue)}
        title={path.split(".")[1]}
    />
);

export default withJsonFormsControlProps(DictionaryControl);