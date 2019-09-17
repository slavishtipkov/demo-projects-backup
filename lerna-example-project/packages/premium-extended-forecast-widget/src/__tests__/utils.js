/* eslint-env jest */
import { getWindDirection, getClearOrMostlyClearDescription } from "../utils";

test("getWindDirection convert properly for N", () => {
  expect(getWindDirection(0)).toBe("N");
  expect(getWindDirection(11)).toBe("N");
  expect(getWindDirection(360)).toBe("N");
  expect(getWindDirection(6)).toBe("N");
  expect(getWindDirection(349)).toBe("N");
  expect(getWindDirection(355)).toBe("N");
});

test("getWindDirection convert properly for S", () => {
  expect(getWindDirection(180)).toBe("S");
  expect(getWindDirection(191)).toBe("S");
  expect(getWindDirection(169)).toBe("S");
  expect(getWindDirection(170)).toBe("S");
  expect(getWindDirection(188)).toBe("S");
});

test("getWindDirection convert properly for E", () => {
  expect(getWindDirection(79)).toBe("E");
  expect(getWindDirection(90)).toBe("E");
  expect(getWindDirection(101)).toBe("E");
  expect(getWindDirection(95)).toBe("E");
  expect(getWindDirection(88)).toBe("E");
});

test("getWindDirection convert properly for W", () => {
  expect(getWindDirection(259)).toBe("W");
  expect(getWindDirection(270)).toBe("W");
  expect(getWindDirection(281)).toBe("W");
  expect(getWindDirection(267)).toBe("W");
  expect(getWindDirection(275)).toBe("W");
});

test("getWindDirection convert properly for NNE", () => {
  expect(getWindDirection(12)).toBe("NNE");
  expect(getWindDirection(33)).toBe("NNE");
  expect(getWindDirection(21)).toBe("NNE");
});

test("getWindDirection convert properly for NE", () => {
  expect(getWindDirection(56)).toBe("NE");
  expect(getWindDirection(34)).toBe("NE");
  expect(getWindDirection(48)).toBe("NE");
});

test("getWindDirection convert properly for ENE", () => {
  expect(getWindDirection(57)).toBe("ENE");
  expect(getWindDirection(78)).toBe("ENE");
  expect(getWindDirection(66)).toBe("ENE");
});

test("getWindDirection convert properly for ESE", () => {
  expect(getWindDirection(102)).toBe("ESE");
  expect(getWindDirection(123)).toBe("ESE");
  expect(getWindDirection(111)).toBe("ESE");
});

test("getWindDirection convert properly for SE", () => {
  expect(getWindDirection(146)).toBe("SE");
  expect(getWindDirection(124)).toBe("SE");
  expect(getWindDirection(133)).toBe("SE");
});

test("getWindDirection convert properly for SSE", () => {
  expect(getWindDirection(147)).toBe("SSE");
  expect(getWindDirection(168)).toBe("SSE");
  expect(getWindDirection(155)).toBe("SSE");
});

test("getWindDirection convert properly for SSW", () => {
  expect(getWindDirection(192)).toBe("SSW");
  expect(getWindDirection(213)).toBe("SSW");
  expect(getWindDirection(200)).toBe("SSW");
});

test("getWindDirection convert properly for SW", () => {
  expect(getWindDirection(214)).toBe("SW");
  expect(getWindDirection(236)).toBe("SW");
  expect(getWindDirection(222)).toBe("SW");
});

test("getWindDirection convert properly for WSW", () => {
  expect(getWindDirection(258)).toBe("WSW");
  expect(getWindDirection(237)).toBe("WSW");
  expect(getWindDirection(248)).toBe("WSW");
});

test("getWindDirection convert properly for WNW", () => {
  expect(getWindDirection(282)).toBe("WNW");
  expect(getWindDirection(303)).toBe("WNW");
  expect(getWindDirection(291)).toBe("WNW");
});

test("getWindDirection convert properly for NW", () => {
  expect(getWindDirection(326)).toBe("NW");
  expect(getWindDirection(304)).toBe("NW");
  expect(getWindDirection(315)).toBe("NW");
});

test("getWindDirection convert properly for NNW", () => {
  expect(getWindDirection(327)).toBe("NNW");
  expect(getWindDirection(348)).toBe("NNW");
  expect(getWindDirection(337)).toBe("NNW");
});

test("getWindDirection convert properly for bigger or less then normal degree", () => {
  expect(getWindDirection(-1)).toBe("-");
  expect(getWindDirection(700)).toBe("-");
  expect(getWindDirection(null)).toBe("-");
  expect(getWindDirection(undefined)).toBe("-");
});

test('clear description should be shown if it\'s "Sunny" and it is after sunset', () => {
  const isNightIconShouldBeShown = true;
  const weatherCode = 22; // Sunny code
  const clearOrMostlyClearDescription = getClearOrMostlyClearDescription(
    isNightIconShouldBeShown,
    weatherCode,
  );

  expect(clearOrMostlyClearDescription).toEqual("clear");
});

test('clear description should be shown if it\'s "Clear" and it is after sunset', () => {
  const isNightIconShouldBeShown = true;
  const weatherCode = 21; // Clear code
  const clearOrMostlyClearDescription = getClearOrMostlyClearDescription(
    isNightIconShouldBeShown,
    weatherCode,
  );

  expect(clearOrMostlyClearDescription).toEqual("clear");
});

test('no description from getClearOrMostlyClearDescription if it\'s not "Sunny" or "Mostly Sunny" and it is after sunset', () => {
  const isNightIconShouldBeShown = true;
  const weatherCode = 3;
  const clearOrMostlyClearDescription = getClearOrMostlyClearDescription(
    isNightIconShouldBeShown,
    weatherCode,
  );

  expect(clearOrMostlyClearDescription).toEqual("");
});

test('no description from getClearOrMostlyClearDescription if it\'s  "Sunny" and it is before sunset', () => {
  const isNightIconShouldBeShown = false;
  const weatherCode = 22; // Sunny code
  const clearOrMostlyClearDescription = getClearOrMostlyClearDescription(
    isNightIconShouldBeShown,
    weatherCode,
  );

  expect(clearOrMostlyClearDescription).toEqual("");
});
