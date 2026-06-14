import { NextResponse } from 'next/server';
import { saveEnquiry } from '@/lib/db';
import { isFirebaseConfigured } from '@/lib/firebase';
import { Enquiry } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { website, ...enquiryData } = body;

    // Honeypot check: If the hidden 'website' field has any value, reject it.
    if (website && website.trim() !== '') {
      console.warn('Bot submission blocked via honeypot:', website);
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // Save the enquiry server-side if Firestore is configured.
    if (isFirebaseConfigured) {
      await saveEnquiry(enquiryData as Enquiry);
    }

    return NextResponse.json({ 
      success: true, 
      referenceNumber: enquiryData.referenceNumber 
    });
  } catch (error: any) {
    console.error('Error in /api/enquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
