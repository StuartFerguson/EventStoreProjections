require('../../NugetPackage/projections/continuous/MerchantBalanceAggregator.js');
var projection = require('@transactionprocessing/esprojection-testing-framework');
var testData = require('./TestData.js');
var describe = require('tape-describe');
var test = describe('Merchant Balance Aggregator Tests');

test('Projection Can Handle Merchant Events',
    t =>
    {
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

        var events = projection.emittedEvents;
        t.equal(events.length, 3);
        t.end();
    });

test('Projection Can Handle Transaction Events',
    t =>
    {
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
        var merchantFeeAddedToTransactionEvent = testData.getMerchantFeeAddedToTransactionEvent(estateId,
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
            merchantFeeAddedToTransactionEvent.eventType,
            merchantFeeAddedToTransactionEvent.data);

        var events = projection.emittedEvents;
        t.equal(events.length, 3);
        t.end();
    });