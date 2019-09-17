export const ERRORS: {
  readonly GEOLOCATION_ERROR: {
    readonly key: string;
    readonly value: string;
  };
  readonly ZIP_CODE_INPUT_ERROR: {
    readonly key: string;
    readonly value: string;
  };
  readonly [key: string]: {
    readonly key: string;
    readonly value: string;
  };
} = {
  GEOLOCATION_ERROR: {
    key: "GEOLOCATION_ERROR",
    value: "Geolocation Error: Please check if this is a valid zip code.",
  },
  ZIP_CODE_INPUT_ERROR: {
    key: "ZIP_CODE_INPUT_ERROR",
    value: "Error: Zip Code is required field.",
  },
};
