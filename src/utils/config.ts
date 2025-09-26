/* eslint-disable no-underscore-dangle */
import axios from "axios";
import Cookies from "js-cookie";

/** URL for API - PRODUCTION */
const apiUrl = "https://fioreinvoicemanager.onrender.com";
const frontendUrl = "https://fioreinvoicemanager.web.app";
const backendUrl = "https://fioreinvoicemanager.onrender.com";

/** URL for API - LOCAL */
// const apiUrl = "http://localhost:4000";
// const frontendUrl = "http://localhost:3000";
// const backendUrl = "https://fioreinvoicemanager.onrender.com";

/** API BASE URL */
const apiBaseUrl = `${apiUrl}/api`;

// NON-AUTHENTICATED API INTEGRATION
/** Axios API for Sign Up and Log In Fiore Invoice Manager Customers with no token */
const fioreInvoiceManagerOnboarding = axios.create({
	baseURL: apiUrl,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// Request Interceptor for fioreInvoiceManagerOnboarding
fioreInvoiceManagerOnboarding.interceptors.request.use(
	async (config) => {
		config.baseURL = `${apiBaseUrl}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response Interceptor
fioreInvoiceManagerOnboarding.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const request = error.config;
		if (
			navigator?.onLine === false ||
			(error?.response?.status === 401 && !request?._retry)
		) {
			request._retry = true;
			axios.defaults.headers.common["Content-Type"] = "application/json";
			return axios(request);
		}
		return Promise.reject(error);
	},
);

// <====> //

// AUTHENTICATED API INTEGRATION
/** Axios API for Fiore Invoice Manager Customers that requires Session Cookie */
const fioreInvoiceManagerApi = axios.create({
	baseURL: `${apiBaseUrl}`,
	withCredentials: true, // ✅ rely on backend session
	headers: {
		"Content-Type": "application/json",
	},
});

// Request Interceptor
fioreInvoiceManagerApi.interceptors.request.use(
	async (config) => {
		// ❌ removed manual Bearer injection, session cookie will carry authentication
		config.headers["Content-Type"] = "application/json";
		config.baseURL = `${apiBaseUrl}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response Interceptor
fioreInvoiceManagerApi.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		console.log(error);
		const request = error.config;

		if (request._retry) {
			return Promise.reject(error);
		}

		if (navigator?.onLine === false) {
			return Promise.reject(error);
		}

		const code = error?.response?.data?.code;

		if (code === 498) {
			request._retry = true;

			try {
				// Call refresh token endpoint
				const refreshResponse = await axios.post(
					`${apiBaseUrl}/auth/refresh-token`,
					{},
					{ withCredentials: true },
				);

				const newAccessToken = refreshResponse.data?.accessToken;
				if (newAccessToken) {
					// Save new token
					Cookies.set("accessToken", newAccessToken);

					// Update headers
					fioreInvoiceManagerApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
					request.headers.Authorization = `Bearer ${newAccessToken}`;

					// Retry original request
					return fioreInvoiceManagerApi(request);
				}
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

// AUTHENTICATED API INTEGRATION - FOR FILES
/** Axios API for Uploading files to Fiore Invoice Manager that requires Token */
const fioreInvoiceManagerUploadFilesApi = axios.create({
	baseURL: `${apiBaseUrl}`,
	withCredentials: true,
});

// Request Interceptor
fioreInvoiceManagerUploadFilesApi.interceptors.request.use(
	async (config) => {
		const token = Cookies.get("accessToken"); // unified key
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		/**
		 * should not be added because axios does not add boundary to form data when content type is manually set
		 * 		config.headers["Content-Type"] = "multipart/form-data";
		 */

		// dynamically update baseURL
		config.baseURL = `${apiBaseUrl}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response Interceptor
fioreInvoiceManagerUploadFilesApi.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const request = error.config;
		if (
			navigator.onLine === false ||
			(error.response.status === 401 && !request._retry)
		) {
			request._retry = true;
			axios.defaults.headers.common["Content-Type"] = "application/json";
			return axios(request);
		}
		return Promise.reject(error);
	},
);

export {
	fioreInvoiceManagerOnboarding,
	fioreInvoiceManagerApi,
	fioreInvoiceManagerUploadFilesApi,
	apiUrl,
	apiBaseUrl,
	frontendUrl,
	backendUrl,
};
