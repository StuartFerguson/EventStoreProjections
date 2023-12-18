var testData = require('./TestData.js');
var helpers = require('./helpers.js');
testData.clearRequireCache();

require('../../NugetPackage/projections/continuous/MerchantBalanceProjection.js');
var projection = require('event-store-projection-testing-framework');
var chai = require("chai");

describe('Merchant Balance Projection Tests', function () {
    it('Merchant State initialised on Merchant Created Event', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, "Test Merchant 1");

        projection.processEvent("MerchantAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8",
                                merchantCreatedEvent.eventType,
                                merchantCreatedEvent.data);                                                   

        var projectionState = projection.getState();
        
        chai.expect(projectionState).to.not.be.null;
        chai.expect(projectionState.merchant).to.not.be.null;

        var merchant = projectionState.merchant;
        
        chai.expect(merchant.numberOfEventsProcessed).equal(1);
        chai.expect(merchant.Id).equal(merchantCreatedEvent.data.merchantId);
        chai.expect(merchant.Name).equal(merchantCreatedEvent.data.merchantName);
        chai.expect(merchant.balance).equal(0);
        // Deposits
        chai.expect(merchant.deposits.count).equal(0);
        chai.expect(merchant.deposits.value).equal(0);
        chai.expect(merchant.deposits.lastDeposit).equal(null);
        // withdrawals
        chai.expect(merchant.withdrawals.count).equal(0);
        chai.expect(merchant.withdrawals.value).equal(0);
        chai.expect(merchant.withdrawals.lastWithdrawal).equal(null);
        // authorisedSales
        chai.expect(merchant.authorisedSales.count).equal(0);
        chai.expect(merchant.authorisedSales.value).equal(0);
        chai.expect(merchant.authorisedSales.lastSale).equal(null);
        // Deposits
        chai.expect(merchant.declinedSales.count).equal(0);
        chai.expect(merchant.declinedSales.value).equal(0);
        chai.expect(merchant.declinedSales.lastSale).equal(null);
        // Fees
        chai.expect(merchant.fees.count).equal(0);
        chai.expect(merchant.fees.value).equal(0);
        chai.expect(merchant.fees.lastFee).equal(null);
    });

    it('Manual Deposit Increments Balances and Deposit Fields', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantName = "Test Merchant 1";

        var merchant = helpers.createMerchantState(merchantId, merchantName,1);
        var projectionState = {
            merchant: {}
        };
        
        projectionState.merchant = merchant;
        projection.setState(projectionState);

        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = 1000.00;
        var manualDepositMadeEvent =
            testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent("MerchantDepositListAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
        manualDepositMadeEvent.eventType,
        manualDepositMadeEvent.data
        );
      
        var projectionState = projection.getState();

        var merchant = projectionState.merchant;
        chai.expect(merchant.numberOfEventsProcessed).equal(2);
        chai.expect(merchant.balance).equal(depositAmount);        
        chai.expect(merchant.deposits.count).equal(1);
        chai.expect(merchant.deposits.value).equal(depositAmount);
        chai.expect(merchant.deposits.lastDeposit).equal(depositDateTime);
    });

    it('Automatic Deposit Increments Balances and Deposit Fields', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantName = "Test Merchant 1";

        var merchant = helpers.createMerchantState(merchantId, merchantName,1);
        var projectionState = {
            merchant: {}
        };
        
        projectionState.merchant = merchant;
        projection.setState(projectionState);

        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = 1000.00;
        var automaticDepositMadeEvent =
            testData.getAutomaticDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent("MerchantDepositListAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
        automaticDepositMadeEvent.eventType,
        automaticDepositMadeEvent.data
        );
      
        var projectionState = projection.getState();

        var merchant = projectionState.merchant;
        chai.expect(merchant.numberOfEventsProcessed).equal(2);
        chai.expect(merchant.balance).equal(depositAmount);        
        chai.expect(merchant.deposits.count).equal(1);
        chai.expect(merchant.deposits.value).equal(depositAmount);
        chai.expect(merchant.deposits.lastDeposit).equal(depositDateTime);
    })

    it('Transaction Completed Event decrements the balance for Sale', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantName = "Test Merchant 1";        
        var initialBalance = 100.00;

        var merchant = helpers.createMerchantState(merchantId, merchantName,2, initialBalance);
        var projectionState = {
            merchant: {}
        };
        
        projectionState.merchant = merchant;
        projection.setState(projectionState);

        var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var transactionAmount = 10.00;
        var transactionCompletedDateTime = '2023-11-01'
        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, transactionAmount, transactionCompletedDateTime); 

        projection.processEvent("TransactionAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
        transactionHasBeenCompletedEvent.eventType,
        transactionHasBeenCompletedEvent.data
            );

        var projectionState = projection.getState();

        var merchant = projectionState.merchant;

        chai.expect(merchant.numberOfEventsProcessed).equal(3);
        chai.expect(merchant.authorisedSales.count).equal(1);
        chai.expect(merchant.authorisedSales.value).equal(transactionAmount);
        chai.expect(merchant.authorisedSales.lastSale).equal(transactionCompletedDateTime);
        chai.expect(merchant.balance).equal(initialBalance  - transactionAmount);
    })

    it('Transaction Completed Event with no amount is ignored', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantName = "Test Merchant 1";        
        var initialBalance = 100.00;

        var merchant = helpers.createMerchantState(merchantId, merchantName,2, initialBalance);
        var projectionState = {
            merchant: {}
        };
        
        projectionState.merchant = merchant;
        projection.setState(projectionState);

        var transactionCompletedDateTime = '2023-11-01'
        var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var transactionAmount = undefined;

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, transactionAmount, transactionCompletedDateTime); 

        projection.processEvent("TransactionAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
        transactionHasBeenCompletedEvent.eventType,
        transactionHasBeenCompletedEvent.data);

        var projectionState = projection.getState();

        var merchant = projectionState.merchant;
        chai.expect(merchant.numberOfEventsProcessed).equal(3);
        chai.expect(merchant.authorisedSales.count).equal(0);
        chai.expect(merchant.authorisedSales.value).equal(0);
        chai.expect(merchant.authorisedSales.lastSale).equal(null);
        chai.expect(merchant.balance).equal(initialBalance);
    })

    it('Transaction Completed Event for declined sale does not affect balance', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantName = "Test Merchant 1";        
        var initialBalance = 100.00;

        var merchant = helpers.createMerchantState(merchantId, merchantName,2, initialBalance);
        var projectionState = {
            merchant: {}
        };
        
        projectionState.merchant = merchant;
        projection.setState(projectionState);

        var transactionCompletedDateTime = '2023-11-01'
        var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var transactionAmount = 10.00;

        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, false, transactionAmount, transactionCompletedDateTime); 

        projection.processEvent("TransactionAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
        transactionHasBeenCompletedEvent.eventType,
        transactionHasBeenCompletedEvent.data);

        var projectionState = projection.getState();

        var merchant = projectionState.merchant;
        chai.expect(merchant.numberOfEventsProcessed).equal(3);
        chai.expect(merchant.declinedSales.count).equal(1);
        chai.expect(merchant.declinedSales.value).equal(transactionAmount);
        chai.expect(merchant.declinedSales.lastSale).equal(transactionCompletedDateTime);
        chai.expect(merchant.balance).equal(initialBalance);
    })

    it('Merchant doesnt exist', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';

        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = 1000.00;
        var manualDepositMadeEvent =
            testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent("MerchantDepositListAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
        manualDepositMadeEvent.eventType,
        manualDepositMadeEvent.data
        );
      
        var projectionState = projection.getState();

        var merchant = projectionState.merchant;
        chai.expect(merchant).equal(null);    

        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = 1000.00;
        var automaticDepositMadeEvent =
            testData.getAutomaticDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);

        projection.processEvent("MerchantDepositListAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
        automaticDepositMadeEvent.eventType,
        automaticDepositMadeEvent.data
        );
      
        var projectionState = projection.getState();

        var merchant = projectionState.merchant;
        chai.expect(merchant).equal(null);    
      
        var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var transactionAmount = 10.00;
        var transactionCompletedDateTime = '2023-11-01'
        var transactionHasBeenCompletedEvent =
            testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, transactionAmount, transactionCompletedDateTime); 

        projection.processEvent("TransactionAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
        transactionHasBeenCompletedEvent.eventType,
        transactionHasBeenCompletedEvent.data
            );

        var projectionState = projection.getState();

        var merchant = projectionState.merchant;
        chai.expect(merchant).equal(null);    

        var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var calculatedValue = 5.00;
        var eventCreatedDateTime = "2020-05-16T07:47:51.6617562+00:00";
        var settledMerchantFeeAddedToTransactionEvent = testData.getSettledMerchantFeeAddedToTransactionEvent(estateId,
            merchantId,
            transactionId,
            calculatedValue,
            eventCreatedDateTime);

        projection.processEvent(
                'TransactionAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8',
                settledMerchantFeeAddedToTransactionEvent.eventType,
                settledMerchantFeeAddedToTransactionEvent.data);      

        var projectionState = projection.getState();

        var merchant = projectionState.merchant;
        chai.expect(merchant).equal(null);    

        var withdrawalDateTime = "2020-05-16T07:47:51.6617562+00:00";
        var withdrawalAmount= 50.00;

        var withdrawalMadeEvent =
            testData.getWithdrawalMadeEvent(estateId, merchantId, withdrawalDateTime, withdrawalAmount);

        projection.processEvent(
                'MerchantAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8',
                withdrawalMadeEvent.eventType,
                withdrawalMadeEvent.data);  

        var projectionState = projection.getState();

        var merchant = projectionState.merchant;
        chai.expect(merchant).equal(null);    
    })

    it('Settled Merchant Fee increments balance', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantName = "Test Merchant 1";        
        var initialBalance = 100.00;

        var merchant = helpers.createMerchantState(merchantId, merchantName,2, initialBalance);
        var projectionState = {
            merchant: {}
        };
        
        projectionState.merchant = merchant;
        projection.setState(projectionState);

        var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var calculatedValue = 5.00;
        var eventCreatedDateTime = "2020-05-16T07:47:51.6617562+00:00";
        var settledMerchantFeeAddedToTransactionEvent = testData.getSettledMerchantFeeAddedToTransactionEvent(estateId,
            merchantId,
            transactionId,
            calculatedValue,
            eventCreatedDateTime);

        projection.processEvent(
                'TransactionAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8',
                settledMerchantFeeAddedToTransactionEvent.eventType,
                settledMerchantFeeAddedToTransactionEvent.data);            

        var projectionState = projection.getState();
        var merchant = projectionState.merchant;
        chai.expect(merchant.numberOfEventsProcessed).equal(3);
        chai.expect(merchant.balance).equal(initialBalance + calculatedValue);                
        chai.expect(merchant.fees.count).equal(1);
        chai.expect(merchant.fees.value).equal(calculatedValue);
        chai.expect(merchant.fees.lastFee).equal(eventCreatedDateTime);
    });

    it('Withdrawal decrements balance', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantName = "Test Merchant 1";        
        var initialBalance = 100.00;

        var merchant = helpers.createMerchantState(merchantId, merchantName,2, initialBalance);
        var projectionState = {
            merchant: {}
        };
        
        projectionState.merchant = merchant;
        projection.setState(projectionState);
        
        var withdrawalDateTime = "2020-05-16T07:47:51.6617562+00:00";
        var withdrawalAmount= 50.00;

        var withdrawalMadeEvent =
            testData.getWithdrawalMadeEvent(estateId, merchantId, withdrawalDateTime, withdrawalAmount);

        projection.processEvent(
                'MerchantAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8',
                withdrawalMadeEvent.eventType,
                withdrawalMadeEvent.data);            

        var projectionState = projection.getState();
        var merchant = projectionState.merchant;
        chai.expect(merchant.numberOfEventsProcessed).equal(3);
        chai.expect(merchant.balance).equal(initialBalance - withdrawalAmount);                
        chai.expect(merchant.withdrawals.count).equal(1);
        chai.expect(merchant.withdrawals.value).equal(withdrawalAmount);
        chai.expect(merchant.withdrawals.lastWithdrawal).equal(withdrawalDateTime);
    });

    it('Projection performance test', function(){
        projection.initialize();

        var estateId = '3bf2dab2-86d6-44e3-bcf8-51bec65cf8bc';
        var merchantId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
        var merchantCreatedEvent = testData.getMerchantCreatedEvent(estateId, merchantId, "Test Merchant 1");

        projection.processEvent("MerchantAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8",
                                merchantCreatedEvent.eventType,
                                merchantCreatedEvent.data);

        var projectionState = projection.getState();
        chai.expect(projectionState.merchant.Id).equal(merchantId);

        var numberOfSales = 100000;
        var salesValues = [];
        var feeValues = [];
        var totalValue = 0;
        var totalFees = 0;
        for (let index = 0; index < numberOfSales; index++) {
            let result = index % 2
            if (result === 0){
                salesValues.push(10);
                feeValues.push(0.10);
                totalValue += 10;
                totalFees += 0.10;
            }
            else{
                salesValues.push(25.00);
                feeValues.push(0.25);
                totalValue += 25;
                totalFees += 0.25;
            }            
        }

        // Make a deposit
        var depositDateTime = '2020-05-30T06:21:31.356Z';
        var depositAmount = totalValue;
        var manualDepositMadeEvent =
            testData.getManualDepositMadeEvent(estateId, merchantId, depositDateTime, depositAmount);
            
        projection.processEvent("MerchantDepositListAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
            manualDepositMadeEvent.eventType,
            manualDepositMadeEvent.data);

            var projectionState = projection.getState();
            chai.expect(projectionState.merchant.balance).equal(totalValue);

        salesValues.forEach(element => {
            var transactionCompletedDateTime = '2023-11-01'
            var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
            var transactionAmount = element;

            var transactionHasBeenCompletedEvent =
                testData.getTransactionHasBeenCompletedEvent(estateId, merchantId, transactionId, true, transactionAmount, transactionCompletedDateTime); 
            
            projection.processEvent("TransactionAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8", 
            transactionHasBeenCompletedEvent.eventType,
            transactionHasBeenCompletedEvent.data);
        });

        var projectionState = projection.getState();        
        chai.expect(projectionState.merchant.balance).equal(0);

        feeValues.forEach(element => {
            var transactionId = 'c4c33d75-f011-40e4-9d97-1f428ab563d8';
            var calculatedValue = element;
            var eventCreatedDateTime = "2020-05-16T07:47:51.6617562+00:00";
            var settledMerchantFeeAddedToTransactionEvent = testData.getSettledMerchantFeeAddedToTransactionEvent(estateId,
            merchantId,
            transactionId,
            calculatedValue,
            eventCreatedDateTime);
            
            projection.processEvent(
                'TransactionAggregate-c4c33d75-f011-40e4-9d97-1f428ab563d8',
                settledMerchantFeeAddedToTransactionEvent.eventType,
                settledMerchantFeeAddedToTransactionEvent.data); 
        });
        
        var projectionState = projection.getState();
        chai.expect(projectionState.merchant.balance).equal(totalFees);        

        console.log("Done");
    });

});


