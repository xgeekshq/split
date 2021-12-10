export const removeElementAtIndex = <T>(
  array: Array<T>,
  index: number,
): Array<T> => {
  const newArray = [...array];
  newArray.splice(index, 1);
  return newArray;
};

export const addElementAtIndex = <T>(
  array: Array<T>,
  index: number,
  element: T,
): Array<T> => {
  const newArray = [...array];
  newArray.splice(index, 0, element);
  return newArray;
};
