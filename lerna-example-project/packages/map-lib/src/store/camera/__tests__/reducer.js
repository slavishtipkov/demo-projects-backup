/* eslint-env jest */
import { cameraReducer, initialState } from "../reducer";

test("camera reducer is properly initialized", () => {
  expect(cameraReducer()).toBe(initialState);
});
