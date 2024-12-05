import { describe, expect, it } from "bun:test";
import { FixedIntBuffer } from "./fixedIntBuffer";

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

  it("iterator works", () => {
    const xs = FixedIntBuffer.from([1, 2, 3]);

    const iter = xs.iterator();
    const a = iter.next();
    const b = iter.next();
    const c = iter.next();
    const d = iter.next();

    expect(a.value).toBe(1);
    expect(b.value).toBe(2);
    expect(c.value).toBe(3);
    expect(d.done).toBe(true);
  });
});
