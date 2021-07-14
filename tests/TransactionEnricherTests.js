var chai = require('chai');
require('../src/continuous/TransactionEnricher.js');
var projection = require('esprojection-testing-framework');
var testData = require('./TestData.js');

describe('Transaction Enricher Tests', function () {
    beforeEach(function () { projection.initialize(); });

    it('Projection Can Handle Transaction Events', function () {
    var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
    var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
    var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
    var transactionAmount = 100.00;
    var transactionType = 'Sale';

    var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId, merchantId, transactionId, transactionAmount, transactionType);

    var contractId = '327678c4-d349-4e1c-b466-f2ea4b0e869b';
    var productId = '001b29c9-91f5-42f9-95d0-6fd9d69a2e18';

    var productDetailsAddedToTransactionEvent = testData.getProductDetailsAddedToTransactionEvent(estateId, merchantId, transactionId, contractId, productId);

    var customerAccountNumber = "1234567890";
    var additionalRequestDataRecordedEvent = testData.getAdditionalRequestDataRecordedEvent(estateId,
        merchantId,
        transactionId,
        transactionAmount,
        customerAccountNumber);

    var transactionHasBeenLocallyAuthorisedEvent = testData.getTransactionHasBeenLocallyAuthorisedEvent(estateId, merchantId, transactionId);

    var transactionHasBeenLocallyDeclinedEvent = testData.getTransactionHasBeenLocallyDeclinedEvent(estateId, merchantId, transactionId);

    var transactionAuthorisedByOperatorEvent = testData.getTransactionAuthorisedByOperatorEvent(estateId, merchantId, transactionId);

    var transactionDeclinedByOperatorEvent = testData.getTransactionDeclinedByOperatorEvent(estateId, merchantId, transactionId);

    var transactionHasBeenCompletedEvent = testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true);

    var calculatedValue = 5.00;
    var eventCreatedDateTime = "2020-05-16T07:47:51.6617562+00:00";
    var merchantFeeAddedToTransactionEvent = testData.getMerchantFeeAddedToTransactionEvent(estateId, merchantId, transactionId, calculatedValue, eventCreatedDateTime);

    projection.processEvent(
        'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
        transactionHasStartedEvent.eventType,
        transactionHasStartedEvent.data,
        null,
        transactionHasStartedEvent.eventId);

    projection.processEvent(
        'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
        productDetailsAddedToTransactionEvent.eventType,
        productDetailsAddedToTransactionEvent.data,
        null,
        productDetailsAddedToTransactionEvent.eventId);

    projection.processEvent(
        'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
        additionalRequestDataRecordedEvent.eventType,
        additionalRequestDataRecordedEvent.data,
        null,
        additionalRequestDataRecordedEvent.eventId);

    projection.processEvent(
        'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
        transactionHasBeenLocallyAuthorisedEvent.eventType,
        transactionHasBeenLocallyAuthorisedEvent.data,
        null,
        transactionHasBeenLocallyAuthorisedEvent.eventId);

    projection.processEvent(
        'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
        transactionHasBeenLocallyDeclinedEvent.eventType,
        transactionHasBeenLocallyDeclinedEvent.data);

    projection.processEvent(
        'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
        transactionAuthorisedByOperatorEvent.eventType,
        transactionAuthorisedByOperatorEvent.data,
        null,
        transactionAuthorisedByOperatorEvent.eventId);

    projection.processEvent(
        'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
        transactionDeclinedByOperatorEvent.eventType,
        transactionDeclinedByOperatorEvent.data,
        null,
        transactionDeclinedByOperatorEvent.eventId);

    projection.processEvent(
        'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
        transactionHasBeenCompletedEvent.eventType,
        transactionHasBeenCompletedEvent.data,
        null,
        transactionHasBeenCompletedEvent.eventId);

    projection.processEvent(
        'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
        merchantFeeAddedToTransactionEvent.eventType,
        merchantFeeAddedToTransactionEvent.data,
        null,
        merchantFeeAddedToTransactionEvent.eventId);

    var events = projection.emittedEvents;
        chai.expect(events.length).to.equal(9);
        var eventBody = JSON.parse(events[8].body);
        chai.expect(eventBody.eventId).to.equal(merchantFeeAddedToTransactionEvent.eventId);
    });
});