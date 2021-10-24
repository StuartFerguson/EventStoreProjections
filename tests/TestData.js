module.exports = {

    getEstateCreatedEvent: function(estateId, estateName)
    {
        return {
            eventType: 'EstateCreatedEvent',

            data: {
                "estateId": estateId,
                "estateName": estateName
            },
            metadata: {

            },
            eventId: "9A0C1FA6-C667-4270-B666-67219969713C"
        };
    },

    getEstateReferenceAllocatedEvent: function (estateId, reference)
    {
        return {
            eventType: 'EstateReferenceAllocatedEvent',

            data: {
                "estateId": estateId,
                "estateReference": reference
            },
            metadata: {

            },
            eventId: "5B9D9F40-8BF5-4B2A-B5FA-6A02701B9AEC"
        };
    },

    getSecurityUserAddedToEstateEvent: function (estateId, securityUserId, emailAddress) {
        return {
            eventType: 'SecurityUserAddedToEstateEvent',
            data: {
                "emailAddress": emailAddress,
                "estateId": estateId,
                "securityUserId": securityUserId
            },
            metadata: {
            },
            eventId: "0BA6D626-C700-451E-B920-3E5F0F41A365"
        };
    },

    getOperatorAddedToEstateEvent: function (estateId, operatorName, operatorId) {
        return {
            eventType: 'OperatorAddedToEstateEvent',
            data: {
                "estateId": estateId,
                "name": operatorName,
                "operatorId": operatorId
            }	,
            metadata: {
            },
            eventId: "732CA7AC-0A75-4BCF-B60F-D5B057CFD64A"
        };
    },

    getMerchantCreatedEvent: function (estateId, merchantId, merchantName)
    {
        return {
            eventType: 'MerchantCreatedEvent',
            data: {
                "dateCreated": "2021-03-16T16:53:06.2873043+00:00",
                "estateId": estateId,
                "merchantId": merchantId,
                "merchantName": merchantName
            },
            metadata: {
                
            },
            eventId: "F1E549DC-EA7D-4D74-840B-2D2311CA0269"
        };
    },

    getAddressAddedEvent: function (estateId, merchantId)
    {
        return {
            eventType: 'AddressAddedEvent',
            data: {
                "addressId": "962e35e1-7ce9-47f7-b71f-e5ff6c51aac2",
                "addressLine1": "Test Address Line 1",
                "country": "UK",
                "estateId": estateId,
                "merchantId": merchantId,
                "postalCode": "TE57 1NG",
                "region": "Test Region",
                "town": "Test Town"
            },
            metadata: {
            },
            eventId: "46A7D0A5-6D73-49B5-945E-9DC6B0F41885"
    };
    },

    getContactAddedEvent: function (estateId, merchantId) {
        return {
            eventType: 'ContactAddedEvent',
            data: {
                "contactEmailAddress": "testcontact@emulatormerchant.co.uk",
                "contactId": "d765c085-4420-4209-bb79-1405b00708d3",
                "contactName": "Test Contact",
                "contactPhoneNumber": "01234567890",
                "estateId": estateId,
                "merchantId": merchantId
            },
            metadata: {
            },
            eventId:"CA506880-A2C9-4F39-872E-57BD129BC1C9"
        };
    },

    getOperatorAssignedToMerchantEvent: function (estateId, merchantId, operatorId, operatorName,merchantNumber, terminalNumber) {
        return {
            eventType: 'OperatorAssignedToMerchantEvent',
            data: {
                "estateId": estateId,
                "merchantId": merchantId,
                "merchantNumber": merchantNumber,
                "name": operatorName,
                "operatorId": operatorId,
                "terminalNumber": terminalNumber
            },
            metadata: {
            },
            eventId:"528416C3-CAE5-47C6-B2F1-2B2C7B37E1E1"
        };
    },

    getSecurityUserAddedToMerchantEvent: function (estateId, merchantId, securityUserId, emailAddress) {
        return {
            eventType: 'SecurityUserAddedToMerchantEvent',
            data: {
                "emailAddress": emailAddress,
                "estateId": estateId,
                "merchantId": merchantId,
                "securityUserId": securityUserId
            },
            metadata: {
            },
            eventId:"7F29A577-DB7F-46C1-8A8A-7A5011AD5074"
        };
    },
    
    getDeviceAddedToMerchantEvent: function (estateId, merchantId, deviceId, deviceIdentifier)
    {
        return {
            eventType: 'DeviceAddedToMerchantEvent',
            data: {
                "deviceId": deviceId,
                "deviceIdentifier": deviceIdentifier,
                "estateId": estateId,
                "merchantId": merchantId
            },
            metadata: {
            },
            eventId:"A2823DDA-83B8-4FDB-AD27-0A730843EF1A"

        }
    },

    getManualDepositMadeEvent: function (estateId, merchantId, depositDateTime, depositAmount)
    {
        return {
            eventType: 'ManualDepositMadeEvent',
            data: {
                "amount": depositAmount,
                "depositDateTime": depositDateTime,
                "depositId": "ff106578-8495-afe1-1e50-6889d76065a6",
                "estateId": estateId,
                "merchantId": merchantId,
                "reference": "Test Deposit from UI"
            },
            metadata: {
            },
            eventId:"4772BD21-BB70-4F46-9360-F9A6FE04C640"
        }
    },

    getAutomaticDepositMadeEvent: function (estateId, merchantId, depositDateTime, depositAmount) {
        return {
            eventType: 'AutomaticDepositMadeEvent',
            data: {
                "amount": depositAmount,
                "depositDateTime": depositDateTime,
                "depositId": "ff106578-8495-afe1-1e50-6889d76065a6",
                "estateId": estateId,
                "merchantId": merchantId,
                "reference": "Test Deposit from UI"
            },
            metadata: {
            },
            eventId: "4772BD21-BB70-4F46-9360-F9A6FE04C640"
        }
    },

    getTransactionHasStartedEvent: function(estateId, merchantId, transactionId, transactionAmount, transactionType)
    {
        return {
            eventType: 'TransactionHasStartedEvent',
            data: {
                "estateId": estateId,
                "deviceIdentifier": "EMULATOR30X0X26X0",
                "transactionAmount": transactionAmount,
                "merchantId": merchantId,
                "transactionDateTime": "2021-03-18T08:36:13.365079Z",
                "transactionId": transactionId,
                "transactionNumber": "3",
                "transactionType": transactionType,
                "transactionReference": "fb3eeba01dbe3ad"
            },
            metadata: {
            },
            eventId:"83AC3E75-816C-420F-978C-D74C814EB68D"
        }
    },

    getProductDetailsAddedToTransactionEvent: function(estateId, merchantId, transactionId, contractId, productId)
    {
        return {
            eventType: 'ProductDetailsAddedToTransactionEvent',
            data: {
                "contractId": contractId,
                "estateId": estateId,
                "merchantId": merchantId,
                "productId": productId,
                "transactionId": transactionId
            },
            metadata: {
            },
            eventId:"BB6402A4-C459-4003-BCD0-650C1D94FE56"
        }
    },

    getAdditionalRequestDataRecordedEvent: function (estateId, merchantId, transactionId, transactionAmount, customerAccountNumber) {
        return {
            eventType: 'AdditionalRequestDataRecordedEvent',
            data: {
                "additionalTransactionRequestMetadata": {
                    "amount": transactionAmount,
                    "customerAccountNumber": customerAccountNumber
                },
                "estateId": estateId,
                "merchantId": merchantId,
                "operatorIdentifier": "Safaricom",
                "transactionId": transactionId
            },
            metadata: {
            },
            eventId:"6183F1D9-25C6-4C7D-9DE0-2F08A284F652"
        }
    },

    getTransactionHasBeenLocallyAuthorisedEvent: function(estateId, merchantId, transactionId)
    {
        return {
            eventType: 'TransactionHasBeenLocallyAuthorisedEvent',
            data: {
                "authorisationCode": "ABCD1234",
                "estateId": estateId,
                "merchantId": merchantId,
                "responseCode": "0000",
                "responseMessage": "SUCCESS",
                "transactionId": transactionId
            },
            metadata: {
            },
            eventId:"867917C1-1278-4A4E-BC45-3B3F96F0A435"
        }
    },

    getTransactionHasBeenLocallyDeclinedEvent: function (estateId, merchantId, transactionId) {
        return {
            eventType: 'TransactionHasBeenLocallyDeclinedEvent',
            data: {
                "estateId": estateId,
                "merchantId": merchantId,
                "responseCode": "1009",
                "responseMessage": "Merchant [Emulator Merchant] does not have enough credit available [0.0] to perform transaction amount [100.00]",
                "transactionId": transactionId
            },
            metadata: {
            },
            eventId:"DEA74F02-348F-42D1-9784-FDBACBD1E1CC"
        }
    },

    getTransactionAuthorisedByOperatorEvent: function (estateId, merchantId, transactionId) {
        return {
            eventType: 'TransactionAuthorisedByOperatorEvent',
            data: {
                "authorisationCode": "ABCD1234",
                "estateId": estateId,
                "merchantId": merchantId,
                "operatorIdentifier": "Safaricom",
                "operatorResponseCode": "200",
                "operatorResponseMessage": "Topup Successful",
                "responseCode": "0000",
                "responseMessage": "SUCCESS",
                "transactionId": transactionId
            },
            metadata: {
            },
            eventId:"2D3275C2-C122-4AF8-AAA5-E74F81181D10"
        }
    },

    getTransactionDeclinedByOperatorEvent: function (estateId, merchantId, transactionId) {
        return {
            eventType: 'TransactionDeclinedByOperatorEvent',
            data: {
                "estateId": estateId,
                "merchantId": merchantId,
                "operatorIdentifier": "Safaricom",
                "operatorResponseCode": "401",
                "operatorResponseMessage": "Amount Greater than 25000",
                "responseCode": "1008",
                "responseMessage": "DECLINED BY OPERATOR",
                "transactionId": transactionId
            },
            metadata: {
            },
            eventId:"F7B216E4-6FE3-4B8E-A0C0-EFA85783ACF2"
        }
    },

    getTransactionHasBeenCompletedEvent: function (estateId, merchantId, transactionId, isAuthorised, transactionAmount)
    {
        return {
            eventType: 'TransactionHasBeenCompletedEvent',
            data: {
                "completedDateTime": "2021-03-18T08:36:13.365079Z",
                "estateId": estateId,
                "isAuthorised": isAuthorised,
                "transactionAmount": transactionAmount,
                "merchantId": merchantId,
                "responseCode": "0000",
                "responseMessage": "SUCCESS",
                "transactionId": transactionId
            },
            metadata: {
            },
            eventId:"7F1FA1B5-449F-4F94-AF5C-5A536CBDAF57"
        }
    },
    
    getMerchantFeeAddedToTransactionEvent: function (estateId, merchantId, transactionId, calculatedValue, feeEventCreatedDateTime)
    {
        return {
            eventType: 'MerchantFeeAddedToTransactionEvent',
            data: {
                "calculatedValue": calculatedValue,
                "estateId": estateId,
                "feeCalculationType": 0,
                "feeId": "cd858cbd-fafd-4f66-9eea-52c6ab1e5832",
                "feeValue": 0.5,
                "merchantId": merchantId,
                "transactionId": transactionId,
                "feeCalculatedDateTime": feeEventCreatedDateTime
            },
            eventId:"290D1C47-86F0-496C-9567-8133066654F1"
        }
    },

    getContractCreatedEvent: function(estateId, contractId, operatorId, description)
    {
        return {
            eventType: 'ContractCreatedEvent',
            data: {
                "description": description,
                "estateId": estateId,
                "operatorId": operatorId,
                "contractId": contractId
            }	,
            metadata: {
            },
            eventId:"DC6AC333-11FB-4C55-B606-07C15938713B"
        }
    },

    getFixedValueProductAddedToContractEvent: function (estateId, contractId, productId, productName, displayText, value)
    {
        return {
            eventType: 'FixedValueProductAddedToContractEvent',
            data: {
                "contractId": contractId,
                "displayText": displayText,
                "estateId": estateId,
                "productId": productId,
                "productName": productName,
                "value": value
            },
            metadata: {
            },
            eventId:"71B1E356-0CCE-44BF-BEF7-F53857A8A374"
        }
    },

    getVariableValueProductAddedToContractEvent: function (estateId, contractId, productId, productName, displayText) {
        return {
            eventType: 'VariableValueProductAddedToContractEvent',
            data: {
                "contractId": contractId,
                "displayText": displayText,
                "estateId": estateId,
                "productId": productId,
                "productName": productName
            },
            metadata: {
            },
            eventId:"AC80EA38-1BB1-44FD-975E-AE9AE45FFBD8"
        }
    },

    getTransactionFeeForProductAddedToContractEvent: function (estateId, contractId, productId, description, feeId, value) {
        return {
            eventType: 'TransactionFeeForProductAddedToContractEvent',
            data: {
                "contractId": contractId,
                "description": description,
                "estateId": estateId,
                "productId": productId,
                "transactionFeeId": feeId,
                "value": value
            }	,
            metadata: {
            },
            eventId:"D76CE0D1-56AF-49E1-817D-67941AE97205"
        }
    },

    getMerchantFeeAddedToTransactionEnrichedEvent: function (estateId, merchantId, transactionId, feeId, feeCalculatedDateTime, feeValue, calculatedValue){
        return {
            eventType: 'MerchantFeeAddedToTransactionEnrichedEvent',
            data: {
                "calculatedValue": calculatedValue,
                "feeCalculatedDateTime": feeCalculatedDateTime,
                "estateId": estateId,
                "feeId": feeId,
                "feeValue": feeValue,
                "merchantId": merchantId,
                "transactionId": transactionId,
                "eventId": "562f99ed-75b5-5b04-95e1-52d12c0433c0"
            },
            metadata: {
            },
            eventId:"AECA5F32-A8A1-4B68-BBF3-389A1C825D59"
        }
    },

    getVoucherGeneratedEvent: function(estateId, voucherId, transactionId, value,voucherCode)
    {
        return {
            eventType: 'VoucherGeneratedEvent',
            data: {
                "estateId": estateId,
                "transactionId": transactionId,
                "voucherId": voucherId,
                "operatorIdentifier": "Voucher",
                "value": value,
                "voucherCode": voucherCode,
                "expiryDateTime": "2021-06-27T05:57:38.3695404+00:00",
                "generatedDateTime": "2021-05-28T05:57:38.3695404+00:00",
                "message": ""
            },
            metadata: {
            },
            eventId:"B589A8E3-2060-4072-B508-505AC8838FC2"
        }
    },

    getBarcodeAddedEvent: function (estateId, voucherId) {
        return {
            eventType: 'BarcodeAddedEvent',
            data: {
                "barcode": "iVBORw0KGgoAAAANSUhEUgAAALQAAABaCAYAAAARg3zAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAUZJREFUeJzt0ksKwjAAQMHG+9+5LqSggVpbceFjZpc2P8Iby7Ksy5N1fQzHGC/jzfZ9djRv7//Z/X91r7Pr99ZdfYer5377rvN5Z+fN5xzdd95nb92n587zb29vD39G0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiZF0KQImhRBkyJoUgRNiqBJETQpgiblDrLoSbOImTw4AAAAAElFTkSuQmCC",
                "estateId": estateId,
                "voucherId": voucherId
            },
            metadata: {
            },
            eventId:"841D45BE-0125-4AED-B7A7-C13251C75768"
        }
    },

    getVoucherIssuedEvent: function (estateId, voucherId) {
        return {
            eventType: 'VoucherIssuedEvent',
            data: {
                "estateId": estateId,
                "issuedDateTime": "2021-05-28T05:57:38.3695404+00:00",
                "recipientMobile": "1234567890",
                "voucherId": voucherId
            },
            metadata: {
            },
            eventId:"0A6ED40D-0C10-4ACE-B039-9854E55BD377"
        }
    },

    getImportLogCreatedEvent: function (estateId, fileImportLogId)
    {
        return {
            eventType: 'ImportLogCreatedEvent',
            data: {
                "estateId": estateId,
                "fileImportLogId": fileImportLogId,
                "importLogDateTime": "2021-06-01T11:08:04.059497+00:00"
            },
            metadata: {
            },
            eventId:"9619BDC6-E778-48D0-AE49-4450371E11CE"
        }
    },

    getFileAddedToImportLogEvent: function (estateId, merchantId, userId, fileId, fileImportLogId, fileProfileId) {
        return {
            eventType: 'FileAddedToImportLogEvent',
            data: {
                "estateId": estateId,
                "fileId": fileId,
                "fileImportLogId": fileImportLogId,
                "filePath": "/home/txnproc/bulkfiles/safaricom//9ea91bd839fd40a39e779957c8571887-9b0dafb3a79d40ed3af21943dc7f88ca",
                "fileProfileId": fileProfileId,
                "fileUploadedDateTime": "2021-06-01T11:08:04.0486043+00:00",
                "merchantId": merchantId,
                "originalFileName": "Safaricom -2021-05-31-00-00-00",
                "userId": userId
            },
            metadata: {
            },
            eventId:"E7258128-8C2B-4E16-80D1-FD05EBE9D665"
        }
    },

    getFileCreatedEvent: function(estateId, merchantId, userId, fileId, fileImportLogId, fileProfileId)
    {
        return {
            eventType: 'FileCreatedEvent',
            data: {
                "estateId": estateId,
                "fileId": fileId,
                "fileImportLogId": fileImportLogId,
                "filePath": "/home/txnproc/bulkfiles/safaricom//9ea91bd839fd40a39e779957c8571887-9b0dafb3a79d40ed3af21943dc7f88ca",
                "fileProfileId": fileProfileId,
                "fileReceivedDateTime": "2021-06-01T11:08:04.0486043+00:00",
                "merchantId": merchantId,
                "userId": userId
            },
            metadata: {
            },
            eventId:"85F594ED-FD93-4FD0-8C78-53AEE0A54195"
        }
    },

    getFileLineAddedEvent: function (estateId, fileId, lineNumber)
    {
        return {
            eventType: 'FileLineAddedEvent',
            data: {
                "estateId": estateId,
                "fileId": fileId,
                "fileLine": "H,2021-05-31-00-00-00\r",
                "lineNumber": lineNumber
            },
            metadata: {
            },
            eventId:"D1309600-5F42-4E25-A7C0-F0800AF0E006"
        }
    },

    getFileLineProcessingSuccessfulEvent: function (estateId, fileId, lineNumber,transactionId)
    {
        return {
            eventType: 'FileLineProcessingSuccessfulEvent',
            data: {
                "estateId": estateId,
                "fileId": fileId,
                "lineNumber": lineNumber,
                "transactionId": transactionId
            },
            metadata: {
            },
            eventId:"55D0E995-2586-4086-8BBE-E73C58F99966"
        }
    },

    getFileLineProcessingIgnoredEvent: function (estateId, fileId, lineNumber) {
        return {
            eventType: 'FileLineProcessingIgnoredEvent',
            data: {
                "estateId": estateId,
                "fileId": fileId,
                "lineNumber": lineNumber
            },
            metadata: {
            },
            eventId:"524BB70A-71DC-4E87-8A8E-40EC623EDC15"
        }
    },

    getFileLineProcessingFailedEvent: function (estateId, fileId, lineNumber, transactionId) {
        return {
            eventType: 'FileLineProcessingFailedEvent',
            data: {
                "estateId": estateId,
                "fileId": fileId,
                "lineNumber": lineNumber,
                "transactionId": transactionId,
                "responseCode": "1010",
                "responseMessage": ""
            },
            metadata: {
            },
            eventId:"041A71E1-3268-4EBF-A25C-523C54235D0B"
        }
    },

    getFileProcessingCompletedEvent: function (estateId, fileId) {
        return {
            eventType: 'FileProcessingCompletedEvent',
            data: {
                "estateId": estateId,
                "fileId": fileId,
                "processingCompletedDateTime": "2021-06-01T11:08:04.0486043+00:00",
            },
            metadata: {
            },
            eventId:"02A5FB46-6A6B-48A0-B3E2-D2C46999ABF5"
        }
    },
    
    getCustomerEmailReceiptRequestedEvent: function (estateId, merchantId, transactionId, customerEmailAddress)
    {
        return {
            eventType: 'CustomerEmailReceiptRequestedEvent',
            data: {
                "estateId": estateId,
                "merchantId": merchantId,
                "transactionId": transactionId,
                "customerEmailAddress": customerEmailAddress
            },
            metadata: {
            },
            eventId: "6CCD33B7-07D5-4545-AD84-E0752743A5D2"
        }
    },

    getCallbackReceivedEvent: function (destination, estateReference, merchantReference)
    {
        var reference = estateReference + "-" + merchantReference;
        console.log(reference);
        return {
            eventType: 'CallbackReceivedEvent',

            data: {
                "typeString": "CallbackHandler.Controllers.Deposit",
                "messageFormat": 1,
                "callbackMessage":
                    "{\"account_number\":\"12345678\",\"amount\":100.00,\"date_time\":\"2021-10-18T06:48:00Z\",\"deposit_id\":\"5cbbcbdd-3d21-4078-b08b-3dcf607253d9\",\"host_identifier\":\"5cbbcbdd-3d21-4078-b08b-3dcf607253d9\",\"reference\":\"1-1\",\"sort_code\":\"123456\"}",
                "destination": destination,
                "reference": reference
            },
            metadata: {

            },
            eventId: "AD762308-D055-4A2F-A4AC-44CC6B0DDA40"
        };
    },

};