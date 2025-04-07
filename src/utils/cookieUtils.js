'use server';

import { cookies } from 'next/headers';

export async function getClientIdFromCookie() {
  const cookieStore = cookies();
  return cookieStore.get('clientId')?.value || 'DREAM_HOMES';
} 