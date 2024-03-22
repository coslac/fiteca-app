import React from "react";
import Icon from "react-icon-base";

export default (props) => {
  return (
    <Icon
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{props.title || "Scriptsicon"}</title>
      <g>
        <path d="M2.99609 18.0094L4.22193 19.1139L6.69096 16.8916" />
        <path d="M2.99609 12.0065L4.22193 13.1109L6.68963 10.8887" />
        <path d="M10.998 18.5031H21.0022" />
        <path d="M10.998 12.5002H21.0022" />
        <path d="M2.99609 6.00452L4.22193 7.10898L6.68963 4.88672" />
        <path d="M10.998 6.49826H21.0022" />
      </g>
    </Icon>
  );
};
