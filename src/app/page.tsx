import React from "react";
// import Image from "next/image";
import LandingPage from "@/app/landing-page/landing-page";
// import BarCoralloIconRed from "@/assets/images/general/fim-icon-red.svg";

export default function RootPage() {
	return (
		<main>
			<LandingPage />

			{/* Coming Soon Sign */}
			{/* <div className="my-[20px] h-screen flex-1 flex justify-center items-center border-t-[0.5px] border-fim-red">
				<div>
					<div className="mb-[20px] flex justify-center items-center">
						<Image
							alt="Bar Corallo"
							priority={false}
							src={BarCoralloIconRed}
							className="w-[10%] cursor-pointer"
						/>
					</div>
					<div className="flex justify-center items-center">
						<p className="text-xl sm:text-2xl md:text-[30px] font-Zapfino font-bold italic text-bol">
							Coming Soon...
						</p>
					</div>
				</div>
			</div> */}
		</main>
	);
}
