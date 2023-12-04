var testData = require('./TestData.js');
testData.clearRequireCache();

require('../../NugetPackage/projections/continuous/EstateManagementSubscriptionStreamBuilder.js');
var projection = require('event-store-projection-testing-framework');
var chai = require("chai");

describe('Estate Management Subscription Stream Builder Tests', function () {
    it('Projection Can Handle Estate Created Event', function(){
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

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.estates[estateId]).to.not.be.null;
        chai.expect(projectionState.estates[estateId].name).equal(estateNameNoSpaces);
        chai.expect(projectionState.estates[estateId].filteredName).equal(estateName);
    })

    it('Projection Can Handle Transaction Has Been Completed Events', function(){
        projection.initialize();

        projection.setState({ estates: {}, events:0 });

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

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.estates[estateId]).to.not.be.null;
        chai.expect(projectionState.estates[estateId].name).equal(estateNameNoSpaces);
        chai.expect(projectionState.estates[estateId].filteredName).equal(estateName);
                
        var events = projection.emittedEvents;
        chai.expect(events.length).equal(1);
    })

    it('Projection Can Handle Merchant Fee Settled Events', function(){        
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

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.estates[estateId]).to.not.be.null;
        chai.expect(projectionState.estates[estateId].name).equal(estateNameNoSpaces);
        chai.expect(projectionState.estates[estateId].filteredName).equal(estateName);

        var events = projection.emittedEvents;
        chai.expect(events.length).equal(1);
    })

    it('Projection Can Handle Statement Generated Events', function(){
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

        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.estates[estateId]).to.not.be.null;
        chai.expect(projectionState.estates[estateId].name).equal(estateNameNoSpaces);
        chai.expect(projectionState.estates[estateId].filteredName).equal(estateName);

        var events = projection.emittedEvents;
        chai.expect(events.length).equal(1);
    })
});