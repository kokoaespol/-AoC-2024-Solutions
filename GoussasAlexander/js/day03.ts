import { makeADT, ofType } from "@morphic-ts/adt";
import { anyChar, eof, int, rest, string } from "parjs";
import {
  backtrack,
  manySepBy,
  manyTill,
  map,
  or,
  qthen,
  recover,
  then,
  thenq,
} from "parjs/combinators";

type Mult = {
  tag: "mult";
  X: number;
  Y: number;
};

type Do = {
  tag: "do";
};

type Dont = {
  tag: "dont";
};

const Op = makeADT("tag")({
  mult: ofType<Mult>(),
  do: ofType<Do>(),
  dont: ofType<Dont>(),
});

const mult = string("mul(").pipe(
  qthen(int()),
  thenq(string(",")),
  then(int()),
  thenq(string(")")),
  recover(() => ({ kind: "Soft" })),
  map((result) => Op.of.mult({ X: result[0], Y: result[1] }))
);

const do_ = string("do()").pipe(map(Op.of.do));
const dont = string("don't()").pipe(map(Op.of.dont));
const op = mult.pipe(or(do_), or(dont));

const sep = anyChar().pipe(manyTill(op.pipe(or(eof()), backtrack())));

const parser = sep.pipe(qthen(op.pipe(manySepBy(sep))), thenq(rest()));

const input = await Bun.file("input.txt").text();

const ops = parser.parse(input).value;

export const part1 = ops.reduce(
  (acc, op) => (op.tag === "mult" ? acc + op.X * op.Y : acc),
  0
);

export const part2 = ops.reduce(
  ({ enabled, result }, op) =>
    Op.matchStrict({
      do: () => ({ enabled: true, result }),
      dont: () => ({ enabled: false, result }),
      mult: ({ X, Y }) => ({
        enabled,
        result: result + X * Y * Number(enabled),
      }),
    })(op),
  { enabled: true, result: 0 }
);
