require('../src/continuous/TransactionProcessorSubscriptionStreamBuilder.js');
var projection = require('@transactionprocessing/esprojection-testing-framework');
var testData = require('./TestData.js');
var describe = require('tape-describe');
var test = describe('Transaction Processor Subscription Stream Builder Tests');

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

test('Projection Can Handle Transaction Events',
    t =>
    {
        projection.initialize();

        projection.setState({ estates: {} });

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var estateName = 'Demo Estate';
        var estateNameNoSpaces = 'DemoEstate';
        var merchantId = "30ebc670-88ac-4c0c-9631-77547a687bbc";
        var transactionId = "b846cec7-b751-4b33-8da5-5382ebc57541";
        var customerEmailAddress = "customer@myemail.com";

        var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateCreatedEvent.eventType,
            estateCreatedEvent.data);

        var customerEmailReceiptRequestedEvent =
            testData.getCustomerEmailReceiptRequestedEvent(estateId, merchantId, transactionId, customerEmailAddress);

        projection.processEvent(
            'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
            customerEmailReceiptRequestedEvent.eventType,
            customerEmailReceiptRequestedEvent.data);

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
        t.equal(events.length, 2);
        t.end();
    });