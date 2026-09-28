// Copies the client project documents into public/docs so "View Project Document" links resolve.
// Runs automatically before `npm run dev` and `npm run build`. Missing sources are reported, not fatal.
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const SOURCE = process.env.CLIENT_DOCS_DIR ?? join(homedir(), 'OneDrive', 'Documents', 'Craftlanee_Projects');
const TARGET = join(import.meta.dirname, '..', 'public', 'docs');

/** public file name → path inside SOURCE */
const DOCS = {
  'arun-dental.pdf': 'ArunDental/Project-Document/Dr-Arun-Dental-Care-Project-Document.pdf',
  'bagmech-bengaluru.pdf': 'Bagmech_Benguluru/Project_Document/BagMech_Bengaluru_Project_Document.pdf',
  'brd-gynecologist-hospital.pdf': 'BRDHospital(Gynaecologist)/Project_Document/BRD_Hospital_Project_Document.pdf',
  'kc-gynecologist-hospitals.pdf': 'Dr. SHILPA/KC Hospital - Case Study by Craftlanee.pdf',
  'e-learning-platform.pdf': 'E_Learning(LMS Portal)/Craftlanee_ELearning_Platform_Documentation.pdf',
  'salon-management-system.pdf': 'SalonProject/Project_Document/Salon_Management_System.pdf',
  'student-management-system.pdf': 'StudentManagement_LiveTracking/Smart_School_Management_System_Product_Document.pdf',
  'onetowncity.pdf': 'Kuppam_Project/docs/OneTownCity_Project_Document.pdf',
};

mkdirSync(TARGET, { recursive: true });
let copied = 0;
for (const [name, rel] of Object.entries(DOCS)) {
  const from = join(SOURCE, rel);
  const to = join(TARGET, name);
  if (!existsSync(from)) {
    if (!existsSync(to)) console.warn(`[docs] missing source for ${name}: ${from}`);
    continue;
  }
  if (existsSync(to) && statSync(to).mtimeMs >= statSync(from).mtimeMs) continue;
  copyFileSync(from, to);
  copied++;
}
console.log(`[docs] ${copied} document(s) copied to public/docs`);
