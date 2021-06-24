import React from "react";
import {materialCells, materialRenderers,} from '@jsonforms/material-renderers';
import {JsonForms} from '@jsonforms/react';
import Button from '@material-ui/core/Button';
import {Redirect} from 'react-router';
import Tooltip from '@material-ui/core/Tooltip';
//import { makeStyles } from '@material-ui/core/styles';
//import AlertForm from '../builderForm/alertControl'
//import AlertTester from '../builderForm/alertTester'
//import DictionaryControl from '../builderForm/customFormRenders/dictControl'
//import DictionaryTester from '../builderForm/customFormRenders/dictTester'
import GardenService from '../services/garden_service'


const GardenViewForm = ({self, schema, uischema, initialModel}) => {
//      const classes = makeStyles({
//                            table: {
//                              minWidth: 500,
//                            },
//                          });
    function submitForm(self, successCallback) {
//          JobService.createJob(self, successCallback);
//          self.setState({redirect: (<Redirect push to="/requests" />)})
    }

    function successCallback(self, response) {
        self.setState({redirect: (<Redirect push to={"/jobs/".concat(response.data.id)}/>)})
    }

    function makeRequest(self) {
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
