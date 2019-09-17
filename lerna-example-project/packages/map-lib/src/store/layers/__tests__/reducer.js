/* eslint-env jest */
import { layersReducer, initialState } from "../reducer";

test("layers reducer is properly initialized", () => {
  expect(layersReducer()).toBe(initialState);
});
