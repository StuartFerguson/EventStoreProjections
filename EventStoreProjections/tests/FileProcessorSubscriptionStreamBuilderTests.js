require('../../NugetPackage/projections/continuous/FileProcessorSubscriptionStreamBuilder.js');
var projection = require('@transactionprocessing/esprojection-testing-framework');
var testData = require('./TestData.js');
var describe = require('tape-describe');
var test = describe('File Processor Subscription Stream Builder Tests');

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
        t.notEqual(projectionState, null);
        t.equal(projectionState.estates[estateId].name, estateNameNoSpaces);
        t.equal(projectionState.estates[estateId].filteredName, estateName);
        t.end();
    });

test('Projection Can Handle File Events',
    t =>
    {
        projection.initialize();

        projection.setState({ estates: {} });

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var estateName = 'Demo Estate';
        var estateNameNoSpaces = 'DemoEstate';
        var merchantId = "30ebc670-88ac-4c0c-9631-77547a687bbc";
        var fileImportLogId = "b846cec7-b751-4b33-8da5-5382ebc57541";
        var fileId = "c89be3a5-8ebc-4f95-adce-084905e678d1";
        var userId = "8fab578b-c23f-41d3-91d2-2b52184637f2";
        var fileProfileId = "22a54491-896f-4a73-8dc1-4f48f050add9";
        var transactionId1 = "6a1bfea7-06c7-46dc-a292-b4d917a900a4";
        var transactionId2 = "a849071c-252a-42de-a77a-1a1651a062ae";

        var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

        projection.processEvent(
            'EstateAggregate-' + estateId.replace(/-/gi, ""),
            estateCreatedEvent.eventType,
            estateCreatedEvent.data);

        var importLogCreatedEvent = testData.getImportLogCreatedEvent(estateId, fileImportLogId);

        projection.processEvent(
            'FileImportLogAggregate-' + fileImportLogId.replace(/-/gi, ""),
            importLogCreatedEvent.eventType,
            importLogCreatedEvent.data);

        var fileAddedToImportLog =
            testData.getFileAddedToImportLogEvent(estateId, merchantId, userId, fileId, fileProfileId);

        projection.processEvent(
            'FileImportLogAggregate-' + fileImportLogId.replace(/-/gi, ""),
            fileAddedToImportLog.eventType,
            fileAddedToImportLog.data);

        var fileCreatedEvent = testData.getFileCreatedEvent(estateId, merchantId, userId, fileId, fileProfileId);

        projection.processEvent(
            'FileAggregate-' + fileId.replace(/-/gi, ""),
            fileCreatedEvent.eventType,
            fileCreatedEvent.data);

        var fileLineAddedEvent1 = testData.getFileLineAddedEvent(estateId, fileId, 1);

        projection.processEvent(
            'FileAggregate-' + fileId.replace(/-/gi, ""),
            fileLineAddedEvent1.eventType,
            fileLineAddedEvent1.data);

        var fileLineAddedEvent2 = testData.getFileLineAddedEvent(estateId, fileId, 2);

        projection.processEvent(
            'FileAggregate-' + fileId.replace(/-/gi, ""),
            fileLineAddedEvent2.eventType,
            fileLineAddedEvent2.data);

        var fileLineAddedEvent3 = testData.getFileLineAddedEvent(estateId, fileId, 3);

        projection.processEvent(
            'FileAggregate-' + fileId.replace(/-/gi, ""),
            fileLineAddedEvent3.eventType,
            fileLineAddedEvent3.data);

        var fileLineProcessingSuccessfulEvent =
            testData.getFileLineProcessingSuccessfulEvent(estateId, fileId, 1, transactionId1);

        projection.processEvent(
            'FileAggregate-' + fileId.replace(/-/gi, ""),
            fileLineProcessingSuccessfulEvent.eventType,
            fileLineProcessingSuccessfulEvent.data);

        var fileLineProcessingIgnoredEvent = testData.getFileLineProcessingIgnoredEvent(estateId, fileId, 2);

        projection.processEvent(
            'FileAggregate-' + fileId.replace(/-/gi, ""),
            fileLineProcessingIgnoredEvent.eventType,
            fileLineProcessingIgnoredEvent.data);

        var fileLineProcessingFailedEvent =
            testData.getFileLineProcessingFailedEvent(estateId, fileId, 3, transactionId2);

        projection.processEvent(
            'FileAggregate-' + fileId.replace(/-/gi, ""),
            fileLineProcessingFailedEvent.eventType,
            fileLineProcessingFailedEvent.data);

        var fileProcessingCompletedEvent = testData.getFileProcessingCompletedEvent(estateId, fileId);

        projection.processEvent(
            'FileAggregate-' + fileId.replace(/-/gi, ""),
            fileProcessingCompletedEvent.eventType,
            fileProcessingCompletedEvent.data);

        var projectionState = projection.getState();

        t.notEqual(projectionState, null);
        t.notEqual(projectionState, null);
        t.equal(projectionState.estates[estateId].name, estateNameNoSpaces);
        t.equal(projectionState.estates[estateId].filteredName, estateName);

        var events = projection.emittedEvents;
        t.equal(events.length, 10);
        t.end();
    });