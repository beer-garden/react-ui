sfPostProcessor.$inject = ["postProcess", "schemaForm"];

/**
 * sfPostProcessor - Post processes a Schema-Form (from angular-schema-form) to includes
 * our rules about nullable objects since angular-schema-form does not like the concept
 * very much.
 * @param  {type} postProcess description
 * @param  {type} schemaForm  description
 */
export function sfPostProcessor(postProcess, schemaForm) {
  postProcess.addPostProcess(function (canonicalForm) {
    // Validators
    let requiredAllowNull = function (modelValue, viewValue) {
      return !(modelValue === undefined);
    };
    let failNull = function (modelValue, viewValue) {
      return !(modelValue === null);
    };

    // Parsers
    let emptyStringToNull = function (modelValue) {
      return modelValue === "" ? null : modelValue;
    };

    for (let i = 0; i < canonicalForm.length; i++) {
      schemaForm.traverseForm(canonicalForm[i], function (formObj) {
        if (formObj.schema) {
          let validators = {};
          if (formObj.schema.requiredAllowNull) {
            validators["requiredAllowNull"] = requiredAllowNull;
          }
          if (formObj.schema.failNull) {
            validators["failNull"] = failNull;
          }
          formObj.$validators = _.merge({}, formObj.$validators, validators);

          let parsers = [];
          if (
            formObj.schema.type.indexOf("string") != -1 &&
            formObj.schema.nullable
          ) {
            parsers.push(emptyStringToNull);
          }
          formObj.$parsers =
            formObj.$parsers === undefined
              ? parsers
              : formObj.$parsers.concat(parsers);
        }
      });
    }
    return canonicalForm;
  });
}
