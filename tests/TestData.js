module.exports = {
    getMerchantCreatedEvent: function()
    {
        return {
            eventType: 'EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
            data: {
                "$type":
                    "EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent, EstateManagement.Merchant.DomainEvents",
                "DateCreated": "2020-05-26T16:01:47.0310853+00:00",
                "EstateId": "2af2dab2-86d6-44e3-bcf8-51bec65cf8bc",
                "MerchantId": "b86a3167-e001-49a9-9f77-6cedccef69c8",
                "MerchantName": "Test Merchant 6",
                "AggregateId": "b86a3167-e001-49a9-9f77-6cedccef69c8",
                "EventId": "63486afb-3fcc-4dff-8195-229ea6e838cf",
                "EventCreatedDateTime": "2020-05-26T16:01:47.0310913+00:00"
            },
            metadata: {
                "$type":
                    "<>f__AnonymousType0`2[[System.Guid, System.Private.CoreLib],[System.Guid, System.Private.CoreLib]], EstateManagement.MerchantAggregate",
                "EstateId": "2af2dab2-86d6-44e3-bcf8-51bec65cf8bc",
                "MerchantId": "b86a3167-e001-49a9-9f77-6cedccef69c8"
            }
        };
    }
};