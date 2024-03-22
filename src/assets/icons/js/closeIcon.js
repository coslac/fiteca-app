import * as React from "react";

const CloseIcon = (props) => (
  <svg
    width={36}
    height={36}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 8.5L16 16.5"
      stroke="#8B61FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 8.5L8 16.5"
      stroke="#8B61FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CloseIcon;
