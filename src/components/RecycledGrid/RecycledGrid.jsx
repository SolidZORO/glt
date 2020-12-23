import React, { useState, useEffect } from 'react';
import * as Ops from 'rxjs/operators';
import { observer } from 'mobx-react-lite'

import { rows as rowCount, columns, cellHeight, cellWidth } from '../../utils/consts';
import { yCoordsCalc, scrollSubject$ } from '../../utils/subjects';

import './styles.css';
import RecycledRow from '../RecycledRow/RecycledRow';

function RecycledGrid(props) {
  const [x, setX] = useState(props.initialX);
  const [y, setY] = useState(props.initialY);
  const [width, setWidth] = useState(columns * cellWidth);
  const [height, setHeight] = useState(rowCount * cellHeight);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    // create initial cells
    yCoordsCalc.changeSubject$
      .pipe(Ops.take(1))
      .subscribe(({ changes }) => {
        setRows(changes.map(({ idx, val }) => {
          const row = {
            y: val,
            cellData: (props.cellData[idx] || []).slice(),
          };
          return row;
        }));
      });
      // handle scroll top
      const scrollSubscription = scrollSubject$.subscribe(({ scrollTop }) => {
        setY((props.initialY || 0) - scrollTop);
      });
      // subscribe updates
      const changeSubscription = yCoordsCalc.changeSubject$
        .pipe(Ops.skip(1))
        .subscribe(({ changes }) => {
          setRows((currentRows) => {
            changes.forEach(({ idx, val }) => {
              const row = currentRows[idx];
              row.y = val;
              const cellData = props.cellData[Math.floor(val / cellHeight)];
              if (cellData) {
                row.cellData = cellData.slice();
              }
            });

            return currentRows;
          });
      });

      return () => {
        scrollSubscription.unsubscribe();
        changeSubscription.unsubscribe();
      };
  }, [props.cellData, props.initialY]);

  return (
    <div
      className="recycled-grid"
      style={{
        ...props.style,
        transform: `translate(${x}px, ${y}px)`,
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      <div className="recycled-grid-items">
        {rows.map((row, idx) => (
          <RecycledRow key={idx} {...row} initialX={0} />
        ))}
      </div>
    </div>
  );
}

export default observer(RecycledGrid);
