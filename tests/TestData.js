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
                "EventId": "63486afb-3fcc-4dff-8195-229ea6e838cf",
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
                "EventId": "2796cfeb-7800-4091-b57c-e07f93bde7ec",
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
                "EventId": "c98179d1-0c4d-4b0d-a5a9-2469e02563bc",
                "EventCreatedDateTime": "2020-05-16T07:47:50.2160246+00:00",
                "TransactionAmount": transactionAmount
            },
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
                "EventId": "5d7aba66-390c-4044-9aae-a298c2b367be",
                "EventCreatedDateTime": "2020-05-16T07:47:51.6617562+00:00"
            },
            metadata: {
                "$type": "<>f__AnonymousType0`1[[System.Guid, System.Private.CoreLib]], TransactionProcessor.TransactionAggregate",
                "EstateId": estateId
            }
        }
    }
};