import _ from "lodash";

/**
 * baseSchemaForm - Get a basic schema and form for a given parameter type
 * @return {Object}                Schema and form definition object
 */
export function baseSchemaForm(parameterType) {
  let type = parameterType.toLowerCase();

  let typeMap = {
    any: "variant",
    integer: "integer",
    float: "number",
    boolean: "boolean",
    dictionary: "dictionary",
    string: "string",
    date: "integer",
    datetime: "integer",
    base64: "file",
  };

  // We want the schema type to default to 'string' and always also allow 'null'.
  // That way we have finer-grained control over when null is allowed.
  let schema = {
    type: [typeMap[type] || "string", "null"],
  };
  let form = {};

  // Certain types require additional options
  if (type === "date") {
    schema["format"] = "datetime";
    form["options"] = { format: "MM/DD/YYYY" };
  } else if (type === "datetime") {
    schema["format"] = "datetime";
  } else if (type === "base64") {
    schema["format"] = "base64";
  }

  return { schema: schema, form: form };
}

/**
 * correctDefault - Get the correct default based on parameter type
 */
export function correctDefault(parameter, type) {
  switch (type) {
    case "boolean":
      return parameter.nullable && parameter.default === null
        ? null
        : !!parameter.default;

    // If the default is null then default to an empty array
    // Otherwise create a deep copy of the default
    case "array":
      if (!!parameter.default) {
        return _.merge([], parameter.default);
      } else if (parameter.default === null && parameter.nullable) {
        return null;
      } else {
        return undefined;
      }

    // If default is defined then return a deep copy, otherwise an empty object
    case "object":
      if (!!parameter.default) {
        return _.merge({}, parameter.default);
      } else {
        return {};
      }

    // Don't allow defaults for the base64 parameter, this could be dangerous.
    case "base64":
      return undefined;

    default:
      return parameter.default;
  }
}

/**
 * applyConstraint - Apply a contraint
 */
export function applyConstraint(object, createKey, paramValue) {
  if (!_.isUndefined(paramValue) && paramValue !== null) {
    object[createKey] = paramValue;
  }
}
