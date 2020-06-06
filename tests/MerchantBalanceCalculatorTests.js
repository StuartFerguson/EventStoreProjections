var chai = require('chai');
require('../src/continuous/MerchantBalanceCalculator.js');
var projection = require('event-store-projection-testing');
var testData = require('./TestData.js');

describe('Merchant Balance Calculator Tests', function()
{
    beforeEach(function () { projection.initialize(); });

    it('Projection handles merchant created events', function()
    {
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

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

    it('Projection handles merchant manual deposit event', function () {

        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = 1000.00;

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime,depositAmount);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data);

        var projectionState = projection.getState();

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.merchants).to.not.be.null;

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];
        chai.expect(merchant).to.not.be.null;
        chai.expect(merchant.MerchantName).to.equal(merchantCreatedEvent.data.MerchantName);
        chai.expect(merchant.Balance).to.equal(manualDepositMadeEvent.data.Amount);
        chai.expect(merchant.AvailableBalance).to.equal(manualDepositMadeEvent.data.Amount);

        //// check emitted events
        //var emittedEvents = projection.emittedEvents;

        //chai.expect(emittedEvents).to.not.be.null;
        //chai.expect(emittedEvents.length).to.equal(1);
        //var data = JSON.parse(emittedEvents[0].body);
        //chai.expect(data.balance).to.equal(manualDepositMadeEvent.data.Amount);
    });

    it('Projection handles multiple merchant manual deposit event', function () {

        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime1 = '2020-05-30T06:21:31.356Z';
        var depositAmount1 = 1000.00;
        var depositDateTime2 = '2020-06-01T06:21:31.356Z';
        var depositAmount2 = 500.00;
        var expectedBalance = depositAmount1 + depositAmount2;

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data);

        var manualDepositMadeEvent1 = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime1, depositAmount1);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            manualDepositMadeEvent1.eventType,
            manualDepositMadeEvent1.data);

        var manualDepositMadeEvent2 = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime2, depositAmount2);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            manualDepositMadeEvent2.eventType,
            manualDepositMadeEvent2.data);

        var projectionState = projection.getState();

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.merchants).to.not.be.null;

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];
        chai.expect(merchant).to.not.be.null;
        chai.expect(merchant.MerchantName).to.equal(merchantCreatedEvent.data.MerchantName);
        chai.expect(merchant.Balance).to.equal(expectedBalance);
        chai.expect(merchant.AvailableBalance).to.equal(expectedBalance);

        // check emitted events
        //var emittedEvents = projection.emittedEvents;

        //chai.expect(emittedEvents).to.not.be.null;
        //chai.expect(emittedEvents.length).to.equal(2);

        //var data = JSON.parse(emittedEvents[0].body);
        //chai.expect(data.balance).to.equal(depositAmount1);
        //chai.expect(data.availableBalance).to.equal(depositAmount1);
        //chai.expect(data.lastDepositDate).to.equal(depositDateTime1);
        //chai.expect(data.lastSaleDate).to.be.null;

        //var data = JSON.parse(emittedEvents[1].body);
        //chai.expect(data.balance).to.equal(depositAmount1 + depositAmount2);
        //chai.expect(data.availableBalance).to.equal(depositAmount1 + depositAmount2);
        //chai.expect(data.lastDepositDate).to.equal(depositDateTime2);
        //chai.expect(data.lastSaleDate).to.be.null;
    });

    it('Projection handles multiple merchant manual deposit event not in date order', function () {
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime2 = '2020-05-30T06:21:31.356Z';
        var depositAmount2 = 1000.00;
        var depositDateTime1 = '2020-06-01T06:21:31.356Z';
        var depositAmount1 = 500.00;
        var expectedBalance = depositAmount1 + depositAmount2;

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data);

        var manualDepositMadeEvent1 = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime1, depositAmount1);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            manualDepositMadeEvent1.eventType,
            manualDepositMadeEvent1.data);

        var manualDepositMadeEvent2 = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime2, depositAmount2);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            manualDepositMadeEvent2.eventType,
            manualDepositMadeEvent2.data);

        var projectionState = projection.getState();

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.merchants).to.not.be.null;

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];
        chai.expect(merchant).to.not.be.null;
        chai.expect(merchant.MerchantName).to.equal(merchantCreatedEvent.data.MerchantName);
        chai.expect(merchant.Balance).to.equal(expectedBalance);
        chai.expect(merchant.AvailableBalance).to.equal(expectedBalance);

        // check emitted events
        //var emittedEvents = projection.emittedEvents;

        //chai.expect(emittedEvents).to.not.be.null;
        //chai.expect(emittedEvents.length).to.equal(2);

        //var data = JSON.parse(emittedEvents[0].body);
        //chai.expect(data.balance).to.equal(depositAmount1);
        //chai.expect(data.availableBalance).to.equal(depositAmount1);
        //chai.expect(data.lastDepositDate).to.equal(depositDateTime1);

        //var data = JSON.parse(emittedEvents[1].body);
        //chai.expect(data.balance).to.equal(depositAmount1 + depositAmount2);
        //chai.expect(data.availableBalance).to.equal(depositAmount1 + depositAmount2);
        //chai.expect(data.lastDepositDate).to.equal(depositDateTime1);
        //chai.expect(data.lastSaleDate).to.be.null;
    });

    it('Projection reduces available balance after transaction started message processed', function()
    {
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 1000.00;
        var transactionType = 'Sale';

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data);

        var projectionState = projection.getState();

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.merchants).to.not.be.null;

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];
        chai.expect(merchant).to.not.be.null;
        chai.expect(merchant.MerchantName).to.equal(merchantCreatedEvent.data.MerchantName);
        chai.expect(merchant.Balance).to.equal(depositAmount);
        chai.expect(merchant.AvailableBalance).to.equal(depositAmount);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId,merchantId, transactionId, transactionAmount, transactionType);

        projection.processEvent(
            '$et-TransactionProcessor.Transaction.DomainEvents.TransactionHasStartedEvent',
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data);

        var projectionState = projection.getState();

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];

        chai.expect(merchant.Balance).to.equal(depositAmount);
        chai.expect(merchant.AvailableBalance).to.equal(depositAmount - transactionAmount);
        chai.expect(merchant.PendingBalanceUpdates[transactionId]).to.not.be.null;

        // check emitted events
        //var emittedEvents = projection.emittedEvents;

        //chai.expect(emittedEvents).to.not.be.null;
        //chai.expect(emittedEvents.length).to.equal(2);

        //var data = JSON.parse(emittedEvents[1].body);
        //chai.expect(data.balance).to.equal(depositAmount);
        //chai.expect(data.availableBalance).to.equal(depositAmount - transactionAmount);
        //chai.expect(data.lastDepositDate).to.equal(depositDateTime);
        //chai.expect(data.lastSaleDate).to.equal(transactionHasStartedEvent.data.TransactionDateTime);
    });

    it('Projection reduces balance after transaction completed message processed if transaction is successful', function () {
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 1000.00;
        var transactionType = 'Sale';

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data);

        var projectionState = projection.getState();

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.merchants).to.not.be.null;

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];
        chai.expect(merchant).to.not.be.null;
        chai.expect(merchant.MerchantName).to.equal(merchantCreatedEvent.data.MerchantName);
        chai.expect(merchant.Balance).to.equal(depositAmount);
        chai.expect(merchant.AvailableBalance).to.equal(depositAmount);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId, merchantId, transactionId, transactionAmount, transactionType);

        projection.processEvent(
            '$et-TransactionProcessor.Transaction.DomainEvents.TransactionHasStartedEvent',
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data);

        var projectionState = projection.getState();

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true);

        projection.processEvent(
            '$et-TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenCompletedEvent',
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data);

        var projectionState = projection.getState();

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];

        chai.expect(merchant.Balance).to.equal(depositAmount - transactionAmount);
        chai.expect(merchant.AvailableBalance).to.equal(depositAmount - transactionAmount);
        chai.expect(merchant.PendingBalanceUpdates[transactionId]).to.be.undefined;

        // check emitted events
        //var emittedEvents = projection.emittedEvents;

        //chai.expect(emittedEvents).to.not.be.null;
        //chai.expect(emittedEvents.length).to.equal(3);

        //var data = JSON.parse(emittedEvents[2].body);
        //chai.expect(data.balance).to.equal(depositAmount - transactionAmount);
        //chai.expect(data.availableBalance).to.equal(depositAmount - transactionAmount);
        //chai.expect(data.lastDepositDate).to.equal(depositDateTime);
        //chai.expect(data.lastSaleDate).to.equal(transactionHasStartedEvent.data.TransactionDateTime);
    });

    it('Projection resets available balance after transaction completed message processed if transaction is not successful', function () {
        var estateId = '2af2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = '6be48c04-a00e-4985-a50c-e27461ca47e1';
        var merchantName = 'Test Merchant 1';
        var depositDateTime = '2020-06-01T06:21:31.356Z';
        var depositAmount = 5000.00;
        var transactionId = 'cf80660e-88c1-434c-a063-92e9076eda1b';
        var transactionAmount = 1000.00;
        var transactionType = 'Sale';

        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
            merchantCreatedEvent.eventType,
            merchantCreatedEvent.data);

        var manualDepositMadeEvent = testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent(
            '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data);

        var projectionState = projection.getState();

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.merchants).to.not.be.null;

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];
        chai.expect(merchant).to.not.be.null;
        chai.expect(merchant.MerchantName).to.equal(merchantCreatedEvent.data.MerchantName);
        chai.expect(merchant.Balance).to.equal(depositAmount);
        chai.expect(merchant.AvailableBalance).to.equal(depositAmount);

        var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId, merchantId, transactionId, transactionAmount, transactionType);

        projection.processEvent(
            '$et-TransactionProcessor.Transaction.DomainEvents.TransactionHasStartedEvent',
            transactionHasStartedEvent.eventType,
            transactionHasStartedEvent.data);

        var projectionState = projection.getState();

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, false);

        projection.processEvent(
            '$et-TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenCompletedEvent',
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data);

        var projectionState = projection.getState();

        var merchant = projectionState.merchants[merchantCreatedEvent.data.MerchantId];

        chai.expect(merchant.Balance).to.equal(depositAmount);
        chai.expect(merchant.AvailableBalance).to.equal(depositAmount);
        chai.expect(merchant.PendingBalanceUpdates[transactionId]).to.be.undefined;
    });
});