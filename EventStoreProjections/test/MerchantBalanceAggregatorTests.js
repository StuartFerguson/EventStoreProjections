var testData = require('./TestData.js');
testData.clearRequireCache();

require('../../NugetPackage/projections/continuous/MerchantBalanceAggregator.js');
var projection = require('event-store-projection-testing-framework');
var chai = require("chai");

describe('Merchant Balance Aggregator Tests', function () {
    it('Projection Can Handle Merchant Events', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantName = 'Test Merchant 1';

        // Set up the merchant events
        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);
        
        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = 1000.00;
        var manualDepositMadeEvent =
            testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        var automaticDepositMadeEvent =
            testData.getAutomaticDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        var withdrawalMadeEvent =
            testData.getWithdrawalMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data);
        
        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data);

        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            automaticDepositMadeEvent.eventType,
            automaticDepositMadeEvent.data);

        projection.processEvent(
            'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
            withdrawalMadeEvent.eventType,
            withdrawalMadeEvent.data);

        var events = projection.emittedEvents;
        chai.expect(events.length).equal(4);
    })

    it('Projection Can Handle Transaction Events', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var transactionAmount = 100.00;
        var transactionType = 'Sale';

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId,
            merchantId,
            transactionId,
            transactionAmount,
            transactionType);

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true);

        var calculatedValue = 5.00;
        var eventCreatedDateTime = "2020-05-16T07:47:51.6617562+00:00";
        var settledMerchantFeeAddedToTransactionEvent = testData.getSettledMerchantFeeAddedToTransactionEvent(estateId,
            merchantId,
            transactionId,
            calculatedValue,
            eventCreatedDateTime);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data);
                
        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            settledMerchantFeeAddedToTransactionEvent.eventType,
            settledMerchantFeeAddedToTransactionEvent.data);

        var events = projection.emittedEvents;
        chai.expect(events.length).equal(3);
    });
})