import { Container } from 'pixi.js';
import * as Ops from 'rxjs/operators';

import CircularArray from '../../utils/CircularArray';
import Cell from './Cell';
import { cellWidth, cellHeight } from './consts';

export default class RecycledColumn extends Container {
  constructor({ scrollSubject, yCoordsCalc, cellData, isHeader, initialY }) {
    super();
    // console.log("initializing recycled column");
    this.y = initialY;
    this.initialY = initialY;

    this.scrollSubject = scrollSubject;
    this.yCoordsCalc = yCoordsCalc;
    this.cells = new CircularArray([]);
    this.cellData = cellData;

    this._setUpIntialCells(isHeader);
    this._handleScrollTop();
    this._subscribeUpdates();
  }

  _handleScrollTop() {
    this.scrollSubject.subscribe(({ scrollTop }) => {
      this.y = this.initialY - scrollTop;
    });
  }

  _setUpIntialCells(isHeader) {
    this.yCoordsCalc.changeSubject
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
          cell.position.set(0, val);
          this.addChild(cell);
          return cell;
        });

        // set the mapping to be the same
        this.cells.updateIndices(headIndex, tailIndex);
      });
  }

  _subscribeUpdates() {
    this.yCoordsCalc.changeSubject
      .pipe(Ops.skip(1))
      .subscribe(({ headIndex, tailIndex, changes }) => {
        changes.forEach(({ idx, val }) => {
          const cell = this.cells.get(idx);
          cell.y = val;
          const cellData = this.cellData[Math.floor(val / cellHeight)];
          if (cellData) {
            cell.setText(cellData);
          }
        });

        // set the mapping to be the same
        this.cells.updateIndices(headIndex, tailIndex);
      });
  }
}
