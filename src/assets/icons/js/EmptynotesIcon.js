import * as React from "react";

const NotesIcon = (props) => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="mask0_2618_9257"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={48}
      height={48}
    >
      <path
        d="M20 38H9.4C7.522 38 6 36.408 6 34.444V9.556C6 7.592 7.522 6 9.4 6H36.6C38.478 6 40 7.592 40 9.556V18"
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 14H30"
        stroke="#788CA0"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 22H30"
        stroke="#788CA0"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 30H20"
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.586 41.414L43.414 32.586C44.196 31.804 44.196 30.538 43.414 29.758L40.242 26.586C39.46 25.804 38.194 25.804 37.414 26.586L28.586 35.414C28.21 35.79 28 36.298 28 36.828V42H33.172C33.702 42 34.21 41.79 34.586 41.414V41.414Z"
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </mask>
    <g mask="url(#mask0_2618_9257)">
      <rect width={48} height={48} fill="#3E4859" />
    </g>
  </svg>
);

export default NotesIcon;
