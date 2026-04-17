import { describe, it, expect } from "bun:test";
import { render } from "@react-email/render";
import { WelcomeEmail } from "./welcome";

describe("WelcomeEmail Component", () => {
  it("should render the correct greeting using the firstName prop", async () => {
    const html = await render(
      <WelcomeEmail firstName="Jack" lastName="Fraser" />
    );

    expect(html).toContain("Jack");
    expect(html).toContain("Welcome to the docs!");
  });

  it("should contain the correct call-to-action link", async () => {
    const html = await render(
      <WelcomeEmail firstName="Test" lastName="User" />
    );

    expect(html).toContain('href="https://your-nextra-site.com"');
  });
});