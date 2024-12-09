export type StepCallback<T> = () => T | null;

export type IterateCallback<T, R> = ({ step }: { step: StepCallback<T> }) => R;

export interface Iterate<T, R> {
  iterate(cb: IterateCallback<T, R>): R;
}
