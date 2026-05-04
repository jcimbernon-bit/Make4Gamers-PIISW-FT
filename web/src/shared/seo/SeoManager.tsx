import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_OG_IMAGE,
  HREFLANG_MAP,
  SITE_NAME,
  SITE_URL,
  SUPPORTED_LANGUAGES,
} from "./seo.config";

type RouteSeoRule = {
  test: (pathname: string) => boolean;
  titleKey: string;
  descriptionKey: string;
  noindex?: boolean;
};

const ROUTE_SEO_RULES: RouteSeoRule[] = [
  {
    test: (pathname) => pathname === "/",
    titleKey: "seo.home.title",
    descriptionKey: "seo.home.description",
  },
  {
    test: (pathname) => pathname === "/juegos",
    titleKey: "seo.games.title",
    descriptionKey: "seo.games.description",
  },
  {
    test: (pathname) => pathname === "/ranking",
    titleKey: "seo.ranking.title",
    descriptionKey: "seo.ranking.description",
  },
  {
    test: (pathname) => pathname === "/login",
    titleKey: "seo.login.title",
    descriptionKey: "seo.login.description",
    noindex: true,
  },
  {
    test: (pathname) => pathname === "/register",
    titleKey: "seo.register.title",
    descriptionKey: "seo.register.description",
    noindex: true,
  },
  {
    test: (pathname) => pathname === "/recuperar-password",
    titleKey: "seo.recoverPassword.title",
    descriptionKey: "seo.recoverPassword.description",
    noindex: true,
  },
  {
    test: (pathname) => pathname === "/chat",
    titleKey: "seo.chat.title",
    descriptionKey: "seo.chat.description",
    noindex: true,
  },
  {
    test: (pathname) => pathname === "/cuenta",
    titleKey: "seo.account.title",
    descriptionKey: "seo.account.description",
    noindex: true,
  },
  {
    test: (pathname) => pathname.startsWith("/game/"),
    titleKey: "seo.gameplay.title",
    descriptionKey: "seo.gameplay.description",
    noindex: true,
  },
];

const FALLBACK_RULE: RouteSeoRule = {
  test: () => true,
  titleKey: "seo.default.title",
  descriptionKey: "seo.default.description",
};

function ensureMetaTag(attr: "name" | "property", key: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${key}"]`) as
    | HTMLMetaElement
    | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function ensureCanonicalTag(href: string) {
  let element = document.querySelector("link[rel=\"canonical\"]") as
    | HTMLLinkElement
    | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function removeAlternateLanguageTags() {
  const tags = document.querySelectorAll("link[rel=\"alternate\"][hreflang]");
  tags.forEach((tag) => tag.remove());
}

function createAlternateLanguageTags(pathname: string) {
  removeAlternateLanguageTags();

  SUPPORTED_LANGUAGES.forEach((lang) => {
    const element = document.createElement("link");
    element.setAttribute("rel", "alternate");
    element.setAttribute("hreflang", HREFLANG_MAP[lang]);
    element.setAttribute("href", `${SITE_URL}${pathname}?lng=${lang}`);
    document.head.appendChild(element);
  });

  const xDefault = document.createElement("link");
  xDefault.setAttribute("rel", "alternate");
  xDefault.setAttribute("hreflang", "x-default");
  xDefault.setAttribute("href", `${SITE_URL}${pathname}`);
  document.head.appendChild(xDefault);
}

export default function SeoManager() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const pathname = location.pathname;
    const rule = ROUTE_SEO_RULES.find((currentRule) => currentRule.test(pathname)) ?? FALLBACK_RULE;

    const title = t(rule.titleKey, { defaultValue: SITE_NAME });
    const description = t(rule.descriptionKey, {
      defaultValue: "Made4Gamers platform for games, ranking, and social features.",
    });

    const canonicalUrl = `${SITE_URL}${pathname}`;
    const detectedLanguage = i18n.language.split("-")[0];
    const language = SUPPORTED_LANGUAGES.includes(
      detectedLanguage as (typeof SUPPORTED_LANGUAGES)[number],
    )
      ? detectedLanguage
      : "es";

    document.title = `${title} | ${SITE_NAME}`;
    document.documentElement.setAttribute("lang", language);

    ensureMetaTag("name", "description", description);
    ensureMetaTag("name", "robots", rule.noindex ? "noindex, nofollow" : "index, follow");

    ensureMetaTag("property", "og:type", "website");
    ensureMetaTag("property", "og:title", title);
    ensureMetaTag("property", "og:description", description);
    ensureMetaTag("property", "og:url", canonicalUrl);
    ensureMetaTag("property", "og:site_name", SITE_NAME);
    ensureMetaTag("property", "og:image", DEFAULT_OG_IMAGE);

    ensureMetaTag("name", "twitter:card", "summary_large_image");
    ensureMetaTag("name", "twitter:title", title);
    ensureMetaTag("name", "twitter:description", description);
    ensureMetaTag("name", "twitter:image", DEFAULT_OG_IMAGE);

    ensureCanonicalTag(canonicalUrl);
    createAlternateLanguageTags(pathname);
  }, [i18n.language, location.pathname, t]);

  return null;
}
