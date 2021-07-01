import React, {FC} from "react";
import {materialCells, materialRenderers,} from '@jsonforms/material-renderers';
import {JsonForms} from '@jsonforms/react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import GardenService from '../services/garden_service'

interface GardenViewFormProps {
    self: any
    schema: any
    uischema: any
}

const GardenViewForm: FC<GardenViewFormProps> = ({self, schema, uischema}: GardenViewFormProps) => {

    function makeRequest(self: any) {
        if (self.state.errors.length > 0) {
            return (
                <Tooltip title="Missing required properties">
                        <span>
                        <Button disabled={true} variant="contained" color="primary">
                                Save Configurations
                        </Button>
                        </span>
                </Tooltip>
            )
        } else {
            return (
                <Button
                    onClick={() => GardenService.updateGardenConfig(GardenService.formToServerModel(self.garden, self.state.dataForm))}
                    variant="contained" color="primary">
                    Save Configurations
                </Button>
            )
        }
    }

    return (
        <div>
            <JsonForms
                schema={schema}
                uischema={uischema}
                data={self.state.dataForm}
                renderers={[...materialRenderers,]}
                cells={materialCells}
                onChange={({data, errors}) => {
                    self.setState({dataForm: data, errors: errors});
                }}
            />
            {makeRequest(self)}

        </div>
    )
}

export default GardenViewForm;
