import React from 'react';

interface HomeIconProps {
  className?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({ className = "" }) => {
  return (
    <svg 
      width="98" 
      height="99" 
      viewBox="0 0 98 99" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M61.375 86V53.3333C61.375 52.2504 60.9492 51.2118 60.1912 50.446C59.4333 49.6802 58.4052 49.25 57.3333 49.25H41.1667C40.0947 49.25 39.0667 49.6802 38.3088 50.446C37.5508 51.2118 37.125 52.2504 37.125 53.3333V86" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12.875 41.0835C12.8747 39.8955 13.131 38.7218 13.6259 37.6442C14.1208 36.5665 14.8425 35.611 15.7405 34.8442L44.0322 10.3482C45.4912 9.10245 47.3397 8.41895 49.25 8.41895C51.1603 8.41895 53.0088 9.10245 54.4678 10.3482L82.7595 34.8442C83.6575 35.611 84.3792 36.5665 84.8741 37.6442C85.369 38.7218 85.6253 39.8955 85.625 41.0835V77.8335C85.625 79.9994 84.7734 82.0766 83.2574 83.6082C81.7415 85.1397 79.6855 86.0002 77.5417 86.0002H20.9583C18.8145 86.0002 16.7585 85.1397 15.2426 83.6082C13.7266 82.0766 12.875 79.9994 12.875 77.8335V41.0835Z" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HomeIcon;