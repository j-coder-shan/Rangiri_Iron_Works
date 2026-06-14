// src/lib/notifications.ts
import emailjs from '@emailjs/browser';

export async function sendEmailNotification(enquiry: {
  referenceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  preferredContact: string;
  categoryNameEn: string;
  itemCode: string;
  message: string;
  language: string;
}): Promise<void> {
  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    {
      reference_number: enquiry.referenceNumber,
      customer_name:    enquiry.customerName,
      customer_phone:   enquiry.customerPhone,
      customer_email:   enquiry.customerEmail || 'Not provided',
      preferred_contact: enquiry.preferredContact,
      service_name:     enquiry.categoryNameEn,
      item_code:        enquiry.itemCode || 'Not specified',
      message:          enquiry.message,
      submitted_at:     new Date().toLocaleString('en-LK'),
      language:         enquiry.language === 'si' ? 'Sinhala' : 'English',
      to_email:         'prabod.jay02@gmail.com',
    },
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  );
}

// WhatsApp fallback — only sends if CALLMEBOT_API_KEY is set
export async function sendWhatsAppNotification(enquiry: any): Promise<void> {
  if (!process.env.CALLMEBOT_API_KEY) return; // skip silently if not configured
  const message = encodeURIComponent(
    `New Enquiry: ${enquiry.referenceNumber}\n` +
    `${enquiry.customerName} | ${enquiry.customerPhone}\n` +
    `${enquiry.categoryNameEn} | ${enquiry.itemCode || 'N/A'}\n` +
    `${enquiry.message}`
  );
  const url = `https://api.callmebot.com/whatsapp.php?phone=${process.env.ADMIN_WHATSAPP}&text=${message}&apikey=${process.env.CALLMEBOT_API_KEY}`;
  await fetch(url).catch(() => {}); // non-blocking, silent fail
}
