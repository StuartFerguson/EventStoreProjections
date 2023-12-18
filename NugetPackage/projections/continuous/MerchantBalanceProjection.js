//starttestsetup
var fromAll = fromAll || require("../../../EventStoreProjections/node_modules/event-store-projection-testing-framework").scope.fromAll;
var partitionBy = partitionBy !== null ? partitionBy : require('../../node_modules/event-store-projection-testing').scope.partitionBy;
var linkTo = linkTo || require("../../../EventStoreProjections/node_modules/event-store-projection-testing-framework").scope.linkTo;
//endtestsetup

function createMerchantState(merchantId, merchantName){
    var merchant = {
        Id: merchantId,
        Name: merchantName,
        numberOfEventsProcessed: 1,
        balance: 0,
        deposits: {
            count: 0,
            value: 0,
            lastDeposit: null,
        },
        withdrawals: {
            count: 0,
            value: 0,
            lastWithdrawal: null
        },
        authorisedSales: {
            count: 0,
            value: 0,
            lastSale: null
        },
        declinedSales: {
            count: 0,
            value: 0,
            lastSale: null
        },
        fees: {
            count: 0,
            value: 0,
            lastFee: null
        }        
    };
    return merchant;
}

function isMerchantValid(s){
    if (s.merchant === null){
       return false;     
    }
    return true;
}

function HandleMerchantCreatedEvent(s,e){    
    if (s.merchant === null){
        var newMerchantState = createMerchantState(e.data.merchantId, e.data.merchantName);        
        s.merchant = newMerchantState;
    }    
}

function HandleDepositEvent(s,e){   
    if (isMerchantValid(s) == false)
        return;
    s.merchant.balance += e.data.amount;
    s.merchant.numberOfEventsProcessed++;
    s.merchant.deposits.count++;
    s.merchant.deposits.value += e.data.amount;
    s.merchant.deposits.lastDeposit = e.data.depositDateTime; // TODO: handle out of date events
}

function HandleWithdrawalMadeEvent(s,e){
    if (isMerchantValid(s) == false)
        return;
    s.merchant.balance -= e.data.amount;
    s.merchant.numberOfEventsProcessed++;
    s.merchant.withdrawals.count++;
    s.merchant.withdrawals.value += e.data.amount;
    s.merchant.withdrawals.lastWithdrawal = e.data.withdrawalDateTime;
}

function HandleTransactionHasBeenCompletedEvent(s,e){   
    if (isMerchantValid(s) == false)
        return;

    s.merchant.numberOfEventsProcessed++;
    
    // Filter out logons and reconciliations
    if(e.data.transactionAmount !== undefined){
        if (e.data.isAuthorised){
            s.merchant.balance -= e.data.transactionAmount;
            s.merchant.authorisedSales.count += 1;
            s.merchant.authorisedSales.value += e.data.transactionAmount;
            s.merchant.authorisedSales.lastSale = e.data.completedDateTime;
        }
        else{
            s.merchant.declinedSales.count++;
            s.merchant.declinedSales.value += e.data.transactionAmount;
            s.merchant.declinedSales.lastSale = e.data.completedDateTime;
        }        
    }
}

function HandleSettledMerchantFeeAddedToTransactionEvent(s,e){   
    if (isMerchantValid(s) == false)
        return;
    
    s.merchant.numberOfEventsProcessed++;    
    s.merchant.balance += e.data.calculatedValue;
    s.merchant.fees.count++;
    s.merchant.fees.value += e.data.calculatedValue;
    s.merchant.fees.lastFee = e.data.feeCalculatedDateTime;
}

fromAll()
    .partitionBy(function(e) {
        return "MerchantBalance-" + e.data.merchantId.replace(/-/gi, "")
    })
    .when({
        $init: function (s, e) {
            return { merchant: null }
        },
        "MerchantCreatedEvent": HandleMerchantCreatedEvent,
        "ManualDepositMadeEvent": HandleDepositEvent,
        "AutomaticDepositMadeEvent": HandleDepositEvent,
        "TransactionHasBeenCompletedEvent": HandleTransactionHasBeenCompletedEvent,
        "SettledMerchantFeeAddedToTransactionEvent": HandleSettledMerchantFeeAddedToTransactionEvent,
        "WithdrawalMadeEvent": HandleWithdrawalMadeEvent
    });