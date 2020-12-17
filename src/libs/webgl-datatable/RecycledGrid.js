import { Container } from 'pixi.js';
import * as Ops from 'rxjs/operators';

import CircularArray from '../../utils/CircularArray';
import { cellHeight } from './consts';
import RecycledRow from './RecycledRow';

export default class RecycledGrid extends Container {
  constructor({ scrollSubject, xCoordsCalc, yCoordsCalc, cellData, initialX, initialY }) {
    super();
    console.log('initializing recycled grid');

    this.x = initialX;
    this.initialX = initialX;
    this.y = initialY;
    this.initialY = initialY;

    this.scrollSubject = scrollSubject;
    this.xCoordsCalc = xCoordsCalc;
    this.yCoordsCalc = yCoordsCalc;
    this.rows = new CircularArray([]);
    this.cellData = cellData;

    this._setUpIntialRows();
    this._handleScrollTop();
    this._subscribeUpdates();
  }

  _handleScrollTop() {
    this.scrollSubject.subscribe(({ scrollTop }) => {
      this.y = this.initialY - scrollTop;
    });
  }

  _setUpIntialRows() {
    this.yCoordsCalc.changeSubject
      .pipe(Ops.take(1))
      .subscribe(({ headIndex, tailIndex, changes }) => {
        this.rows.array = changes.map(({ idx, val }) => {
          const recycledRow = new RecycledRow({
            scrollSubject: this.scrollSubject,
            xCoordsCalc: this.xCoordsCalc,
            isHeader: false,
            initialX: 0,
            cellData: this.cellData[idx].slice(), // shallow clone
          });
          recycledRow.position.set(0, val);
          this.addChild(recycledRow);
          return recycledRow;
        });

        // set the mapping to be the same
        this.rows.updateIndices(headIndex, tailIndex);
      });
  }

  _subscribeUpdates() {
    this.yCoordsCalc.changeSubject
      .pipe(Ops.skip(1))
      .subscribe(({ headIndex, tailIndex, changes }) => {
        changes.forEach(({ idx, val }) => {
          const row = this.rows.get(idx);
          row.y = val;
          const cellData = this.cellData[Math.floor(val / cellHeight)];
          if (cellData) {
            row.setCellData(cellData.slice());
          }
        });

        // set the mapping to be the same
        this.rows.updateIndices(headIndex, tailIndex);
      });
  }
}
