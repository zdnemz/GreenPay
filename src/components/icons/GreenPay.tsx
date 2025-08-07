import * as React from "react";

interface GreenPayIconProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const GreenPayIcon: React.FC<GreenPayIconProps> = React.memo(
  ({
    width = 24,
    height = 24,
    color = "currentColor",
    strokeWidth = 4,
    className = "",
  }) => {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M49.0999 22.85C49.1091 19.7229 48.3503 16.6414 46.8902 13.8761C45.4302 11.1108 43.3135 8.74627 40.726 6.99019C38.1385 5.2341 35.1595 4.14018 32.0505 3.80447C28.9414 3.46877 25.7975 3.90157 22.8948 5.06484C19.9922 6.22812 17.4195 8.0863 15.4028 10.4762C13.3861 12.8661 11.987 15.7146 11.3284 18.7716C10.6698 21.8285 10.7719 25.0005 11.6257 28.0088C12.4794 31.0171 14.0587 33.7697 16.2249 36.025C18.9477 38.9114 20.4599 42.7321 20.4499 46.7H39.5499C39.5121 42.7586 41.0094 38.957 43.7249 36.1C47.1758 32.5532 49.1046 27.7986 49.0999 22.85Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <path
          d="M20.45 46.7H39.5499V51.475C39.5499 52.7414 39.0469 53.956 38.1514 54.8514C37.2559 55.7469 36.0414 56.25 34.775 56.25H25.225C23.9585 56.25 22.744 55.7469 21.8485 54.8514C20.953 53.956 20.45 52.7414 20.45 51.475V46.7Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <path
          d="M1.375 22.85H6.125"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <path
          d="M8.52502 3.75H13.3"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <path
          d="M8.52502 41.925H13.3"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <path
          d="M58.625 22.85H53.875"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <path
          d="M51.475 41.925H46.7"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <path
          d="M51.475 3.75H46.7"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <path
          d="M29.9879 16.0048L34.3366 20.3535C36.306 22.3321 37.4131 25.0093 37.4164 27.801C37.4197 30.5927 36.319 33.2724 34.3543 35.2557L30.0056 39.6044L25.6746 35.2734C23.6914 33.2902 22.5772 30.6004 22.5772 27.7958C22.5772 24.9911 23.6914 22.3013 25.6746 20.3181L29.9879 16.0048Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <path
          d="M30 46.375V25.225"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
      </svg>
    );
  },
);

GreenPayIcon.displayName = "GreenPayIcon";

export default GreenPayIcon;
