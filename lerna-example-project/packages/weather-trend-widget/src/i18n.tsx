import { init } from "@dtn/i18n-lib";
import * as translations from "./translations";

const { Consumer, Provider, t } = init(
  {
    en: {
      weatherTrend: translations.en_US,
    },
  },
  "weatherTrend",
);

export { Consumer, Provider, t };
