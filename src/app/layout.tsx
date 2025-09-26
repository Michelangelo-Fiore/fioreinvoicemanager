// import React from "react";
// import { Metadata } from "next";
// import "../../public/assets/css/global.css";
// import { SFProDisplay, CabinetGrotesk } from "@/utils/custom-fonts";

// export const metadata: Metadata = {
// 	title: "Sefarvest - making investments safer...",
// 	description:
// 		"Sefarvest connects investors, businesses and talents. Empower innovation, growth, and collaboration. Join now for unparalleled opportunities.",
// };

// export default function RootLayout({
// 	children,
// }: Readonly<{
// 	children: React.ReactNode;
// }>) {
// 	return (
// 		<html lang="en">
// 			<head>
// 				<link rel="icon" href="/seo/icons/favicon.ico" />
// 				<meta name="viewport" content="width=device-width, initial-scale=1" />
// 				<meta name="theme-color" content="#199B6C" />
// 				<meta name="description" content="making investments safer..." />
// 				<meta name="mobile-web-app-capable" content="yes" />
// 				<meta name="apple-mobile-web-app-capable" content="yes" />
// 				<link rel="manifest" href="/seo/manifest.json" />
// 				<link rel="apple-touch-icon" href="/seo/icons/apple-touch-icon.png" />
// 				<link
// 					href="/seo/splashscreens/iphone5_splash.png"
// 					media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<link
// 					href="/seo/splashscreens/iphone6_splash.png"
// 					media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<link
// 					href="/seo/splashscreens/iphoneplus_splash.png"
// 					media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<link
// 					href="/seo/splashscreens/iphonex_splash.png"
// 					media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<link
// 					href="/seo/splashscreens/iphonexr_splash.png"
// 					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<link
// 					href="/seo/splashscreens/iphonexsmax_splash.png"
// 					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<link
// 					href="/seo/splashscreens/ipad_splash.png"
// 					media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<link
// 					href="/seo/splashscreens/ipadpro1_splash.png"
// 					media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<link
// 					href="/seo/splashscreens/ipadpro3_splash.png"
// 					media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<link
// 					href="/seo/splashscreens/ipadpro2_splash.png"
// 					media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
// 					rel="apple-touch-startup-image"
// 				/>
// 				<title>Sefarvest - making investments safer...</title>
// 			</head>
// 			<body className={`${SFProDisplay.variable} ${CabinetGrotesk.variable}`}>

// 		{children}

// 			</body>
// 		</html>
// 	);
// }

import "../../public/assets/css/globals.css";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LibreFranklinFont } from "@/utils/custom-fonts";

// Meta Data
export const metadata: Metadata = {
	title: "Fiore Invoice Manager 📊",
	description:
		"Fiore Invoice Manager Integrates FattureInCloud to Manage Invoices",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			{/* <head>
				<link rel="icon" href="/seo/icons/favicon.ico" sizes="any" />
			</head> */}
			<body
				className={`
			${LibreFranklinFont.variable}
			antialiased
			`}
			>
				{children}
				<SpeedInsights />
			</body>
		</html>
	);
}
