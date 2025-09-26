// "use client";

/** Local Storage Handler: used for manipulating all data stored in the browser local storage. */
const localStorageHandler = {
	handle(token: string) {
		this.set(token);
	},
	set(token: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("verified", token);
		}
	},
	get() {
		if (typeof window !== "undefined") {
			return localStorage.getItem("verified");
		}
		// return null;
	},
	delete() {
		if (typeof window !== "undefined") {
			return localStorage.removeItem("verified");
		}
	},
	setCurrentCustomerType(customerType: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("customerType", customerType);
		}
	},
	getCurrentCustomerType() {
		if (typeof window !== "undefined") {
			return localStorage.getItem("customerType");
		}
	},
	setCustomerInformation(customer: object) {
		if (typeof window !== "undefined") {
			localStorage.setItem("customer", JSON.stringify(customer));
		}
	},
	setCustomerAuth(auth: object) {
		if (typeof window !== "undefined") {
			localStorage.setItem("auth", JSON.stringify(auth));
		}
	},
	getCustomerAuth() {
		if (typeof window !== "undefined") {
			return localStorage.getItem("auth");
		}
	},
	getCustomerInformation() {
		if (typeof window !== "undefined") {
			const customer = localStorage.getItem("customer");
			return customer ? JSON.parse(customer) : null;
		}
		// return null;
	},
	deleteCustomerInformation() {
		if (typeof window !== "undefined") {
			localStorage.removeItem("customer");
		}
	},
	deleteAllData() {
		if (typeof window !== "undefined") {
			localStorage.clear();
		}
	},
	setEmailToBeVerified(email: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("email", email);
		}
	},
	getEmail() {
		if (typeof window !== "undefined") {
			return localStorage.getItem("email");
		}
	},
	clearEmailToBeVerified() {
		if (typeof window !== "undefined") {
			localStorage.deleteItem("email");
		}
	},
	// Business
	setBusinessIndustry(industry: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("businessIndustry", industry);
		}
	},
	setBusinessOperationPeriod(period: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("operationPeriod", period);
		}
	},
	setBusinessInvestmentType(investmentType: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("investmentType", investmentType);
		}
	},
	getSignUpAdditionalFormData() {
		if (typeof window !== "undefined") {
			const formData = {
				email: localStorage.getItem("email"),
				investmentType: localStorage.getItem("investmentType"),
				operationPeriod: localStorage.getItem("operationPeriod"),
				businessIndustry: localStorage.getItem("businessIndustry"),
			};

			return formData;
		}
	},

	// Investor
	setInvestorIndustry(investorType: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("investorIndustry", investorType);
		}
	},
	setInvestorOperationPeriod(investorProfile: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("operationPeriod", investorProfile);
		}
	},
	setInvestorInvestmentType(investorPhone: string) {
		if (typeof window !== "undefined") {
			localStorage.setItem("investmentType", investorPhone);
		}
	},
};

export default localStorageHandler;
