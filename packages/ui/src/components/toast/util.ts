export type CallbackResult = {
  errMsg: string;
};

export function successHandler(
  success?: (res: CallbackResult) => void,
  complete?: (res: CallbackResult) => void
) {
  return function (res: CallbackResult): Promise<any> {
    success && success(res);
    complete && complete(res);
    return Promise.resolve(res);
  };
}

export function errorHandler(
  fail?: (res: CallbackResult) => void,
  complete?: (res: CallbackResult) => void
) {
  return function (res: CallbackResult): Promise<any> {
    fail && fail(res);
    complete && complete(res);
    return Promise.reject(res);
  };
}
