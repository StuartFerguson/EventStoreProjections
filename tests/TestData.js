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
            eventType: 'EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
            data: {
                "$type":
                    "EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent, EstateManagement.Merchant.DomainEvents",
                "DateCreated": "2020-05-26T16:01:47.0310853+00:00",
                "EstateId": estateId,
                "MerchantId": merchantId,
                "MerchantName": merchantName,
                "AggregateId": merchantId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-05-26T16:01:47.0310913+00:00"
            },
            metadata: {
                "$type":
                    "<>f__AnonymousType0`2[[System.Guid, System.Private.CoreLib],[System.Guid, System.Private.CoreLib]], EstateManagement.MerchantAggregate",
                "EstateId": estateId,
                "MerchantId": merchantId
            }
        };
    },

    getAddressAddedEvent: function (estateId, merchantId) {
        return {
            eventType: 'EstateManagement.Merchant.DomainEvents.AddressAddedEvent',
            data: {
                "$type": "EstateManagement.Merchant.DomainEvents.AddressAddedEvent, EstateManagement.Merchant.DomainEvents",
                "AddressId": "7ccd0921-41b8-4780-b347-bb45348dcc67",
                "AddressLine1": "test address line 1",
                "AddressLine2": null,
                "AddressLine3": null,
                "AddressLine4": null,
                "Country": "United Kingdom",
                "EstateId": estateId,
                "MerchantId": merchantId,
                "PostalCode": null,
                "Region": "Region",
                "Town": "MyTown",
                "AggregateId": merchantId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-11-10T18:11:38.2197973+00:00"
            },
            metadata: {
                "$type":
                    "<>f__AnonymousType0`2[[System.Guid, System.Private.CoreLib],[System.Guid, System.Private.CoreLib]], EstateManagement.MerchantAggregate",
                "EstateId": estateId,
                "MerchantId": merchantId
            }
        };
    },

    getContactAddedEvent: function (estateId, merchantId) {
        return {
            eventType: 'EstateManagement.Merchant.DomainEvents.ContactAddedEvent',
            data: {
                "$type": "EstateManagement.Merchant.DomainEvents.ContactAddedEvent, EstateManagement.Merchant.DomainEvents",
                "ContactEmailAddress": "testcontact@emulatormerchant.co.uk",
                "ContactId": "4fe7c5d6-b83e-4199-bbc4-60166652a889",
                "ContactName": "Test Contact",
                "ContactPhoneNumber": null,
                "EstateId": estateId,
                "MerchantId": merchantId,
                "AggregateId": merchantId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-11-10T18:11:38.2225649+00:00"
            },
            metadata: {
                "$type":
                    "<>f__AnonymousType0`2[[System.Guid, System.Private.CoreLib],[System.Guid, System.Private.CoreLib]], EstateManagement.MerchantAggregate",
                "EstateId": estateId,
                "MerchantId": merchantId
            }
        };
    },

    getOperatorAssignedToMerchantEvent: function (estateId, merchantId, operatorId, operatorName,merchantNumber, terminalNumber) {
        return {
            eventType: 'EstateManagement.Merchant.DomainEvents.OperatorAssignedToMerchantEvent',
            data: {
                "$type": "EstateManagement.Merchant.DomainEvents.OperatorAssignedToMerchantEvent, EstateManagement.Merchant.DomainEvents",
                "EstateId": estateId,
                "MerchantId": merchantId,
                "MerchantNumber": merchantNumber,
                "Name": operatorName,
                "OperatorId": "410c55fd-9eef-462d-9267-3649c7dedbff",
                "TerminalNumber": terminalNumber,
                "AggregateId": merchantId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-11-10T18:16:13.3097526+00:00"
            },
            metadata: {
                "$type":
                    "<>f__AnonymousType0`2[[System.Guid, System.Private.CoreLib],[System.Guid, System.Private.CoreLib]], EstateManagement.MerchantAggregate",
                "EstateId": estateId,
                "MerchantId": merchantId
            }
        };
    },

    getSecurityUserAddedEvent: function (estateId, merchantId, securityUserId, emailAddress) {
        return {
            eventType: 'EstateManagement.Merchant.DomainEvents.SecurityUserAddedEvent',
            data: {
                "$type": "EstateManagement.Merchant.DomainEvents.SecurityUserAddedEvent, EstateManagement.Merchant.DomainEvents",
                "EmailAddress": emailAddress,
                "EstateId": estateId,
                "MerchantId": merchantId,
                "SecurityUserId": securityUserId,
                "AggregateId": merchantId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-11-10T18:17:16.3060575+00:00"
            },
            metadata: {
                "$type":
                    "<>f__AnonymousType0`2[[System.Guid, System.Private.CoreLib],[System.Guid, System.Private.CoreLib]], EstateManagement.MerchantAggregate",
                "EstateId": estateId,
                "MerchantId": merchantId
            }
        };
    },

    getManualDepositMadeEventWithoutMerchantId: function (estateId, merchantId, depositDateTime, depositAmount) {
        return {
            eventType: 'EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            data: {
                "$type": "EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent, EstateManagement.Merchant.DomainEvents",
                "EstateId": estateId,
                "DepositId": "3d33ae52-9517-43fe-b7a3-c9db99a0e36c",
                "Reference": "first test deposit",
                "DepositDateTime": depositDateTime,
                "Amount": depositAmount,
                "AggregateId": merchantId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-05-30T07:25:16.1932531+01:00"
            },
            metadata: {
                "$type":
                    "<>f__AnonymousType0`2[[System.Guid, System.Private.CoreLib],[System.Guid, System.Private.CoreLib]], EstateManagement.MerchantAggregate",
                "EstateId": estateId,
                "MerchantId": merchantId
            }
        }
    },

    getDeviceAddedToMerchantEvent: function (estateId, merchantId, deviceId, deviceIdentifier)
    {
        return {
            eventType: 'EstateManagement.Merchant.DomainEvents.DeviceAddedToMerchantEvent',
            data: {
                "$type":
                    "EstateManagement.Merchant.DomainEvents.DeviceAddedToMerchantEvent, EstateManagement.Merchant.DomainEvents",
                "DeviceId": deviceId,
                "DeviceIdentifier": deviceIdentifier,
                "EstateId": estateId,
                "MerchantId": merchantId,
                "AggregateId": merchantId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-11-10T18:17:52.2591669+00:00"
            },
            metadata: {
                "$type":
                    "<>f__AnonymousType0`2[[System.Guid, System.Private.CoreLib],[System.Guid, System.Private.CoreLib]], EstateManagement.MerchantAggregate",
                "EstateId": estateId,
                "MerchantId": merchantId
            }
        }
    },

    getManualDepositMadeEvent: function (estateId, merchantId, depositDateTime, depositAmount)
    {
        return {
            eventType: 'EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
            data: {
                "$type": "EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent, EstateManagement.Merchant.DomainEvents",
                "EstateId": estateId,
                "MerchantId": merchantId,
                "DepositId": "3d33ae52-9517-43fe-b7a3-c9db99a0e36c",
                "Reference": "first test deposit",
                "DepositDateTime": depositDateTime,
                "Amount": depositAmount,
                "AggregateId": merchantId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-05-30T07:25:16.1932531+01:00"
            },
            metadata: {
                "$type":
                    "<>f__AnonymousType0`2[[System.Guid, System.Private.CoreLib],[System.Guid, System.Private.CoreLib]], EstateManagement.MerchantAggregate",
                "EstateId": estateId,
                "MerchantId": merchantId
            }
        }
    },

    getTransactionHasStartedEvent: function(estateId, merchantId, transactionId, transactionAmount, transactionType)
    {
        return {
            eventType: 'TransactionProcessor.Transaction.DomainEvents.TransactionHasStartedEvent',
            data: {
                "$type": "TransactionProcessor.Transaction.DomainEvents.TransactionHasStartedEvent, TransactionProcessor.Transaction.DomainEvents",
                "EstateId": estateId,
                "DeviceIdentifier": "ce11160bbd98480601",
                "MerchantId": merchantId,
                "TransactionDateTime": "2020-05-16T07:47:50.160628Z",
                "TransactionId": transactionId,
                "TransactionNumber": "1",
                "TransactionType": transactionType,
                "TransactionReference": "b62b046631dcab",
                "AggregateId": transactionId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-05-16T07:47:50.2160246+00:00",
                "TransactionAmount": transactionAmount
            },
            metadata: {
                "$type": "<>f__AnonymousType0`1[[System.Guid, System.Private.CoreLib]], TransactionProcessor.TransactionAggregate",
                "EstateId": estateId
            }	
        }
    },

    getProductDetailsAddedToTransactionEvent: function(estateId, merchantId, transactionId, contractId, productId)
    {
        return {
            eventType: 'TransactionProcessor.Transaction.DomainEvents.ProductDetailsAddedToTransactionEvent',
            data: {
                "$type": "TransactionProcessor.Transaction.DomainEvents.ProductDetailsAddedToTransactionEvent, TransactionProcessor.Transaction.DomainEvents",
                "ContractId": contractId,
                "EstateId": estateId,
                "MerchantId": merchantId,
                "ProductId": productId,
                "TransactionId": transactionId,
                "EventId": generateEventId(),
                "AggregateId": transactionId,
                "EventCreatedDateTime": "2020-11-11T16:29:51.6635007+00:00"
            }	,
            metadata: {
                "$type": "<>f__AnonymousType0`1[[System.Guid, System.Private.CoreLib]], TransactionProcessor.TransactionAggregate",
                "EstateId": estateId
            }
        }
    },

    getAdditionalRequestDataRecordedEvent: function (estateId, merchantId, transactionId, transactionAmount, customerAccountNumber) {
        return {
            eventType: 'TransactionProcessor.Transaction.DomainEvents.AdditionalRequestDataRecordedEvent',
            data: {
                "$type": "TransactionProcessor.Transaction.DomainEvents.AdditionalRequestDataRecordedEvent, TransactionProcessor.Transaction.DomainEvents",
                "AdditionalTransactionRequestMetadata": {
                    "$type": "System.Collections.Generic.Dictionary`2[[System.String, System.Private.CoreLib],[System.String, System.Private.CoreLib]], System.Private.CoreLib",
                    "Amount": transactionAmount.toString(),
                    "CustomerAccountNumber": customerAccountNumber
                },
                "EstateId": estateId,
                "MerchantId": merchantId,
                "OperatorIdentifier": "Safaricom",
                "TransactionId": transactionId,
                "AggregateId": transactionId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-11-11T16:29:51.714202+00:00"
            },
            metadata: {
                "$type": "<>f__AnonymousType0`1[[System.Guid, System.Private.CoreLib]], TransactionProcessor.TransactionAggregate",
                "EstateId": estateId
            }
        }
    },

    getTransactionHasBeenLocallyAuthorisedEvent: function(estateId, merchantId, transactionId)
    {
        return {
            eventType: 'TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenLocallyAuthorisedEvent',
            data: {
                "$type": "TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenLocallyAuthorisedEvent, TransactionProcessor.Transaction.DomainEvents",
                "AuthorisationCode": "ABCD1234",
                "EstateId": estateId,
                "MerchantId": merchantId,
                "ResponseCode": "0000",
                "ResponseMessage": "SUCCESS",
                "TransactionId": transactionId,
                "AggregateId": transactionId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-11-11T11:16:54.2243331+00:00"
            },
            metadata: {
                "$type": "<>f__AnonymousType0`1[[System.Guid, System.Private.CoreLib]], TransactionProcessor.TransactionAggregate",
                "EstateId": estateId
            }
        }
    },

    getTransactionHasBeenLocallyDeclinedEvent: function (estateId, merchantId, transactionId) {
        return {
            eventType: 'TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenLocallyDeclinedEvent',
            data: {
                "$type": "TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenLocallyDeclinedEvent, TransactionProcessor.Transaction.DomainEvents",
                "EstateId": estateId,
                "MerchantId": merchantId,
                "ResponseCode": "1009",
                "ResponseMessage": "Merchant [Emulator Merchant] does not have enough credit available [0.0] to perform transaction amount [100.00]",
                "TransactionId": transactionId,
                "AggregateId": transactionId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-05-16T07:47:51.6617562+00:00"
            },
            metadata: {
                "$type": "<>f__AnonymousType0`1[[System.Guid, System.Private.CoreLib]], TransactionProcessor.TransactionAggregate",
                "EstateId": estateId
            }
        }
    },

    getTransactionAuthorisedByOperatorEvent: function (estateId, merchantId, transactionId) {
        return {
            eventType: 'TransactionProcessor.Transaction.DomainEvents.TransactionAuthorisedByOperatorEvent',
            data: {
                "$type": "TransactionProcessor.Transaction.DomainEvents.TransactionAuthorisedByOperatorEvent, TransactionProcessor.Transaction.DomainEvents",
                "AuthorisationCode": "ABCD1234",
                "EstateId": estateId,
                "MerchantId": merchantId,
                "OperatorIdentifier": "Safaricom",
                "OperatorResponseCode": "200",
                "OperatorResponseMessage": "Topup Successful",
                "OperatorTransactionId": null,
                "ResponseCode": "0000",
                "ResponseMessage": "SUCCESS",
                "TransactionId": transactionId,
                "AggregateId": transactionId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-11-11T11:16:55.7048259+00:00"
            },
            metadata: {
                "$type": "<>f__AnonymousType0`1[[System.Guid, System.Private.CoreLib]], TransactionProcessor.TransactionAggregate",
                "EstateId": estateId
            }
        }
    },

    getTransactionDeclinedByOperatorEvent: function (estateId, merchantId, transactionId) {
        return {
            eventType: 'TransactionProcessor.Transaction.DomainEvents.TransactionDeclinedByOperatorEvent',
            data: {
                "$type": "TransactionProcessor.Transaction.DomainEvents.TransactionDeclinedByOperatorEvent, TransactionProcessor.Transaction.DomainEvents",
                "EstateId": estateId,
                "MerchantId": merchantId,
                "OperatorIdentifier": "Safaricom",
                "OperatorResponseCode": "401",
                "OperatorResponseMessage": "Amount Greater than 25000",
                "ResponseCode": "1008",
                "ResponseMessage": "DECLINED BY OPERATOR",
                "TransactionId": transactionId,
                "AggregateId": transactionId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-11-11T11:16:58.017584+00:00"
            }	,
            metadata: {
                "$type": "<>f__AnonymousType0`1[[System.Guid, System.Private.CoreLib]], TransactionProcessor.TransactionAggregate",
                "EstateId": estateId
            }
        }
    },

    getTransactionHasBeenCompletedEvent: function(estateId, merchantId, transactionId, isAuthorised)
    {
        return {
            eventType: 'TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenCompletedEvent',
            data: {
                "$type": "TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenCompletedEvent, TransactionProcessor.Transaction.DomainEvents",
                "EstateId": estateId,
                "IsAuthorised": isAuthorised,
                "MerchantId": merchantId,
                "ResponseCode": "0000",
                "ResponseMessage": "SUCCESS",
                "TransactionId": transactionId,
                "AggregateId": transactionId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": "2020-05-16T07:47:51.6617562+00:00"
            },
            metadata: {
                "$type": "<>f__AnonymousType0`1[[System.Guid, System.Private.CoreLib]], TransactionProcessor.TransactionAggregate",
                "EstateId": estateId
            }
        }
    },
    
    getMerchantFeeAddedToTransactionEvent: function (estateId, merchantId, transactionId, calculatedValue, eventCreatedDateTime)
    {
        return {
            eventType: 'TransactionProcessor.Transaction.DomainEvents.MerchantFeeAddedToTransactionEvent',
            data: {
                "$type": "TransactionProcessor.Transaction.DomainEvents.MerchantFeeAddedToTransactionEvent, TransactionProcessor.Transaction.DomainEvents",
                "CalculatedValue": calculatedValue,
                "EstateId": estateId,
                "FeeCalculationType": 0,
                "FeeId": "cd858cbd-fafd-4f66-9eea-52c6ab1e5832",
                "FeeValue": 0.5,
                "MerchantId": merchantId,
                "TransactionId": transactionId,
                "AggregateId": transactionId,
                "EventId": generateEventId(),
                "EventCreatedDateTime": eventCreatedDateTime
            }					
        }
    }
};