var fromStreams = fromStreams || require('../../node_modules/event-store-projection-testing').scope.fromStreams;
var emit = emit || require('../../node_modules/event-store-projection-testing').scope.emit;

class Merchant {
    constructor(id, name) {
        this.MerchantId = id;
        this.MerchantName = name;
        this.Balance = 0;
        this.LastDepositDateTime = null;
        this.LastSaleDateTime = null;
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

    getLastDepositDateTime() {
        return this.LastDepositDateTime;
    }

    getLastSaleDateTime() {
        return this.LastSaleDateTime;
    }

    incrementBalanceFromDeposit(amount, dateTime) {
        this.Balance += amount;
        // protect against events coming in out of order
        if (this.LastDepositDateTime === null || dateTime > this.LastDepositDateTime) {
            this.LastDepositDateTime = dateTime;
        }
    }

    decrementBalanceForSale(amount, dateTime) {
        this.Balance -= amount;
        if (this.LastSaleDateTime === null || dateTime > this.LastSaleDateTime) {
            this.LastSaleDateTime = dateTime;
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

var createBalanceUpdatedEvent = function (merchant) {
    return {
        type: 'EstateManagement.Merchant.DomainEvents.BalanceUpdatedEvent',
        data: {
            merchantId: merchant.getMerchantId(),
            balance: merchant.getBalance(),
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
    '$et-EstateManagement.Merchant.DomainEvents.ManualDepositMadeEvent')
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