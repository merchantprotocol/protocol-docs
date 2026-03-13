import React from 'react';

function GridBackground() {
  return (
    <svg
      width="1512"
      height="684"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        minWidth: 1200,
        height: '100%',
        pointerEvents: 'none',
      }}>
      <path
        opacity={0.3}
        d="M1425.16-141.045v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.726-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.729-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.729-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.729-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.729-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5m-54.73-824.5v824.5M1533.2 627.303H.767m1532.433-55.44H.767M1533.2 517.844H.767M1533.2 462.403H.767M1533.2 408.384H.767m1532.433-55.44H.767M1533.2 298.925H.767M1533.2 243.484H.767M1533.2 189.465H.767m1532.433-55.44H.767M1533.2 80.005H.767M1533.2 24.566H.767M1533.2-29.454H.767M1533.2-84.894H.767"
        stroke="url(#splashGrid)"
        strokeWidth={0.8}
      />
      <defs>
        <radialGradient
          id="splashGrid"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 -591.533 857.267 0 766.983 683.455)">
          <stop stopColor="#3fb950" />
          <stop offset={1} stopColor="#3fb950" stopOpacity={0} />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default GridBackground;
