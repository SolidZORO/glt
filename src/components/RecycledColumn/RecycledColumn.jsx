import React, { useState, useEffect } from 'react';
import * as Ops from 'rxjs/operators';

import Cell from '../Cell/Cell';

import { rows, cellHeight, cellWidth } from '../../utils/consts';
import { yCoordsCalc, scrollSubject$ } from '../../utils/subjects';

import './styles.css';

export default function RecycledColumn(props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(props.initialY);
  const [height, setHeight] = useState(rows * cellHeight);

  const [cells, setCells] = useState([]);

  useEffect(() => {
    // create initial cells
    yCoordsCalc.changeSubject$
      .pipe(Ops.take(1))
      .subscribe(({ changes }) => {
        setCells(changes.map(({ idx, val }) => {
          const cell = {
            x: 0,
            y: val,
            text: props.cellData[idx],
          };
          return cell;
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
          setCells((currentCells) => {
            changes.forEach(({ idx, val }) => {
              const cell = currentCells[idx];
              cell.y = val;
              const cellData = props.cellData[Math.floor(val / cellHeight)];
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
  }, [props.cellData, props.initialY]);

  return (
    <div
      className="recycled-column"
      style={{
        ...props.style,
        transform: `translate(${x}px, ${y}px)`,
        width: `${cellWidth}px`,
        height: `${height}px`
      }}
    >
      <div className="recycled-column-items">
        {cells.map((cell, idx) => (
          <Cell key={idx} {...cell} />
        ))}
      </div>
    </div>
  );
}
