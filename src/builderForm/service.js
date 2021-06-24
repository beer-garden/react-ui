//import _ from 'lodash';

import {buildCommonSF, buildModelSF} from './builder';

/**
 * sfBuilderService - Service for converting systems, commands, and parameters into valid
 * schema-form objects for use by angular-schema-form.
 * @return {Object}                A Service for building valid schema-form objects.
 */
export function sfBuilderService() {
  let SFBuilderService = {};

  /**
   * Returns a valid schema / form combination for use in angular-schema-form
   *
   * If there are optional fields, it will return a form which includes tabs
   * where the required and optional fields are separated.
   * If there are no * optional fields, then it returns a simple flat form with
   * the required fields only.
   *
   * @param {Object} system - A valid beer-garden System object
   * @param {Object} command - A valid beer-garden Command object
   * @return {Object} schemaForm - An object with schema and form properties
   */
  SFBuilderService.build = function(system, command) {
    // Build the actual schema and form for this specific command
    let modelSF = buildModelSF(command, ['parameters']);
    let commonSF = buildCommonSF(system, command);

    let buildSchemas = {
        "type": "object",
        "properties": Object.assign({}, commonSF.schema, modelSF.schema),
        "required": commonSF.required
      };
    let buildModel = Object.assign({}, commonSF.model, modelSF.model)
    let buildForm = {
                        'type': 'VerticalLayout', 'elements': [modelSF.form, commonSF.form],
                      };

    // Merge the two into the final representation
    // For the schema start with common and add the model to its parameters
    // If the command has a custom schema then use that instead of the generated one



//    if (command.schema !== undefined && !_.isEqual({}, command.schema)) {
//      modelSchema = {type: 'object', properties: command.schema};
//    } else {
//      modelSchema = {type: 'object', properties: modelSF['schema']};
//    }
//
//    // Form is a little more tricky
//    // If the command has a custom form then use that instead of the generated one
//    if (command.form !== undefined &&
//        !_.isEqual({}, command.form) &&
//        !_.isEqual([], command.form)) {
//      modelForm = Array.isArray(command.form) ? command.form : [command.form];
//    } else {
//      modelForm = [];
//      let required = [];
//      let optional = [];
//
//      for (var item of modelSF['form']) {
//        // Form items can be either a string or dictionary with a key parameter
//        let itemKey = typeof item === 'string' ? item : item.key;
//
//        // The actual key itself should be an array, but if not we need to make it one
//        itemKey = typeof itemKey === 'string' ? parse(itemKey) : itemKey;
//        let schemaItem = modelSchema['properties'][itemKey[itemKey.length-1]];
//
//        if (schemaItem.optional) {
//          optional.push(item);
//        } else {
//          required.push(item);
//        }
//      }
//
//      if (optional.length) {
//        if (!required.length) {
//          required.push(
//            {'type': 'help',
//             'helpvalue': '<div uib-alert class="alert alert-info m-b-0">None! :)</div>'}
//           );
//        }
//        modelForm.push({
//          'type': 'tabs',
//          'tabs': [
//            {'title': 'Required Fields', 'items': required},
//            {'title': 'Optional Fields', 'items': optional},
//          ],
//        });
//      } else {
//        modelForm = required;
//      }
//    }
//
//    // Build the schema and form common to all commands
//    let commonSF = buildCommonSF(system, command);
//
//    // Tie in the model schema in the correct place
//    commonSF['schema']['parameters'] = modelSchema;
//
    return {
      schema: buildSchemas,
      form: buildForm,
      model: buildModel
    };
  };

  return SFBuilderService;
};
