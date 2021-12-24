var chai = require('chai');
require('../src/continuous/EstateAggregator.js');
var projection = require('@transactionprocessing/esprojection-testing-framework');
var testData = require('./TestData.js');

describe('Estate Aggregator Tests', function()
{
    beforeEach(function() { projection.initialize(); });

    it('Projection Can Handle Estate Events',
        function()
        {
            var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
            var estateName = 'Demo Estate 1';
            var securityUserId = 'e41e6196-4f18-4f49-bab4-ead032c1e52e';
            var emailAddress = 'estateuser@demoestate.co.uk';
            var operatorName = "Safaricom";
            var operatorId = 'e41e6196-4f18-4f49-bab4-ead032c1e52e';

            var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

            var securityUserAddedToEstateEvent = testData.getSecurityUserAddedToEstateEvent(estateId,securityUserId,emailAddress);

            var operatorAddedToEstateEvent = testData.getOperatorAddedToEstateEvent(estateId, operatorName, operatorId);

            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                estateCreatedEvent.eventType,
                estateCreatedEvent.data);

            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                securityUserAddedToEstateEvent.eventType,
                securityUserAddedToEstateEvent.data);

            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                operatorAddedToEstateEvent.eventType,
                operatorAddedToEstateEvent.data);

            var events = projection.emittedEvents;
            chai.expect(events.length).to.equal(3);

            var state = projection.getState();
            chai.expect(state.estates[estateId].name).to.equal('DemoEstate1');
        });

    it('Projection Can Handle Merchant Events',
        function()
        {
            var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
            var estateName = 'Demo Estate';
            var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
            var merchantName = 'Test Merchant 1';

            var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

            // Set up the merchant events
            var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, merchantName);
            var addressAddedEvent = testData.getAddressAddedEvent(estateId, merchantId);
            var contactAddedEvent = testData.getContactAddedEvent(estateId, merchantId);

            var operatorId1 = '410c55fd-9eef-462d-9267-3649c7dedbff';
            var operatorName1 = 'Safaricom';
            var merchantNumber1 = '';
            var terminalNumber1 = '';
            var operatorAssignedToMerchantEvent = testData.getOperatorAssignedToMerchantEvent(estateId,
                merchantId,
                operatorId1,
                operatorName1,
                merchantNumber1,
                terminalNumber1);

            var securityUserId = 'e41e6196-4f18-4f49-bab4-ead032c1e52e';
            var emailAddress = 'merchantuser@emulatormerchant.co.uk';
            var securityUserAddedEvent =
                testData.getSecurityUserAddedToMerchantEvent(estateId, merchantId, securityUserId, emailAddress);

            var deviceId = '24297b34-b1cf-48bf-a391-eb1b8a48fdc7';
            var deviceIdentifier = 'EMULATOR29X3X2X0';
            var deviceAddedToMerchantEvent =
                testData.getDeviceAddedToMerchantEvent(estateId, merchantId, deviceId, deviceIdentifier);

            var depositDateTime = '2020-05-30T06:21:31.356Z';
            var depositAmount = 1000.00;
            var manualDepositMadeEvent =
                testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                estateCreatedEvent.eventType,
                estateCreatedEvent.data);

            projection.processEvent(
                'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
                merchantCreatedEvent.eventType,
                merchantCreatedEvent.data);
            projection.processEvent(
                'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
                addressAddedEvent.eventType,
                addressAddedEvent.data);
            projection.processEvent(
                'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
                contactAddedEvent.eventType,
                contactAddedEvent.data);
            projection.processEvent(
                'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
                operatorAssignedToMerchantEvent.eventType,
                operatorAssignedToMerchantEvent.data);
            projection.processEvent(
                'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
                securityUserAddedEvent.eventType,
                securityUserAddedEvent.data);
            projection.processEvent(
                'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
                deviceAddedToMerchantEvent.eventType,
                deviceAddedToMerchantEvent.data);
            projection.processEvent(
                'MerchantAggregate-' + merchantId.replace(/-/gi, ""),
                manualDepositMadeEvent.eventType,
                manualDepositMadeEvent.data);

            var events = projection.emittedEvents;
            chai.expect(events.length).to.equal(8);
        });

    it('Projection Can Handle Contract Events',
        function()
        {
            var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
            var estateName = 'Demo Estate';
            
            var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

            var contractId = '7975776e-6c75-4fde-ab8b-ff561ceddcbe';
            var operatorId = 'ed2cadd0-5d25-4074-92fd-3de099189bb2';
            var contractDescription = 'Safaricom Contract';

            var contractCreatedEvent = testData.getContractCreatedEvent(estateId, contractId, operatorId, contractDescription);
            var fixedProductId = '27f8c6a7-4eb4-4398-9519-257b15aff072';
            var fixedProductName = "100 KES Topup";
            var fixedProductDisplayText = "100 KES";
            var fixedProductValue = 100;

            var fixedValueProductAddedToContractEvent = testData.getFixedValueProductAddedToContractEvent(estateId, contractId, fixedProductId, fixedProductName, fixedProductDisplayText, fixedProductValue);

            var variableProductId = '4fc2adaa-cf8f-4a67-84ae-deb15860f61a';
            var variableProductName = "Custom";
            var variableProductDisplayText = "Custom";
            var variableValueProductAddedToContractEvent = testData.getVariableValueProductAddedToContractEvent(estateId, contractId, variableProductId, variableProductName, variableProductDisplayText);

            var feeDescription = 'Merchant Commission';
            var feeId = 'd740dfa3-0b5e-40b1-a1ed-d369f80f041a';
            var feeValue = 0.5;
            var transactionFeeForProductAddedToContractEvent = testData.getTransactionFeeForProductAddedToContractEvent(estateId,contractId,fixedProductId, feeDescription, feeId, feeValue);

            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                estateCreatedEvent.eventType,
                estateCreatedEvent.data);

            projection.processEvent(
                'ContractAggregate-' + estateId.replace(/-/gi, ""),
                contractCreatedEvent.eventType,
                contractCreatedEvent.data);

            projection.processEvent(
                'ContractAggregate-' + estateId.replace(/-/gi, ""),
                fixedValueProductAddedToContractEvent.eventType,
                fixedValueProductAddedToContractEvent.data);

            projection.processEvent(
                'ContractAggregate-' + estateId.replace(/-/gi, ""),
                variableValueProductAddedToContractEvent.eventType,
                variableValueProductAddedToContractEvent.data);

            projection.processEvent(
                'ContractAggregate-' + estateId.replace(/-/gi, ""),
                transactionFeeForProductAddedToContractEvent.eventType,
                transactionFeeForProductAddedToContractEvent.data);

            var events = projection.emittedEvents;
            chai.expect(events.length).to.equal(5);
        });

    it('Projection Can Handle Transaction Events',
        function()
        {
            var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
            var estateName = 'Demo Estate';

            var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

            var merchantId = 'a2f9ef28-59f8-4f4a-9110-2a4e5a4d2c32';
            var transactionId = 'a355ceef-90b9-46bc-af2c-73701e55a8e4';
            var transactionAmount = 100.0;
            var transactionType = 'Logon';
            var contractId = 'a51958f8-dfdf-42cc-a044-7e347b76a1f2';
            var productId = '1f362ae5-6e4e-422e-aacb-a2a9c912441a';
            var customerAccountNumber = '1234567890';
            var calculatedFeeValue = 0.92;
            var feeValue = 0.5;
            var feeEventCreatedDateTime = '2021-05-28T05:57:40.5876129+00:00';
            var feeId = 'a514c078-80df-4fcf-81c4-07a633ed8a92';

            var transactionHasStartedEvent = testData.getTransactionHasStartedEvent(estateId,
                merchantId,
                transactionId,
                transactionAmount,
                transactionType);

            var productDetailsAddedToTransactionEvent = testData.getProductDetailsAddedToTransactionEvent(estateId, merchantId, transactionId, contractId, productId )

            var additionalRequestDataRecordedEvent = testData.getAdditionalRequestDataRecordedEvent(estateId,
                merchantId,
                transactionId,
                transactionAmount,
                customerAccountNumber);

            var transactionHasBeenLocallyAuthorisedEvent = testData.getTransactionHasBeenLocallyAuthorisedEvent(estateId, merchantId, transactionId);
            var transactionHasBeenLocallyDeclinedEvent = testData.getTransactionHasBeenLocallyDeclinedEvent(estateId, merchantId, transactionId);
            var transactionAuthorisedByOperatorEvent = testData.getTransactionAuthorisedByOperatorEvent(estateId, merchantId, transactionId);
            var transactionDeclinedByOperatorEvent = testData.getTransactionDeclinedByOperatorEvent(estateId, merchantId, transactionId);
            var transactionHasBeenCompletedEvent =
                testData.getTransactionHasBeenCompletedEvent(estateId,
                    merchantId,
                    transactionId,
                    true,
                    transactionAmount);
            var merchantFeeAddedToTransactionEvent = testData.getMerchantFeeAddedToTransactionEvent(estateId,
                merchantId,
                transactionId,
                calculatedFeeValue,
                feeEventCreatedDateTime);

            var merchantFeeAddedToTransactionEnrichedEvent = testData.getMerchantFeeAddedToTransactionEnrichedEvent(
                estateId,
                merchantId,
                transactionId,
                feeId,
                feeEventCreatedDateTime,
                feeValue,
                calculatedFeeValue);


            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                estateCreatedEvent.eventType,
                estateCreatedEvent.data);

            projection.processEvent(
                'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
                transactionHasStartedEvent.eventType,
                transactionHasStartedEvent.data);

            projection.processEvent(
                'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
                productDetailsAddedToTransactionEvent.eventType,
                productDetailsAddedToTransactionEvent.data);

            projection.processEvent(
                'TransactionAggregate-' + transactionId.replace(/-/gi, ""),
                additionalRequestDataRecordedEvent.eventType,
                additionalRequestDataRecordedEvent.data);

            projection.processEvent('TransactionAggregate-' + transactionId.replace(/-/gi, ""),
                transactionHasBeenLocallyAuthorisedEvent.eventType,
                transactionHasBeenLocallyAuthorisedEvent.data);

            projection.processEvent('TransactionAggregate-' + transactionId.replace(/-/gi, ""),
                transactionHasBeenLocallyDeclinedEvent.eventType,
                transactionHasBeenLocallyDeclinedEvent.data);

            projection.processEvent('TransactionAggregate-' + transactionId.replace(/-/gi, ""),
                transactionAuthorisedByOperatorEvent.eventType,
                transactionAuthorisedByOperatorEvent.data);

            projection.processEvent('TransactionAggregate-' + transactionId.replace(/-/gi, ""),
                transactionDeclinedByOperatorEvent.eventType,
                transactionDeclinedByOperatorEvent.data);

            projection.processEvent('TransactionAggregate-' + transactionId.replace(/-/gi, ""),
                transactionHasBeenCompletedEvent.eventType,
                transactionHasBeenCompletedEvent.data);

            // This event will not be emitted
            projection.processEvent('TransactionAggregate-' + transactionId.replace(/-/gi, ""),  
                merchantFeeAddedToTransactionEvent.eventType,
                merchantFeeAddedToTransactionEvent.data);

            projection.processEvent("TransactionEnricherResult",
                merchantFeeAddedToTransactionEnrichedEvent.eventType,
                merchantFeeAddedToTransactionEnrichedEvent.data);

            var events = projection.emittedEvents;
            chai.expect(events.length).to.equal(10);
        });

    it('Projection Can Handle Voucher Events',
        function () {
            var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
            var estateName = 'Demo Estate';

            var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

            var transactionId = '4c41a750-0fc7-421a-9ae2-c7ab7f5d8dca';
            var voucherId = 'b6c8e2c2-6a8b-4fe1-b10e-e054601bc2c6';
            var voucherValue = 10.0;
            var voucherCode = '2017251882';
            var voucherGeneratedEvent =
                testData.getVoucherGeneratedEvent(estateId, voucherId, transactionId, voucherValue, voucherCode);

            var barcodeAddedEvent = testData.getBarcodeAddedEvent(estateId, voucherId);

            var voucherIssuedEvent = testData.getVoucherIssuedEvent(estateId, voucherId);

            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                estateCreatedEvent.eventType,
                estateCreatedEvent.data);

            projection.processEvent(
                'VoucherAggregate-' + voucherId.replace(/-/gi, ""),
                voucherGeneratedEvent.eventType,
                voucherGeneratedEvent.data);

            projection.processEvent(
                'VoucherAggregate-' + voucherId.replace(/-/gi, ""),
                barcodeAddedEvent.eventType,
                barcodeAddedEvent.data);

            projection.processEvent(
                'VoucherAggregate-' + voucherId.replace(/-/gi, ""),
                voucherIssuedEvent.eventType,
                voucherIssuedEvent.data);

            var events = projection.emittedEvents;
            chai.expect(events.length).to.equal(4);
    });

    it('Projection Can Handle File Events',
        function () {
            var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
            var estateName = 'Demo Estate';

            var estateCreatedEvent = testData.getEstateCreatedEvent(estateId, estateName);

            var merchantId = '40c57207-0dfd-41b9-ae85-f7cd44f22288';
            var userId = '9a53a0a7-73ca-4766-9ce9-85148661ced0';
            var fileId = '5daf6d47-413d-833d-2cda-829ee5d29b28';
            var fileImportLogId = '330cc000-2490-08d9-0000-000000000000';
            var fileProfileId = 'b2a59abf-293d-4a6b-b81b-7007503c3476';
            var lineNumber = 1;
            var transactionId = '8a52210e-1aeb-48c5-9571-276a0b781cf7"';

            var importLogCreatedEvent =
                testData.getImportLogCreatedEvent(estateId, fileImportLogId);
            var fileAddedToImportLogEvent = testData.getFileAddedToImportLogEvent(estateId, merchantId);

            var fileCreatedEvent =
                testData.getFileCreatedEvent(estateId, merchantId, userId, fileId, fileImportLogId, fileProfileId);
            var fileLineAddedEvent = testData.getFileLineAddedEvent(estateId, fileId, lineNumber);
            var fileLineProcessingSuccessfulEvent =
                testData.getFileLineProcessingSuccessfulEvent(estateId, fileId, lineNumber, transactionId);
            var fileLineProcessingIgnoredEvent =
                testData.getFileLineProcessingIgnoredEvent(estateId, fileId, lineNumber, transactionId);

            var fileLineProcessingFailedEvent =
                testData.getFileLineProcessingFailedEvent(estateId, fileId, lineNumber, transactionId);

            var fileProcessingCompletedEvent = testData.getFileProcessingCompletedEvent(estateId, fileId);

            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                estateCreatedEvent.eventType,
                estateCreatedEvent.data);

            projection.processEvent(
                'EstateAggregate-' + estateId.replace(/-/gi, ""),
                importLogCreatedEvent.eventType,
                importLogCreatedEvent.data);
            projection.processEvent(
                'FileImportLogAggregate-' + fileImportLogId.replace(/-/gi, ""),
                fileAddedToImportLogEvent.eventType,
                fileAddedToImportLogEvent.data);

            projection.processEvent(
                'FileAggregate-' + fileId.replace(/-/gi, ""),
                fileCreatedEvent.eventType,
                fileCreatedEvent.data);
            projection.processEvent(
                'FileAggregate-' + fileId.replace(/-/gi, ""),
                fileLineAddedEvent.eventType,
                fileLineAddedEvent.data);
            projection.processEvent(
                'FileAggregate-' + fileId.replace(/-/gi, ""),
                fileLineProcessingSuccessfulEvent.eventType,
                fileLineProcessingSuccessfulEvent.data);
            projection.processEvent(
                'FileAggregate-' + fileId.replace(/-/gi, ""),
                fileLineProcessingIgnoredEvent.eventType,
                fileLineProcessingIgnoredEvent.data);
            projection.processEvent(
                'FileAggregate-' + fileId.replace(/-/gi, ""),
                fileLineProcessingFailedEvent.eventType,
                fileLineProcessingFailedEvent.data);
            projection.processEvent(
                'FileAggregate-' + fileId.replace(/-/gi, ""),
                fileProcessingCompletedEvent.eventType,
                fileProcessingCompletedEvent.data);
            
            var events = projection.emittedEvents;
            chai.expect(events.length).to.equal(9);
        });

    // TODO: Messaging Events Tests
});