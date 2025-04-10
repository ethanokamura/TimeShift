"use client"

import { useState } from "react";

type ButtonProps = {
  eventId: string,
  clerkUserId: string,
}

// Various States of Copying
type CopyState = "idle" | "copied" | "error";

export default function CopyEventButton({ eventId, clerkUserId, ...buttonProps } : ButtonProps) {

  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyString = getCopyState(copyState);

  function getCopyState(copyState: CopyState) {
    switch (copyState) {
      case "idle":
        return "Copy Link"
      case "copied":
        return "Copied!"
      case "error":
        return "Error"
    }
  }

  return(
    <button {...buttonProps} onClick={() => {
      navigator.clipboard.writeText(
        `${location.origin}/book/${clerkUserId}/${eventId}`
      ).then(() => {
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
      }).catch(() => {
        setCopyState("error");
        setTimeout(() => setCopyState("idle"), 2000);
      })
    }}>
      {copyString}
    </button>
  );
}