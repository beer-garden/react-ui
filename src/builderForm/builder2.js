////https://react-jsonschema-form.readthedocs.io/en/latest/usage/widgets/
//import {buildParameterSF} from './parameterBuilder';
//
///**
// * buildCommonSF - * Builds the schema and form common to all commands.
// * @param  {Object} system  beer-garden system object.
// * @param  {Object} command beer-gardne command object.
// * @return {Object}         Schema-form object that is common to all commands.
// */
//export function buildCommonSF(system, command) {
//  // SCHEMA
//  let instanceNames = [];
//  for (var instance of system.instances) {
//    instanceNames.push(instance.name);
//  }
//
//  let commonSchema = {
//            'system': {
//              "type": "string",
//                    "title": "System Name",
//                    "default": system.name
////              'default': system.name, 'required': true,
//            },
//            'system_version': {
//              'title': 'System Version', 'type': 'string',
//                    "default": system.version
//            },
//            'namespace': {
//              'title': 'Namespace', 'type': 'string',
//              'default': system.namespace, 'required': true,
//            },
//            'command': {
//              'title': 'Command Name', 'type': 'string', 'disabled': true,
//              'default': command.name, 'required': true,
//            },
//            'comment': {
//              'title': 'Comment', 'type': 'string',
//              'default': '', 'required': false,
//              'maxLength': 140,
//              'validationMessage': 'Maximum comment length is 140 characters',
//            },
//            'output_type': {
//              'title': 'Output Type', 'type': 'string',
//              'default': command.output_type, 'required': false,
//            },
//            'instance_name': {
//              'title': 'Instance Name', 'type': 'string',
//              'required': true,
//            },
//  };
//  let commonModel = {
//    'system': system.name,
//    'system_version': system.version,
//    'namespace': system.namespace,
//    'command': command.name,
//    'output_type': command.output_type,
//  }
//
//  if (system.instances.length === 1) {
//    commonModel['instance_name'] = instanceNames[0];
//    commonSchema['instance_name']['default'] = instanceNames[0];
//  }
//
//  // FORM
//  const instanceHelp = {
//    'type': 'help',
//    'helpvalue': '<div uib-alert class="alert alert-warning m-b-0">Instance is not RUNNING, ' +
//                 'but you can still "Make Request"</div><br>',
//    'condition': 'checkInstance(instance_name)',
//  };
//
//  const systemSection = {
//      "system": {
//        "ui:disabled": true
//      },
//      "system_version": {
//        "ui:widget": "textarea", 'feedback': false, 'disableSuccessState': true,
//        'disableErrorState': true, 'ui:readonly': true, 'required': true,
//        'htmlClass': 'col-md-3',
//      },
//      "command": {
//        "ui:widget": "textarea", 'feedback': false, 'disableSuccessState': true,
//        'disableErrorState': true, 'ui:disable': true, 'required': true,
//        'htmlClass': 'col-md-3',
//      },
//      "instance_name": {
//        "ui:widget": "textarea", 'feedback': false, 'disableSuccessState': true,
//        'htmlClass': 'col-md-3', 'choices': {'titleMap': instanceNames},
//      },
//  };
//
//  const hr = {'type': 'help', 'helpvalue': '<hr>'};
//  const comment = {
//    'type': 'Control',
//    'scope': '#/properties/comment', 'feedback': true, 'disableSuccessState': false,
//    'disableErrorState': false, 'readonly': false, 'required': false, 'fieldHtmlClass': 'm-b-3',
//  };
//
//  const buttonSection = {
//    'type': 'section',
//    'htmlClass': 'row',
//    'items': [
//      {
//        'type': 'button', 'style': 'btn-warning w-100 ', 'title': 'Reset',
//        'onClick': 'reset(ngform, model, system, command.data)', 'htmlClass': 'col-md-2',
//      },
//      {
//        'type': 'submit', 'style': 'btn-primary w-100',
//        'title': 'Make Request', 'htmlClass': 'col-md-10',
//      },
//    ],
//  };
//
//  const commonForm = systemSection;
//
//  return {
//    schema: {"type": "object",
//                          "properties": commonSchema},
//    form: commonForm,
//    model: commonModel,
//  };
//};
//
///**
// * buildModelSf - Build a schema and form for an object model.
// * @param  {Object} model     Parameter Model.
// * @param  {string} parentKey The key representing this model's parent.
// * @return {Object}           Schema-Form object for use by angular-schema-form.
// */
//export function buildModelSF(model, parentKey) {
//  let paramSchemas = {};
//  let paramForms = [];
//
//  for (let i=0, len=model.parameters.length; i<len; i++) {
//    let parameter = model.parameters[i];
//    let key = parameter.key;
//    let sf = buildParameterSF(parameter, parentKey);
//
//    paramSchemas[key] = sf['schema'];
//    paramForms.push(sf['form']);
//  }
//
//  return {
//    schema: {"type": "object",
//              "properties": paramSchemas},
//    form: {
//       "type": "Categorization",
//       "elements": [
//         {
//             "type": "Category",
//             "label": "Job Optional Fields",
//             "elements": [paramForms,]
//         }
//       ]
//    }
//
//  };
//};
