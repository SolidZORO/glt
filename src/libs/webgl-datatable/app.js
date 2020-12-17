import { Application, Loader } from 'pixi.js';
import { ReplaySubject } from 'rxjs';
import * as Ops from 'rxjs/operators';

import {
  columns,
  rows,
  cellWidth,
  cellHeight,
  throttleTimeout,
  debounceTimeout,
  bufferFactor,
  marginFactor,
} from './consts';
import CoordsCalculator from './CoordsCalculator';
import { Grid } from './Grid';

/**
 * Profiling
 */
const handleSetupEnd = () => {
  const endTime = new Date();
  console.log('Loaded in ' + (endTime - window.startTime) / 1000 + ' seconds');
  document.querySelector('.loader').innerHTML = '';
};

/**
 * Initialize PIXI application
 */
const app = new Application({
  autoResize: true,
  resolution: devicePixelRatio,
});
app.renderer.backgroundColor = 0xffffff;
document.querySelector('.canvas-container').appendChild(app.view);

const resizeSubject = new ReplaySubject(1);
const scrollSubject = new ReplaySubject(1);

const xCoordsCalc = new CoordsCalculator({
  resizeSubject: resizeSubject.pipe(Ops.pluck('width')),
  scrollSubject: scrollSubject.pipe(Ops.pluck('scrollLeft')),
  totalCount: columns - 1,
  gap: cellWidth,
  throttleTimeout,
  debounceTimeout,
  bufferFactor,
  marginFactor,
});
xCoordsCalc.changeSubject.subscribe((x) => console.log('x coords changes', x));

const yCoordsCalc = new CoordsCalculator({
  resizeSubject: resizeSubject.pipe(Ops.pluck('height')),
  scrollSubject: scrollSubject.pipe(Ops.pluck('scrollTop')),
  totalCount: rows,
  gap: cellHeight,
  throttleTimeout,
  debounceTimeout,
  bufferFactor,
  marginFactor,
});
yCoordsCalc.changeSubject.subscribe((y) => console.log('y coords change', y));

const resize = () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  resizeSubject.next({ width: window.innerWidth, height: window.innerHeight });
};

window.addEventListener('resize', resize);
resize();

const onAssetsLoaded = () => {
  /**
   * Initialize grid
   */
  const grid = new Grid({ scrollSubject, xCoordsCalc, yCoordsCalc, handleSetupEnd });
  app.stage.addChild(grid);

  /**
   * Handle scroll
   */
  const scrollContainer = document.querySelector('.scroll-container');
  const scrollWrapper = document.querySelector('.scroll-wrapper');
  // scrollWrapper.style.left = cellWidth + "px";
  scrollWrapper.style.top = cellHeight + 'px';
  scrollContainer.style.width = columns * cellWidth + 'px';
  scrollContainer.style.height = rows * cellHeight + 'px';

  scrollWrapper.addEventListener('scroll', (e) => {
    const { scrollLeft, scrollTop } = e.target;
    scrollSubject.next({ scrollLeft, scrollTop });
  });

  /**
   * Handle double click
   */
  const cellInput = document.querySelector('.cell-input');
  cellInput.style.height = cellHeight + 'px';
  cellInput.style.width = cellWidth + 'px';
  let clickedCell = null;

  scrollContainer.addEventListener('dblclick', (e) => {
    const rect = e.target.getBoundingClientRect(),
      offsetX = e.clientX - rect.left,
      offsetY = e.clientY - rect.top;

    const cell = grid.getCell(offsetX, offsetY);

    if (!cell || !cell.editable) {
      return;
    }

    clickedCell = cell;

    cellInput.value = clickedCell.getValue();
    cellInput.style.left = clickedCell.x + 'px';
    cellInput.style.top = clickedCell.y + 'px';
    cellInput.style.display = 'block';

    cellInput.focus();
    cellInput.select();
  });

  cellInput.addEventListener('keypress', (e) => {
    if (!clickedCell) {
      return;
    }

    clickedCell.setText(e.target.value);

    if (e.keyCode === 13) {
      // on Enter
      e.target.style.display = 'none';
      clickedCell = null;
    }
  });

  cellInput.addEventListener('blur', (e) => {
    if (!clickedCell) {
      return;
    }

    e.target.style.display = 'none';
    clickedCell = null;
  });
};

Loader.shared.add('arial', '/assets/arial/arial.fnt').load(onAssetsLoaded);
