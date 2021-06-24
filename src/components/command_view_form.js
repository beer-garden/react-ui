//import JobService from './jobsform';
import {materialCells, materialRenderers,} from '@jsonforms/material-renderers';
import {JsonForms} from '@jsonforms/react';
import AlertForm from '../builderForm/alertControl'
import AlertTester from '../builderForm/alertTester'
import DictionaryControl from '../builderForm/customFormRenders/dictControl'
import DictionaryTester from '../builderForm/customFormRenders/dictTester'
import Button from '@material-ui/core/Button';
import {Link as RouterLink} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
//import { makeStyles } from '@material-ui/core/styles';
import RequestService from '../services/request_service'


const CommandViewForm = ({self, schema, uischema, initialData}) => {
//      const classes = makeStyles({
//                            table: {
//                              minWidth: 500,
//                            },
//                          });
    function submitForm(self) {
        RequestService.createRequest(self, self.state.model);
//          self.setState({redirect: (<Redirect push to="/requests" />)})
    }

//        successCallback(response){
//            self.setState({redirect: (<Redirect push to={"/requests/".concat(response.data.id)} />)})
//        }

    function makeRequest(self) {
        if (self.state.errors.length > 0) {
            return (
                <Tooltip title="Missing required properties">
                        <span>
                        <Button disabled={true} variant="contained" color="primary">
                                Make Request
                        </Button>
                        </span>
                </Tooltip>
            )
        } else {
            return (
                <Button onClick={() => submitForm(self)} variant="contained" color="primary">
                    Make Request
                </Button>
            )
        }
    }

    function CreateJobRequest(self) {
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
                <Button component={RouterLink} to={{pathname: "/jobs/create", state: {request: self.state.model}}}
                        variant="contained" color="primary">
                    Create Job
                </Button>
            )
        }
    }

    function onChange(self, data, errors) {
        let temp_errors = [];
//            let temp_data = {};
        for (let i in errors) {
            let path = errors[i].dataPath.replace("parameters.", "").replace('__dict', '');
            let parameter = self.command.parameters.find(para => para['key'] === path) || {}
            if (!((parameter["nullable"] || parameter['optional']) && errors[i].data === null)) {
                temp_errors.push(errors[i]);
                if (errors[i].dataPath.includes('parameters.')) {
                    delete data[errors[i].dataPath.split('.')[0]][errors[i].dataPath.split('.')[1]]
                }
            }
        }
        self.setState({data: data, errors: temp_errors, model: self.formatDataToModel(data)});
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
                    onChange(self, data, errors)
                }}
            />
            <Button variant="contained" onClick={() => onChange(self, initialData, [])} color='secondary'>
                Reset
            </Button>

            {makeRequest(self)}
            {CreateJobRequest(self)}

        </div>
    )
}

export default CommandViewForm;
