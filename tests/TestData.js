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
    }
};