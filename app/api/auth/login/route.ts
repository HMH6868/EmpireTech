import { NextResponse } from 'next/server';

import { ApiError, handleApiError } from '@/lib/errors';
import { createSupabaseRouteClient } from '@/lib/supabase/server';
import { isValidEmail, sanitizeInput } from '@/lib/validators';

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    let payload: LoginPayload;

    try {
      payload = await request.json();
    } catch (error) {
      throw new ApiError('Invalid payload', 400, 'INVALID_PAYLOAD');
    }

    const { email, password } = payload;

    if (!email || !password) {
      throw new ApiError('Missing required fields', 400, 'MISSING_FIELDS');
    }

    // Kiểm tra format email
    if (!isValidEmail(email)) {
      throw new ApiError('Thông tin đăng nhập không hợp lệ', 400, 'INVALID_CREDENTIALS');
    }

    // Làm sạch input
    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
    const sanitizedPassword = sanitizeInput(password);

    const supabase = await createSupabaseRouteClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      // Lấy IP để log
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';

      console.error('[auth/login] failed attempt', {
        ip,
        timestamp: new Date().toISOString(),
        error: error.message,
      });

      // Trả về lỗi chung, không tiết lộ chi tiết
      throw new ApiError('Thông tin đăng nhập không hợp lệ', 400, 'INVALID_CREDENTIALS');
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error('[auth/login]', error);
    return handleApiError(error);
  }
}
