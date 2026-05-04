import { useState } from "react";
import { Logo } from '../../../shared/icons/Logo'
import { ScrollSplitHero } from '../components/ScrollSplitHero'
import Typewriter from 'typewriter-effect'
import { useAuthStatus } from "../../auth/hooks/useAuthStatus";
import { Alert } from "../../../shared/layout/Alert";
import { useTranslation } from "react-i18next";
import { slots } from '../constants/Slots'
import Timeline from '../components/TimeLine'
import { useNavigate } from "react-router-dom";
import SubscriptionPlans from "../components/SubscriptionPlans";

export default function PublicLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading: authLoading, isAuthenticated } = useAuthStatus();
  const [showAuthNotice, setShowAuthNotice] = useState(true);

  const timelineEvents = slots.map((slot, index) => ({
    ...slot,
    button: slot.button
      ? {
          text: t(slot.button.textKey),
          onClick: index === 0 ? () => navigate("/login") : slot.button.onClick,
        }
      : undefined,
  }))

  return (
    <>

      {!authLoading && !isAuthenticated && showAuthNotice && (
        <Alert
          type="warning"
          title={t("auth.loginRequiredTitle")}
          message={t("auth.loginRequired")}
          actionLabel={t("auth.loginButton")}
          actionTo="/login"
          onClose={() => setShowAuthNotice(false)}
        />
      )}

      <section className="relative flex min-h-[100svh] items-center justify-center px-8 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
          <div className="mb-6 text-sm font-semibold uppercase tracking-[0.45em] text-lime-200 md:text-base">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString('Challenge the Top,')
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString('Be the Top.')
                  .start()
              }}
            />
          </div>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white drop-shadow-[0_0_6px_rgba(192,132,252,0.2)] md:text-8xl xl:text-[10rem]">
            Made<span className="text-violet-500">4Gamers</span>
          </h1>

          <div className="relative mt-6 inline-flex items-center justify-center isolate overflow-visible">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Logo className="h-80 w-auto text-fuchsia-400/30 blur-xl animate-spin [animation-duration:14s]" />
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Logo className="h-80 w-auto text-lime-300/35 blur-md animate-pulse" />
            </div>

            <Logo className="relative h-80 w-auto text-lime-200 drop-shadow-[0_0_12px_rgba(163,230,53,0.4)]" />
          </div>

          <div className="mx-auto my-12 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-violet-400/60 to-transparent shadow-[0_0_12px_rgba(167,139,250,0.35)]" />
          
        </div>
      </section>

      <ScrollSplitHero
        direction="right"
        imageSrc="/assets/ps5.png"
        imageAlt={t("home.splitHero.one.imageAlt")}
        title={
          <h2 className="text-6xl font-black leading-tight text-white">
            {t("home.splitHero.one.prefix")} <br />
            <span className="text-lime-200">{t("home.splitHero.one.brand")}</span>
            {t("home.splitHero.one.suffix")}
          </h2>
        }
      />

      <ScrollSplitHero
        direction="left"
        imageSrc="/assets/ps3.png"
        imageAlt={t("home.splitHero.two.imageAlt")}
        title={
          <h2 className="text-6xl font-black leading-tight text-white">
            {t("home.splitHero.two.prefix")}
            <span className="text-lime-200"> {t("home.splitHero.two.highlight")}</span>.
          </h2>
        }
      />

      <ScrollSplitHero
        direction="right"
        imageSrc="/assets/nintendo.png"
        imageAlt={t("home.splitHero.three.imageAlt")}
        title={
          <h2 className="text-6xl font-black leading-tight text-white">
            <span className="text-lime-200">{t("home.splitHero.three.highlight")}</span>
            {t("home.splitHero.three.suffix")}
          </h2>
        }
      />

      <div className="mx-auto my-12 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-violet-400/60 to-transparent shadow-[0_0_12px_rgba(167,139,250,0.35)]" />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-6 text-left text-2xl font-black tracking-wide text-violet-300 sm:text-3xl">
          {t("home.ranks.title")}
        </h2>
      </div>

      <Timeline events={timelineEvents} />

      <div className="mx-auto my-12 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-violet-400/60 to-transparent shadow-[0_0_12px_rgba(167,139,250,0.35)]" />

      <SubscriptionPlans />

    </>

  )
}