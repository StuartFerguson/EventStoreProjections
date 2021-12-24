require('../src/continuous/MerchantBalanceCalculator.js');
var projection = require('@transactionprocessing/esprojection-testing-framework');
var testData = require('./TestData.js');
var describe = require('tape-describe');
var test = describe('Merchant Balance Calculator Tests');

    test('Projection handles merchant created events', t =>
    {
        projection.initialize();

        projection.setState({
            initialised: true,
            availableBalance: 0,
            balance: 0,
            lastDepositDateTime: null,
            lastSaleDateTime: null,
            lastFeeProcessedDateTime: null,
            debug: [],
            totalDeposits: 0,
            totalAuthorisedSales: 0,
            totalDeclinedSales: 0,
            totalFees: 0,
            emittedEvents: 1
        });

        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var streamName = "$ce-MerchantArchive";
        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);
        
        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState,null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.merchantName, merchantCreatedEvent.data.merchantName);
        t.end();
    });

    test('Projection handles merchant manual deposit event', t => {

        projection.initialize();

        projection.setState({
            initialised: true,
            availableBalance: 0,
            balance: 0,
            lastDepositDateTime: null,
            lastSaleDateTime: null,
            lastFeeProcessedDateTime: null,
            debug: [],
            totalDeposits: 0,
            totalAuthorisedSales: 0,
            totalDeclinedSales: 0,
            totalFees: 0,
            emittedEvents: 1
        });

        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = 1000.00;
        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime,depositAmount);
        
        projection.processEvent(
            streamName,
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data,
            null,
            manualDepositMadeEvent.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState,null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount);
        t.equal(projectionState.balance,depositAmount);
        t.equal(projectionState.lastDepositDateTime,depositDateTime);

        var events = projection.emittedEvents;
        t.equal(events.length,2);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        console.log(eventBody);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount);
        t.equal(eventBody.changeAmount,depositAmount);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent.eventId);
        t.equal(eventBody.aggregateId, manualDepositMadeEvent.data.merchantId);
        t.end();
    });

    test('Projection handles merchant automatic deposit event', t => {

        projection.initialize();

        projection.setState({
            initialised: true,
            availableBalance: 0,
            balance: 0,
            lastDepositDateTime: null,
            lastSaleDateTime: null,
            lastFeeProcessedDateTime: null,
            debug: [],
            totalDeposits: 0,
            totalAuthorisedSales: 0,
            totalDeclinedSales: 0,
            totalFees: 0,
            emittedEvents: 1
        });

        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = 1000.00;
        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent = testData.getAutomaticDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent(
            streamName,
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data,
            null,
            manualDepositMadeEvent.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount);
        t.equal(projectionState.balance,depositAmount);
        t.equal(projectionState.lastDepositDateTime,depositDateTime);

        var events = projection.emittedEvents;
        t.equal(events.length,2);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        console.log(eventBody);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount);
        t.equal(eventBody.changeAmount,depositAmount);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent.eventId);
        t.equal(eventBody.aggregateId, manualDepositMadeEvent.data.merchantId);
        t.end();
    });

test('Projection handles multiple merchant manual deposit event', t => {

    projection.initialize();
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime1 = '2020-05-30T06:21:31.356Z';
        var depositAmount1 = 1000.00;
        var depositDateTime2 = '2020-06-01T06:21:31.356Z';
        var depositAmount2 = 500.00;
        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent1 = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime1, depositAmount1);

        projection.processEvent(
            streamName,
            manualDepositMadeEvent1.eventType,
            manualDepositMadeEvent1.data,
            null,
            manualDepositMadeEvent1.eventId);

        var manualDepositMadeEvent2 = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime2, depositAmount2);
        projection.processEvent(
            streamName,
            manualDepositMadeEvent2.eventType,
            manualDepositMadeEvent2.data,
            null,
            manualDepositMadeEvent2.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount1 + depositAmount2);
        t.equal(projectionState.balance,depositAmount1 + depositAmount2);
        t.equal(projectionState.lastDepositDateTime,depositDateTime2);

        var events = projection.emittedEvents;
        t.equal(events.length,3);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount1);
        t.equal(eventBody.changeAmount,depositAmount1);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent1.eventId);
        t.equal(eventBody.aggregateId,manualDepositMadeEvent1.data.merchantId);

        var eventBody = JSON.parse(events[2].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount1 + depositAmount2);
        t.equal(eventBody.changeAmount,depositAmount2);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent2.eventId);
    t.equal(eventBody.aggregateId, manualDepositMadeEvent2.data.merchantId);
    t.end();
    });

