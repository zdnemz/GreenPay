"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";

export default function CTASection() {
  return (
    <section className="relative grid h-[70vh] w-full items-center overflow-hidden">
      <div className="space-y-3">
        {/* text */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold md:text-5xl">
            Mulai Tukar Sampahmu dan Dapatkan <br />
            <span className="text-primary">Saldo Digital!</span>
          </h1>
        </div>
        {/* content */}
        <div>
          <Button
            size="lg"
            className="relative cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
          >
            Daftar Gratis Sekarang
          </Button>
        </div>
      </div>
      {/* blob */}
      <div className="absolute bottom-0 w-full translate-x-[-50vw] translate-y-[50%]">
        <Blob />
      </div>
    </section>
  );
}

function Blob() {
  return (
    <svg
      className="h-full w-[200vw] opacity-60"
      width="4137"
      height="855"
      viewBox="0 0 4137 855"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g style={{ mixBlendMode: "overlay" }} filter="url(#filter0_f_56_423)">
        <path
          d="M3048 558H1016V340L2032 427.2L3048 340V558Z"
          fill="url(#paint0_linear_56_423)"
        />
      </g>
      <g style={{ mixBlendMode: "overlay" }} filter="url(#filter1_f_56_423)">
        <path
          d="M2567 622H1476V449L2021.5 518.2L2567 449V622Z"
          fill="url(#paint1_linear_56_423)"
        />
      </g>
      <g style={{ mixBlendMode: "overlay" }} filter="url(#filter2_f_56_423)">
        <path
          d="M3101 359H1069V121L2085 216.2L3101 121V359Z"
          fill="url(#paint2_linear_56_423)"
        />
      </g>
      <g style={{ mixBlendMode: "overlay" }} filter="url(#filter3_f_56_423)">
        <path
          d="M4117 557H2085V319L3101 414.2L4117 319V557Z"
          fill="url(#paint3_linear_56_423)"
        />
      </g>
      <g filter="url(#filter4_f_56_423)">
        <path
          d="M1257.3 655.751C1171.37 652.492 1089.46 595.724 1073.54 528.389C1052.3 438.631 1092.33 373.539 1053.88 277.633C1028.73 214.898 1010.92 117.016 1110.41 111.609C1172.23 108.253 1234.72 145.888 1310.51 232.107C1363.18 292.018 1389.1 311.587 1463.15 347.335C1623.69 424.822 1653.38 498.739 1515.06 551.612C1434.76 582.307 1360.64 659.686 1257.3 655.751Z"
          fill="url(#paint4_linear_56_423)"
        />
      </g>
      <g filter="url(#filter5_f_56_423)">
        <path
          d="M2959.92 527.286C2910.66 597.77 2818.58 635.902 2753.35 612.838C2666.38 582.102 2633.33 513.206 2531.88 493.61C2465.51 480.796 2373.57 442.775 2422.89 356.202C2453.54 302.407 2519.01 270.238 2632.53 253.2C2711.42 241.352 2741.91 230.151 2812.05 187.246C2964.12 94.2157 3042.34 109.274 3011.9 254.195C2994.24 338.32 3019.17 442.537 2959.92 527.286Z"
          fill="url(#paint5_linear_56_423)"
        />
      </g>
      <g filter="url(#filter6_f_56_423)">
        <path
          d="M2207.29 698.051C2131.77 739.188 2032.36 732.283 1984.24 682.558C1920.09 616.281 1921.21 539.874 1839.13 477.112C1785.44 436.06 1720.08 361.046 1802.82 305.53C1854.23 271.035 1927.18 271.424 2036.39 306.771C2112.29 331.328 2144.58 334.89 2226.49 327.749C2404.08 312.254 2467.39 360.598 2375.55 476.762C2322.24 544.195 2298.1 648.597 2207.29 698.051Z"
          fill="url(#paint6_linear_56_423)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_56_423"
          x="886"
          y="210"
          width="2292"
          height="478"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="65"
            result="effect1_foregroundBlur_56_423"
          />
        </filter>
        <filter
          id="filter1_f_56_423"
          x="1346"
          y="319"
          width="1351"
          height="433"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="65"
            result="effect1_foregroundBlur_56_423"
          />
        </filter>
        <filter
          id="filter2_f_56_423"
          x="939"
          y="-9.00012"
          width="2292"
          height="498"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="65"
            result="effect1_foregroundBlur_56_423"
          />
        </filter>
        <filter
          id="filter3_f_56_423"
          x="1955"
          y="189"
          width="2292"
          height="498"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="65"
            result="effect1_foregroundBlur_56_423"
          />
        </filter>
        <filter
          id="filter4_f_56_423"
          x="904.218"
          y="-18.5965"
          width="829.034"
          height="804.492"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="65"
            result="effect1_foregroundBlur_56_423"
          />
        </filter>
        <filter
          id="filter5_f_56_423"
          x="2278.91"
          y="-1.17502"
          width="869.481"
          height="750.74"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="65"
            result="effect1_foregroundBlur_56_423"
          />
        </filter>
        <filter
          id="filter6_f_56_423"
          x="1633.51"
          y="149.956"
          width="913.945"
          height="704.938"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="65"
            result="effect1_foregroundBlur_56_423"
          />
        </filter>
        <linearGradient
          id="paint0_linear_56_423"
          x1="3048"
          y1="449"
          x2="1016"
          y2="449"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--chart-2)" />
          <stop offset="0.5" stopColor="var(--chart-3)" />
          <stop offset="0.75" stopColor="var(--chart-4)" />
          <stop offset="1" stopColor="var(--chart-5)" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_56_423"
          x1="2567"
          y1="535.5"
          x2="1476"
          y2="535.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--chart-2)" />
          <stop offset="0.5" stopColor="var(--chart-3)" />
          <stop offset="0.75" stopColor="var(--chart-4)" />
          <stop offset="1" stopColor="var(--chart-5)" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_56_423"
          x1="3101"
          y1="240"
          x2="1069"
          y2="240"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--chart-2)" />
          <stop offset="0.5" stopColor="var(--chart-3)" />
          <stop offset="0.75" stopColor="var(--chart-4)" />
          <stop offset="1" stopColor="var(--chart-5)" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_56_423"
          x1="4117"
          y1="438"
          x2="2085"
          y2="438"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--chart-2)" />
          <stop offset="0.5" stopColor="var(--chart-3)" />
          <stop offset="0.75" stopColor="var(--chart-4)" />
          <stop offset="1" stopColor="var(--chart-5)" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_56_423"
          x1="981.243"
          y1="302.575"
          x2="1579.54"
          y2="540.848"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--chart-2)" />
          <stop offset="0.5" stopColor="var(--chart-3)" />
          <stop offset="0.75" stopColor="var(--chart-4)" />
          <stop offset="1" stopColor="var(--chart-5)" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_56_423"
          x1="2513.52"
          y1="568.186"
          x2="3037.77"
          y2="194.15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--chart-2)" />
          <stop offset="0.5" stopColor="var(--chart-3)" />
          <stop offset="0.75" stopColor="var(--chart-4)" />
          <stop offset="1" stopColor="var(--chart-5)" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_56_423"
          x1="1789.46"
          y1="535.688"
          x2="2425.47"
          y2="434.539"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--chart-2)" />
          <stop offset="0.5" stopColor="var(--chart-3)" />
          <stop offset="0.75" stopColor="var(--chart-4)" />
          <stop offset="1" stopColor="var(--chart-5)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
