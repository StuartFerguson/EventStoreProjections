var fromCategory = fromCategory || require('../../node_modules/event-store-projection-testing').scope.fromCategory;
var partitionBy = partitionBy !== null ? partitionBy : require('../../node_modules/event-store-projection-testing').scope.partitionBy;
var emit = emit || require('../../node_modules/event-store-projection-testing').scope.emit;

fromCategory('MerchantArchive')
    .foreachStream()
    .when({
        $init: function()
        {
            return {
                availableBalance: 0,
                balance: 0,
                lastDepositDateTime: null,
                lastSaleDateTime: null,
                lastFeeProcessedDateTime: null,
                debug: [],
                totalDeposits: 0,
                totalAuthorisedSales: 0,
                totalDeclinedSales: 0,
                totalFees: 0
            }
        },
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

var decrementBalanceFromAuthorisedTransaction = function (s, amount) {
    s.balance = subtractTwoNumbers(s.balance, amount);
    s.totalAuthorisedSales = addTwoNumbers(s.totalAuthorisedSales, amount);
};

var incrementAvailableBalanceFromDeclinedTransaction = function (s, amount) {
    s.availableBalance = addTwoNumbers(s.availableBalance, amount);
    s.totalDeclinedSales = addTwoNumbers(s.totalDeclinedSales, amount);
};

var merchantCreatedEventHandler = function (s, e) {

    // Setup the state here
    s.estateId = e.data.EstateId;
    s.merchantId = e.data.MerchantId;
    s.merchantName = e.data.MerchantName;
};

var emitBalanceChangedEvent = function (aggregateId, eventId, s, changeAmount, dateTime, reference) {
    var balanceChangedEvent = {
        $type: getEventTypeName(),
        "aggregateId": aggregateId,
        "merchantId": s.merchantId,
        "estateId": s.estateId,
        "availableBalance": s.availableBalance,
        "balance": s.balance,
        "changeAmount": changeAmount,
        "eventId": eventId,
        "eventCreatedDateTime": dateTime,
        "reference": reference
    }

    // emit an balance changed event here
    emit(getStreamName(s), getEventType(), balanceChangedEvent);
};

var depositMadeEventHandler = function (s, e) {

    // Check if we have got a merchant id already set
    if (s.merchantId === undefined)
    {
        // We have obviously not got a created event yet but we must process this event,
        // so fill in what we can here
        s.estateId = e.data.EstateId;
        s.merchantId = e.data.MerchantId;
    }

    incrementBalanceFromDeposit(s, e.data.Amount, e.data.DepositDateTime);

    // emit an balance changed event here
    emitBalanceChangedEvent(e.data.AggregateId, e.data.EventId, s, e.data.Amount, e.data.DepositDateTime, "Merchant Deposit");
};

var transactionHasStartedEventHandler = function (s, e) {

    // Check if we have got a merchant id already set
    if (s.merchantId === undefined) {
        // We have obviously not got a created event yet but we must process this event,
        // so fill in what we can here
        e.estateId = e.data.EstateId;
        s.merchantId = e.data.MerchantId;
    }

    var amount = e.data.TransactionAmount;
    if (amount === undefined) {
        amount = 0;
    }
    decrementAvailableBalanceFromTransactionStarted(s, amount, e.data.TransactionDateTime);

    // emit an balance changed event here
    if (amount > 0)
    {
        // emit an balance changed event here
        emitBalanceChangedEvent(e.data.AggregateId, e.data.EventId, s, amount, e.data.TransactionDateTime, "Transaction Started");
    }
};

var transactionHasCompletedEventHandler = function (s, e) {

    // Check if we have got a merchant id already set
    if (s.merchantId === undefined) {
        // We have obviously not got a created event yet but we must process this event,
        // so fill in what we can here
        e.estateId = e.data.EstateId;
        s.merchantId = e.data.MerchantId;
    }

    var amount = e.data.TransactionAmount;
    if (amount === undefined) {
        amount = 0;
    }

    var transactionDateTime = new Date(Date.parse(e.data.CompletedDateTime));
    var completedTime = new Date(transactionDateTime.getFullYear(), transactionDateTime.getMonth(), transactionDateTime.getDate(), transactionDateTime.getHours(), transactionDateTime.getMinutes(), transactionDateTime.getSeconds() + 2);

    if (e.data.IsAuthorised) {
        decrementBalanceFromAuthorisedTransaction(s, amount, completedTime);
    }
    else {
        incrementAvailableBalanceFromDeclinedTransaction(s, amount, completedTime);
    }

    // emit an balance changed event here
    if (amount > 0)
    {
        emitBalanceChangedEvent(e.data.AggregateId, e.data.EventId, s, amount, completedTime, "Transaction Completed");
    }
};

var merchantFeeAddedToTransactionEventHandler = function (s, e) {

    // Check if we have got a merchant id already set
    if (s.merchantId === undefined) {
        // We have obviously not got a created event yet but we must process this event,
        // so fill in what we can here
        e.estateId = e.data.EstateId;
        s.merchantId = e.data.MerchantId;
    }

    // increment the balance now
    incrementBalanceFromMerchantFee(s, e.data.CalculatedValue, e.data.EventCreatedDateTime);

    // emit an balance changed event here
    emitBalanceChangedEvent(e.data.AggregateId, e.data.EventId, s, e.data.CalculatedValue, e.data.EventCreatedDateTime, "Transaction Fee Processed");
}

