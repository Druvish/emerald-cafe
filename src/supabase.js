import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' &&
  supabaseUrl !== ''
);

let supabaseClient = null;

if (isSupabaseConfigured) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

// Local simulation layer using BroadcastChannel (communicates between browser tabs)
const simulationChannel = new BroadcastChannel('cafe_aroma_realtime_simulation');

const getMockOrders = () => {
  const data = localStorage.getItem('cafe_aroma_orders');
  if (!data) {
    // Premium initial dummy orders for demonstration
    const initialOrders = [
      {
        order_id: 'ord_8f12a3',
        pickup_code: 'AROMA-82',
        customer_name: 'Rahul Sharma',
        customer_phone: '9876543210',
        customer_email: 'rahul.sharma@example.com',
        pickup_time: 'As soon as possible (10-15 mins)',
        items: [
          { id: 'hot-1', name: 'Espresso Romano', price: 180, quantity: 2, rating: 5, category: 'hotdrinks' },
          { id: 'cold-1', name: 'Classic Cold Brew', price: 210, quantity: 1, rating: 4, category: 'coldbrews' }
        ],
        subtotal: 570,
        gst: 28.5,
        packaging_fee: 15,
        grand_total: 613.5,
        payment_method: 'UPI QR Code',
        status: 'Preparing',
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5m ago
      },
      {
        order_id: 'ord_c7a4b2',
        pickup_code: 'AROMA-19',
        customer_name: 'Priya Patil',
        customer_phone: '9823456789',
        customer_email: 'priya.patil@example.com',
        pickup_time: 'Within 30 mins',
        items: [
          { id: 'bites-1', name: 'Artisanal Croissant', price: 190, quantity: 1, rating: 5, category: 'bites' },
          { id: 'hot-2', name: 'Rose Gold Latte', price: 240, quantity: 1, rating: 5, category: 'hotdrinks' }
        ],
        subtotal: 430,
        gst: 21.5,
        packaging_fee: 15,
        grand_total: 466.5,
        payment_method: 'Simulated Card',
        status: 'Pending',
        created_at: new Date(Date.now() - 11 * 60 * 1000).toISOString() // 11m ago (Warning: Amber border)
      },
      {
        order_id: 'ord_e2f15d',
        pickup_code: 'AROMA-95',
        customer_name: 'Aditya Joshi',
        customer_phone: '9011223344',
        customer_email: 'aditya.joshi@example.com',
        pickup_time: 'Within 45 mins',
        items: [
          { id: 'sweets-1', name: 'Signature Tiramisu', price: 290, quantity: 1, rating: 5, category: 'sweets' }
        ],
        subtotal: 290,
        gst: 14.5,
        packaging_fee: 15,
        grand_total: 319.5,
        payment_method: 'UPI QR Code',
        status: 'Pending',
        created_at: new Date(Date.now() - 16 * 60 * 1000).toISOString() // 16m ago (Alert: Flashing Red)
      }
    ];
    localStorage.setItem('cafe_aroma_orders', JSON.stringify(initialOrders));
    return initialOrders;
  }
  return JSON.parse(data);
};

const saveMockOrders = (orders) => {
  localStorage.setItem('cafe_aroma_orders', JSON.stringify(orders));
};

export const supabase = isSupabaseConfigured ? supabaseClient : {
  from: () => ({
    select: () => ({
      order: () => Promise.resolve({ data: getMockOrders().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), error: null }),
      eq: (col, val) => {
        const orders = getMockOrders();
        const found = orders.filter(o => o[col] === val);
        return Promise.resolve({ data: found, error: null });
      }
    }),
    insert: (records) => {
      const orders = getMockOrders();
      const updated = [...orders, ...records];
      saveMockOrders(updated);
      
      // Post to BroadcastChannel so other tabs running the mock database receive the real-time event
      records.forEach(newRecord => {
        simulationChannel.postMessage({
          eventType: 'INSERT',
          new: newRecord
        });
      });
      
      return Promise.resolve({ data: records, error: null });
    },
    update: (fields) => ({
      eq: (col, val) => {
        const orders = getMockOrders();
        let changedRecords = [];
        const updated = orders.map(o => {
          if (o[col] === val) {
            const updatedRecord = { ...o, ...fields };
            changedRecords.push(updatedRecord);
            return updatedRecord;
          }
          return o;
        });
        saveMockOrders(updated);
        
        // Post to BroadcastChannel so other tabs receive the real-time event
        changedRecords.forEach(record => {
          simulationChannel.postMessage({
            eventType: 'UPDATE',
            new: record
          });
        });
        
        return Promise.resolve({ data: changedRecords, error: null });
      }
    })
  }),
  channel: (channelName) => {
    let callbacks = [];
    const listener = (event) => {
      callbacks.forEach(cb => {
        cb({
          eventType: event.data.eventType,
          new: event.data.new
        });
      });
    };
    
    simulationChannel.addEventListener('message', listener);
    
    return {
      on: (eventStr, filterStr, callback) => {
        callbacks.push(callback);
        return {
          subscribe: () => {
            return {
              unsubscribe: () => {
                simulationChannel.removeEventListener('message', listener);
                callbacks = callbacks.filter(cb => cb !== callback);
              }
            };
          }
        };
      }
    };
  }
};
