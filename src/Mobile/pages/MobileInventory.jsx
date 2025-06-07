import React, { useState, useEffect, useCallback } from 'react';
import { getAllCustomersPaginated, getCustomersByMobileNumber, getCustomersByVehicleNumber, getCustomersByName } from '../../API/CustomerApi';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import '../styles/MobileInventory.css';

const EyeIcon = ({ onClick }) => (
  <svg onClick={onClick} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#2563eb" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
);

const MobileInventory = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(7); // match backend default
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();
  const searchTimeout = React.useRef();

  const fetchCustomers = useCallback(async (page = pageNumber) => {
    setLoading(true);
    try {
      const response = await getAllCustomersPaginated(page, pageSize);
      if (response.errorDescription) {
        if (response.errorDescription.includes('Authentication required')) {
          navigate('/login');
          return;
        }
        setError(response.errorDescription);
      } else {
        setCustomers(response.payload || []);
        setTotalRecords(response.totalRecords || 0);
      }
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, [navigate, pageNumber, pageSize]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchCustomers(pageNumber);
  }, [navigate, fetchCustomers, pageNumber]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value) {
      fetchCustomers(pageNumber);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const [byMobile, byVehicle, byName] = await Promise.all([
          getCustomersByMobileNumber(value),
          getCustomersByVehicleNumber(value),
          getCustomersByName(value),
        ]);
        console.log('byMobile', byMobile, 'byVehicle', byVehicle, 'byName', byName); // Debug log
        // Helper to handle both array and object API responses
        const getArray = (res) =>
          Array.isArray(res) ? res : Array.isArray(res?.responseDto) ? res.responseDto : [];
        const all = [
          ...getArray(byMobile),
          ...getArray(byVehicle),
          ...getArray(byName),
        ];
        // Merge and deduplicate by id
        const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
        setCustomers(unique);
        setTotalRecords(unique.length);
      } catch (err) {
        setError('Search failed');
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(totalRecords / pageSize)) return;
    setPageNumber(newPage);
  };

  return (
    <div className="mobile-inventory">
      <input
        className="mobile-search-input"
        type="text"
        placeholder="Search by name, mobile, or vehicle number..."
        value={search}
        onChange={handleSearch}
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
          {customers.length === 0 ? (
            <div className="mobile-inventory-loading">No customers found</div>
          ) : (
            customers.map((customer, idx) => (
              <motion.div
                className="mobile-customer-card"
                key={customer.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.32, ease: [0.4, 2, 0.6, 1], delay: idx * 0.07 }}
              >
                <div className="mobile-customer-info">
                  <div className="mobile-customer-avatar">
                    {customer.avatarUrl ? (
                      <img src={customer.avatarUrl} alt={customer.name} />
                    ) : (
                      <div className="mobile-customer-initials">
                        {customer.name ? customer.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="mobile-customer-name">{customer.name}</div>
                    <div className="mobile-customer-vehicle">{customer.vehicleNumber}</div>
                  </div>
                </div>
                <div className="mobile-customer-action">
                  <EyeIcon onClick={() => handleView(customer)} />
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
      <AnimatePresence>
        {showModal && selectedCustomer && (
          <motion.div
            className="mobile-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeModal}
          >
            <motion.div
              className="mobile-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.4, 2, 0.6, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <div className="mobile-modal-header">
                <h3>Customer Details</h3>
              </div>
              <div className="mobile-modal-content">
                {['name', 'vehicleNumber', 'mobileNumber'].map((key) => (
                  <div key={key} className="mobile-modal-row-card">
                    <span className="mobile-modal-label-card">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                    <span className="mobile-modal-value-card">{String(selectedCustomer[key] || '')}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileInventory; 