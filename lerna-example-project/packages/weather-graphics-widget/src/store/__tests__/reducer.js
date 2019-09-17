/* eslint-env jest */
import { reducer, initialState } from "../reducers";

test("reducer is properly initialized", () => {
  expect(reducer()).toBe(initialState);
});
