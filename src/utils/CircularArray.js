export default class CircularArray {
  constructor(array) {
    this.array = array;
    this.headIndex = 0;
    this.tailIndex = array.length - 1;
  }

  updateIndices(headIndex, tailIndex) {
    this.headIndex = headIndex;
    this.tailIndex = tailIndex;
  }

  get(idx) {
    return this.array[idx];
  }

  get size() {
    return this.array.length;
  }

  get head() {
    return this.get(this.headIndex);
  }

  get headNext() {
    this.headIndex = this.nextIndex(this.headIndex);
    return this.head;
  }

  get headPrev() {
    this.headIndex = this.prevIndex(this.headIndex);
    return this.head;
  }

  peekHeadNext() {
    const idx = this.nextIndex(this.headIndex);
    return this.get(idx);
  }

  peekHeadPrev() {
    const idx = this.prevIndex(this.headIndex);
    return this.get(idx);
  }

  get tail() {
    return this.get(this.tailIndex);
  }

  get tailNext() {
    this.tailIndex = this.nextIndex(this.tailIndex);
    return this.tail;
  }

  get tailPrev() {
    this.tailIndex = this.prevIndex(this.tailIndex);
    return this.tail;
  }

  peekTailNext() {
    const idx = this.nextIndex(this.tailIndex);
    return this.get(idx);
  }

  peekTailPrev() {
    const idx = this.prevIndex(this.tailIndex);
    return this.get(idx);
  }

  prevIndex(idx) {
    return (idx === 0 ? this.array.length - 1 : idx - 1) % this.array.length;
  }

  nextIndex(idx) {
    return (idx + 1) % this.array.length;
  }
}
