import React from "react";
import { motion } from "framer-motion";

import type { VariantLabels, TargetAndTransition } from "framer-motion";

interface ButtonProps {
	whileHover?: VariantLabels | TargetAndTransition;
	whileTap?: VariantLabels | TargetAndTransition;
	type?: "button" | "submit" | "reset";
	title?: string;
	disabled?: boolean;
	onClick?: React.MouseEventHandler;
	className?: string;
	text?: string;
	children?: React.ReactNode;
	loading?: boolean;
}

const Buttons: React.FC<ButtonProps> = (props): React.ReactElement => {
	const {
		whileHover,
		whileTap,
		type,
		title,
		disabled,
		onClick,
		className,
		text,
		children,
		loading,
	} = props;

	return (
		<motion.button
			whileHover={whileHover}
			whileTap={whileTap}
			type={type || "button"}
			title={title}
			disabled={disabled || loading}
			onClick={onClick}
			className={`${className} cursor-pointer rounded-3xl flex items-center justify-center`}
		>
			{loading ? (
				<div className="loader"></div>
			) : (
				<>
					<p className="font-Lora">{text}</p>
					{children}
				</>
			)}
		</motion.button>
	);
};

export default Buttons;
