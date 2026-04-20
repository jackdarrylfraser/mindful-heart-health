import { authentication } from "@/src/service/authentication"; // Import the instance created above
import { toNextJsHandler } from "better-auth/next-js";

// This exports the GET and POST handlers required by Better Auth
export const { POST, GET } = toNextJsHandler(authentication);
