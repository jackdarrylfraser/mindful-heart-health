import * as React from "react";
import {
	Html,
	Body,
	Container,
	Text,
	Link,
	Section,
} from "@react-email/components";

/**
 * MagicLinkEmail
 * Transactional email for delivering a magic login/signup link.
 *
 * @param props.email - Recipient email address
 * @param props.url - Magic link URL
 */
export function MagicLinkEmail({ email, url }: { email: string; url: string }) {
	return (
		<Html>
			<Body
				style={{
					background: "#f9fafb",
					fontFamily: "Inter, Arial, sans-serif",
				}}
			>
				<Container
					style={{
						maxWidth: 480,
						margin: "40px auto",
						background: "#fff",
						borderRadius: 8,
						boxShadow: "0 2px 8px #e5e7eb",
						padding: 32,
					}}
				>
					<Section>
						<Text
							style={{
								fontSize: 24,
								fontWeight: 700,
								marginBottom: 8,
							}}
						>
							Sign in to Healthy Blood Pressure
						</Text>
						<Text
							style={{
								fontSize: 16,
								color: "#374151",
								marginBottom: 24,
							}}
						>
							Click the button below to securely sign in. This
							link is valid for a limited time and can only be
							used once.
						</Text>
						<Section
							style={{ textAlign: "center", margin: "32px 0" }}
						>
							<Link
								href={url}
								style={{
									display: "inline-block",
									background: "#2563eb",
									color: "#fff",
									fontWeight: 600,
									fontSize: 18,
									padding: "14px 32px",
									borderRadius: 6,
									textDecoration: "none",
								}}
							>
								Sign in with Magic Link
							</Link>
						</Section>
						<Text
							style={{
								fontSize: 14,
								color: "#6b7280",
								marginTop: 24,
							}}
						>
							If you did not request this email, you can safely
							ignore it.
						</Text>
						<Text
							style={{
								fontSize: 12,
								color: "#9ca3af",
								marginTop: 16,
							}}
						>
							Sent to: {email}
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}
