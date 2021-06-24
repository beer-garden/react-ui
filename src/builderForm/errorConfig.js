sfErrorMessageConfig.$inject = ['sfErrorMessageProvider'];

/**
 * sfErrorMessageConfig - Setup default error messages for nullable problems.
 * @param  {Object} sfErrorMessageProvider Provider from angular-schema-form
 */
export function sfErrorMessageConfig(sfErrorMessageProvider) {
    sfErrorMessageProvider.setDefaultMessage('requiredAllowNull', 'Required');
    sfErrorMessageProvider.setDefaultMessage('failNull', 'Required');
};


