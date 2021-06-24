import _ from 'lodash';

import {buildModelSF} from './builder';
import {setDynamicChoices} from './dynamicChoices';
import {baseSchemaForm, correctDefault, applyConstraint} from './utils';

/**
 * buildParameterSF - Build a schema and form for an individual parameter.
 * @param  {Object} parameter Beer-garden parameter object.
 * @param  {string} parentKey The key representing this parameter's parent.
 * @param  {boolean} inArray  Flag to determine if the parameter is part of an array.
 * @return {Object}           Schema-Form object for use by angular-schema-form.
 */
export function buildParameterSF(parameter, parentKey, inArray) {
  // Schema and form that are the same across all parameters
  let parameter_type = parameter.type.toLowerCase();
      let formatSchema = false;
      let dictConcat = "";
      let requiredArray = [];
      let param_properties = {};
      if (parameter_type === 'float'){
          parameter_type = 'number';
      } else if(parameter_type === 'dictionary'){
        parameter_type = 'object';
        if(parameter.parameters[0]){
            for (let i in parameter.parameters){
                let param = parameter.parameters[i];
                let build = buildParameterSF(param, parameter.key)
                param_properties[param.key] = build.schema
                if (!param.optional){
//                    requiredArray.push(param.key);
                }
            }
        } else {
            dictConcat = '__dict';
        }
      } else if(parameter_type === 'date'){
        parameter_type = "string";
        formatSchema = "date";
      } else if(parameter_type === 'datetime'){
        parameter_type = "string";
        formatSchema = "date-time";
      }
  let generalSF = {
    'schema': {
      'type': parameter_type,
      'title': parameter.display_name,
      'description': _.escape(parameter.description),

    },
    'form': {
        'type': 'Control',
        'scope': '#/properties/'.concat([parentKey, 'properties', parameter.key].join('/')).concat(dictConcat)
    },
    'model': parameter.default
  };
  if (parameter.parameters[0]){
    generalSF['schema']['properties'] = param_properties;
    generalSF['schema']['required'] = requiredArray

  }
  if (parameter.choices){
    generalSF['schema']['enum'] = parameter.choices['value']
  }
  if (parameter.multi){
    generalSF['schema'] = {"type": "array", 'title': parameter.display_name, "maxLength": 5, "items": generalSF['schema']};
  }
  if (!parameter.default && parameter_type==='boolean' && !parameter.nullable){
    generalSF['model'] = false;
  }
  if (formatSchema){
    generalSF.schema['format'] = formatSchema;
  }

//  if (inArray) {
//    generalSF['form']['key'].push('');
//  }
//
//  // Type-specific schema / forms
//  let builderFunction;
//  if (parameter.multi && !inArray) {
//    builderFunction = buildMultiParameterSF;
//  } else if (parameter.parameters && parameter.parameters.length > 0) {
//    builderFunction = buildModelParameterSF;
//  } else {
//    builderFunction = buildSimpleParameterSF;
//  }

  return generalSF;
};

