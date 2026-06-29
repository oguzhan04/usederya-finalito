/* eslint-disable @next/next/no-img-element */
import { FirstBentoAnimation } from "@/components/first-bento-animation";
import { FourthBentoAnimation } from "@/components/fourth-bento-animation";
import { SecondBentoAnimation } from "@/components/second-bento-animation";
import { ThirdBentoAnimation } from "@/components/third-bento-animation";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Globe } from "@/components/ui/globe";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "p-1 py-0.5 font-medium dark:font-semibold text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
};

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "Cal AI",
  description: "Smart scheduling powered by AI.",
  cta: "Get Started",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "AI Calendar",
    "Smart Scheduling",
    "Productivity",
    "Time Management",
  ],
  links: {
    email: "support@calai.app",
    twitter: "https://twitter.com/calaiapp",
    discord: "https://discord.gg/calaiapp",
    github: "https://github.com/calaiapp",
    instagram: "https://instagram.com/calaiapp",
  },
  nav: {
    links: [
      { id: 1, name: "Home", href: "#hero" },
      { id: 2, name: "How it Works", href: "#bento" },
      { id: 3, name: "Features", href: "#features" },
      { id: 4, name: "Pricing", href: "#pricing" },
    ],
  },
  hero: {
    badgeIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Y Combinator"
      >
        <rect width="16" height="16" rx="3" fill="#FB651E" />
        <text
          x="8"
          y="11.5"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="11"
          fontWeight="500"
          fill="#ffffff"
        >
          Y
        </text>
      </svg>
    ),
    badge: "Backed by Y Combinator",
    title: "How fast can AI move your freight?",
    description:
      "Try below, for free",
    cta: {
      primary: {
        text: "Book Freight",
        href: "#",
      },
      secondary: {
        text: "All Services",
        href: "#",
      },
    },
  },
  companyShowcase: {
    companyLogos: [
      {
        id: 1,
        name: "Hyzmatdalar",
        logo: (
          <img
            src="/testimonal_logos/hyzmatdalar.png"
            alt="Hyzmatdalar"
            className="h-[67px] w-auto max-w-[192px] object-contain"
          />
        ),
      },
      {
        id: 2,
        name: "TVO",
        logo: (
          <img
            src="/testimonal_logos/tvo.png"
            alt="TVO"
            className="h-[67px] w-auto max-w-[192px] object-contain"
          />
        ),
      },
      {
        id: 3,
        name: "Umur",
        logo: (
          <img
            src="/testimonal_logos/umur.png"
            alt="Umur"
            className="h-[67px] w-auto max-w-[192px] object-contain"
          />
        ),
      },
      {
        id: 4,
        name: "Andelog",
        logo: (
          <img
            src="/testimonal_logos/andelog.png"
            alt="Andelog"
            className="h-[67px] w-auto max-w-[192px] object-contain"
          />
        ),
      },
      {
        id: 5,
        name: "Fevzi",
        logo: (
          <img
            src="/testimonal_logos/fevzi.png"
            alt="Fevzi"
            className="h-[67px] w-auto max-w-[192px] object-contain"
          />
        ),
      },
      {
        id: 6,
        name: "Stella",
        logo: (
          <img
            src="/testimonal_logos/stella.png"
            alt="Stella"
            className="h-[67px] w-auto max-w-[192px] object-contain"
          />
        ),
      },
      {
        id: 7,
        name: "Transorient",
        logo: (
          <img
            src="/testimonal_logos/transorient.png"
            alt="Transorient"
            className="h-[67px] w-auto max-w-[192px] object-contain"
          />
        ),
      },
    ],
  },
  featureSection: {
    title: "Freight Forwarding Workflow",
    description:
      "In a nutshell for our investors and non-logistics backgrounds",
    items: [
      {
        id: 1,
        title: "1. Booking (and Financing)",
        content:
          "We book with the right carrier line for each route. Booking costs range from $1,000 to $5,000 per container, and for deals over $20,000 we provide our own financing with term payments.",
        image:
          "https://t3.ftcdn.net/jpg/02/17/15/34/360_F_217153491_HkqRfksxshg1sbFvCN97a422wQ0q5DxC.jpg",
      },
      {
        id: 2,
        title: "2. Exporter to Port",
        content:
          "Freight is loaded into an empty or partial container or truck and carried to the shipping line.",
        image:
          "https://ship4wd.com/wp-content/uploads/Benefits-of-FCL-Shipment-for-Businesses.webp",
      },
      {
        id: 3,
        title: "3. Port to Port + Customs",
        content:
          "The container ships port to port. On arrival, we clear customs and manage the bill of lading release, monitoring free time to avoid demurrage and detention charges that can build up to an average of $2,500 per container once incurred.",
        image:
          "https://ship4wd.com/wp-content/uploads/What-Does-FCL-Mean-in-Shipping-1.webp",
      },
      {
        id: 4,
        title: "4. Port to Importer",
        content:
          "After customs release, the cargo is trucked from the port for final inland delivery to the importer's door.",
        image:
          "https://cdn.prod.website-files.com/60c70a3e4664aa16ddd5459a/618528521149ad23d3786711_shipping%20terms%20full%20truckload.jpg",
      },
    ],
  },
  bentoSection: {
    title: "Derya managed over $3M",
    description:
      "in freight and supply procurement transactions.",
    items: [
      {
        id: 1,
        content: <FirstBentoAnimation />,
        title: "The AI Native Freight Forwarder",
        description:
          "We use AI agents in real time to coordinate tasks, answer questions, and maintain team alignment. AI agents can operate across all traditional forwarding teams in sales, pricing, and operations.",
      },
      {
        id: 2,
        content: <SecondBentoAnimation />,
        title: "For Importers/Exporters",
        description:
          "Derya combines a startup's existing tech stack with the industry knowledge of Derya Brain to build best-in-class AI employees and deploy them across supply deals and freight deals to create margins on new routes.",
      },
      {
        id: 3,
        content: (
          <ThirdBentoAnimation
            data={[20, 30, 25, 45, 40, 55, 75]}
            toolTipValues={[
              1234, 1678, 2101, 2534, 2967, 3400, 3833, 4266, 4700, 5133,
            ]}
          />
        ),
        title: "For Freight Forwarders",
        description:
          "Lead generation is what Derya is best at as of yet. Derya generates leads and sources deals for freight forwarding offices and offers financing options.",
      },
      {
        id: 4,
        content: <FourthBentoAnimation once={false} />,
        title: "For Carriers and Shippers",
        description:
          "Derya handles the digital legwork and passes carriers and shippers clean, fully-informed loads from trusted demand, so they fill capacity faster without chasing missing details.",
      },
    ],
  },
  benefits: [
    {
      id: 1,
      text: "Save hours each week with AI-optimized scheduling.",
      image: "/Device-6.png",
    },
    {
      id: 2,
      text: "Reduce scheduling conflicts and double-bookings.",
      image: "/Device-7.png",
    },
    {
      id: 3,
      text: "Improve work-life balance with smart time allocation.",
      image: "/Device-8.png",
    },
    {
      id: 4,
      text: "Increase productivity with AI-driven time management insights.",
      image: "/Device-1.png",
    },
  ],
  growthSection: {
    title: "Harnessing More Than 20+ Years of Experience",
    description:
      "We leverage AI to scale across our global partner network: tapping into their local expertise, established connections, and industry licenses to deliver results worldwide.",
    items: [
      {
        id: 1,
        content: (
          <div
            className="relative flex size-full items-center justify-center overflow-hidden transition-all duration-300 hover:[mask-image:none] hover:[webkit-mask-image:none]"
            style={{
              WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='265' height='268' viewBox='0 0 265 268' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fillRule='evenodd' clipRule='evenodd' d='M121.384 4.5393C124.406 1.99342 128.319 0.585938 132.374 0.585938C136.429 0.585938 140.342 1.99342 143.365 4.5393C173.074 29.6304 210.174 45.6338 249.754 50.4314C253.64 50.9018 257.221 52.6601 259.855 55.3912C262.489 58.1223 264.005 61.6477 264.13 65.3354C265.616 106.338 254.748 146.9 232.782 182.329C210.816 217.759 178.649 246.61 140.002 265.547C137.645 266.701 135.028 267.301 132.371 267.298C129.715 267.294 127.1 266.686 124.747 265.526C86.0991 246.59 53.9325 217.739 31.9665 182.309C10.0005 146.879 -0.867679 106.317 0.618784 65.3147C0.748654 61.6306 2.26627 58.1102 4.9001 55.3833C7.53394 52.6565 11.1121 50.9012 14.9945 50.4314C54.572 45.6396 91.6716 29.6435 121.384 4.56V4.5393Z' fill='black'/%3E%3C/svg%3E")`,
              maskImage: `url("data:image/svg+xml,%3Csvg width='265' height='268' viewBox='0 0 265 268' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fillRule='evenodd' clipRule='evenodd' d='M121.384 4.5393C124.406 1.99342 128.319 0.585938 132.374 0.585938C136.429 0.585938 140.342 1.99342 143.365 4.5393C173.074 29.6304 210.174 45.6338 249.754 50.4314C253.64 50.9018 257.221 52.6601 259.855 55.3912C262.489 58.1223 264.005 61.6477 264.13 65.3354C265.616 106.338 254.748 146.9 232.782 182.329C210.816 217.759 178.649 246.61 140.002 265.547C137.645 266.701 135.028 267.301 132.371 267.298C129.715 267.294 127.1 266.686 124.747 265.526C86.0991 246.59 53.9325 217.739 31.9665 182.309C10.0005 146.879 -0.867679 106.317 0.618784 65.3147C0.748654 61.6306 2.26627 58.1102 4.9001 55.3833C7.53394 52.6565 11.1121 50.9012 14.9945 50.4314C54.572 45.6396 91.6716 29.6435 121.384 4.56V4.5393Z' fill='black'/%3E%3C/svg%3E")`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          >
            <div className="absolute top-[55%] md:top-[58%] left-[55%] md:left-[57%] -translate-x-1/2 -translate-y-1/2  size-full z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="227"
                height="244"
                viewBox="0 0 227 244"
                fill="none"
                className="size-[90%] md:size-[85%] object-contain fill-background"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M104.06 3.61671C106.656 1.28763 110.017 0 113.5 0C116.983 0 120.344 1.28763 122.94 3.61671C148.459 26.5711 180.325 41.2118 214.322 45.6008C217.66 46.0312 220.736 47.6398 222.999 50.1383C225.262 52.6369 226.563 55.862 226.67 59.2357C227.947 96.7468 218.612 133.854 199.744 166.267C180.877 198.68 153.248 225.074 120.052 242.398C118.028 243.454 115.779 244.003 113.498 244C111.216 243.997 108.969 243.441 106.948 242.379C73.7524 225.055 46.1231 198.661 27.2556 166.248C8.38807 133.835 -0.947042 96.7279 0.329744 59.2168C0.441295 55.8464 1.74484 52.6258 4.00715 50.1311C6.26946 47.6365 9.34293 46.0306 12.6777 45.6008C46.6725 41.2171 78.5389 26.5832 104.06 3.63565V3.61671Z"
                />
              </svg>
            </div>
            <div className="absolute top-[58%] md:top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2  size-full z-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="245"
                height="282"
                viewBox="0 0 245 282"
                className="size-full object-contain fill-accent"
              >
                <g filter="url(#filter0_dddd_2_33)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M113.664 7.33065C116.025 5.21236 119.082 4.04126 122.25 4.04126C125.418 4.04126 128.475 5.21236 130.836 7.33065C154.045 28.2076 183.028 41.5233 213.948 45.5151C216.984 45.9065 219.781 47.3695 221.839 49.6419C223.897 51.9144 225.081 54.8476 225.178 57.916C226.339 92.0322 217.849 125.781 200.689 155.261C183.529 184.74 158.4 208.746 128.209 224.501C126.368 225.462 124.323 225.962 122.248 225.959C120.173 225.956 118.13 225.45 116.291 224.484C86.0997 208.728 60.971 184.723 43.811 155.244C26.6511 125.764 18.1608 92.015 19.322 57.8988C19.4235 54.8334 20.6091 51.9043 22.6666 49.6354C24.7242 47.3665 27.5195 45.906 30.5524 45.5151C61.4706 41.5281 90.4531 28.2186 113.664 7.34787V7.33065Z"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_dddd_2_33"
                    x="0.217041"
                    y="0.0412598"
                    width="244.066"
                    height="292.917"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="3" />
                    <feGaussianBlur stdDeviation="3.5" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_2_33"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="12" />
                    <feGaussianBlur stdDeviation="6" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_2_33"
                      result="effect2_dropShadow_2_33"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="27" />
                    <feGaussianBlur stdDeviation="8" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect2_dropShadow_2_33"
                      result="effect3_dropShadow_2_33"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="48" />
                    <feGaussianBlur stdDeviation="9.5" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect3_dropShadow_2_33"
                      result="effect4_dropShadow_2_33"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect4_dropShadow_2_33"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="81"
                height="80"
                viewBox="0 0 81 80"
                className="fill-background"
              >
                <g filter="url(#filter0_iiii_2_34)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.5 36V28C20.5 22.6957 22.6071 17.6086 26.3579 13.8579C30.1086 10.1071 35.1957 8 40.5 8C45.8043 8 50.8914 10.1071 54.6421 13.8579C58.3929 17.6086 60.5 22.6957 60.5 28V36C62.6217 36 64.6566 36.8429 66.1569 38.3431C67.6571 39.8434 68.5 41.8783 68.5 44V64C68.5 66.1217 67.6571 68.1566 66.1569 69.6569C64.6566 71.1571 62.6217 72 60.5 72H20.5C18.3783 72 16.3434 71.1571 14.8431 69.6569C13.3429 68.1566 12.5 66.1217 12.5 64V44C12.5 41.8783 13.3429 39.8434 14.8431 38.3431C16.3434 36.8429 18.3783 36 20.5 36ZM52.5 28V36H28.5V28C28.5 24.8174 29.7643 21.7652 32.0147 19.5147C34.2652 17.2643 37.3174 16 40.5 16C43.6826 16 46.7348 17.2643 48.9853 19.5147C51.2357 21.7652 52.5 24.8174 52.5 28Z"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_iiii_2_34"
                    x="12.5"
                    y="8"
                    width="56"
                    height="70"
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
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect1_innerShadow_2_34"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="3" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_innerShadow_2_34"
                      result="effect2_innerShadow_2_34"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="2.5" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect2_innerShadow_2_34"
                      result="effect3_innerShadow_2_34"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="14" />
                    <feGaussianBlur stdDeviation="3" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect3_innerShadow_2_34"
                      result="effect4_innerShadow_2_34"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="size-full"
            >
              <FlickeringGrid
                className="size-full"
                gridGap={4}
                squareSize={2}
                maxOpacity={0.5}
              />
            </motion.div>
          </div>
        ),

        title: "Freight Data Security",
        description:
          "Freight data is precious and private. We value this and never share your data with any other third party or models.",
      },
      {
        id: 2,
        content: (
          <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden [mask-image:linear-gradient(to_top,transparent,black_50%)] -translate-y-20">
            <Globe className="top-28" />
          </div>
        ),

        title: "Scaling Globally",
        description:
          "We inherit not only knowledge but the whole structure from our partners for global coverage.",
      },
    ],
  },
  quoteSection: {
    quote:
      "\"Derya was the first to quote in all requests for quotation so far, and we were always able to reach a team member when needed for operations.\"",
    author: {
      name: "Oguzcan Koksal",
      role: "Head of Export, Umur Marine Parts Ltd",
      image: "https://randomuser.me/api/portraits/men/91.jpg",
    },
  },
  pricing: {
    title: "Pricing that scales with you",
    description:
      "Whichever plan you pick, it's free until you love your docs. That's our promise.",
    pricingItems: [
      {
        name: "Free",
        href: "#",
        price: "$0",
        period: "month",
        yearlyPrice: "$0",
        features: [
          "Custom domain",
          "SEO-optimizations",
          "Auto-generated API docs",
          "Built-in components library",
        ],
        description: "Perfect for individual users",
        buttonText: "Start Free",
        buttonColor: "bg-accent text-primary",
        isPopular: false,
      },
      {
        name: "Startup",
        href: "#",
        price: "$12",
        period: "month",
        yearlyPrice: "$120",
        features: [
          "Custom domain",
          "SEO-optimizations",
          "Auto-generated API docs",
          "Built-in components library",
          "E-commerce integration",
          "User authentication system",
          "Multi-language support",
          "Real-time collaboration tools",
        ],
        description: "Ideal for professionals and small teams",
        buttonText: "Upgrade to Pro",
        buttonColor: "bg-secondary text-white",
        isPopular: true,
      },
      {
        name: "Enterprise",
        href: "#",
        price: "$24",
        period: "month",
        yearlyPrice: "$240",
        features: [
          "Custom domain",
          "SEO-optimizations",
          "Auto-generated API docs",
          "Built-in components librarys",
          "Real-time collaboration tools",
        ],
        description: "Best for large teams and enterprise-level organizations",
        buttonText: "Contact Sales",
        buttonColor: "bg-primary text-primary-foreground",
        isPopular: false,
      },
    ],
  },
  testimonials: {
    derya: [
      {
        name: "Derya Assistant",
        role: "AI Assistant",
        badge: { kind: "mark", src: "/team/derya-assistant.png" },
        noQuote: true,
        bold: true,
        quote: "Found 87 carrier contacts for a single Brazil to Ukraine deal.",
      },
      {
        name: "Jane",
        role: "Derya AI Employee · Sales",
        badge: { kind: "portrait", src: "/team/jane.png" },
        quote:
          "Opened a new lane for the TVO Sudan deal: packed sunflower oil, Yumurtalık → Port Sudan, 30× 40HC.",
      },
      {
        name: "Harry",
        role: "Derya AI Employee · Carrier Relations",
        badge: { kind: "portrait", src: "/team/harry.png" },
        quote:
          "Locked 10× 40HC with the line. Vessel confirmed 22/06 to Port Sudan.",
      },
      {
        name: "Amanda",
        role: "Derya AI Employee · Pricing",
        badge: { kind: "portrait", src: "/team/amanda.png" },
        quote:
          "Priced Irving, TX → İstanbul including DG handling and returned the quote in minutes.",
      },
    ],
    shippers: [
      {
        name: "O.K.",
        role: "Umur Marine Parts Ltd",
        badge: { kind: "logo", src: "/testimonal_logos/umur.png" },
        quote:
          "İstanbul Airport → Shanghai, 1 pallet, 230 kg, marine parts. Need your best air rate.",
      },
      {
        name: "O.K.",
        role: "Umur Marine Parts Ltd",
        badge: { kind: "logo", src: "/testimonal_logos/umur.png" },
        bold: true,
        quote:
          "Oguzhan [Derya Co-Founder] was the first to quote across ALL our loads since I've met him.",
      },
      {
        name: "Sudan sunflower oil deal",
        role: "TVO importer",
        badge: { kind: "logo", src: "/testimonal_logos/tvo.png" },
        noQuote: true,
        quote:
          "TVO, one of Turkey's largest edible-oil importers, signed for 20 containers, one of Derya's very first loads.",
      },
      {
        name: "TVO Malaysia deal",
        role: "In the pipeline",
        badge: { kind: "logo", src: "/testimonal_logos/tvo.png" },
        noQuote: true,
        quote:
          "Next up: TVO's Malaysia → Mersin cooking-oil lane, around 50 containers every month.",
      },
    ],
    logistics: [
      {
        name: "D.A.",
        role: "Stella Shipping Agency",
        badge: { kind: "logo", src: "/testimonal_logos/stella.png" },
        quote:
          "Space confirmed with the line at 03:40. Your container makes the next sailing out of Ambarlı.",
      },
      {
        name: "S.K.",
        role: "Fevzi Gandur Logistics",
        badge: { kind: "logo", src: "/testimonal_logos/fevzi.png" },
        bold: true,
        quote: "Sunday pickup and trucking arranged. Nothing waits for Monday.",
      },
      {
        name: "E.Y.",
        role: "Transorient Global Logistics",
        badge: { kind: "logo", src: "/testimonal_logos/transorient.png" },
        quote:
          "We were about to deploy Derya AI employees before they pivoted. Now they're sourcing deals all over the world for us.",
      },
      {
        name: "N.B.",
        role: "Andelog Ltd",
        badge: { kind: "logo", src: "/testimonal_logos/andelog.png" },
        bold: true,
        quote:
          "We almost always have something missing, like an MSDS. Derya chases the info and only passes on fully-informed loads.",
      },
    ],
  },
  faqSection: {
    title: "Frequently Asked Questions",
    description:
      "Answers to how AI works in freight forwarding. Don't hesitate to contact us for any other questions.",
    faQitems: [
      {
        id: 1,
        question: "Can I talk to a person if I need to?",
        answer:
          "Yes. Derya is AI-native, but not AI-only. Any shipment detail that materially affects price, compliance, customs, dangerous goods classification, or carrier acceptance is reviewed or approved by a team member before it moves forward.",
      },
      {
        id: 2,
        question: "Is Derya a freight forwarder or just software?",
        answer:
          "Derya is an AI-native freight forwarder. Our software handles the repetitive parts of quoting, documentation, follow-up, and shipment visibility, while our team and partner network handle the parts that require operational judgment, carrier coordination, and local execution.",
      },
      {
        id: 3,
        question: "Who handles customs clearance?",
        answer:
          "Customs clearance can be handled on either side, or both, depending on the shipment and Incoterm. Derya can coordinate clearance through local agents or work alongside your existing customs broker. Duties, taxes, and final customs decisions remain subject to the relevant customs authority and the importer/exporter's documentation.",
      },
      {
        id: 4,
        question: "Are duties, taxes, and customs fees included in the quote?",
        answer:
          "Only if they are clearly stated in the quote. Freight quotes usually cover transport and agreed handling charges; duties, taxes, inspections, storage, demurrage, and customs-related charges may be separate depending on the shipment and destination.",
      },
      {
        id: 5,
        question: "What happens after I accept a quote?",
        answer:
          "We confirm the booking, collect any missing documents, validate key shipment details, and keep the shipment timeline updated through pickup, departure, arrival, customs, and delivery.",
      },
      {
        id: 6,
        question: "Can I use my own customs broker, trucker, or warehouse?",
        answer:
          "Yes. You can use your own broker or local provider where needed. Derya can either coordinate the whole shipment or work around the partners you already trust.",
      },
      {
        id: 7,
        question: "Is cargo insurance included?",
        answer:
          "Cargo insurance is not automatically included unless stated in the quote. If you want insurance, tell us the cargo value and we'll help arrange the appropriate coverage before shipment.",
      },
    ],
  },
  ctaSection: {
    id: "cta",
    title: "Automate. Simplify. Thrive",
    backgroundImage: "/agent-cta-background.png",
    button: {
      text: "Start Your 30-Day Free Trial Today",
      href: "#",
    },
    subtext: "Cancel anytime, no questions asked",
  },
  footerLinks: [
    {
      title: "Company",
      links: [
        { id: 1, title: "About", url: "#" },
        { id: 2, title: "Contact", url: "#" },
        { id: 3, title: "Blog", url: "#" },
        { id: 4, title: "Story", url: "#" },
      ],
    },
    {
      title: "Products",
      links: [
        { id: 5, title: "Company", url: "#" },
        { id: 6, title: "Product", url: "#" },
        { id: 7, title: "Press", url: "#" },
        { id: 8, title: "More", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { id: 9, title: "Press", url: "#" },
        { id: 10, title: "Careers", url: "#" },
        { id: 11, title: "Newsletters", url: "#" },
        { id: 12, title: "More", url: "#" },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;
