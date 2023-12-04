//starttestsetup
var fromAll = fromAll || require("../../../EventStoreProjections/node_modules/event-store-projection-testing-framework").scope.fromAll;
var linkTo = linkTo || require("../../../EventStoreProjections/node_modules/event-store-projection-testing-framework").scope.linkTo;
//endtestsetup

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
    if (e.data.merchantId === undefined) {
        return null;
    }
    return e.data.merchantId;
};

fromAll()
    .when({
        $any: function (s, e) {
            if (isValidEvent(e)) {
                var merchantId = getMerchantId(e);
                if (merchantId !== null) {
                    var streamName = "MerchantArchive-" + merchantId.replace(/-/gi, "");
                    linkTo(streamName, e);
                }
            }
        }
    });