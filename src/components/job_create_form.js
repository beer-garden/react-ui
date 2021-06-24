import React from "react";
//import JobService from './jobsform';
import {materialCells, materialRenderers,} from '@jsonforms/material-renderers';
import {JsonForms} from '@jsonforms/react';
import AlertForm from '../builderForm/alertControl'
import AlertTester from '../builderForm/alertTester'
import DictionaryControl from '../builderForm/customFormRenders/dictControl'
import DictionaryTester from '../builderForm/customFormRenders/dictTester'
import Button from '@material-ui/core/Button';
import {Redirect} from 'react-router';
import Tooltip from '@material-ui/core/Tooltip';
//import { makeStyles } from '@material-ui/core/styles';
import JobService from '../services/job_service'


const JobViewForm = ({self, schema, uischema, initialModel}) => {
//      const classes = makeStyles({
//                            table: {
//                              minWidth: 500,
//                            },
//                          });
    function submitForm(self, successCallback) {
        JobService.createJob(self, successCallback);
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
                                Create Job
                        </Button>
                        </span>
                </Tooltip>
            )
        } else {
            return (
                <Button onClick={() => submitForm(self, successCallback)} variant="contained" color="primary">
                    Create Job
                </Button>
            )
        }
    }

    return (
        <div>

            <JsonForms
                schema={schema}
                uischema={uischema}
                data={self.state.data}
                renderers={[...materialRenderers, {tester: AlertTester, renderer: AlertForm}, {
                    tester: DictionaryTester,
                    renderer: DictionaryControl
                }]}
                cells={materialCells}
                onChange={({data, errors}) => {
                    self.setState({data: data, errors: errors});
                }}
            />
            <Button variant="contained" onClick={() => self.setState({data: initialModel})} color='secondary'>
                Reset
            </Button>

            {makeRequest(self)}

        </div>
    )
}

export default JobViewForm;
