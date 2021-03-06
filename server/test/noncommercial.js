'use strict';

var noncommercialTestData = require('./data/noncommercialTestData.es6');
var request = require('supertest');
var server = require('../app.es6');
var testGetURL = '/permits/applications';
var testURL = '/permits/applications/special-uses/noncommercial';

describe('noncommercial tests', () => {

  describe('POST tests', () => {
    it('should return a 201 response and a db generated applicationId', (done) => {
      request(server)
				.post(testURL)
        .set('Accept', 'application/json')
        .send(noncommercialTestData.singlePermitHolder.create())
				.expect('Content-Type', /json/)
        .expect(/"applicationId":[\d]+/)
        .expect(201, done);
    });
  });

  describe('POST date validation tests', () => {
    it('should return a 201 response', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create();
      data.dateTimeRange.startDateTime = '2018-01-01T00:15:00Z';
      data.dateTimeRange.endDateTime = '2018-06-30T23:30:00Z';
      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(201, done);
    });

    it('should return a 201 response', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create();
      data.dateTimeRange.startDateTime = '2018-01-31T00:45:00Z';
      data.dateTimeRange.endDateTime = '2018-12-31T23:00:00Z';
      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(201, done);
    });

    it('should return a 400 response', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create();
      data.dateTimeRange.startDateTime = '2018-01-32T00:45:00Z';
      data.dateTimeRange.endDateTime = '2018-13-31T23:00:00Z';
      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect({errors: ['pattern-dateTimeRange.startDateTime', 'pattern-dateTimeRange.endDateTime']})
        .expect(400, done);
    });

    it('should return a 400 response', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create();
      data.dateTimeRange.startDateTime = '2018-32T00:45:00Z';
      data.dateTimeRange.endDateTime = '2018-13-31T00:00Z';
      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect({errors: ['pattern-dateTimeRange.startDateTime', 'pattern-dateTimeRange.endDateTime']})
        .expect(400, done);
    });

    it('should return a 400 response', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create();
      data.dateTimeRange.startDateTime = '2018-01-01T00:45:00';
      data.dateTimeRange.endDateTime = '01-01T23:00:00Z';
      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect({errors: ['pattern-dateTimeRange.startDateTime', 'pattern-dateTimeRange.endDateTime']})
        .expect(400, done);
    });

    it('should return a 400 response', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create();
      data.dateTimeRange.startDateTime = 'what';
      data.dateTimeRange.endDateTime = ' ';
      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect({errors: ['pattern-dateTimeRange.startDateTime', 'pattern-dateTimeRange.endDateTime']})
        .expect(400, done);
    });

  });

  describe('POST validation tests', () => {

    it('should return a validation error for region', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create({ 'region' : 'midwest' });

      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(/\{"errors":\["pattern-region"\]\}/)
        .expect(400, done);
    });

    it('should return a required error for region', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create();
      data.region = undefined;

      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(/\{"errors":\["required-region"\]\}/)
        .expect(400, done);
    });

    it('should return a required error for applicantInfo.dayPhone.areaCode', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create();
      data.applicantInfo.dayPhone.areaCode = undefined;

      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(/\{"errors":\["required-applicantInfo.dayPhone.areaCode"\]\}/)
        .expect(400, done);
    });

    it('should return a type error for applicantInfo.dayPhone.areaCode', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create({ 'applicantInfo.dayPhone.areaCode' : 555 });

      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(/"type-applicantInfo.dayPhone.areaCode"/)
        .expect(400, done);
    });

    it('should return a required error for region AND a pattern error for district', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create({ 'district' : '600' });
      data.region = undefined;

      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(/"required-region"/)
        .expect(/"pattern-district"/)
        .expect(400, done);
    });

    it('should return a required error for evening area code', (done) => {
      let data = noncommercialTestData.singlePermitHolder.create(
        { 'applicantInfo.eveningPhone.prefix' : '555',
          'applicantInfo.eveningPhone.number' : '5555'});

      request(server)
        .post(testURL)
        .set('Accept', 'application/json')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(/"required-applicantInfo.eveningPhone.areaCode"/)
        .expect(400, done);
    });
  });

  it('should return a required error for event name', (done) => {
    let data = noncommercialTestData.singlePermitHolder.create();
    data.eventName = undefined;
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(/"required-eventName"/)
      .expect(400, done);
  });

  it('should return a required error for numberParticipants', (done) => {
    let data = noncommercialTestData.singlePermitHolder.create();
    data.noncommercialFields.numberParticipants = undefined;
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(/"required-noncommercialFields.numberParticipants"/)
      .expect(400, done);
  });

  it('should return a required error for spectator count', (done) => {
    let data = noncommercialTestData.singlePermitHolder.create();
    data.noncommercialFields.spectators = undefined;
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(/"required-noncommercialFields.spectators"/)
      .expect(400, done);
  });

  it('should return a required error for start date', (done) => {
    let data = noncommercialTestData.singlePermitHolder.create();
    data.dateTimeRange.startDateTime = undefined;
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(/"required-dateTimeRange.startDateTime"/)
      .expect(400, done);
  });

  it('should return a required error for end date', (done) => {
    let data = noncommercialTestData.singlePermitHolder.create();
    data.dateTimeRange.endDateTime = undefined;
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(/"required-dateTimeRange.endDateTime"/)
      .expect(400, done);
  });

  it('should return a pattern error for start date', (done) => {
    let data = noncommercialTestData.singlePermitHolder.create();
    data.dateTimeRange.startDateTime = '2020';
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(/"pattern-dateTimeRange.startDateTime"/)
      .expect(400, done);
  });

  it('should return a pattern error for end date', (done) => {
    let data = noncommercialTestData.singlePermitHolder.create();
    data.dateTimeRange.endDateTime = '2020';
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(/"pattern-dateTimeRange.endDateTime"/)
      .expect(400, done);
  });

});

