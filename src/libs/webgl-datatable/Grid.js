import { Container } from 'pixi.js';

import Cell from './Cell';
import RecycledRow from './RecycledRow';
import RecycledColumn from './RecycledColumn';
import { rows, columns, cellWidth, cellHeight } from './consts';
import RecycledGrid from './RecycledGrid';

export class Grid extends Container {
  constructor({ scrollSubject, xCoordsCalc, yCoordsCalc, handleSetupEnd }) {
    super();

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

    const cellContainer = new RecycledGrid({
      scrollSubject,
      xCoordsCalc,
      yCoordsCalc,
      cellData: cellData.map((row) => row.slice(1)),
      initialX: cellWidth,
      initialY: cellHeight,
    });
    const topHeaderContainer = new RecycledRow({
      scrollSubject,
      xCoordsCalc,
      cellData: headers.slice(1),
      isHeader: true,
      initialX: cellWidth,
    });
    const leftHeaderContainer = new RecycledColumn({
      scrollSubject,
      yCoordsCalc,
      cellData: cellData.map((row) => row[0]),
      isHeader: false,
      initialY: cellHeight,
    });
    const topLeftHeaderContainer = new Container();

    cellContainer.interactiveChildren = false;
    topHeaderContainer.interactiveChildren = false;
    leftHeaderContainer.interactiveChildren = false;
    topLeftHeaderContainer.interactiveChildren = false;

    // create top left header component as pinned
    const topLeftCell = new Cell({
      isHeader: true,
      width: cellWidth,
      height: cellHeight,
      textAlign: 'center',
      isOdd: false,
    });
    topLeftCell.setText(headers[0]);
    topLeftHeaderContainer.addChild(topLeftCell);

    this.cellContainer = cellContainer;
    this.topHeaderContainer = topHeaderContainer;
    this.leftHeaderContainer = leftHeaderContainer;

    // layering at the right order
    this.addChild(cellContainer);
    this.addChild(topHeaderContainer);
    this.addChild(leftHeaderContainer);
    this.addChild(topLeftHeaderContainer);

    handleSetupEnd();
  }

  // getCell(posX, posY) {
  //   const clickedColumn = Math.floor(posX / cellWidth);
  //   const clickedRow = Math.floor(posY / cellHeight);

  //   // console.log(posX, posY);

  //   // We found a cell
  //   if(this.cells[clickedRow] && this.cells[clickedRow][clickedColumn]) {
  //     return this.cells[clickedRow][clickedColumn];
  //   }
  // }
}
