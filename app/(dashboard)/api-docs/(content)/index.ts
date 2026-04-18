import { ApiSystemLogs } from "./api-systemlogs";

export const apiDocuments = [ApiSystemLogs];

export function getApiDocumentBySlug(slug: string) {
  return apiDocuments.find((doc) => doc.id === slug);
}
