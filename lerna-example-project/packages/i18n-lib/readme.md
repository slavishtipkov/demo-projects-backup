# @dtn/i18n-lib

A package for use internationalizing DTN widgets.
This packages relies on [i18next](https://www.i18next.com) for the underlying i18n library implementation.

## Install

```sh
npm install --dev @dtn/i18n-lib
```

## API

### `enum Locale`

The `Locale` enum contains the language codes for all support locales. This enum should always be used to handling branching logic, locale configurations, API headers/query-parameters, etc.

Currently they are:

- ENGLISH - For english locales

```TypeScript
import { Locale } from "@dtn/i18n-lib";

Locale.ENGLISH;
```

### `enum Units`

The `Units` enum contains the unit codes for all supported units of measurement. This enum should always be used handling branching logic, units configurations, API headers/query-parameters, etc.

Currently they are:

- IMPERIAL - For imperial units
- METRIC - For metric units

```TypeScript
import { Units } from "@dtn/i18n-lib";

Units.IMPERIAL;
Units.METRIC;
```

### `enum Clock`

The `Clock` enum contains the two time display formats supported. This enum should always be used for handling branching logic, time configurations, API headers/query-parameters, etc.

They are:

- TWELVE_HOUR - For twelve hour display e.g. 4:56 PM
- TWENTY_FOUR_HOUR - For twenty-four/military time display e.g. 14:00

```TypeScript
import { Clock } from "@dtn/i18n-lib";

Clock.TWELVE_HOUR;
Clock.TWENTRY_FOUR_HOUR;
```

### `init`

`init` implements this type

```TypeScript
export type I18nInitFunction = (
  resources: LanguageResource,
  defaultNamespace?: string,
) => {
  readonly Provider: React.Provider<{ readonly t: i18next.TranslationFunction }>;
  readonly Consumer: React.Consumer<{ readonly t: i18next.TranslationFunction }>;
  readonly t: i18next.TranslationFunction;
};
```

## Key Concepts

The i18n lib is based around two key concepts

1.  [i18next's `t` translation function](https://www.i18next.com/translation-function/essentials)
2.  [React's Context API](https://reactjs.org/docs/context.html)

## Recipes

### Setting Up a Widget for Internationalization

Create an `i18n.tsx` module in the `src/` directory of the widget.

```TypeScript
// i18n.tsx
import * as React from "react";
// Import the init function
import { init, TranslationOptionsBase } from "@dtn/i18n-lib";
// Import language bundles
import englishTranslations from "./translations/en";
import spanishTranslations from "./translations/es";

// Initialize the i18n lib
const { Consumer, Provider, t } = init(
  {
    en: {
      myNamespace: englishTranslations,
    },
    es: {
      myNamespace: spanishTranslations,
    },
  },
  "myNamespace",
);

// Export the Consumer, Provider, and translation function returned from the i18n lib
export { Consumer, Provider, t };


// my-component.tsx
// Now import the consumer, provider, or translation function directly from the i18n module
import { Consumer as I18nConsumer } from "../i18n";
```

### Internationalizing a Class-Based Component

```TypeScript
import * as React from "react";
import { Consumer as I18nConsumer } from "../i18n";

export class MyComponent extends React.Component<Props, State> {
  render() {
    return (
      <I18nConsumer>
        {({ t }) => (
          <p>{t("my.translation.key")}</p>
        )}
      </I18nConsumer>
    )
  }
}
```
