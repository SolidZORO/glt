import { ReplaySubject, combineLatest } from 'rxjs';
import * as Ops from 'rxjs/operators';

import CircularArray from './CircularArray';

export default class CoordsCalculator {
  constructor({
    resizeSubject,
    scrollSubject,
    totalCount,
    gap,
    throttleTimeout,
    debounceTimeout,
    bufferFactor,
    marginFactor,
  }) {
    this.changeSubject$ = new ReplaySubject(1);
    this.resizeSubject = resizeSubject;
    this.scrollSubject = scrollSubject;

    this.totalCount = totalCount;
    this.gap = gap;
    this.throttleTimeout = throttleTimeout;
    this.debounceTimeout = debounceTimeout;
    this.bufferFactor = bufferFactor;
    this.marginFactor = marginFactor;
    this.coordinates = new CircularArray([]);

    this._setUpInitialCoords();
    this._subscribeUpdates();
  }

  _setUpInitialCoords() {
    this.resizeSubject.pipe(Ops.take(1)).subscribe((size) => {
      console.log('determining initial count');
      const count = Math.ceil((size * 1.5) / this.gap);
      console.log('intial count', count);

      for (let i = 0; i < Math.min(count, this.totalCount); i++) {
        this.coordinates.array.push(this.gap * i);
      }

      // set the mapping to be the same
      this.coordinates.updateIndices(0, this.coordinates.size - 1);

      this.changeSubject$.next({
        headIndex: 0,
        tailIndex: this.coordinates.size - 1,
        changes: this.coordinates.array.map((val, idx) => ({ val, idx })),
      });
    });
  }

  _subscribeUpdates() {
    combineLatest([
      this.scrollSubject,
      this.resizeSubject.pipe(Ops.debounceTime(this.debounceTimeout)),
    ])
      .pipe(
        Ops.throttleTime(this.throttleTimeout),
        Ops.map(([scrollOffset, size]) => {
          const margin = Math.ceil((size * this.marginFactor) / this.gap);

          let currentHead = this.coordinates.head;
          let currentTail = this.coordinates.tail;

          const changes = [];

          while (scrollOffset - currentHead >= margin * this.gap) {
            // peek previous head
            const prevHead = this.coordinates.peekHeadPrev();
            // move head
            const newCoords = prevHead + this.gap;
            this.coordinates.array[this.coordinates.headIndex] = newCoords;
            changes.push({ idx: this.coordinates.headIndex, val: newCoords });
            // move head and tail pointer to next
            currentHead = this.coordinates.headNext;
            currentTail = this.coordinates.tailNext;
          }

          while (currentTail - size - scrollOffset >= margin * this.gap) {
            // peek next tail
            const nextTail = this.coordinates.peekTailNext();
            // move tail
            const newCoords = nextTail - this.gap;
            this.coordinates.array[this.coordinates.tailIndex] = newCoords;
            changes.push({ idx: this.coordinates.tailIndex, val: newCoords });
            // move head and tail pointer to prev
            currentHead = this.coordinates.headPrev;
            currentTail = this.coordinates.tailPrev;
          }

          return {
            headIndex: this.coordinates.headIndex,
            tailIndex: this.coordinates.tailIndex,
            changes,
          };
        }),
        Ops.filter(({ changes }) => changes.length > 0),
      )
      .subscribe((payload) => this.changeSubject$.next(payload));
  }
}
