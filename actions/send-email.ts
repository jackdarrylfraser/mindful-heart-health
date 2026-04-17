"use server"

import { Resend } from 'resend';
import { WelcomeEmail } from '@/email/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handleContactForm(formData: FormData) {
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const email = formData.get('email') as string;

  const { data, error } = await resend.emails.send({
    from: 'hello@yourdomain.com',
    to: email,
    subject: 'Welcome!',
    react: WelcomeEmail({ firstName, lastName }),
  });

  if (error) return { success: false };
  return { success: true };
}