var chai = require('chai');
require('../src/continuous/MerchantBalanceCalculator.js');
var projection = require('event-store-projection-testing');
var testData = require('./TestData.js');

describe('Merchant Balance Calculator Tests', function()
{
    beforeEach(function () { projection.initialize(); });

    it('Test', function()
    {
        var merchantCreatedEvent = testData.getMerchantCreatedEvent();

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data);

        var projectionState = projection.getState();

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.merchants).to.not.be.null;

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];
        chai.expect(merchant).to.not.be.null;
        chai.expect(merchant.MerchantName).to.equal(merchantCreatedEvent.data.MerchantName);
    });
});