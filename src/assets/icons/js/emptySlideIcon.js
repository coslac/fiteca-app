import * as React from "react";

const EmptySlideIcon = (props) => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="mask0_2999_68979"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={48}
      height={48}
    >
      <rect
        x={5.99316}
        y={5.99316}
        width={36.015}
        height={6.0025}
        rx={1}
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x={7.99316}
        y={11.9951}
        width={32.0133}
        height={22.0092}
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.0082 34.0043H5.99316"
        stroke="#788CA0"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.0004 34.0049V38.0066"
        stroke="#788CA0"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx={24.0003}
        cy={41.0071}
        rx={3.00125}
        ry={3.00125}
        stroke="#323232"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </mask>
    <g mask="url(#mask0_2999_68979)">
      <rect width={48} height={48} fill="#3E4859" />
    </g>
  </svg>
);

export default EmptySlideIcon;
