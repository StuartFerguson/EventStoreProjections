require('../../NugetPackage/projections/continuous/CallbackHandlerEnricher.js');
var projection = require('@transactionprocessing/esprojection-testing-framework');
var testData = require('./TestData.js');
var describe = require('tape-describe');
var test = describe('Callback Handler Enricher Tests');

test('Projection Can Handle Estate Events',
    t =>
    {
        projection.initialize();

        projection.setState({
            estates: [],
            debug: []
        });

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var estateName = 'Demo Estate';
        var reference = "1";

        var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateCreatedEvent.eventType,
            estateCreatedEvent.data);

        var estateReferenceAllocatedEvent = testData.getEstateReferenceAllocatedEvent(estateId, reference);
        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateReferenceAllocatedEvent.eventType,
            estateReferenceAllocatedEvent.data);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);
        t.notEqual(projectionState.estates, null);
        t.equal(projectionState.estates.length, 1);
        t.equal(projectionState.estates[0].estateId, estateId);
        t.equal(projectionState.estates[0].reference, reference);

        t.end();
    });

test('Projection Can Handle Callback Received Event after Estate Created',
    t =>
    {
        projection.initialize();

        projection.setState({
            estates: [],
            debug: []
        });

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var estateName = 'Demo Estate';
        var reference = "1";

        var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateCreatedEvent.eventType,
            estateCreatedEvent.data);

        var estateReferenceAllocatedEvent = testData.getEstateReferenceAllocatedEvent(estateId, reference);
        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateReferenceAllocatedEvent.eventType,
            estateReferenceAllocatedEvent.data);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);
        t.notEqual(projectionState.estates, null);
        t.equal(projectionState.estates.length, 1);

        var destination = "EstateManagement";
        var estateReference = "1";
        var merchantReference = "1";
        var callbackReceivedEvent = testData.getCallbackReceivedEvent(destination, estateReference, merchantReference);

        projection.processEvent(
            "$et-CallbackReceivedEvent",
            callbackReceivedEvent.eventType,
            callbackReceivedEvent.data);

        var events = projection.emittedEvents;
        t.equal(events.length, 1);

        var eventBody = JSON.parse(events[0].body);
        t.equal(eventBody.estateId, estateId);
        t.equal(events[0].streamId, destination + "SubscriptionStream_" + estateName.replace(" ", ""));
        t.equal(events[0].eventName, "CallbackReceivedEnrichedEvent");

        t.end();
    });

test('Projection Can Handle Callback Received Event before Estate Created',
    t =>
    {
        projection.initialize();

        projection.setState({
            estates: [],
            debug: []
        });

        var destination = "EstateManagement";
        var estateReference = "1";
        var merchantReference = "1";
        var callbackReceivedEvent =
            testData.getCallbackReceivedEvent(destination, estateReference, merchantReference);

        projection.processEvent(
            "$et-CallbackReceivedEvent",
            callbackReceivedEvent.eventType,
            callbackReceivedEvent.data);

        var events = projection.emittedEvents;
        t.equal(events.length, 1);
        var eventBody = JSON.parse(events[0].body);

        t.equal(eventBody.estateId, undefined);
        t.equal(events[0].streamId, destination + "SubscriptionStream_UnknownEstate");
        t.equal(events[0].eventName, "CallbackReceivedEnrichedWithNoEstateEvent");
        t.end();
    });