import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Only register Happy DOM if the test file ends in .dom.test.ts or .tsx
if (Bun.main.includes(".dom.") || Bun.main.endsWith(".tsx")) {
	GlobalRegistrator.register();
}
