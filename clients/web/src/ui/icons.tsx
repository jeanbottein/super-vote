/** Stroke icons that follow the text colour. Decorative: controls carry their own labels. */
import type { ReactNode } from 'react';

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const BackIcon = () => (
  <Icon>
    <path d="M15 18l-6-6 6-6" />
  </Icon>
);

export const CloseIcon = () => (
  <Icon>
    <path d="M18 6L6 18M6 6l12 12" />
  </Icon>
);

export const SettingsIcon = () => (
  <Icon>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </Icon>
);

export const ShareIcon = () => (
  <Icon>
    <path d="M12 3v12M7 8l5-5 5 5" />
    <path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
  </Icon>
);

export const MailIcon = () => (
  <Icon>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Icon>
);

export const CheckIcon = () => (
  <Icon>
    <path d="M5 12l5 5 9-10" />
  </Icon>
);

export const PlusIcon = () => (
  <Icon>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = () => (
  <Icon>
    <path d="M5 12h14" />
  </Icon>
);

export const QuestionIcon = () => (
  <Icon>
    <path d="M5 4h14a2 2 0 012 2v9a2 2 0 01-2 2h-8l-5 4v-4H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
    <path d="M9.75 8.75a2.25 2.25 0 113.4 1.95c-.7.4-1.15.9-1.15 1.55M12 14.5h0" />
  </Icon>
);

export const ResultsIcon = () => (
  <Icon>
    <path d="M5 20v-8M12 20V5M19 20v-5" />
  </Icon>
);

/** Half of it filled: "partly", between a tick and a cross. */
export const PartlyIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4a8 8 0 000 16z" fill="currentColor" />
  </Icon>
);

export const CupIcon = () => (
  <Icon>
    <path d="M4 9h12v5a5 5 0 01-5 5H9a5 5 0 01-5-5z" />
    <path d="M16 11h1.5a2.5 2.5 0 010 5H16M8 3.5V6M12 3.5V6" />
  </Icon>
);

export const HeartIcon = () => (
  <Icon>
    <path d="M12 20s-7.5-4.4-7.5-10.2A4.3 4.3 0 0112 7a4.3 4.3 0 017.5 2.8C19.5 15.6 12 20 12 20z" />
  </Icon>
);
