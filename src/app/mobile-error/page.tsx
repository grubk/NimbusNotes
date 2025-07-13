"use client";

import ErrorPage from "./mobile-error";

export default function MobileErrorPage() {
  const mobileError = new Error("Nimbus Notes is currently not supported on mobile devices. Please switch to a desktop browser.");

  return (
    <ErrorPage
      error={mobileError}
      reset={() => {}}
    />
  );
}