// Build a schema and form for a parameter that's not a dictionary
// and not an array
export function buildSimpleParameterSF(parameter, parentKey, inArray) {
  let baseSF = baseSchemaForm(parameter.type);
  let schema = baseSF['schema'];
  let form = baseSF['form'];

  // If the set a form_input_type, we apply it to the form
  applyConstraint(form, 'type', parameter.form_input_type);

  // Deal with 'requiredness'
  // ASF does some mangling before its 'required' validation, most annoyingly making empty
  // strings appear undefined. So we have our own validation based on if the parameter is
  // optional and whether nulls are allowed.
  // Booleans are special. The only way they could 'fail' would be if they were nullable
  // with a null default. If that's allowed it would require two clicks to be 'false' and
  // look the same as how it started.
  if (schema['type'].indexOf('boolean') === -1) {
    if (!parameter.optional) {
      schema[parameter.nullable ? 'requiredAllowNull' : 'required'] = true;
    }

    if (!parameter.nullable) {
      schema['failNull'] = true;
    }
  }

  // Now we do some setup that only makes sense if we aren't inside an array, because if we
  // are we want to apply these things to the array itself, not this
  if (!inArray) {
    // Set up the default model value for this parameter
    // FYI - It's a good idea to only specify a default for things that need it, as a default
    // can cause ASF to treat the field differently.
    // Parameters with NO default will not show in the model preview until they get a value.
    let defaultValue = correctDefault(parameter, schema['type']);
    if (defaultValue !== undefined) {
      if (defaultValue !== null || parameter.nullable) {
        schema['default'] = defaultValue;
      }
    }

    // Now map constraints that depend on the type into the schema and form
    if (schema['type'].indexOf('string') !== -1) {
      applyConstraint(schema, 'maxLength', parameter['maximum']);
      applyConstraint(schema, 'minLength', parameter['minimum']);
      applyConstraint(schema, 'pattern', parameter['regex']);
    } else if (schema['type'].indexOf('integer') !== -1 ||
               schema['type'].indexOf('number') !== -1) {
      applyConstraint(schema, 'maximum', parameter['maximum']);
      applyConstraint(schema, 'minimum', parameter['minimum']);
    }
  }

  // Now wire up dynamic choices
  if (parameter.choices && !_.isEqual(parameter.choices, {})) {
    setDynamicChoices(schema, form, parameter, parentKey);
  }

  return {schema: schema, form: form};
};

export function buildMultiParameterSF(parameter, parentKey) {
  // Multi parameters are represented as 'array' types with their real type
  // definition in the 'items' definition. So first we need to construct the
  // schema and form for this as if it weren't a multi.
  let nestedSF = buildParameterSF(parameter, parentKey, true);

  // Now tweak the result to make sense as an array item
  // We are assuming the default for this parameter is intended for the array,
  // so remove it from the child
  delete nestedSF['schema']['default'];

  // Tweak the display a bit so it looks better inside the array
  nestedSF['form']['notitle'] = true;
  nestedSF['form']['htmlClass'] = 'clear-right';
  delete nestedSF['schema']['description'];

  // A nullable object is a distinct thing and doesn't make sense inside an
  // array (would be the same as an empty array)
  if (nestedSF['schema']['type'] === 'object') {
    nestedSF['schema']['nullable'] = false;
  }

  let arraySF = {
    schema: {
      type: ['array', 'null'],
      items: nestedSF['schema'],
    },
    form: {
      startEmpty: !!parameter.nullable,
      items: [nestedSF['form']],
    },
  };

  // Only add a default if necessary, otherwise it breaks things
  let arrayDefault = correctDefault(parameter, 'array');
  if (arrayDefault !== undefined) {
    arraySF['schema']['default'] = arrayDefault;
    arraySF['form']['startEmpty'] = true;
  }

  // Add array constraints
  applyConstraint(arraySF['schema'], 'maxItems', parameter['maximum']);
  applyConstraint(arraySF['schema'], 'minItems', parameter['minimum']);

  return arraySF;
};

export function buildModelParameterSF(parameter, parentKey, inArray) {
  let newParentKey = inArray ?
    parentKey.concat(parameter.key, '') : parentKey.concat(parameter.key);
  let innerSF = buildModelSF(parameter, newParentKey);
  let objDefault = correctDefault(parameter, 'object');

  let form = {};
  let schema = {
    type: 'object',
    partition: '!optional',
    accordionHeading: 'Optional Fields',
    properties: innerSF['schema'],
  };

  if (parameter.optional && parameter.nullable && _.isEqual({}, objDefault) && !inArray) {
    schema['format'] = 'nullable';
  } else {
    schema['default'] = objDefault;
    form['items'] = innerSF['form'];
  }

  return {schema: schema, form: form};
};
