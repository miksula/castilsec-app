import { html } from "lit";

export const LogoCastleIcon = () =>
  html`
    <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path
          d="M50 8 L84 22 L84 53 C84 73 50 92 50 92 C50 92 16 73 16 53 L16 22 Z"
          fill="none"
          stroke="currentColor"
          stroke-width="4.5"
          stroke-linejoin="round"
        />
        <rect x="33" y="33" width="8" height="12" fill="currentColor" rx="1" />
        <rect x="46" y="33" width="8" height="12" fill="currentColor" rx="1" />
        <rect x="59" y="33" width="8" height="12" fill="currentColor" rx="1" />
        <path
          d="M33 44 H67 V64 H33 Z M43 64 L43 58 Q50 48 57 58 L57 64 Z"
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
        />
      </svg>
  `;
