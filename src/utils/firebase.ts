import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Load Firebase configuration
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface ContactBriefData {
  organization: string;
  contactName: string;
  contactRole: string;
  email: string;
  phoneOrSignal?: string;
  focusAreas: string[];
  infrastructure: string;
  budget: string;
  timeline: string;
  urgency: string;
  complianceMandates: string;
  message: string;
  timestamp?: string;
  fullRequirements?: string;
}

/**
 * Saves a contact form submission directly into the Firestore database
 */
export async function saveContactBriefToDatabase(data: ContactBriefData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'audit_briefs'), {
      ...data,
      createdAt: serverTimestamp(),
      submittedAtIso: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving contact brief to Firestore database:', error);
    throw error;
  }
}
