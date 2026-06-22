import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Load orders from Supabase on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
        } else if (data) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();

    // Subscribe to real-time changes on the orders table
    const ordersChannel = supabase
      .channel('realtime:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        if (eventType === 'INSERT' || eventType === 'insert') {
          setOrders((prev) => {
            // Avoid duplicate orders if inserted locally
            if (prev.some(o => o.order_id === newRecord.order_id)) return prev;
            return [newRecord, ...prev];
          });
        } else if (eventType === 'UPDATE' || eventType === 'update') {
          setOrders((prev) =>
            prev.map((order) => (order.order_id === newRecord.order_id ? newRecord : order))
          );
        } else if (eventType === 'DELETE' || eventType === 'delete') {
          const idToDelete = oldRecord?.order_id || payload.old?.order_id;
          if (idToDelete) {
            setOrders((prev) => prev.filter((order) => order.order_id !== idToDelete));
          }
        }
      })
      .subscribe();

    return () => {
      ordersChannel.unsubscribe();
    };
  }, []);

  // Cart Operations
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) => {
      return prevCart
        .map((i) => {
          if (i.id === itemId) {
            const nextQty = i.quantity + change;
            return { ...i, quantity: nextQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = parseFloat((subtotal * 0.05).toFixed(2)); // 5% GST
  const packagingFee = subtotal > 0 ? 15 : 0; // Flat 15 packaging fee
  const grandTotal = parseFloat((subtotal + gst + packagingFee).toFixed(2));

  // Add order to database and trigger notification simulation
  const addOrder = async (orderData) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) {
        console.error('Error inserting order in Supabase:', error);
        throw error;
      }

      // Simulate EmailJS confirmation
      simulateEmailConfirmation(orderData);

      // Instantly update local state to reflect creation if offline/mocked
      setOrders(prev => {
        if (prev.some(o => o.order_id === orderData.order_id)) return prev;
        return [orderData, ...prev];
      });

      return orderData;
    } catch (err) {
      console.error('addOrder operation failed:', err);
      throw err;
    }
  };

  // Update order status in KDS
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('order_id', orderId);

      if (error) {
        console.error(`Error updating status for order ${orderId}:`, error);
        throw error;
      }

      // Locally update state to ensure instant UI responsiveness
      setOrders((prev) =>
        prev.map((order) => (order.order_id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (err) {
      console.error('updateOrderStatus operation failed:', err);
      throw err;
    }
  };

  // Simulated email service logger
  const simulateEmailConfirmation = (order) => {
    console.log('%c✉️ [EmailJS Simulation - Email Sent]', 'color: #D47A55; font-weight: bold; font-size: 14px;', {
      to_name: order.customer_name,
      to_email: order.customer_email,
      order_id: order.order_id,
      pickup_code: order.pickup_code,
      pickup_time: order.pickup_time,
      grand_total: `₹${order.grand_total}`,
      message: `Dear ${order.customer_name}, your order ${order.pickup_code} has been successfully placed at Café Aroma Chinchwad and is currently PENDING. Thank you!`
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        orders,
        loadingOrders,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        gst,
        packagingFee,
        grandTotal,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
