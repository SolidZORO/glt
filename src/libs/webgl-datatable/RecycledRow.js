import { Container } from 'pixi.js';
import * as Ops from 'rxjs/operators';

import CircularArray from './CircularArray';
import Cell from './Cell';
import { cellWidth, cellHeight } from './consts';

export default class RecycledRow extends Container {
  constructor({ scrollSubject, xCoordsCalc, cellData, isHeader, initialX }) {
    super();
    // console.log("initializing recycled row");
    this.x = initialX;
    this.initialX = initialX;

    this.scrollSubject = scrollSubject;
    this.xCoordsCalc = xCoordsCalc;
    this.cells = new CircularArray([]);
    this.cellData = cellData;

    this._setUpIntialCells(isHeader);
    this._handleScrollLeft();
    this._subscribeUpdates();
  }

  setCellData(cellData) {
    this.cells.array.forEach((cell) => {
      cell.setText(cellData[Math.floor(cell.x / cellWidth)]);
    });
    this.cellData = cellData;
  }

  _handleScrollLeft() {
    this.scrollSubject.subscribe(({ scrollLeft }) => {
      this.x = this.initialX - scrollLeft;
    });
  }

  _setUpIntialCells(isHeader) {
    this.xCoordsCalc.changeSubject
      .pipe(Ops.take(1))
      .subscribe(({ headIndex, tailIndex, changes }) => {
        this.cells.array = changes.map(({ idx, val }) => {
          const cell = new Cell({
            isHeader,
            width: cellWidth,
            height: cellHeight,
            textAlign: 'center',
          });
          cell.setText(this.cellData[idx]);
          cell.position.set(val, 0);
          this.addChild(cell);
          return cell;
        });

        // set the mapping to be the same
        this.cells.updateIndices(headIndex, tailIndex);
      });
  }

  _subscribeUpdates() {
    this.xCoordsCalc.changeSubject
      .pipe(Ops.skip(1))
      .subscribe(({ headIndex, tailIndex, changes }) => {
        changes.forEach(({ idx, val }) => {
          const cell = this.cells.get(idx);
          cell.x = val;
          const cellData = this.cellData[Math.floor(val / cellWidth)];
          if (cellData) {
            cell.setText(cellData);
          }
        });

        // set the mapping to be the same
        this.cells.updateIndices(headIndex, tailIndex);
      });
  }
}
