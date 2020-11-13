var chai = require('chai');
require('../src/continuous/MerchantAggregator.js');
var projection = require('event-store-projection-testing');
var testData = require('./TestData.js');

describe('Merchant Aggregator Tests', function()
{
    beforeEach(function() { projection.initialize(); });

    it('Projection Can Handle Merchant Events', function()
    {
        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantName = 'Test Merchant 1';
        
        // Set up the merchant events
        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);
        var addressAddedEvent = testData.getAddressAddedEvent(estateId, merchantId);
        var contactAddedEvent = testData.getContactAddedEvent(estateId, merchantId);

        var operatorId1 = '410c55fd-9eef-462d-9267-3649c7dedbff';
        var operatorName1 = 'Safaricom';
        var merchantNumber1 = '';
        var terminalNumber1 = '';
        var operatorAssignedToMerchantEvent = testData.getOperatorAssignedToMerchantEvent(estateId,
            merchantId,
            operatorId1,
            operatorName1,
            merchantNumber1,
            terminalNumber1);

        var securityUserId = 'e41e6196-4f18-4f49-bab4-ead032c1e52e';
        var emailAddress = 'merchantuser@emulatormerchant.co.uk';
        var securityUserAddedEvent =
            testData.getSecurityUserAddedEvent(estateId, merchantId, securityUserId, emailAddress);

        var deviceId = '24297b34-b1cf-48bf-a391-eb1b8a48fdc7';
        var deviceIdentifier = 'EMULATOR29X3X2X0';
        var deviceAddedToMerchantEvent =
            testData.getDeviceAddedToMerchantEvent(estateId, merchantId, deviceId, deviceIdentifier);

        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = 1000.00;
        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);
        
        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data);
        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            addressAddedEvent.eventType,
            addressAddedEvent.data);
        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            contactAddedEvent.eventType,
            contactAddedEvent.data);
        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            operatorAssignedToMerchantEvent.eventType,
            operatorAssignedToMerchantEvent.data);
        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            securityUserAddedEvent.eventType,
            securityUserAddedEvent.data);
        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            deviceAddedToMerchantEvent.eventType,
            deviceAddedToMerchantEvent.data);
        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data);

        var events = projection.emittedEvents;
        chai.expect(events.length).to.equal(7);
        chai.expect(events[0].metadata.EventId).to.equal(merchantCreatedEvent.data.EventId);
        chai.expect(events[1].metadata.EventId).to.equal(addressAddedEvent.data.EventId);
        chai.expect(events[2].metadata.EventId).to.equal(contactAddedEvent.data.EventId);
        chai.expect(events[3].metadata.EventId).to.equal(operatorAssignedToMerchantEvent.data.EventId);
        chai.expect(events[4].metadata.EventId).to.equal(securityUserAddedEvent.data.EventId);
        chai.expect(events[5].metadata.EventId).to.equal(deviceAddedToMerchantEvent.data.EventId);
        chai.expect(events[6].metadata.EventId).to.equal(manualDepositMadeEvent.data.EventId);
    });

    it('Projection Can Handle Transaction Events', function()
    {
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
            transactionHasStartedEvent.data);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            productDetailsAddedToTransactionEvent.eventType,
            productDetailsAddedToTransactionEvent.data);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            additionalRequestDataRecordedEvent.eventType,
            additionalRequestDataRecordedEvent.data);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            transactionHasBeenLocallyAuthorisedEvent.eventType,
            transactionHasBeenLocallyAuthorisedEvent.data);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            transactionHasBeenLocallyDeclinedEvent.eventType,
            transactionHasBeenLocallyDeclinedEvent.data);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            transactionAuthorisedByOperatorEvent.eventType,
            transactionAuthorisedByOperatorEvent.data);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            transactionDeclinedByOperatorEvent.eventType,
            transactionDeclinedByOperatorEvent.data);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            merchantFeeAddedToTransactionEvent.eventType,
            merchantFeeAddedToTransactionEvent.data);

        var events = projection.emittedEvents;
        chai.expect(events.length).to.equal(9);
        chai.expect(events[0].metadata.EventId).to.equal(transactionHasStartedEvent.data.EventId);
        chai.expect(events[1].metadata.EventId).to.equal(productDetailsAddedToTransactionEvent.data.EventId);
        chai.expect(events[2].metadata.EventId).to.equal(additionalRequestDataRecordedEvent.data.EventId);
        chai.expect(events[3].metadata.EventId).to.equal(transactionHasBeenLocallyAuthorisedEvent.data.EventId);
        chai.expect(events[4].metadata.EventId).to.equal(transactionHasBeenLocallyDeclinedEvent.data.EventId);
        chai.expect(events[5].metadata.EventId).to.equal(transactionAuthorisedByOperatorEvent.data.EventId);
        chai.expect(events[6].metadata.EventId).to.equal(transactionDeclinedByOperatorEvent.data.EventId);
        chai.expect(events[7].metadata.EventId).to.equal(transactionHasBeenCompletedEvent.data.EventId);
        chai.expect(events[8].metadata.EventId).to.equal(merchantFeeAddedToTransactionEvent.data.EventId);
    });
});