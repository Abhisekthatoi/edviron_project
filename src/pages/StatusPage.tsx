import React, { useState } from 'react';
import api from '../lib/api';

export default function StatusPage() {
  const [custom, setCustom] = useState('');
  const [status, setStatus] = useState<any>(null);

  const fetchStatus = async () => {
    const res = await api.get(`/transaction-status/${custom}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setStatus(res.data);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input className="border p-2" placeholder="custom_order_id" value={custom} onChange={e=>setCustom(e.target.value)} />
        <button className="border px-3" onClick={fetchStatus}>Check</button>
      </div>
      <pre className="bg-white p-3 border overflow-auto">{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
