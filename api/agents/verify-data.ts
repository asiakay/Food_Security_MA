import fs from 'fs/promises';
import path from 'path';
import { verifyBusinessData } from '../services/claude-ai.js';
import type { Business, VerificationResult } from '../types.js';

const DATA_PATH = path.join(process.cwd(), 'src/data/businesses.json');
const VERIFICATION_PATH = path.join(process.cwd(), 'api/data/verification-results.json');

async function loadBusinesses(): Promise<Business[]> {
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

async function saveVerifications(verifications: VerificationResult[]): Promise<void> {
  await fs.mkdir(path.dirname(VERIFICATION_PATH), { recursive: true });
  await fs.writeFile(VERIFICATION_PATH, JSON.stringify(verifications, null, 2));
}

async function verifyBusiness(business: Business): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];

  console.log(`\n🔍 Verifying data for: ${business.business_name}`);

  try {
    const verificationData = await verifyBusinessData(business);

    for (const verification of verificationData.verifications || []) {
      results.push({
        businessId: business.id,
        field: verification.field,
        isValid: verification.isValid,
        currentValue: business[verification.field as keyof Business] as string | number | null,
        issues: verification.issues || [],
        suggestions: verification.suggestions || [],
      });
    }

    const issueCount = results.filter((r) => !r.isValid).length;
    console.log(`  ${issueCount > 0 ? '⚠️' : '✅'} Found ${issueCount} issues`);
  } catch (error) {
    console.error(`  ❌ Verification failed: ${error}`);
  }

  return results;
}

async function main() {
  console.log('🔎 Starting data verification agent...\n');

  const businesses = await loadBusinesses();
  const allVerifications: VerificationResult[] = [];

  console.log(`Verifying ${businesses.length} businesses\n`);

  for (const business of businesses.slice(0, 10)) {
    // Limit to 10 for testing
    const verifications = await verifyBusiness(business);
    allVerifications.push(...verifications);

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  await saveVerifications(allVerifications);

  const totalIssues = allVerifications.filter((v) => !v.isValid).length;
  console.log(`\n✨ Complete! Found ${totalIssues} total issues`);
  console.log(`📄 Results saved to: ${VERIFICATION_PATH}`);
}

main().catch(console.error);
