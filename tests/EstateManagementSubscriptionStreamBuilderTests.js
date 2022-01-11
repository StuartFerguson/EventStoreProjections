require('../src/continuous/EstateManagementSubscriptionStreamBuilder.js');
var projection = require('@transactionprocessing/esprojection-testing-framework');
var testData = require('./TestData.js');
var describe = require('tape-describe');
var test = describe('Estate Management Subscription Stream Builder Tests');

test('Projection Can Handle Estate Created Event',
    t =>
    {
        projection.initialize();

        projection.setState({ estates: {} });

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var estateName = 'Demo Estate 1';
        var estateNameNoSpaces = 'DemoEstate1';

        var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateCreatedEvent.eventType,
            estateCreatedEvent.data);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);
        t.notEqual(projectionState.estates[estateId], null);
        t.equal(projectionState.estates[estateId].name, estateNameNoSpaces);
        t.equal(projectionState.estates[estateId].filteredName, estateName);
        t.end();
    });

test('Projection Can Handle Transaction Has Been Completed Events',
    t =>
    {
        projection.initialize();

        projection.setState({ estates: {} });

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var estateName = 'Demo Estate';
        var estateNameNoSpaces = 'DemoEstate';
        var merchantId = "30ebc670-88ac-4c0c-9631-77547a687bbc";
        var transactionId = "b846cec7-b751-4b33-8da5-5382ebc57541";

        var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateCreatedEvent.eventType,
            estateCreatedEvent.data);

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, 100.00);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);
        t.notEqual(projectionState.estates[estateId], null);
        t.equal(projectionState.estates[estateId].name, estateNameNoSpaces);
        t.equal(projectionState.estates[estateId].filteredName, estateName);

        var events = projection.emittedEvents;
        t.equal(events.length, 1);
        t.end();
    });

test('Projection Can Handle Merchant Fee Settled Events',
    t =>
    {
        projection.initialize();

        projection.setState({ estates: {} });

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var estateName = 'Demo Estate';
        var estateNameNoSpaces = 'DemoEstate';
        var merchantId = "30ebc670-88ac-4c0c-9631-77547a687bbc";
        var transactionId = "b846cec7-b751-4b33-8da5-5382ebc57541";
        var settlementId = "5bc0c000-aedd-08d9-0000-000000000000";

        var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateCreatedEvent.eventType,
            estateCreatedEvent.data);

        var merchantFeeSettledEvent =
            testData.getMerchantFeeSettledEvent(estateId, merchantId, transactionId, settlementId);

        projection.processEvent(
            'SettlementAggregate-' + settlementId.replace(/-/gi, ""),
            merchantFeeSettledEvent.eventType,
            merchantFeeSettledEvent.data);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);
        t.notEqual(projectionState.estates[estateId], null);
        t.equal(projectionState.estates[estateId].name, estateNameNoSpaces);
        t.equal(projectionState.estates[estateId].filteredName, estateName);

        var events = projection.emittedEvents;
        t.equal(events.length, 1);
        t.end();
    });

test('Projection Can Handle Statement Generated Events',
    t =>
    {
        projection.initialize();

        projection.setState({ estates: {} });

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var estateName = 'Demo Estate';
        var estateNameNoSpaces = 'DemoEstate';
        var merchantId = "30ebc670-88ac-4c0c-9631-77547a687bbc";
        var merchantStatementId = "71f5fdc4-6661-4a4d-bd61-c5e7f4b01a4a";

        var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateCreatedEvent.eventType,
            estateCreatedEvent.data);

        var statementGeneratedEvent =
            testData.getStatementGeneratedEvent(estateId, merchantId, merchantStatementId);

        projection.processEvent(
            'MerchantStatementAggregate-' + merchantStatementId.replace(/-/gi, ""),
            statementGeneratedEvent.eventType,
            statementGeneratedEvent.data);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);
        t.notEqual(projectionState.estates[estateId], null);
        t.equal(projectionState.estates[estateId].name, estateNameNoSpaces);
        t.equal(projectionState.estates[estateId].filteredName, estateName);

        var events = projection.emittedEvents;
        t.equal(events.length, 1);
        t.end();
    });