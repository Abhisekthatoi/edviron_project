import React, { useState } from 'react';
import api from '../lib/api';

export default function SchoolPage() {
  const [schoolId, setSchoolId] = useState('');
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await api.get(`/transactions/school/${schoolId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setData(res.data.data);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input className="border p-2" placeholder="school_id" value={schoolId} onChange={e=>setSchoolId(e.target.value)} />
        <button className="border px-3" onClick={fetchData}>Fetch</button>
      </div>
      <pre className="bg-white p-3 border overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
