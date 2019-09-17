import * as ResponseMock from "./response-data-mock";

export const stateAfterZipRequestSend = {
  loading: true,
  zipCode: "33101",
  error: undefined,
};

export const stateAfterZipRequestSuccess = {
  ...stateAfterZipRequestSend,
  loading: false,
  coordinates: ResponseMock.zipResponseData,
};

export const stateAfterZipRequestError = {
  ...stateAfterZipRequestSend,
  loading: false,
  coordinates: undefined,
  error: "Some server error.",
};

export const stateAfterRemoveZipValue = {
  ...stateAfterZipRequestSuccess,
  zipCode: undefined,
  coordinates: undefined,
  error: undefined,
  loading: false,
};

export const stateAfterSetZipValue = {
  ...stateAfterRemoveZipValue,
  zipCode: "33101",
};
