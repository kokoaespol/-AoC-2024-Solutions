import type { Iterate, IterateCallback } from "./iterate";

export class FixedIntBuffer implements Iterate<number, number> {
  public length: number;
  private _mask: number = 0;

  private constructor(private internal: Int32Array) {
    this.length = internal.length;

    for (let i = 0; i < this.length; i++) {
      this._mask |= 1 << i;
    }
  }

  static from(xs: Array<number>): FixedIntBuffer {
    return new FixedIntBuffer(new Int32Array(xs));
  }

  at(index: number): number {
    if (this.isMasked(index)) {
      throw new Error("tried to access a masked element");
    }
    return this.internal[index];
  }

  private isMasked(index: number): boolean {
    return (this._mask & (1 << index)) == 0;
  }

  mask(index: number): void {
    this._mask &= ~(1 << index);
  }

  unmask(index: number): void {
    this._mask |= 1 << index;
  }

  *iterator(): Iterator<number> {
    for (let i = 0; i < this.length; i++) {
      if (!this.isMasked(i)) {
        yield this.internal[i];
      }
    }
  }

  [Symbol.iterator](): Iterator<number> {
    return this.iterator();
  }

  iterate(cb: IterateCallback<number, number>) {
    let index = 0;
    return cb({
      step: () => {
        while (this.isMasked(index) && index < this.internal.length) {
          index++;
        }
        if (index < this.internal.length) {
          return this.internal[index++];
        }
        return null;
      },
    });
  }
}
