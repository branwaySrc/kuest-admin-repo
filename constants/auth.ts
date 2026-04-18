export const ADMIN_AUTH = {
  ID: process.env.NEXT_PUBLIC_ADMIN_ID || "",
  PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "",
} as const;
