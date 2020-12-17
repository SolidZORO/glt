import React, { useState, useEffect } from 'react';

import { columns } from '../../utils/consts';
import RecycledRow from '../RecycledRow/RecycledRow';

// import './styles.css';

export default function Grid(props) {
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const headers = [];

    for (let i = 0; i < columns; i++) {
      headers.push(`Header ${i + 1}`);
    }

    setHeaders(headers);
  }, []);

  return (
    <div className="grid">
      <RecycledRow cellData={headers} />
    </div>
  );
}
