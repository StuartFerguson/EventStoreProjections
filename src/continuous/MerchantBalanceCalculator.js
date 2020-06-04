var fromStreams = fromStreams || require('../../node_modules/event-store-projection-testing').scope.fromStreams;
var emit = emit || require('../../node_modules/event-store-projection-testing').scope.emit;

class Merchant {
    constructor(id, name) {
        this.MerchantId = id;
        this.MerchantName = name;
        this.AvailableBalance = 0;
        this.Balance = 0;
        this.LastDepositDateTime = null;
        this.LastSaleDateTime = null;
        this.PendingBalanceUpdates = [];
    }

    getMerchantId() {
        return this.MerchantId;
    }

    getMerchantName() {
        return this.MerchantName;
    }

    getBalance() {
        return this.Balance;
    }

    getAvailableBalance() {
        return this.AvailableBalance;
    }

    getLastDepositDateTime() {
        return this.LastDepositDateTime;
    }

    getLastSaleDateTime() {
        return this.LastSaleDateTime;
    }

    incrementBalanceFromDeposit(amount, dateTime) {
        this.Balance += amount;
        this.AvailableBalance += amount;
        // protect against events coming in out of order
        if (this.LastDepositDateTime === null || dateTime > this.LastDepositDateTime) {
            this.LastDepositDateTime = dateTime;
        }
    }

    addPendingBalanceUpdate(amount, transactionId, dateTime)
    {
        this.AvailableBalance -= amount;
        this.PendingBalanceUpdates[transactionId] = {
            Amount: amount,
            TransactionId: transactionId
        };
        // protect against events coming in out of order
        if (this.LastSaleDateTime === null || dateTime > this.LastSaleDateTime) {
            this.LastSaleDateTime = dateTime;
        }
    }

    decrementBalanceForSale(transactionId, isAuthorised)
    {
        // lookup the balance update
        var balanceUpdate = this.PendingBalanceUpdates[transactionId];

        if (balanceUpdate !== undefined)
        {
            if (isAuthorised)
            {
                this.Balance -= balanceUpdate.Amount;
            }
            else
            {
                this.AvailableBalance += balanceUpdate.Amount;
            }

            delete this.PendingBalanceUpdates[transactionId];
        }
    }
}

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
    }
}

var merchantCreatedEventHandler = function (s, e) {
    var merchantId = getMerchantIdFromEvent(e);

    if (s.merchants[merchantId] === undefined) {
        let merchant = new Merchant(merchantId, e.data.MerchantName);
        s.merchants[merchantId] = merchant;
    }
}

var depositMadeEventHandler = function (s, e) {
    var merchantId = getMerchantIdFromEvent(e);
    var merchant = s.merchants[merchantId];

    merchant.incrementBalanceFromDeposit(e.data.Amount, e.data.DepositDateTime);
    var event = createBalanceUpdatedEvent(merchant);

    emit("MerchantBalanceHistory-" + merchantId.replace(/-/gi, ""),
        event.type,
        event.data,
        event.metadata);
}

var transactionHasStartedEventHandler = function(s, e)
{
    // Add this to a pending balance update list
    var merchantId = getMerchantIdFromEvent(e);
    var merchant = s.merchants[merchantId];

    merchant.addPendingBalanceUpdate(e.data.TransactionAmount, e.data.TransactionId, e.data.TransactionDateTime);
}

var transactionHasCompletedEventHandler = function(s, e)
{
    // Add this to a pending balance update list
    var merchantId = getMerchantIdFromEvent(e);
    var merchant = s.merchants[merchantId];

    merchant.decrementBalanceForSale(e.data.TransactionId, e.data.IsAuthorised);
}

var createBalanceUpdatedEvent = function (merchant) {
    return {
        type: 'EstateManagement.Merchant.DomainEvents.BalanceUpdatedEvent',
        data: {
            merchantId: merchant.getMerchantId(),
            balance: merchant.getBalance(),
            availableBalance: merchant.getAvailableBalance(),
            lastSaleDate: merchant.getLastSaleDateTime(),
            lastDepositDate: merchant.getLastDepositDateTime()
        },
        metadata: {}
    }
}

var getMerchantIdFromEvent = function (e) {
    if (e.data.MerchantId !== undefined && e.data.MerchantId !== null)
        return e.data.MerchantId;

    return e.data.AggregateId;
}

fromStreams('$et-EstateManagement.Merchant.DomainEvents.MerchantCreatedEvent',
    '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent',
    '$et-TransactionProcessor.Transaction.DomainEvents.TransactionHasStartedEvent',
    '$et-TransactionProcessor.Transaction.DomainEvents.TransactionHasBeenCompletedEvent')
    .when({
        $init: function (s, e) {
            return {
                merchants: {},
                debug: []
            };
        },

        $any: function (s, e) {

            if (e === null || e.data === null || e.data.IsJson === false)
                return;

            eventbus.dispatch(s, e);
        }
    });