import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function TransactionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [sort, setSort] = useState('payment_time');
  const [order, setOrder] = useState<'asc'|'desc'>('desc');

  const fetchData = async () => {
    const params: any = { page, limit: 10, sort, order };
    if (status) params.status = status;
    const res = await api.get('/transactions', { params, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setData(res.data.data);
    setCount(res.data.count);
  };

  useEffect(() => { fetchData(); }, [page, status, sort, order]);

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <select className="border p-2" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select className="border p-2" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="payment_time">Payment Time</option>
          <option value="transaction_amount">Transaction Amount</option>
          <option value="status">Status</option>
        </select>
        <select className="border p-2" value={order} onChange={e=>setOrder(e.target.value as any)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
      <table className="w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">collect_id</th>
            <th className="p-2 text-left">school_id</th>
            <th className="p-2 text-left">gateway</th>
            <th className="p-2 text-left">order_amount</th>
            <th className="p-2 text-left">transaction_amount</th>
            <th className="p-2 text-left">status</th>
            <th className="p-2 text-left">custom_order_id</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={`${row.collect_id}-${row.custom_order_id}`} className="border-t hover:bg-gray-50">
              <td className="p-2">{row.collect_id}</td>
              <td className="p-2">{row.school_id}</td>
              <td className="p-2">{row.gateway}</td>
              <td className="p-2">{row.order_amount}</td>
              <td className="p-2">{row.transaction_amount}</td>
              <td className="p-2">{row.status}</td>
              <td className="p-2">{row.custom_order_id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2">
        <button className="px-3 py-1 border" onClick={()=>setPage((p)=>Math.max(1, p-1))}>Prev</button>
        <span>Page {page} of {Math.max(1, Math.ceil(count/10))}</span>
        <button className="px-3 py-1 border" onClick={()=>setPage((p)=>p+1)}>Next</button>
      </div>
    </div>
  );
}
