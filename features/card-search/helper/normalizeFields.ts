export const normalizeFields = <TData>(data: string[] | string) => {
  if (typeof data === "string") {
    return data.toLowerCase() as TData;
  }

  return data.map((item) => item.toLowerCase()) as TData;
};
