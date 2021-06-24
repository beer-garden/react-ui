//used for testing form builder

import React, { useState } from "react";
//import JobService from './jobsform';
import systemService from './command';
import {sfBuilderService} from './builderForm/service';
import PageHeader from './components/pageHeader';
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import ReactJson from 'react-json-view'
import AlertForm from './builderForm/alertControl'
import AlertTester from './builderForm/alertTester'
import Button from '@material-ui/core/Button';
//import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
//import Alert from '@material-ui/lab/Alert';

import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';
import { createAjv } from '@jsonforms/core';


export default function App() {


  const classes = makeStyles({
                      table: {
                        minWidth: 500,
                      },
                    });
  let SFBuilderService = sfBuilderService();
    let build = SFBuilderService.build(systemService, systemService.commands[0])
//  let build = buildModelSF(systemService.commands[0], "test")
  let uischema = build.form;
  let schema = build.schema;
  let model = build.model;


  const handleDefaultsAjv = createAjv({useDefaults: true});

//  let build = buildModelSF(systemService.commands[0], "test")
//    let uischema = build.form;
//    let schema = build.schema;
//    let model = build.model;
//  let formButton = build.formButton
  const [data, setData] = useState(build.model);
  const [errors, setErrors] = useState();
      let modelFormatted = {'parameters': {}}
      for (let key in data) {
        let newKey = key.split("__");
        if (newKey.length === 2){
            modelFormatted[newKey[0]][newKey[1]] = data[key];
        } else {
            modelFormatted[key] = data[key];
        }
      }
  function submitForm(errors, model){
    console.log(errors)
  }
//      return modelFormatted;
//  modelFormatted = formatModel(data)
  return (
    <div className="App">
      <PageHeader title = {systemService.commands[0].name} description={systemService.commands[0].description} breadcrumbs = {[systemService.namespace, systemService.name, systemService.version, systemService.commands[0].name]} />
      <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
              <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell>

                    </TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow>
                    <TableCell>
                        <JsonForms
                          schema={schema}
                          uischema={uischema}
                          data={data}
                          renderers={[...materialRenderers, {tester: AlertTester, renderer: AlertForm}]}
                          cells={materialCells}
                          onChange={({ data, _errors }) => {setData(data); setErrors(_errors);}}
                        />
                        <Button variant="contained" onClick={() => setData(model)} color='secondary'>
                                Reset
                        </Button>
                        <Button variant="contained" onClick={() => submitForm(errors, modelFormatted)} color='primary'>
                                Make Request
                        </Button>
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'top' }}>
                        <ReactJson src={modelFormatted} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: 'top' }}>
                        <ReactJson src={schema} />
                    </TableCell>
                    <TableCell>
                        <ReactJson src={uischema} />
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
    </div>
  );
}