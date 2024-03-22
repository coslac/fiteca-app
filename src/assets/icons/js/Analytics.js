import * as React from "react";
import Icon from "react-icon-base";

const AnalyticsIcon = (props) => (
    <Icon 
    viewBox="0 0 24 24"
    {...props}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round">
              <title>{props.title || "Analytics"}</title>

            <g mask="url(#mask0_3207_98184)">

    <path fillRule="evenodd" clipRule="evenodd" d="M21 12V12C21 16.971 16.971 21 12 21V21C7.029 21 3 16.971 3 12V12C3 7.029 7.029 3 12 3V3C16.971 3 21 7.029 21 12Z" />
    <path d="M18.364 18.364L12.293 12.293C12.105 12.105 12 11.851 12 11.586V3" />
    <path d="M12.0703 11.96L19.7903 7.5" />
    </g>
    </Icon>
);

export default AnalyticsIcon;
