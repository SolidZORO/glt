import React, { useState, useEffect } from 'react';
import * as Ops from 'rxjs/operators';

import Cell from '../Cell/Cell';

import { columns, cellHeight, cellWidth } from '../../utils/consts';
import { xCoordsCalc, scrollSubject$ } from '../../utils/subjects';

import './styles.css';

export default function RecycledRow(props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(columns * cellWidth);
  const [height, setHeight] = useState(cellHeight);

  const [cells, setCells] = useState([]);

  useEffect(() => {
    // create initial cells
    xCoordsCalc.changeSubject$
      .pipe(Ops.take(1))
      .subscribe(({ headIndex, tailIndex, changes }) => {
        setCells(changes.map(({ idx, val }) => {
          const cell = {
            x: val,
            y: 0,
            text: props.cellData[idx],
          };
          return cell;
        }));
      });
      // handle scroll left
      const scrollSubscription = scrollSubject$.subscribe(({ scrollLeft }) => {
        setX((props.initialX || 0) - scrollLeft);
      });
      // subscribe updates
      const changeSubscription = xCoordsCalc.changeSubject$
        .pipe(Ops.skip(1))
        .subscribe(({ changes }) => {
          setCells((currentCells) => {
            changes.forEach(({ idx, val }) => {
              const cell = currentCells[idx];
              cell.x = val;
              const cellData = props.cellData[Math.floor(val / cellWidth)];
              if (cellData) {
                cell.text = cellData;
              }
            });

            return currentCells;
          });
      });

      return () => {
        scrollSubscription.unsubscribe();
        changeSubscription.unsubscribe();
      };
  }, [props.cellData]);

  return (
    <div
      className="recycled-row"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width: `${width}px`,
        height: `${cellHeight}px`
      }}
    >
      <div className="recycled-row-items">
        {cells.map((cell, idx) => (
          <Cell key={idx} {...cell} />
        ))}
      </div>
    </div>
  );
}
