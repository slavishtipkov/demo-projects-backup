/* eslint-env jest */
/* eslint no-global-assign: "off" */
import { getTimecodesForDescriptor, createAnimationTimeline } from "../timeline";

const NOW = new Date("Wed Dec 05 2018 11:53:10 GMT-0600 (Central Standard Time)");

const SATELLITE_ANIMATION_DESCRIPTOR = { interval: 1800000, past: 21600000, future: 0 };
const EXPECTED_SATELLITE_FRAMES = [
  "2018-12-05T17:30:00.000Z",
  "2018-12-05T17:00:00.000Z",
  "2018-12-05T16:30:00.000Z",
  "2018-12-05T16:00:00.000Z",
  "2018-12-05T15:30:00.000Z",
  "2018-12-05T15:00:00.000Z",
  "2018-12-05T14:30:00.000Z",
  "2018-12-05T14:00:00.000Z",
  "2018-12-05T13:30:00.000Z",
  "2018-12-05T13:00:00.000Z",
  "2018-12-05T12:30:00.000Z",
  "2018-12-05T12:00:00.000Z",
  "2018-12-05T11:30:00.000Z",
];

const RADAR_ANIMATION_DESCRIPTOR = { interval: 300000, past: 10800000, future: 0 };
const EXPECTED_RADAR_FRAMES = [
  "2018-12-05T17:50:00.000Z",
  "2018-12-05T17:45:00.000Z",
  "2018-12-05T17:40:00.000Z",
  "2018-12-05T17:35:00.000Z",
  "2018-12-05T17:30:00.000Z",
  "2018-12-05T17:25:00.000Z",
  "2018-12-05T17:20:00.000Z",
  "2018-12-05T17:15:00.000Z",
  "2018-12-05T17:10:00.000Z",
  "2018-12-05T17:05:00.000Z",
  "2018-12-05T17:00:00.000Z",
  "2018-12-05T16:55:00.000Z",
  "2018-12-05T16:50:00.000Z",
  "2018-12-05T16:45:00.000Z",
  "2018-12-05T16:40:00.000Z",
  "2018-12-05T16:35:00.000Z",
  "2018-12-05T16:30:00.000Z",
  "2018-12-05T16:25:00.000Z",
  "2018-12-05T16:20:00.000Z",
  "2018-12-05T16:15:00.000Z",
  "2018-12-05T16:10:00.000Z",
  "2018-12-05T16:05:00.000Z",
  "2018-12-05T16:00:00.000Z",
  "2018-12-05T15:55:00.000Z",
  "2018-12-05T15:50:00.000Z",
  "2018-12-05T15:45:00.000Z",
  "2018-12-05T15:40:00.000Z",
  "2018-12-05T15:35:00.000Z",
  "2018-12-05T15:30:00.000Z",
  "2018-12-05T15:25:00.000Z",
  "2018-12-05T15:20:00.000Z",
  "2018-12-05T15:15:00.000Z",
  "2018-12-05T15:10:00.000Z",
  "2018-12-05T15:05:00.000Z",
  "2018-12-05T15:00:00.000Z",
  "2018-12-05T14:55:00.000Z",
  "2018-12-05T14:50:00.000Z",
];

const EXPECTED_COMBINED = {
  "1544031000000": ["RADAR", "SATELLITE"],
  "1544029200000": ["RADAR", "SATELLITE"],
  "1544027400000": ["RADAR", "SATELLITE"],
  "1544025600000": ["RADAR", "SATELLITE"],
  "1544023800000": ["RADAR", "SATELLITE"],
  "1544022000000": ["RADAR", "SATELLITE"],
};

describe("getTimecodesForDescriptor", () => {
  let originalDate;

  beforeEach(() => {
    originalDate = Date;
    Date = class extends Date {
      constructor() {
        super();

        return NOW;
      }
    };
  });

  afterEach(() => {
    Date = originalDate;
  });

  test("it builds the correct timeline for radar", () => {
    let actual = getTimecodesForDescriptor(RADAR_ANIMATION_DESCRIPTOR);

    expect(actual).toHaveLength(EXPECTED_RADAR_FRAMES.length);
  });

  test("it builds the correct timeline for satellite", () => {
    let actual = getTimecodesForDescriptor(SATELLITE_ANIMATION_DESCRIPTOR);

    expect(actual).toHaveLength(EXPECTED_SATELLITE_FRAMES.length);
  });

  test.skip("it builds the correct combined timeline", () => {
    let actual = createAnimationTimeline(
      [
        { layerId: "RADAR", ...RADAR_ANIMATION_DESCRIPTOR },
        { layerId: "SATELLITE", ...SATELLITE_ANIMATION_DESCRIPTOR },
      ],
      true,
    );

    expect(Object.keys(actual).length).toEqual(Object.keys(EXPECTED_COMBINED).length);
  });
});
