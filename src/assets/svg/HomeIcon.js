import React from 'react';
import Svg, { Path } from 'react-native-svg';

const HomeIcon = ({
  size = 24,
  color = '#111111',
  strokeWidth = 2,
  filled = false,
  style,
  ...props
}) => {
  // viewBox is 24x24 — common for icons
  if (filled) {
    // simple filled home shape
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        {...props}
      >
        <Path
          d="M12 3.2l8 6.1v8.7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.3l8-6.1zM9 20v-6h6v6"
          fill={color}
        />
      </Svg>
    );
  }

  // outline version
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      {...props}
    >
      {/* Roof */}
      <Path
        d="M3 10.5L12 3l9 7.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* House body */}
      <Path
        d="M5 10.5v8.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Door */}
      <Path
        d="M9 20v-6h6v6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};

export default HomeIcon;
