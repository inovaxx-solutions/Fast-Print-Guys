// src/pages/Admin/AdminOrders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrders.css'; // make sure this file is present

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) Get the JWT from localStorage under the key you actually used at login
    const token = localStorage.getItem('authToken');
    console.log('AdminOrders: Bearer token =', token);

    // 2) If no token, bail now and show an error
    if (!token) {
      setError('No token found in localStorage. Please log in as admin.');
      setLoading(false);
      return;
    }

    // 3) Fetch all orders
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/order/all`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 0,
      })
      .then((response) => {
        console.log('AdminOrders: got response data:', response.data);
        setOrders(response.data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error({
          message: err.message,
          code: err.code,
          status: err.response?.status,
          data: err.response?.data,
        });
        // Show the server‐side error if present, or else show the Axios message
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading orders…</div>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="no-orders-message">No orders available.</p>;
  }

  return (
    <div className="admin-orders-container">
      <h2>All Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Item Price</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Total</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
        {orders.map((order) => (
            <tr key={order._id}>
              <td>
                {order.items.map((item) => item.name).join(', ')}
              </td>
              <td>
                {order.items
                  .map((item) => `$${item.price.toFixed(2)}`)
                  .join(', ')}
              </td>
              <td>{order.paymentMethod}</td>
              <td>{order.paymentStatus}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
