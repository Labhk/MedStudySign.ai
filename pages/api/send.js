import { SendConsentEmail } from '../../app/emails/SendSignature';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const  patients  = req.body.patients;
    const authID  = req.body.authID;
    const currentUrl = req.body.currentUrl;

    for (const patient of patients) {
      const { pid, email } = patient;
      
      const data = await resend.emails.send({
        from: 'urgent <email@labhkreatives.me>',
        to: [email], 
        subject: 'Sign',
        react: SendConsentEmail({ pid, authID, currentUrl }), 
      });

      console.log(`Email sent for pid: ${pid},${authID} email: ${email}`);
    }

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(400).json({ error: 'Error sending emails' });
  }
}
