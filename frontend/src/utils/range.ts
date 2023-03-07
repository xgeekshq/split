const range = (startAt: number, size: number): Array<number> => {
  const length = size - startAt + 1;
  return Array.from({ length }, (_, i) => i + startAt);
};

export default range;
