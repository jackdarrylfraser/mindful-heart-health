import { Html, Body, Container, Text, Link, Preview, Heading } from "@react-email/components";

export const WelcomeEmail = ({ firstName, lastName }: { firstName: string, lastName: string }) => (
  <Html>
    <Preview>Welcome to the docs!</Preview>
    <Body style={{ backgroundColor: "#f6f9fc", padding: "20px 0" }}>
      <Container style={{ backgroundColor: "#ffffff", border: "1px solid #e1e1e1", padding: "40px" }}>
        <Heading style={{ fontSize: "24px" }}>Hi {firstName},</Heading>
        <Text>Thanks for checking out our documentation. We're glad you're here!</Text>
        <Link href="https://your-nextra-site.com">Visit Dashboard</Link>
      </Container>
    </Body>
  </Html>
);