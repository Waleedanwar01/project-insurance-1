import React from "react";

const SleekAnimatedBanner = ({ companyInfo }) => {
  return (
    <div className="flex justify-center items-center p-4 bg-gray-50 w-full font-sans">
      <div
        className="relative flex flex-col md:flex-row items-center justify-between 
        bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 
        rounded-xl shadow-xl max-w-4xl w-full overflow-hidden border border-gray-700"
      >
        {/* Left Text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4 md:mb-0 md:mr-6 z-20 flex-grow">
          <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-widest">
            Help protect yourself on the road with
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight text-white">
            {companyInfo?.company_name ? (
              <>
                {companyInfo.company_name.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-red-500">{companyInfo.company_name.split(' ').slice(-1).join(' ')}</span>
              </>
            ) : (
              <>Insurance <span className="text-red-500">Panda</span></>
            )}
          </h2>
        </div>

        {/* Stylish Button */}
        <a
        
          href="#Tohero"
          className="group relative inline-flex items-center justify-center 
          w-full md:w-auto px-7 py-3 sm:px-9 sm:py-3 text-base font-bold text-white 
          bg-red-600 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)] border-2 border-red-500
          transition duration-300 ease-in-out transform hover:scale-[1.08] 
          hover:shadow-[0_0_25px_rgba(239,68,68,0.9)] overflow-hidden z-20"
          aria-label="Get a Free Quote Now"
        >
          {/* gradient ring effect */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 opacity-0 group-hover:opacity-100 blur-sm transition duration-500 z-10"></span>

          {/* Button Content */}
          <span className="relative z-20 flex items-center font-semibold tracking-wider uppercase">
            <svg
              className="w-6 h-6 mr-2 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Get Quote
          </span>
        </a>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_top,_var(--tw-color-gray-500),_transparent)] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default SleekAnimatedBanner;