test('Projection handles multiple merchant manual deposit event not in date order', t => {

    projection.initialize();
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime2 = '2020-05-30T06:21:31.356Z';
        var depositAmount2 = 1000.00;
        var depositDateTime1 = '2020-06-01T06:21:31.356Z';
        var depositAmount1 = 500.00;
        var expectedBalance = depositAmount1 + depositAmount2;
        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent1 = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime1, depositAmount1);
        
        projection.processEvent(
            streamName,
            manualDepositMadeEvent1.eventType,
            manualDepositMadeEvent1.data,
            null,
            manualDepositMadeEvent1.eventId);

        var manualDepositMadeEvent2 = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime2, depositAmount2);

        projection.processEvent(
            streamName,
            manualDepositMadeEvent2.eventType,
            manualDepositMadeEvent2.data,
            null,
            manualDepositMadeEvent2.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount1 + depositAmount2);
        t.equal(projectionState.balance,depositAmount1 + depositAmount2);
        t.equal(projectionState.lastDepositDateTime,depositDateTime1);

        var events = projection.emittedEvents;
        t.equal(events.length,3);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount1);
        t.equal(eventBody.changeAmount,depositAmount1);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent1.eventId);
        t.equal(eventBody.aggregateId,manualDepositMadeEvent1.data.merchantId);

        var eventBody = JSON.parse(events[2].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount1 + depositAmount2);
        t.equal(eventBody.changeAmount,depositAmount2);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent2.eventId);
    t.equal(eventBody.aggregateId, manualDepositMadeEvent2.data.merchantId);
    t.end();
    });

    test('Projection reduces available balance after transaction started message processed', t =>
    {
        projection.initialize();

        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 100.00;
        var transactionType = 'Sale';
        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);
        
        projection.processEvent(
            streamName,
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data,
            null,
            manualDepositMadeEvent.eventId);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId,merchantId, transactionId, transactionAmount, transactionType);

        projection.processEvent(
            streamName,
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data,
            null,
            transactionHasStartedEvent.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount - transactionAmount);
        t.equal(projectionState.balance,depositAmount);
        t.equal(projectionState.lastDepositDateTime,depositDateTime);
        t.equal(projectionState.lastSaleDateTime,transactionHasStartedEvent.data.transactionDateTime);

        var events = projection.emittedEvents;
        t.equal(events.length,2);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount);
        t.equal(eventBody.changeAmount,depositAmount);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent.eventId);
        t.equal(eventBody.aggregateId, manualDepositMadeEvent.data.merchantId);
        t.end();
    });

test('Projection reduces balance after transaction completed message processed if transaction is successful', t => {

    projection.initialize();
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 100.00;
        var transactionType = 'Sale';
        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);
        
        projection.processEvent(
            streamName,
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data,
            null,
            manualDepositMadeEvent.eventId);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId, merchantId, transactionId, transactionAmount, transactionType);
        
        projection.processEvent(
            streamName,
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data,
            null,
            transactionHasStartedEvent.eventId);

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, transactionAmount);

        projection.processEvent(
            streamName,
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data,
            null,
            transactionHasBeenCompletedEvent.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount - transactionAmount);
        t.equal(projectionState.balance,depositAmount - transactionAmount);
        t.equal(projectionState.lastDepositDateTime,depositDateTime);
        t.equal(projectionState.lastSaleDateTime,transactionHasStartedEvent.data.transactionDateTime);

        var events = projection.emittedEvents;
        t.equal(events.length,3);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount);
        t.equal(eventBody.changeAmount,depositAmount);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent.eventId);
        t.equal(eventBody.aggregateId,manualDepositMadeEvent.data.merchantId);

        var eventBody = JSON.parse(events[2].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount - transactionAmount);
        t.equal(eventBody.changeAmount,transactionAmount * -1);
        t.equal(eventBody.reference,"Transaction Completed");
        t.equal(eventBody.eventId,transactionHasBeenCompletedEvent.eventId);
    t.equal(eventBody.aggregateId, transactionHasBeenCompletedEvent.data.transactionId);
    t.end();
    });

