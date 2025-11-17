// Kiểm tra biến môi trường bắt buộc
function validateEnv() {
  const requiredEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${missingVars.join(', ')}`);
  }

  return {
    supabaseUrl: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

// Kiểm tra biến môi trường server-only
export function validateServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('validateServerEnv chỉ được gọi trên server');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Thiếu biến môi trường bắt buộc: SUPABASE_SERVICE_ROLE_KEY');
  }

  return {
    serviceRoleKey,
  };
}

// Export các biến môi trường đã validate
export const env = validateEnv();
