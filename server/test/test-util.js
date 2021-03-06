'use strict';

var expect = require('chai').expect;
var util = require('../util.es6');
var noncommercialModels = require('./data/noncommercial-model-test-data.es6');

describe('util tests', () => {

  describe('collate errors tests', () => {

    it('should push an error string with a prefix onto the error array for enum error', () => {
      let result = {
        errors: [
          {
            name: 'enum',
            property: 'instance.testfield'
          }
        ]
      };

      let errorArr = [];

      util.collateErrors(result, errorArr, 'prefixtest.');

      expect(errorArr).to.have.lengthOf(1);
      expect(errorArr[0]).to.equal('enum-prefixtest.testfield');

    });

    it('should push an error string without a prefix onto the error array for enum error', () => {
      let result = {
        errors: [
          {
            name: 'enum',
            property: 'instance.testfield'
          }
        ]
      };

      let errorArr = [];

      util.collateErrors(result, errorArr);

      expect(errorArr).to.have.lengthOf(1);
      expect(errorArr[0]).to.equal('enum-testfield');

    });

    it('should push an error string without a prefix onto the error array for required error not just instance', () => {
      let result = {
        errors: [
          {
            name: 'required',
            property: 'instance.testObj',
            argument: 'testField'
          }
        ]
      };

      let errorArr = [];

      util.collateErrors(result, errorArr);

      expect(errorArr).to.have.lengthOf(1);
      expect(errorArr[0]).to.equal('required-testObj.testField');

    });

    it('should push an error string without a prefix onto the error array for required error just instance', () => {
      let result = {
        errors: [
          {
            name: 'required',
            property: 'instance',
            argument: 'testField'
          }
        ]
      };

      let errorArr = [];

      util.collateErrors(result, errorArr);

      expect(errorArr).to.have.lengthOf(1);
      expect(errorArr[0]).to.equal('required-testField');

    });

    it('should push an error string with a prefix onto the error array for required error just instance', () => {
      let result = {
        errors: [
          {
            name: 'required',
            property: 'instance',
            argument: 'testField'
          }
        ]
      };

      let errorArr = [];

      util.collateErrors(result, errorArr, 'prefixtest.');

      expect(errorArr).to.have.lengthOf(1);
      expect(errorArr[0]).to.equal('required-prefixtest.testField');

    });

  });

  describe('test intake to middle layer', () => {
    it('should correctly put the person address in middle layer object', () => {
      let result = util.translateFromIntakeToMiddleLayer(noncommercialModels.noncommercialModelPerson.create());

      expect(result.applicantInfo.mailingAddress).to.equal('111 Oak St');

    });

    it('should correctly put the org address in middle layer object', () => {
      let result = util.translateFromIntakeToMiddleLayer(noncommercialModels.noncommercialModelOrg.create());

      expect(result.applicantInfo.mailingAddress).to.equal('999 Birch St');

    });
  });

});