test('Projection resets available balance after transaction completed message processed if transaction is not successful', t => {
    projection.initialize();
    
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 100.00;
        var transactionType = 'Sale';
        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);
        
        projection.processEvent(
            streamName,
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data,
            null,
            manualDepositMadeEvent.eventId);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId, merchantId, transactionId, transactionAmount, transactionType);

        projection.processEvent(
            streamName,
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data,
            null,
            transactionHasStartedEvent.eventId);

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, false,transactionAmount);
        
        projection.processEvent(
            streamName,
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data,
            null,
            transactionHasBeenCompletedEvent.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount);
        t.equal(projectionState.balance,depositAmount);
        t.equal(projectionState.lastDepositDateTime,depositDateTime);
        t.equal(projectionState.lastSaleDateTime,transactionHasStartedEvent.data.transactionDateTime);

        var events = projection.emittedEvents;
        t.equal(events.length,2);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount);
        t.equal(eventBody.changeAmount,depositAmount);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent.eventId);
    t.equal(eventBody.aggregateId, manualDepositMadeEvent.data.merchantId);
    t.end();
    });

test('Projection handles merchant fee event', t => {
    projection.initialize();
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 100.00;
        var transactionType = 'Sale';
        var feeEventCreatedDateTime = '2020-05-30T06:21:31.356Z';
        var calculatedValue = 0.50;

        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent(
            streamName,
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data,
            null,
            manualDepositMadeEvent.eventId);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId, merchantId, transactionId, transactionAmount, transactionType);

        projection.processEvent(
            streamName,
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data,
            null,
            transactionHasStartedEvent.eventId);

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, transactionAmount);

        projection.processEvent(
            streamName,
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data,
            null,
            transactionHasBeenCompletedEvent.eventId);

        var merchantFeeAddedToTransactionEvent = testData.getMerchantFeeAddedToTransactionEvent(estateId, merchantId, transactionId, calculatedValue, feeEventCreatedDateTime);
        
        projection.processEvent(
            streamName,
            merchantFeeAddedToTransactionEvent.eventType,
            merchantFeeAddedToTransactionEvent.data,
            null,
            merchantFeeAddedToTransactionEvent.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount - transactionAmount + calculatedValue);
        t.equal(projectionState.balance,depositAmount - transactionAmount + calculatedValue);
        t.equal(projectionState.lastDepositDateTime,depositDateTime);
        t.equal(projectionState.lastSaleDateTime,transactionHasStartedEvent.data.transactionDateTime);
        t.equal(projectionState.lastFeeProcessedDateTime,feeEventCreatedDateTime);

        var events = projection.emittedEvents;
        t.equal(events.length,4);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount);
        t.equal(eventBody.changeAmount,depositAmount);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent.eventId);
        t.equal(eventBody.aggregateId,manualDepositMadeEvent.data.merchantId);
        
        var eventBody = JSON.parse(events[2].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount - transactionAmount);
        t.equal(eventBody.changeAmount,transactionAmount * -1);
        t.equal(eventBody.reference,"Transaction Completed");
        t.equal(eventBody.eventId,transactionHasBeenCompletedEvent.eventId);
        t.equal(eventBody.aggregateId,transactionHasBeenCompletedEvent.data.transactionId);

        var eventBody = JSON.parse(events[3].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount - transactionAmount + calculatedValue);
        t.equal(eventBody.changeAmount,calculatedValue);
        t.equal(eventBody.reference,"Transaction Fee Processed");
        t.equal(eventBody.eventId,merchantFeeAddedToTransactionEvent.eventId);
    t.equal(eventBody.aggregateId, merchantFeeAddedToTransactionEvent.data.transactionId);
    t.end();
    });
    
