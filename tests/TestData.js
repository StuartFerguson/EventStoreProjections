function generateEventId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
};

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

            }
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
            }
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
            }
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
                
            }
        };
    },

    getAddressAddedEvent: function (estateId, merchantId) {
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
            }	,
            metadata: {
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }	
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }					
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
        }
    }



};