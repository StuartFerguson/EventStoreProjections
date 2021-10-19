var chai = require('chai');
require('../src/continuous/CallbackHandlerEnricher.js');
var projection = require('esprojection-testing-framework');
var testData = require('./TestData.js');

describe('Callback Handler Enricher Tests', function()
{
    beforeEach(function() { projection.initialize(); });

    it('Projection Can Handle Estate Events',
        function()
        {
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
            chai.expect(projectionState.estates.length).to.equal(1);
            chai.expect(projectionState.estates[0].estateId).to.equal(estateId);
            chai.expect(projectionState.estates[0].reference).to.equal(reference);
        }
    );

    it('Projection Can Handle Callback Received Event after Estate Created',
        function () {
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
            chai.expect(projectionState.estates.length).to.equal(1);

            var destination = "EstateManagement";
            var estateReference = "1";
            var merchantReference = "1";
            var callbackReceivedEvent = testData.getCallbackReceivedEvent(destination, estateReference, merchantReference);

            projection.processEvent(
                "$et-CallbackReceivedEvent",
                callbackReceivedEvent.eventType,
                callbackReceivedEvent.data);

            var events = projection.emittedEvents;
            chai.expect(events.length).to.equal(1);
            
            var eventBody = JSON.parse(events[0].body);
            chai.expect(eventBody.estateId).to.equal(estateId);
            chai.expect(events[0].streamId).to.equal(destination + "SubscriptionStream_" + estateName.replace(" ", ""));
            chai.expect(events[0].eventName).to.equal("CallbackReceivedEnrichedEvent");
        }
    );

    it('Projection Can Handle Callback Received Event before Estate Created',
        function () {
            
            var destination = "EstateManagement";
            var estateReference = "1";
            var merchantReference = "1";
            var callbackReceivedEvent = testData.getCallbackReceivedEvent(destination, estateReference, merchantReference);

            projection.processEvent(
                "$et-CallbackReceivedEvent",
                callbackReceivedEvent.eventType,
                callbackReceivedEvent.data);

            var events = projection.emittedEvents;
            chai.expect(events.length).to.equal(1);
            
            var eventBody = JSON.parse(events[0].body);
            chai.expect(eventBody.estateId).to.be.undefined;
            chai.expect(events[0].streamId).to.equal(destination + "SubscriptionStream_UnknownEstate");
            chai.expect(events[0].eventName).to.equal("CallbackReceivedEnrichedWithNoEstateEvent");
        }
    );
});