import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogIntoFattureInCloud } from "./helpers";
import Buttons from "@/library/buttons/buttons";

/** Log In */
const Login: React.FC = () => {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");

	/** Desktop View */
	const desktopView = () => {
		return (
			<div>
				<div className="text-black text-center font-LibreFranklin flex justify-center items-center h-screen w-full">
					<div>
						{/* Website Title */}
						<div>
							<p className="font-semibold font-LibreFranklin text-5xl">
								Fiore Invoice Manager 📊
							</p>
						</div>

						<div className="flex mt-[20px] flex-col justify-center items-center w-full">
							<Buttons
								whileHover={{
									scale: 1.1,
									transition: { duration: 0.3, ease: "easeInOut" },
								}}
								whileTap={{ scale: 0.95 }}
								type="button"
								onClick={() =>
									handleLogIntoFattureInCloud(router, setErrorMessage)
								}
								className="bg-green-600 px-[30px] py-[10px] mt-[100px] text-[20px] font-semibold text-white"
							>
								Log Into FattureInCloud
							</Buttons>

							{/* ✅ Error Message Display */}
							{errorMessage && (
								<p className="mt-4 text-red-600 font-medium">{errorMessage}</p>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	return <div>{desktopView()}</div>;
};

export default Login;
