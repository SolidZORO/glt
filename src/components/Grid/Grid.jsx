import React, { useState, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';

import './styles.css';

import Cell from '../Cell/Cell';
import RecycledRow from '../RecycledRow/RecycledRow';
import RecycledColumn from '../RecycledColumn/RecycledColumn';

import { cellWidth, cellHeight, columns, rows } from '../../utils/consts';
import RecycledGrid from '../RecycledGrid/RecycledGrid';

// import './styles.css';

function Grid(props) {
  const [headers, setHeaders] = useState([]);

  const cellData = useLocalObservable(() => ({
    data: Array.from({ length: rows }, (_, rowIndex) =>
      Array.from(
        { length: columns },
        (_, columnIndex) => `${(columnIndex + 1) * 100000 + (rowIndex + 1)}`
      )
    ),
    get firstRowData() {
      return this.data.map(row => row[0]);
    },
    get otherRowsData() {
      return this.data.map(row => row.slice(1));
    }
  }));


  useEffect(() => {
    const headers = [];

    for (let i = 0; i < columns; i++) {
      headers.push(`Header ${i + 1}`);
    }

    setHeaders(headers);
  }, []);

  return (
    <div className="grid">
      <Cell text={headers[0]} x={0} y={0} style={{ zIndex: 4 }} />
      <RecycledRow cellData={headers.slice(1)} initialX={cellWidth} style={{ zIndex: 2 }} />
      <RecycledColumn cellData={cellData.firstRowData} initialY={cellHeight} style={{ zIndex: 3 }} />
      <RecycledGrid cellData={cellData.otherRowsData} initialX={cellWidth} initialY={cellHeight} style={{ zIndex: 1 }} />
    </div>
  );
}

export default observer(Grid);
