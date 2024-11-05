// Virtual Terminal Payment Application
// Note: This is a simplified version. Production implementation requires:
// - PCI DSS certification
// - VISA certification
// - Proper key management
// - Additional security measures

import React, { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Constants for transaction types
const TRANSACTION_TYPES = {
  SALE: '101',
  PREAUTH: '102',
  FORCE: '201',
  COMPLETION: '103'
};

// Mock VISA API service
class VisaApiService {
  static async processTransaction(transactionData) {
    // In production, this would interface with VISA's actual API
    // using proper encryption and authentication
    
    const {
      amount,
      currency,
      cardNumber,
      expiryDate,
      cvv,
      transactionType,
      pin,
      isCardPresent
    } = transactionData;

    // Implement proper encryption for sensitive data
    const encryptedCard = this.encryptData(cardNumber);
    const encryptedPin = this.encryptData(pin);

    // Format message according to VISA specifications
    const messageFormat = {
      header: {
        messageType: transactionType,
        transmissionDateTime: new Date().toISOString(),
        systemTraceNumber: this.generateTraceNumber(),
      },
      body: {
        amount,
        currency,
        card: encryptedCard,
        pin: encryptedPin,
        cardPresent: isCardPresent,
        terminalId: process.env.TERMINAL_ID,
        merchantId: process.env.MERCHANT_ID
      }
    };

    // In production, implement proper error handling
    // and response validation
    return await this.sendToVisa(messageFormat);
  }

  static encryptData(data) {
    // Implement proper encryption according to PCI standards
    return `encrypted_${data}`;
  }

  static generateTraceNumber() {
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  }

  static async sendToVisa(message) {
    // Mock response - in production, this would
    // actually communicate with VISA's servers
    return {
      responseCode: '00',
      authCode: '123456',
      referenceNumber: '789012',
      message: 'Approved'
    };
  }
}

// Main Terminal Component
const VirtualTerminal = () => {
  const [step, setStep] = useState(1);
  const [transactionData, setTransactionData] = useState({
    amount: '',
    currency: 'USD',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    pin: '',
    isCardPresent: false,
    transactionType: TRANSACTION_TYPES.SALE
  });
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      // Process the transaction
      const response = await VisaApiService.processTransaction(transactionData);
      
      // Generate receipt
      if (response.responseCode === '00') {
        setReceipt({
          ...transactionData,
          ...response,
          timestamp: new Date().toISOString()
        });
        setStep(4); // Move to receipt step
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // Handle error appropriately
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const printReceipt = () => {
    // Implement receipt printing logic
    window.print();
  };

  // Step 1: Amount and Currency
  const renderAmountStep = () => (
    <div className="space-y-4">
      <Input 
        type="number"
        name="amount"
        value={transactionData.amount}
        onChange={handleInputChange}
        placeholder="Enter Amount"
        required
      />
      <select
        name="currency"
        value={transactionData.currency}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>
      <Button onClick={() => setStep(2)}>Next</Button>
    </div>
  );

  // Step 2: Card Details
  const renderCardDetailsStep = () => (
    <div className="space-y-4">
      <div>
        <label>
          <input
            type="checkbox"
            name="isCardPresent"
            checked={transactionData.isCardPresent}
            onChange={(e) => handleInputChange({
              target: {
                name: 'isCardPresent',
                value: e.target.checked
              }
            })}
          />
          Card Present
        </label>
      </div>
      <Input
        type="text"
        name="cardNumber"
        value={transactionData.cardNumber}
        onChange={handleInputChange}
        placeholder="Card Number"
        required
        maxLength="16"
      />
      <Input
        type="text"
        name="expiryDate"
        value={transactionData.expiryDate}
        onChange={handleInputChange}
        placeholder="MM/YY"
        required
      />
      <Input
        type="text"
        name="cvv"
        value={transactionData.cvv}
        onChange={handleInputChange}
        placeholder="CVV"
        required
        maxLength="4"
      />
      <div className="flex space-x-2">
        <Button onClick={() => setStep(1)}>Back</Button>
        <Button onClick={() => setStep(3)}>Next</Button>
      </div>
    </div>
  );

  // Step 3: Transaction Type and PIN
  const renderTransactionTypeStep = () => (
    <div className="space-y-4">
      <select
        name="transactionType"
        value={transactionData.transactionType}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      >
        <option value={TRANSACTION_TYPES.SALE}>Sale</option>
        <option value={TRANSACTION_TYPES.PREAUTH}>Pre-Authorization</option>
        <option value={TRANSACTION_TYPES.FORCE}>Force Sale</option>
      </select>
      {transactionData.isCardPresent && (
        <Input
          type="password"
          name="pin"
          value={transactionData.pin}
          onChange={handleInputChange}
          placeholder="PIN"
          maxLength="4"
        />
      )}
      <div className="flex space-x-2">
        <Button onClick={() => setStep(2)}>Back</Button>
        <Button onClick={handleSubmit} disabled={processing}>
          {processing ? 'Processing...' : 'Process Payment'}
        </Button>
      </div>
    </div>
  );

  // Step 4: Receipt
  const renderReceipt = () => (
    <div className="space-y-4">
      {receipt && (
        <Card className="p-4">
          <h2 className="text-xl font-bold">Transaction Receipt</h2>
          <div className="mt-4 space-y-2">
            <p>Amount: {receipt.amount} {receipt.currency}</p>
            <p>Authorization Code: {receipt.authCode}</p>
            <p>Reference Number: {receipt.referenceNumber}</p>
            <p>Transaction Type: {receipt.transactionType}</p>
            <p>Card: **** **** **** {receipt.cardNumber.slice(-4)}</p>
            <p>Date: {new Date(receipt.timestamp).toLocaleString()}</p>
          </div>
          <Button onClick={printReceipt} className="mt-4">
            Print Receipt
          </Button>
        </Card>
      )}
      <Button onClick={() => {
        setStep(1);
        setTransactionData({
          amount: '',
          currency: 'USD',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          pin: '',
          isCardPresent: false,
          transactionType: TRANSACTION_TYPES.SALE
        });
        setReceipt(null);
      }}>
        New Transaction
      </Button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Virtual Terminal</h1>
        {step === 1 && renderAmountStep()}
        {step === 2 && renderCardDetailsStep()}
        {step === 3 && renderTransactionTypeStep()}
        {step === 4 && renderReceipt()}
      </Card>
    </div>
  );
};

export default VirtualTerminal;