/** General Page Unauthenticated Routes or URL Page Links */
const GeneralNonAuthRoutes = {
	landingPage: "/",
};

/** General Page Authenticated Routes or URL Page Links */
const GeneralAuthRoutes = {
	dashboard: "/dashboard",
};

const protectedRoutes = [...Object.values(GeneralAuthRoutes)];

export { GeneralNonAuthRoutes, GeneralAuthRoutes, protectedRoutes };
