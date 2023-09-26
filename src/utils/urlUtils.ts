export type ClearSearchParamsParam = string | string[];
export type ChangeSearchParamsParam =
  | { name: string; value: string }
  | [string, string][];

export const clearSearchParams = (
  urlSearchParams: URLSearchParams,
  value: ClearSearchParamsParam
) => {
  if (Array.isArray(value)) {
    value.forEach((n) => urlSearchParams.delete(n));
  } else {
    urlSearchParams.delete(value);
  }
  return urlSearchParams;
};

export const changeSearchParams = (
  urlSearchParams: URLSearchParams,
  obj: ChangeSearchParamsParam
) => {
  if (Array.isArray(obj)) {
    obj.forEach(([name, value]) => {
      urlSearchParams.set(name, value);
    });
  } else {
    urlSearchParams.set(obj.name, obj.value);
  }
  return urlSearchParams;
};
