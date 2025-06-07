import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/MobileTransactionDetails.css';

const TransactionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const txn = location.state?.transaction;

  if (!txn) {
    return (
      <div className="transaction-details-container">
        <div className="transaction-details-card">
          <div className="transaction-details-title">Transaction Not Found</div>
          <button className="transaction-details-back-btn" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = (txn.transactionDetailsList || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  // Example: No tax, but you can add if needed
  const tax = 0;

  return (
    <div className="transaction-details-container receipt-view">
      <div className="receipt-paper">
        {/* Header */}
        <div className="receipt-header-row">
          <div className="receipt-title">ONLINE RECEIPT</div>
        </div>
        <div className="receipt-info-grid">
          <div>
            <div className="receipt-shop-name">Zed X Automotive Shop</div>
            <div>123 Main Street</div>
            <div>City, State ZIP</div>
          </div>
          <div>
            <div className="receipt-label">BILL TO</div>
            <div>{txn.customerDto?.name || '-'}</div>
            <div>{txn.customerDto?.vehicleNumber || ''}</div>
            <div>{txn.customerDto?.mobileNumber || ''}</div>
          </div>
          <div>
            <div className="receipt-label">RECEIPT #</div>
            <div>{txn.transactionNo || '-'}</div>
            <div className="receipt-label">RECEIPT DATE</div>
            <div>{txn.finalPaymentDateTime ? new Date(txn.finalPaymentDateTime).toLocaleDateString() : '-'}</div>
          </div>
        </div>
        <hr className="receipt-divider" />
        {/* Receipt Total */}
        <div className="receipt-total-row">
          <div className="receipt-total-label">Receipt Total</div>
          <div className="receipt-total-amount">{txn.totalAmount ?? '0.00'}</div>
        </div>
        {/* Item Table */}
        <table className="receipt-items-table">
          <thead>
            <tr>
              <th>QTY</th>
              <th>DESCRIPTION</th>
              <th>UNIT</th>
              <th>PRICE</th>
            </tr>
          </thead>
          <tbody>
            {(txn.transactionDetailsList || []).map((item, idx) => (
              <tr key={item.id || idx}>
                <td>1</td>
                <td>
                  <div className="receipt-item-name">{item.serviceDto?.name || '-'}</div>
                  <div className="receipt-item-desc">{item.description || ''}</div>
                </td>
                <td>{item.amount ?? '0.00'}</td>
                <td>{item.amount ?? '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Totals */}
        <div className="receipt-totals-box">
          <div className="receipt-totals-row">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          {tax > 0 && (
            <div className="receipt-totals-row">
              <span>Tax</span>
              <span>{tax.toFixed(2)}</span>
            </div>
          )}
          <div className="receipt-totals-row receipt-totals-row-bold">
            <span>Total</span>
            <span>{txn.totalAmount ?? '0.00'}</span>
          </div>
        </div>
        {/* Payment Instruction */}
        <div className="receipt-section-title">PAYMENT INSTRUCTION</div>
        <div className="receipt-section-content">
          <div>Payment Method: {txn.paymentMethodDto?.name || '-'}</div>
        </div>
        {/* Terms & Conditions */}
        <div className="receipt-section-title">TERMS & CONDITIONS</div>
        <div className="receipt-section-content">
          Payment is due within 15 days.<br />
          Please make checks payable to: Zed X Automotive Shop
        </div>
        <button className="transaction-details-back-btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
};

export default TransactionDetails; 