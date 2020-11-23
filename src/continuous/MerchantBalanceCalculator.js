var fromCategory = fromCategory || require('../../node_modules/event-store-projection-testing').scope.fromCategory;
var partitionBy = partitionBy !== null ? partitionBy : require('../../node_modules/event-store-projection-testing').scope.partitionBy;
var emit = emit || require('../../node_modules/event-store-projection-testing').scope.emit;

fromCategory('MerchantArchive')
    .foreachStream()
    .when({
        $any: function (s, e) {

            if (e === null || e.data === null || e.data.IsJson === false)
                return;

            eventbus.dispatch(s, e);
        }
    });

var eventbus = {
    dispatch: function (s, e) {

        if (e.eventType === 'EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent') {
            merchantCreatedEventHandler(s, e);
            return;
        }

        if (e.eventType === 'EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent') {
            depositMadeEventHandler(s, e);
            return;
        }

        if (e.eventType === 'TransactionProcessor.Transaction.DomainEvents.TransactionHasStartedEvent') {
            transactionHasStartedEventHandler(s, e);
            return;
        }

        if (e.eventType === 'TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenCompletedEvent') {
            transactionHasCompletedEventHandler(s, e);
            return;
        }

        if (e.eventType === 'TransactionProcessor.Transaction.DomainEvents.MerchantFeeAddedToTransactionEvent') {
            merchantFeeAddedToTransactionEventHandler(s, e);
            return;
        }
    }
}

function getStreamName(s) {
    return "MerchantBalanceHistory-" + s.merchantId.replace(/-/gi, "");
}

function getEventTypeName() {
    return 'EstateReporting.BusinessLogic.Events.' + getEventType() + ', EstateReporting.BusinessLogic.Events';
}

function getEventType() { return "MerchantBalanceChangedEvent"; }

function generateEventId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

function addTwoNumbers(number1, number2) {
    return parseFloat((number1 + number2).toFixed(4));
}

function subtractTwoNumbers(number1, number2) {
    return parseFloat((number1 - number2).toFixed(4));
}

var incrementBalanceFromDeposit = function (s, amount, dateTime) {
    s.balance = addTwoNumbers(s.balance, amount);
    s.availableBalance = addTwoNumbers(s.availableBalance, amount);
    s.totalDeposits = addTwoNumbers(s.totalDeposits, amount);

    // protect against events coming in out of order
    if (s.lastDepositDateTime === null || dateTime > s.lastDepositDateTime) {
        s.lastDepositDateTime = dateTime;
    }
};

var incrementBalanceFromMerchantFee = function (s, amount, dateTime) {
    s.balance = addTwoNumbers(s.balance, amount);
    s.availableBalance = addTwoNumbers(s.availableBalance, amount);
    s.totalFees = addTwoNumbers(s.totalFees, amount);

    // protect against events coming in out of order
    if (s.lastFeeProcessedDateTime === null || dateTime > s.lastFeeProcessedDateTime) {
        s.lastFeeProcessedDateTime = dateTime;
    }
};

var decrementAvailableBalanceFromTransactionStarted = function (s, amount, dateTime) {
    s.availableBalance = subtractTwoNumbers(s.availableBalance, amount);

    // protect against events coming in out of order
    if (s.lastSaleDateTime === null || dateTime > s.lastSaleDateTime) {
        s.lastSaleDateTime = dateTime;
    }
};

var decrementBalanceFromAuthorisedTransaction = function (s, amount, dateTime) {
    s.balance = subtractTwoNumbers(s.balance, amount);
    s.totalAuthorisedSales = addTwoNumbers(s.totalAuthorisedSales, amount);
};

var incrementAvailableBalanceFromDeclinedTransaction = function (s, amount, dateTime) {
    s.availableBalance = addTwoNumbers(s.availableBalance, amount);
    s.totalDeclinedSales = addTwoNumbers(s.totalDeclinedSales, amount);
};

var merchantCreatedEventHandler = function (s, e) {

    // Setup the state here
    s.estateId = e.data.EstateId;
    s.merchantId = e.data.MerchantId;
    s.merchantName = e.data.MerchantName;
    s.availableBalance = 0;
    s.balance = 0;
    s.lastDepositDateTime = null;
    s.lastSaleDateTime = null;
    s.lastFeeProcessedDateTime = null;
    s.debug = [],
        s.totalDeposits = 0;
    s.totalAuthorisedSales = 0;
    s.totalDeclinedSales = 0;
    s.totalFees = 0;
    s.startedEvents = [];
};

var emitBalanceChangedEvent = function (s, changeAmount, dateTime, reference) {
    var balanceChangedEvent = {
        $type: getEventTypeName(),
        "aggregateId": s.merchantId,
        "merchantId": s.merchantId,
        "estateId": s.estateId,
        "availableBalance": s.availableBalance,
        "balance": s.balance,
        "changeAmount": changeAmount,
        "eventId": generateEventId(),
        "eventCreatedDateTime": dateTime,
        "reference": reference
    }

    // emit an balance changed event here
    emit(getStreamName(s), getEventType(), balanceChangedEvent);
};

var depositMadeEventHandler = function (s, e) {
    incrementBalanceFromDeposit(s, e.data.Amount, e.data.DepositDateTime);

    // emit an balance changed event here
    emitBalanceChangedEvent(s, e.data.Amount, e.data.DepositDateTime, "Merchant Deposit");
};

var transactionHasStartedEventHandler = function (s, e) {
    var amount = e.data.TransactionAmount;
    if (amount === undefined) {
        amount = 0;
    }
    decrementAvailableBalanceFromTransactionStarted(s, amount, e.data.TransactionDateTime);

    // emit an balance changed event here
    if (amount > 0)
    {
        // emit an balance changed event here
        emitBalanceChangedEvent(s, amount, e.data.TransactionDateTime, "Transaction Started");
    }

    s.startedEvents.push({
        transactionId: e.data.TransactionId,
        dateTime: e.data.TransactionDateTime
    });
};

var transactionHasCompletedEventHandler = function (s, e) {
    var amount = e.data.TransactionAmount;
    if (amount === undefined) {
        amount = 0;
    }

    // find the started event
    const index = s.startedEvents.findIndex((element, index) => {
        if (element.transactionId === e.data.transactionId) {
            return true;
        }
    });

    var startedEvents = s.startedEvents.filter(se => se.transactionId === e.data.TransactionId);
    var startedEvent = startedEvents[0];
    var startedTime = new Date(Date.parse(startedEvent.dateTime));

    var completedTime = new Date(startedTime.getFullYear(), startedTime.getMonth(), startedTime.getDate(), startedTime.getHours(), startedTime.getMinutes(), startedTime.getSeconds() + 2);

    if (e.data.IsAuthorised) {
        decrementBalanceFromAuthorisedTransaction(s, amount, completedTime);
    }
    else {
        incrementAvailableBalanceFromDeclinedTransaction(s, amount, completedTime);
    }

    // emit an balance changed event here
    if (amount > 0)
    {
        emitBalanceChangedEvent(s, amount, completedTime, "Transaction Completed");
    }

    s.startedEvents.splice(index);
    //console.log(s.startedEvents);
};

var merchantFeeAddedToTransactionEventHandler = function (s, e) {
    // increment the balance now
    incrementBalanceFromMerchantFee(s, e.data.CalculatedValue, e.data.EventCreatedDateTime);

    // emit an balance changed event here
    emitBalanceChangedEvent(s, e.data.CalculatedValue, e.data.EventCreatedDateTime, "Transaction Fee Processed");
}

