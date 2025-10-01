import { fioreInvoiceManagerApi } from "../../utils/config";

/** Get Clients */
export const getClients = async (opts?: {
	signal?: AbortSignal;
	params?: any;
}) =>
	fioreInvoiceManagerApi.get("/dashboard/clients", {
		signal: opts?.signal,
		params: opts?.params,
	});

/** Get Receipts */
export const getReceipts = async (opts?: {
	signal?: AbortSignal;
	params?: any;
}) =>
	fioreInvoiceManagerApi.get("/dashboard/receipts", {
		signal: opts?.signal,
		params: opts?.params,
	});

/** Get Suppliers */
export const getSuppliers = async (opts?: {
	signal?: AbortSignal;
	params?: any;
}) =>
	fioreInvoiceManagerApi.get("/dashboard/suppliers", {
		signal: opts?.signal,
		params: opts?.params,
	});

/** Get Issued Documents */
export const getIssuedDocuments = async (opts?: {
	signal?: AbortSignal;
	params?: any;
}) =>
	fioreInvoiceManagerApi.get("/dashboard/issued-documents", {
		signal: opts?.signal,
		params: opts?.params,
	});

/** Get Received Documents */
export const getReceivedDocuments = async (opts?: {
	signal?: AbortSignal;
	params?: any;
}) =>
	fioreInvoiceManagerApi.get("/dashboard/received-documents", {
		signal: opts?.signal,
		params: opts?.params,
	});

export default {
	getClients,
	getReceipts,
	getSuppliers,
	getIssuedDocuments,
	getReceivedDocuments,
};
