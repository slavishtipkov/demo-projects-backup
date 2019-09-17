import * as React from "react";
import { init, TranslationOptionsBase } from "@dtn/i18n-lib";
import en from "./translations/en";

const { Consumer, Provider, t } = init(
  {
    en: {
      zipCode: en,
    },
  },
  "zipCode",
);

export { Consumer, Provider, t };
