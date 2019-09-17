import { init } from "@dtn/i18n-lib";
import * as translations from "./translations";

const { Consumer, Provider, t } = init(
  {
    en: {
      map: translations.en_US,
    },
  },
  "map",
);

export { Consumer, Provider, t };
