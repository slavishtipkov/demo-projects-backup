/* eslint-env jest */
import { weatherDataReducer, initialState } from "../reducer";

test("reducer is properly initialized", () => {
  expect(weatherDataReducer()).toBe(initialState);
});