describe('GET tests', () => {

  it('should return at least one noncommercial application', (done) => {
    request(server)
      .get(testGetURL)
      .expect('Content-Type', /json/)
      .expect(/"applicationId":[\d]+/)
      .expect(200, done);
  });

  it('should return a 400 error when requesting a with a malformed uuid', (done) => {
    request(server)
      .get(testGetURL + '/malformed-uuid')
      .expect(400, done);
  });

  it('should return a 404 error when requesting a nonexistant application', (done) => {
    request(server)
      .get(testGetURL + '/4dc61d60-a318-462f-8753-a57605303faa')
      .expect(404, done);
  });

  it('should return a 404 error when requesting a nonexistant resource', (done) => {
    request(server)
      .get('/nonexistant-resource')
      .expect(404, done);
  });

});

describe('Persistence tests', () => {

  let intakeControlNumber = undefined;
  let singlePermitHolderPersisted = noncommercialTestData.singlePermitHolder.create();
  let singlePermitHolderWithSecondaryPermitHolderPersisted = noncommercialTestData.singlePermitHolderWithSecondaryPermitHolder.create();
  let singlePermitHolderWithSecondaryPermitHolderwithCustomAddressPersisted = noncommercialTestData.singlePermitHolderWithSecondaryPermitHolderwithCustomAddress.create();
  let singlePermitHolderOrganizationPersisted = noncommercialTestData.singlePermitHolderOrganization.create();
  let singlePermitHolderOrganizationWithCustomAddressesPersisted = noncommercialTestData.singlePermitHolderOrganizationWithCustomAddresses.create();

  it('should persist an application with a primary permit holder', (done) => {
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(noncommercialTestData.singlePermitHolder.create())
      .expect('Content-Type', /json/)
      .expect(function(res) {
        // record the intake control number so that we can the the application back out
        intakeControlNumber = res.body.appControlNumber;
      })
      .expect(201, done);
  });

  it('should return a persisted application with a primary permit holder', (done) => {
    request(server)
      .get(testGetURL + '/' + intakeControlNumber)
      .expect(function(res) {
        // update the object with values only present after saving to the DB
        singlePermitHolderPersisted.appControlNumber = res.body.appControlNumber;
        singlePermitHolderPersisted.applicationId = res.body.applicationId;
        singlePermitHolderPersisted.createdAt = res.body.createdAt;
        singlePermitHolderPersisted.status = 'Received';
      })
      .expect(200, singlePermitHolderPersisted, done);
  });

  it('should persist an application with a primary permit holder and a secondary permit holder', (done) => {
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(noncommercialTestData.singlePermitHolderWithSecondaryPermitHolder.create())
      .expect('Content-Type', /json/)
      .expect(function(res) {
        // record the intake control number so that we can the the application back out
        intakeControlNumber = res.body.appControlNumber;
      })
      .expect(201, done);
  });

  it('should return a persisted application with a primary permit holder and a secondary permit holder', (done) => {
    request(server)
      .get(testGetURL + '/' + intakeControlNumber)
      .expect(function(res) {
        // update the object with values only present after saving to the DB
        singlePermitHolderWithSecondaryPermitHolderPersisted.appControlNumber = res.body.appControlNumber;
        singlePermitHolderWithSecondaryPermitHolderPersisted.applicationId = res.body.applicationId;
        singlePermitHolderWithSecondaryPermitHolderPersisted.createdAt = res.body.createdAt;
        singlePermitHolderWithSecondaryPermitHolderPersisted.status = 'Received';
      })
      .expect(200, singlePermitHolderWithSecondaryPermitHolderPersisted, done);
  });

  it('should persist an application with a primary permit holder and a secondary permit holder with a custom address', (done) => {
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(noncommercialTestData.singlePermitHolderWithSecondaryPermitHolderwithCustomAddress.create())
      .expect('Content-Type', /json/)
      .expect(function(res) {
        // record the intake control number so that we can the the application back out
        intakeControlNumber = res.body.appControlNumber;
      })
      .expect(201, done);
  });

  it('should return a persisted application with a primary permit holder and a secondary permit holder with a custom address', (done) => {
    request(server)
      .get(testGetURL + '/' + intakeControlNumber)
      .expect(function(res) {
        // update the object with values only present after saving to the DB
        singlePermitHolderWithSecondaryPermitHolderwithCustomAddressPersisted.appControlNumber = res.body.appControlNumber;
        singlePermitHolderWithSecondaryPermitHolderwithCustomAddressPersisted.applicationId = res.body.applicationId;
        singlePermitHolderWithSecondaryPermitHolderwithCustomAddressPersisted.createdAt = res.body.createdAt;
        singlePermitHolderWithSecondaryPermitHolderwithCustomAddressPersisted.status = 'Received';
      })
      .expect(200, singlePermitHolderWithSecondaryPermitHolderwithCustomAddressPersisted, done);
  });

  it('should persist an application with a primary permit holder for an organization', (done) => {
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(noncommercialTestData.singlePermitHolderOrganization.create())
      .expect('Content-Type', /json/)
      .expect(function(res) {
        // record the intake control number so that we can the the application back out
        intakeControlNumber = res.body.appControlNumber;
      })
      .expect(201, done);
  });

  it('should return a persisted application with a primary permit holder for an organization', (done) => {
    request(server)
      .get(testGetURL + '/' + intakeControlNumber)
      .expect(function(res) {
        // update the object with values only present after saving to the DB
        singlePermitHolderOrganizationPersisted.appControlNumber = res.body.appControlNumber;
        singlePermitHolderOrganizationPersisted.applicationId = res.body.applicationId;
        singlePermitHolderOrganizationPersisted.createdAt = res.body.createdAt;
        singlePermitHolderOrganizationPersisted.status = 'Received';
      })
      .expect(200, singlePermitHolderOrganizationPersisted, done);
  });

  it('should persist an application for an organization with primary and secondary permit holder with unique addresses', (done) => {
    request(server)
      .post(testURL)
      .set('Accept', 'application/json')
      .send(noncommercialTestData.singlePermitHolderOrganizationWithCustomAddresses.create())
      .expect('Content-Type', /json/)
      .expect(function(res) {
        // record the intake control number so that we can the the application back out
        intakeControlNumber = res.body.appControlNumber;
      })
      .expect(201, done);
  });

  it('should return a persisted application for an organization with primary and secondary permit holder with unique addresses', (done) => {
    request(server)
      .get(testGetURL + '/' + intakeControlNumber)
      .expect(function(res) {
        // update the object with values only present after saving to the DB
        singlePermitHolderOrganizationWithCustomAddressesPersisted.appControlNumber = res.body.appControlNumber;
        singlePermitHolderOrganizationWithCustomAddressesPersisted.applicationId = res.body.applicationId;
        singlePermitHolderOrganizationWithCustomAddressesPersisted.createdAt = res.body.createdAt;
        singlePermitHolderOrganizationWithCustomAddressesPersisted.status = 'Received';
      })
      .expect(200, singlePermitHolderOrganizationWithCustomAddressesPersisted, done);
  });

});
