function generateEventId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
};

module.exports = {
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

    getSecurityUserAddedEvent: function (estateId, merchantId, securityUserId, emailAddress) {
        return {
            eventType: 'SecurityUserAddedEvent',
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
    }
};