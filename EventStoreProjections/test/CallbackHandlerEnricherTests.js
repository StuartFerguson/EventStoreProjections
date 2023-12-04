var testData = require('./TestData.js');
testData.clearRequireCache();

require('../../NugetPackage/projections/continuous/CallbackHandlerEnricher.js');
var projection = require('event-store-projection-testing-framework');
var chai = require("chai");
describe('Callback Handler Enricher Tests', function () {
    it('Projection Can Handle Estate Events', function(){
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

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.estates).to.not.be.null;
        chai.expect(projectionState.estates.length).equal(1);
        chai.expect(projectionState.estates[0].estateId).equal(estateId);
        chai.expect(projectionState.estates[0].reference).equal(reference);
    })

    it('Projection Can Handle Callback Received Event after Estate Created', function() {
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

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.estates).to.not.be.null;
        chai.expect(projectionState.estates.length).equal(1);

        var destination = "EstateManagement";
        var estateReference = "1";
        var merchantReference = "1";
        var callbackReceivedEvent = testData.getCallbackReceivedEvent(destination, estateReference, merchantReference);

        projection.processEvent(
            "$et-CallbackReceivedEvent",
            callbackReceivedEvent.eventType,
            callbackReceivedEvent.data);

        var events = projection.emittedEvents;
        chai.expect(events.length).equal(1);

        var eventBody = JSON.parse(events[0].body);
        chai.expect(eventBody.estateId).equal(estateId);
        chai.expect(events[0].streamId).equal(destination + "SubscriptionStream_" + estateName.replace(" ", ""));
        chai.expect(events[0].eventName).equal("CallbackReceivedEnrichedEvent");
    })

    it('Projection Can Handle Callback Received Event before Estate Created', function(){
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
        chai.expect(events.length).equal(1);
        var eventBody = JSON.parse(events[0].body);

        chai.expect(eventBody.estateId).equal(undefined);
        chai.expect(events[0].streamId).equal(destination + "SubscriptionStream_UnknownEstate");
        chai.expect(events[0].eventName).equal("CallbackReceivedEnrichedWithNoEstateEvent");
    })
});