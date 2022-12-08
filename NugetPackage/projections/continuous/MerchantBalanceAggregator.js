//starttestsetup
var fromAll = fromAll || require("../../../EventStoreProjections/node_modules/@transactionprocessing/esprojection-testing-framework").scope.fromAll;
var linkTo = linkTo || require("../../../EventStoreProjections/node_modules/@transactionprocessing/esprojection-testing-framework").scope.linkTo;
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

isEventSupported = function (e) {
    if (e.eventType == "MerchantCreatedEvent" ||
        e.eventType === "ManualDepositMadeEvent" ||
        e.eventType === "AutomaticDepositMadeEvent" ||
        e.eventType === "TransactionHasStartedEvent" ||
        e.eventType === "TransactionHasBeenCompletedEvent" ||
        e.eventType === "MerchantFeeAddedToTransactionEvent" ||
        e.eventType === "WithdrawalMadeEvent") {
        return true;
    }
    return false;
}

fromAll()
    .when({
        $any: function (s, e) {
            if (isValidEvent(e)) {
                var merchantId = getMerchantId(e);
                if (merchantId !== null) {
                    {
                        if (isEventSupported(e)) {
                            var streamName = "MerchantBalanceArchive-" + merchantId.replace(/-/gi, "");
                            linkTo(streamName, e);
                        }
                    }
                }
            }
        }
    });