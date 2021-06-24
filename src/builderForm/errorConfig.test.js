import {sfErrorMessageConfig} from './errorConfig';

let mut, providerStub;

describe('Error Message Config', function () {

    beforeEach(function () {
        providerStub = {
            setDefaultMessage: sinon.stub()
        };

        mut = sfErrorMessageConfig(providerStub);
    });

    it('should set "requiredAllowNull" message', function () {
        expect(providerStub.setDefaultMessage).to.have.been.calledWith('requiredAllowNull');
        expect(providerStub.setDefaultMessage).to.have.been.calledWith('failNull');
    });
});
