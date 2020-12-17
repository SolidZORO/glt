import { ReplaySubject } from "rxjs";
import * as Ops from 'rxjs/operators';

import { columns, rows, cellWidth, cellHeight, throttleTimeout, debounceTimeout, bufferFactor, marginFactor } from './consts';
import CoordsCalculator from './CoordsCalculator';

export const resizeSubject$ = new ReplaySubject(1);
export const scrollSubject$ = new ReplaySubject(1);

const xCoordsCalc = new CoordsCalculator({
  resizeSubject: resizeSubject$.pipe(Ops.pluck('width')),
  scrollSubject: scrollSubject$.pipe(Ops.pluck('scrollLeft')),
  totalCount: columns - 1,
  gap: cellWidth,
  throttleTimeout,
  debounceTimeout,
  bufferFactor,
  marginFactor,
});
xCoordsCalc.changeSubject$.subscribe((x) => console.log('x coords changes', x));

const yCoordsCalc = new CoordsCalculator({
  resizeSubject: resizeSubject$.pipe(Ops.pluck('height')),
  scrollSubject: scrollSubject$.pipe(Ops.pluck('scrollTop')),
  totalCount: rows,
  gap: cellHeight,
  throttleTimeout,
  debounceTimeout,
  bufferFactor,
  marginFactor,
});
yCoordsCalc.changeSubject$.subscribe((y) => console.log('y coords change', y))

export { xCoordsCalc, yCoordsCalc };
