export const extract = <T extends Object, K extends T[keyof T]>(
  a: T[],
  key: keyof T
): K[] => {
  return a.map((item) => item[key] as K);
};

export const sortByObjectKey = <T extends Object>(
  a: T[],
  key: keyof T
): T[] => {
  return a.sort((a, b) => (a[key] as any) - (b[key] as any));
};
