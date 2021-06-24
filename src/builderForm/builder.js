//https://jsonforms.io/docs/integrations/react/
import {buildParameterSF} from './parameterBuilder';

/**
 * buildCommonSF - * Builds the schema and form common to all commands.
 * @param  {Object} system  beer-garden system object.
 * @param  {Object} command beer-gardne command object.
 * @return {Object}         Schema-form object that is common to all commands.
 */
export function buildCommonSF(system, command) {
  // SCHEMA
  let instanceNames = [];
  for (var instance of system.instances) {
    instanceNames.push(instance.name);
  }

  let commonSchema = {
            'system': {
              'title': 'System Name', 'type': 'string',
//              'required': true,
            },
            'system_version': {
              'title': 'System Version', 'type': 'string',
            },
            'namespace': {
              'title': 'Namespace', 'type': 'string',
//              'required': true,
            },
            'command': {
              'title': 'Command Name', 'type': 'string',
//              'required': true,
            },
            'comment': {
              'title': 'Comment', 'type': 'string',
              'maxLength': 140,
              'validationMessage': 'Maximum comment length is 140 characters',
            },
            'output_type': {
              'title': 'Output Type', 'type': 'string',
//              'required': false,
            },
            'instance_name': {
              'title': 'Instance Name', 'type': 'string',
//              'required': true,
            },

  };
  let commonModel = {
    'system': system.name,
    'system_version': system.version,
    'namespace': system.namespace,
    'command': command.name,
    'output_type': command.output_type,
  }
    let systemSection = {};
  if (system.instances.length === 1) {
    commonModel['instance_name'] = instanceNames[0];
    systemSection = {
        'type': 'HorizontalLayout',
        "rule": {
          "effect": "DISABLE",
          "condition": {
          },
        },
        'elements': [

              {
                'type': 'Control',
                'scope': '#/properties/system'
              },
              {
                'type': 'Control',
                'scope': '#/properties/system_version', 'feedback': false, 'disableSuccessState': true,
                'disableErrorState': true, 'disabled': true, 'required': true,
                'htmlClass': 'col-md-3',
              },
              {
                'type': 'Control',
                'scope': '#/properties/command', 'feedback': false, 'disableSuccessState': true,
                'disableErrorState': true, 'disable': true, 'required': true,
                'htmlClass': 'col-md-3',
              },
          {
            'type': 'Control',
            'scope': '#/properties/instance_name', 'feedback': false, 'disableSuccessState': true,
            'htmlClass': 'col-md-3', 'choices': {'titleMap': instanceNames},
          },
        ],
      };
  } else{
    commonSchema.instance_name["enum"] = instanceNames;
    systemSection = {
        'type': 'HorizontalLayout',
        "rule": {
          "effect": "DISABLE",
          "condition": {
          },
        },
        'elements': [
            {'type': 'HorizontalLayout',
            "rule": {
              "effect": "DISABLE",
              "condition": {}
            },
            'elements': [
              {
                'type': 'Control',
                'scope': '#/properties/system'
              },
              {
                'type': 'Control',
                'scope': '#/properties/system_version', 'feedback': false, 'disableSuccessState': true,
                'disableErrorState': true, 'disabled': true, 'required': true,
                'htmlClass': 'col-md-3',
              },
              {
                'type': 'Control',
                'scope': '#/properties/command', 'feedback': false, 'disableSuccessState': true,
                'disableErrorState': true, 'disable': true, 'required': true,
                'htmlClass': 'col-md-3',
              },
            ]
          },
          {
            'type': 'Control',
            'scope': '#/properties/instance_name', 'feedback': false, 'disableSuccessState': true,
            'htmlClass': 'col-md-3', 'choices': {'titleMap': instanceNames},
            "rule": {
                  "effect": "ENABLE",
                  "condition": {
                    "scope": "#/properties/instance_name",
                    "schema": { enum: undefined }
                  },
          },
          }
        ],
      };
  }

  // UI Schema
//  const instanceHelp = {
//    'type': 'help',
//    'helpvalue': '<div uib-alert class="alert alert-warning m-b-0">Instance is not RUNNING, ' +
//                 'but you can still "Make Request"</div><br>',
//    'condition': 'checkInstance(instance_name)',
//  };



//  const hr = {'type': 'help', 'helpvalue': '<hr>'};
  const comment = {
    'type': 'Control',
    'scope': '#/properties/comment', 'feedback': true, 'disableSuccessState': false, "options": {
                                                                                             "multi": true
                                                                                           },
    'disableErrorState': false, 'readonly': false, 'required': false, 'fieldHtmlClass': 'm-b-3',
  };

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

  const commonForm = {
    'type': 'VerticalLayout', 'elements': [systemSection, comment],
  };

  return {
    schema: commonSchema,
    form: commonForm,
    model: commonModel,
    required: ['system','system_version','namespace','instance_name','command',]
  };
};

/**
 * buildModelSf - Build a schema and form for an object model.
 * @param  {Object} model     Parameter Model.
 * @param  {string} parentKey The key representing this model's parent.
 * @return {Object}           Schema-Form object for use by angular-schema-form.
 */
export function buildModelSF(model, parentKey) {
  let paramSchemas = {};
  paramSchemas[parentKey] = {"type": "object",
                   "properties": {},
                   "required": [],
                  };
  let paramModel = {};
  paramModel[parentKey] = {};
//  paramModel[parentKey] = {}
//  paramSchemas[parentKey] = {};
  let optionalArray = [];
  let requiredArray = [];

  for (let i=0, len=model.parameters.length; i<len; i++) {
    let parameter = model.parameters[i];
    let key = parameter.key;
    if (parameter.type.toLowerCase() === 'dictionary'){
        if(!parameter.parameters[0]){
            key = key.concat('__dict')
        }
    }
    let sf = buildParameterSF(parameter, parentKey);
    paramModel.[parentKey][key] = sf.model;
    paramSchemas[parentKey].properties[key] = sf['schema'];
    if (parameter.optional){
        optionalArray.push(sf['form']);
    }
    else{
            paramSchemas[parentKey]["required"].push(key);
            requiredArray.push(sf['form']);
    }
  }
  if (requiredArray.length < 1 || requiredArray === undefined){
    paramSchemas['alert'] = {'title': 'System Name', 'type': 'string',};
    requiredArray.push({
            'type': 'Control',
            'scope': '#/properties/alert'
          })
  }
  if (optionalArray.length < 1 || optionalArray === undefined){
      paramSchemas['alert'] = {'title': 'System Name', 'type': 'string',};
      optionalArray.push({
              'type': 'Control',
              'scope': '#/properties/alert'
            })
    }

  let paramForms =
        {
          "type": "Categorization",
          "elements": [
            {
                "type": "Category",
                "label": "Required Fields",
                "elements": requiredArray
            },
            {
               "type": "Category",
               "label": "Optional Fields",
               "elements": optionalArray
            },
          ]
        };

  return {
    schema: paramSchemas,
    form: paramForms,
    model: paramModel,
  };
};