test('Projection handles multiple merchant fee event not in date order', t =>
{
    projection.initialize();
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 100.00;
        var transactionType = 'Sale';
        var feeEventCreatedDateTime1 = '2020-05-30T06:21:31.356Z';
        var calculatedValue1 = 1.0;
        var feeEventCreatedDateTime2 = '2020-05-30T04:21:31.356Z';
        var calculatedValue2 = 1.5;

        var streamName = "$ce-MerchantArchive";

    var projectionState = projection.getState();
    t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);
        
        projection.processEvent(
            streamName,
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data,
            null,
            manualDepositMadeEvent.eventId);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId, merchantId, transactionId, transactionAmount, transactionType);

        projection.processEvent(
            streamName,
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data,
            null,
            transactionHasStartedEvent.eventId);

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, transactionAmount);
        
        projection.processEvent(
            streamName,
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data,
            null,
            transactionHasBeenCompletedEvent.eventId);

        var merchantFeeAddedToTransactionEvent1 = testData.getMerchantFeeAddedToTransactionEvent(estateId, merchantId, transactionId, calculatedValue1, feeEventCreatedDateTime1);
        
        projection.processEvent(
            streamName,
            merchantFeeAddedToTransactionEvent1.eventType,
            merchantFeeAddedToTransactionEvent1.data,
            null,
            merchantFeeAddedToTransactionEvent1.eventId);

        var merchantFeeAddedToTransactionEvent2 = testData.getMerchantFeeAddedToTransactionEvent(estateId, merchantId, transactionId, calculatedValue2, feeEventCreatedDateTime2);

        projection.processEvent(
            streamName,
            merchantFeeAddedToTransactionEvent2.eventType,
            merchantFeeAddedToTransactionEvent2.data,
            null,
            merchantFeeAddedToTransactionEvent2.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount - transactionAmount + calculatedValue1 + calculatedValue2);
        t.equal(projectionState.balance,depositAmount - transactionAmount + calculatedValue1 + calculatedValue2);
        t.equal(projectionState.lastDepositDateTime,depositDateTime);
        t.equal(projectionState.lastSaleDateTime,transactionHasStartedEvent.data.transactionDateTime);
        t.equal(projectionState.lastFeeProcessedDateTime,merchantFeeAddedToTransactionEvent1.data.feeCalculatedDateTime);

        var events = projection.emittedEvents;
        t.equal(events.length,5);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);
        
        var eventBody = JSON.parse(events[1].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount);
        t.equal(eventBody.changeAmount,depositAmount);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent.eventId);
        t.equal(eventBody.aggregateId,manualDepositMadeEvent.data.merchantId);

        var eventBody = JSON.parse(events[2].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount - transactionAmount);
        t.equal(eventBody.changeAmount,transactionAmount * -1);
        t.equal(eventBody.reference,"Transaction Completed");
        t.equal(eventBody.eventId,transactionHasBeenCompletedEvent.eventId);
        t.equal(eventBody.aggregateId,transactionHasBeenCompletedEvent.data.transactionId);

        var eventBody = JSON.parse(events[3].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount - transactionAmount + calculatedValue1);
        t.equal(eventBody.changeAmount,calculatedValue1);
        t.equal(eventBody.reference,"Transaction Fee Processed");
        t.equal(eventBody.eventId,merchantFeeAddedToTransactionEvent1.eventId);
        t.equal(eventBody.aggregateId,merchantFeeAddedToTransactionEvent1.data.transactionId);

        var eventBody = JSON.parse(events[4].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount - transactionAmount + calculatedValue1 + calculatedValue2);
        t.equal(eventBody.changeAmount,calculatedValue2);
        t.equal(eventBody.reference,"Transaction Fee Processed");
        t.equal(eventBody.eventId,merchantFeeAddedToTransactionEvent2.eventId);
    t.equal(eventBody.aggregateId, merchantFeeAddedToTransactionEvent2.data.transactionId);
    t.end();
    });

    test('Projection does not emit a balance event on a successful logon transaction ', t =>
    {
        projection.initialize();
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 0;
        var transactionType = 'Logon';

        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent(
            streamName,
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data,
            null,
            manualDepositMadeEvent.eventId);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId, merchantId, transactionId, transactionAmount, transactionType);

        projection.processEvent(
            streamName,
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data,
            null,
            transactionHasStartedEvent.eventId);

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, transactionAmount);
        
        projection.processEvent(
            streamName,
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data,
            null,
            transactionHasBeenCompletedEvent.eventId);

        var projectionState = projection.getState();

        t.notEqual(projectionState,null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.availableBalance,depositAmount);
        t.equal(projectionState.balance,depositAmount);
        t.equal(projectionState.lastDepositDateTime,depositDateTime);

        var events = projection.emittedEvents;
        t.equal(events.length,2);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        t.equal(eventBody.eventId,manualDepositMadeEvent.eventId);
        t.equal(eventBody.aggregateId, manualDepositMadeEvent.data.merchantId);
        t.end();
    });

