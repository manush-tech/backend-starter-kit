import env from "../lib/env";

export const isDevelopment = () => env().NODE_ENV === "development";
