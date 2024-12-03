import "bun:test";
import { describe, expect, it } from "bun:test";

export class FixedIntBuffer {
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
      while (index < this.length && this.isMasked(index)) {
        index++;
      }

      if (index < this.length && !this.isMasked(index)) {
        return this.internal[index];
      } else {
        throw new Error("index out of bounds");
      }
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
}

describe("FixedIntBuffer", () => {
  it("should mask elements correctly", () => {
    const xs = FixedIntBuffer.from([1, 2, 3]);
    xs.mask(1);

    const ys = [...xs];

    expect(ys.length).toBe(2);
    expect(ys).toContainValues([1, 3]);
    expect(ys).not.toContain(2);
  });

  it("masking and unmasking should effectively do nothing", () => {
    const xs = FixedIntBuffer.from([1, 2, 3]);
    xs.mask(1);
    xs.unmask(1);

    const ys = [...xs];

    expect(ys.length).toBe(3);
    expect(ys).toContainAllValues([1, 2, 3]);
  });

  it("accessing a masked element returns the next unmasked element", () => {
    const xs = FixedIntBuffer.from([1, 2, 3]);
    xs.mask(1);
    xs.mask(0);

    expect(xs.at(0)).toBe(3);
  });

  it("accessing a masked element when there are no more elements after it throws an error", () => {
    const xs = FixedIntBuffer.from([1, 2, 3]);
    xs.mask(2);

    expect(() => xs.at(2)).toThrowError("index out of bounds");
  });
});
