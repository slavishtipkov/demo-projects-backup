import * as React from "react";
import * as i18next from "i18next";
import { TranslationOptionsBase } from "i18next";

export interface LanguageResource {
  readonly [language: string]: {
    readonly [namespace: string]: object;
  };
}

export { TranslationOptionsBase };

export type I18nInitFunction = (
  resources: LanguageResource,
  defaultNamespace?: string,
) => {
  readonly Provider: React.Provider<{ readonly t: i18next.TranslationFunction }>;
  readonly Consumer: React.Consumer<{ readonly t: i18next.TranslationFunction }>;
  readonly t: i18next.TranslationFunction;
};
export const init: I18nInitFunction = (resources, defaultNamespace) => {
  let i18n = i18next.createInstance().init({
    fallbackLng: "en",
    defaultNS: defaultNamespace ? defaultNamespace : "translations",
    resources,
  });
  const { Provider, Consumer } = React.createContext({ t: i18n.t.bind(i18n) });
  return {
    Provider,
    Consumer,
    t: i18n.t.bind(i18n),
  };
};
