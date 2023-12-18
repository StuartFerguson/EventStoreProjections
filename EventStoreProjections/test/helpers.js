module.exports = {   
    createMerchantState: function(merchantId,merchantName, eventsProcessed,balance = 0,
        deposits = {count:0, value:0, lastDeposit: null}, 
        withdrawals = {
            count: 0,
            value: 0,
            lastWithdrawal: null
        },
        authorisedSales = {
            count: 0,
            value: 0,
            lastSale: null
        },
        declinedSales = {
            count: 0,
            value: 0,
            lastSale: null
        },
        fees = {
            count: 0,
            value: 0,
            lastFee: null
        }){
        var merchant = {
            Id: merchantId,
            Name: merchantName,
            numberOfEventsProcessed: eventsProcessed,
            balance: balance,
            deposits: deposits,
            withdrawals:withdrawals,
            authorisedSales:authorisedSales,
            declinedSales:declinedSales,
            fees: fees
        };

        return merchant;
    }
}