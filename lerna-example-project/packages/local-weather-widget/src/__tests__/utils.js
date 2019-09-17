/* eslint-env jest */
import { areCoordinatesValid } from "../utils";

test("expect coordinates to be valid", () => {
  const coordinates = {
    lat: -33.898197,
    lon: 90.716944,
  };
  expect(areCoordinatesValid(coordinates)).toBeTruthy();
});

test("expect coordinates to be invalid", () => {
  const coordinates = {
    lat: -33.898197,
    lon: 900.716944,
  };
  expect(areCoordinatesValid(coordinates)).toBeFalsy();
});
