import React, { useState, useEffect } from 'react';

import './styles.css';

import Cell from '../Cell/Cell';
import RecycledRow from '../RecycledRow/RecycledRow';
import RecycledColumn from '../RecycledColumn/RecycledColumn';

import { cellWidth, cellHeight, columns, rows } from '../../utils/consts';
import RecycledGrid from '../RecycledGrid/RecycledGrid';

// import './styles.css';

export default function Grid(props) {
  const [headers, setHeaders] = useState([]);
  const [cellData, setCellData] = useState([]);

  useEffect(() => {
    const headers = [];
    const cellData = [];

    for (let i = 0; i < columns; i++) {
      headers.push(`Header ${i + 1}`);
    }

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(`${(j + 1) * 100000 + (i + 1)}`);
      }
      cellData.push(row);
    }

    setHeaders(headers);
    setCellData(cellData);
  }, []);

  return (
    <div className="grid">
      <Cell text={headers[0]} x={0} y={0} style={{ zIndex: 4 }} />
      <RecycledRow cellData={headers.slice(1)} initialX={cellWidth} style={{ zIndex: 2 }} />
      <RecycledColumn cellData={cellData.map((row) => row[0])} initialY={cellHeight} style={{ zIndex: 3 }} />
      <RecycledGrid cellData={cellData.map((row) => row.slice(1))} initialX={cellWidth} initialY={cellHeight} style={{ zIndex: 1 }} />
    </div>
  );
}
