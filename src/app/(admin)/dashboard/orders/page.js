  'use client'

  import { useState, useEffect } from 'react'
  import { createClient } from '@/lib/supabase/client'

  const STATUSES = ['Pending', 'Preparing', 'Ready',
  'Completed', 'Cancelled']

  const ORDER_TYPE_LABEL = { Delivery: 'Delivery',
  Pickup: 'Pickup' }
  const PAYMENT_LABEL = { Cash: 'Cash', GCash: 'GCash' }

  export default function OrderQueuePage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const supabase = createClient()

    useEffect(() => {
      async function fetchOrders() {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*, menu_items(name))')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching orders:', error)
          setError(error.message)
        } else {
          setOrders(data)
          setError(null)
        }
        setLoading(false)
      }

      fetchOrders()

      const channel = supabase
        .channel('orders-realtime')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table:
  'orders' },
          // Refetch so order_items (embedded relation) comes through correctly
          () => fetchOrders()
        )
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table:
  'orders' },
          (payload) => {
            setOrders((current) =>
              current.map((order) =>
                order.id === payload.new.id
                  ? { ...order, ...payload.new,
  order_items: order.order_items }
                  : order
              )
            )
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }, [])

    async function handleStatusChange(orderId,
  newStatus) {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating status:', error)
        setError(error.message)
      }
      // Realtime UPDATE subscription handles local state
    }

    if (loading) {
      return <p className="text-stone-500">Loading
  orders…</p>
    }

    return (
      <div>
        <h1 className="text-2xl font-bold text-stone-900
  mb-6">Order Queue</h1>

        {error && (
          <div className="mb-4 rounded-md border
  border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm
  p-8 text-center text-stone-500">
            No orders yet — they&apos;ll appear here in
  real time.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white
  rounded-lg shadow-sm p-4">
                <div className="flex items-center
  justify-between mb-2">
                  <div>
                    <p className="font-semibold
  text-stone-900">{order.customer_name}</p>
                    <p className="text-sm
  text-stone-500">

  {ORDER_TYPE_LABEL[order.order_type] ??
  order.order_type} ·{' '}

  {PAYMENT_LABEL[order.payment_method] ??
  order.payment_method} ·{' '}
                      ₱{order.total_price}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) =>
  handleStatusChange(order.id, e.target.value)}
                    className="border border-stone-300
  rounded-md px-3 py-1.5 text-sm"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} 
  value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <ul className="text-sm text-stone-600
  mt-2">
                  {order.order_items?.map((item) => (
                    <li key={item.id}>
                      {item.quantity}×
  {item.menu_items?.name ?? 'Unknown item'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }