import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllTransactionsPaginated } from '../../API/TransactionApi';
import '../styles/MobileTransaction.css';

const ArrowIcon = ({ onClick }) => (
  <svg onClick={onClick} style={{ cursor: 'pointer' }} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#e8f0fe"/>
    <path d="M10 8l4 4-4 4" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MobileTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(7);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async (page = pageNumber) => {
    setLoading(true);
    try {
      const response = await getAllTransactionsPaginated(page, pageSize);
      if (response.errorDescription) {
        setError(response.errorDescription);
      } else {
        // Support both array and object response
        const data = Array.isArray(response?.payload) ? response.payload : Array.isArray(response?.responseDto?.payload) ? response.responseDto.payload : [];
        setTransactions(data);
        setTotalRecords(response?.totalRecords || response?.responseDto?.totalRecords || 0);
      }
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize]);

  useEffect(() => {
    fetchTransactions(pageNumber);
  }, [fetchTransactions, pageNumber]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(totalRecords / pageSize)) return;
    setPageNumber(newPage);
  };

  const handleView = (txn) => {
    navigate(`/transaction/${txn.id}`, { state: { transaction: txn } });
  };

  return (
    <div className="mobile-transaction">
      <input
        className="mobile-search-input"
        type="text"
        placeholder="Search (not implemented)"
        disabled
        style={{ marginTop: 32, marginBottom: 18, opacity: 0.5 }}
      />
      {loading ? (
        <div className="mobile-inventory-loading">Loading...</div>
      ) : error ? (
        <div className="mobile-inventory-error">{error}</div>
      ) : (
        <motion.div
          className="mobile-list-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.32, ease: [0.4, 2, 0.6, 1] }}
        >
          {transactions.length === 0 ? (
            <div className="mobile-inventory-loading">No transactions found</div>
          ) : (
            transactions.map((txn, idx) => (
              <motion.div
                className="mobile-customer-card"
                key={txn.id || txn.transactionNo || idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.32, ease: [0.4, 2, 0.6, 1], delay: idx * 0.07 }}
              >
                <div className="mobile-customer-info">
                  <div className="mobile-customer-avatar">
                    <div className="mobile-customer-initials">
                      {txn.customerDto?.name ? txn.customerDto.name[0] : '?'}
                    </div>
                  </div>
                  <div>
                    <div className="mobile-customer-name">{txn.customerDto?.name || 'N/A'}</div>
                    <div className="mobile-customer-vehicle" style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.08rem' }}>
                      ₹{txn.totalAmount ?? '0.00'}
                    </div>
                    <div className="mobile-customer-vehicle" style={{ color: '#8a94a6', fontSize: '0.97rem', marginTop: 2 }}>
                      {txn.paymentMethodDto?.name || ''}
                    </div>
                  </div>
                </div>
                <div className="mobile-customer-action">
                  <ArrowIcon onClick={() => handleView(txn)} />
                </div>
              </motion.div>
            ))
          )}
          {/* Pagination Controls */}
          {totalRecords > pageSize && (
            <div className="mobile-pagination">
              <button
                className="mobile-pagination-btn"
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber === 1}
              >
                Prev
              </button>
              <span className="mobile-pagination-info">
                Page {pageNumber} of {Math.ceil(totalRecords / pageSize)}
              </span>
              <button
                className="mobile-pagination-btn"
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber === Math.ceil(totalRecords / pageSize)}
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MobileTransaction; 