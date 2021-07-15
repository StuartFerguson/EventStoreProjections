var chai = require('chai');
require('../src/continuous/TransactionProcessorSubscriptionStreamBuilder.js');
var projection = require('esprojection-testing-framework');
var testData = require('./TestData.js');

describe('Transaction Processor Subscription Stream Builder Tests', function()
{
    beforeEach(function() { projection.initialize(); });

    it('Projection Can Handle Estate Created Event',
        function()
        {
            var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
            var estateName = 'Demo Estate';
            var estateNameNoSpaces = 'DemoEstate';
            
            var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                estateCreatedEvent.eventType,
                estateCreatedEvent.data);

            var projectionState = projection.getState();
            
            chai.expect(projectionState).to.not.be.null;
            chai.expect(projectionState.estates[estateId]).to.not.be.null;
            chai.expect(projectionState.estates[estateId].name).to.equal(estateNameNoSpaces);
            chai.expect(projectionState.estates[estateId].filteredName).to.equal(estateName);
        });
    
    it('Projection Can Handle Transaction Events',
        function () {
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
            
            var customerEmailReceiptRequestedEvent = testData.getCustomerEmailReceiptRequestedEvent(estateId, merchantId, transactionId, customerEmailAddress);

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

            chai.expect(projectionState).to.not.be.null;
            chai.expect(projectionState.estates[estateId]).to.not.be.null;
            chai.expect(projectionState.estates[estateId].name).to.equal(estateNameNoSpaces);
            chai.expect(projectionState.estates[estateId].filteredName).to.equal(estateName);

            var events = projection.emittedEvents;
            chai.expect(events.length).to.equal(2);
        });
});