test('Projection handles events with no Merchant Created', t => {
    projection.initialize();
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 100.00;
        var transactionType = 'Sale';
        var streamName = "$ce-MerchantArchive";

        var projectionState = projection.getState();
        t.true(projectionState.initialised);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent(
            streamName,
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data,
            null,
            manualDepositMadeEvent.eventId);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId, merchantId, transactionId, transactionAmount, transactionType);

        projection.processEvent(
            streamName,
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data,
            null,
            transactionHasStartedEvent.eventId);

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, transactionAmount);

        projection.processEvent(
            streamName,
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data,
            null,
            transactionHasBeenCompletedEvent.eventId);

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            streamName,
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data,
            null,
            merchantCreatedEvent.eventId);

        var projectionState = projection.getState();
        
        t.notEqual(projectionState,null);

        t.equal(projectionState.estateId,merchantCreatedEvent.data.estateId);
        t.equal(projectionState.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(projectionState.merchantName,merchantCreatedEvent.data.merchantName);
        t.equal(projectionState.availableBalance,depositAmount - transactionAmount);
        t.equal(projectionState.balance,depositAmount - transactionAmount);
        t.equal(projectionState.lastDepositDateTime,depositDateTime);
        t.equal(projectionState.lastSaleDateTime,transactionHasStartedEvent.data.transactionDateTime);

        var events = projection.emittedEvents;
        t.equal(events.length,3);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,0);
        t.equal(eventBody.changeAmount,0);
        t.equal(eventBody.reference,"Opening Balance");
        t.equal(eventBody.eventId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.aggregateId,merchantCreatedEvent.data.merchantId);

        var eventBody = JSON.parse(events[1].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount);
        t.equal(eventBody.changeAmount,depositAmount);
        t.equal(eventBody.reference,"Merchant Deposit");
        t.equal(eventBody.eventId,manualDepositMadeEvent.eventId);
        t.equal(eventBody.aggregateId,manualDepositMadeEvent.data.merchantId);
        
        var eventBody = JSON.parse(events[2].body);
        t.equal(eventBody.estateId,merchantCreatedEvent.data.estateId);
        t.equal(eventBody.merchantId,merchantCreatedEvent.data.merchantId);
        t.equal(eventBody.balance,depositAmount - transactionAmount);
        t.equal(eventBody.changeAmount,transactionAmount * -1);
        t.equal(eventBody.reference,"Transaction Completed");
        t.equal(eventBody.eventId,transactionHasBeenCompletedEvent.eventId);
    t.equal(eventBody.aggregateId, transactionHasBeenCompletedEvent.data.transactionId);
    t.end();
    });
