import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { GeneralNonAuthRoutes, protectedRoutes } from "./src/utils/urls";

export default async function middleware(req: NextRequest) {
	const cookieStore = await cookies();
	const customerIsAuthenticated = cookieStore.get("loggedIn");

	if (
		(customerIsAuthenticated === undefined ||
			customerIsAuthenticated?.value === "false") &&
		protectedRoutes.includes(req.nextUrl.pathname)
	) {
		const absoluteURL = new URL(
			GeneralNonAuthRoutes.landingPage,
			req.nextUrl.origin,
		);

		return NextResponse.redirect(absoluteURL.toString());
	}
}
