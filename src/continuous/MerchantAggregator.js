var fromAll = fromAll || require('../../node_modules/event-store-projection-testing').scope.fromAll;
var linkTo = linkTo || require('../../node_modules/event-store-projection-testing').scope.linkTo;

isValidEvent = function (e) {

    if (e) {
        if (e.data) {
            if (e.isJson) {
                if (e.eventType !== "$metadata") {
                    return true;
                }
            }
        }
    }

    return false;
};

getMerchantId = function (e) {
    return e.data.MerchantId;
};

fromAll()
    .when({
        $any: function (s, e) {
            //if (isValidEvent(e)) {
                var merchantId = getMerchantId(e);
                s.merchantId = merchantId;
                var streamName = "MerchantArchive-" + merchantId.replace(/-/gi, "");
                s.streamName = streamName;
                linkTo(streamName, e.eventType, e.data);
            //}
        }
    });