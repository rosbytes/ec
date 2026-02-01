const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      {/* ROS Logo - Green hexagonal badge */}
      <div className="relative flex items-center justify-center">
        <svg 
          width="48" 
          height="52" 
          viewBox="0 0 48 52" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          {/* Hexagon shape */}
          <path 
            d="M24 2L44 14V38L24 50L4 38V14L24 2Z" 
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* ROS text inside */}
          <text 
            x="24" 
            y="22" 
            textAnchor="middle" 
            fill="white" 
            fontSize="10" 
            fontWeight="bold"
            fontFamily="system-ui"
          >
            R
          </text>
          <text 
            x="14" 
            y="36" 
            textAnchor="middle" 
            fill="white" 
            fontSize="10" 
            fontWeight="bold"
            fontFamily="system-ui"
          >
            O
          </text>
          <text 
            x="34" 
            y="36" 
            textAnchor="middle" 
            fill="white" 
            fontSize="10" 
            fontWeight="bold"
            fontFamily="system-ui"
          >
            S
          </text>
        </svg>
      </div>
      
      {/* Brand text */}
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-bold text-primary tracking-wide">REPUBLIC OF</span>
        <span className="text-xl font-extrabold text-primary tracking-wider">SABJIWALA</span>
      </div>
    </div>
  );
};

export default Logo;
