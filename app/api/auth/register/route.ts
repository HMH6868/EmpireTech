import { NextResponse } from 'next/server';

import { ApiError, handleApiError } from '@/lib/errors';
import { createSupabaseRouteClient } from '@/lib/supabase/server';
import { isStrongPassword, isValidEmail, sanitizeInput } from '@/lib/validators';

type RegisterPayload = {
  email?: string;
  password?: string;
  name?: string;
};

export async function POST(request: Request) {
  try {
    let payload: RegisterPayload;

    try {
      payload = await request.json();
    } catch (error) {
      throw new ApiError('Invalid payload', 400, 'INVALID_PAYLOAD');
    }

    const { email, password, name } = payload;

    if (!email || !password || !name) {
      throw new ApiError('Missing required fields', 400, 'MISSING_FIELDS');
    }

    // Kiểm tra email hợp lệ
    if (!isValidEmail(email)) {
      throw new ApiError('Email không hợp lệ', 400, 'INVALID_EMAIL');
    }

    // Kiểm tra mật khẩu mạnh
    if (!isStrongPassword(password)) {
      throw new ApiError(
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa và số',
        400,
        'WEAK_PASSWORD'
      );
    }

    // Làm sạch input name
    const sanitizedName = sanitizeInput(name.trim());

    // Kiểm tra độ dài name
    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      throw new ApiError('Tên phải có từ 2 đến 50 ký tự', 400, 'INVALID_NAME_LENGTH');
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());

    const supabase = await createSupabaseRouteClient();

    // Kiểm tra email trùng lặp trước khi gọi signUp (tiết kiệm quota)
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', sanitizedEmail)
      .maybeSingle();

    if (existingUser) {
      throw new ApiError('Email đã được sử dụng', 400, 'EMAIL_EXISTS');
    }

    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          full_name: sanitizedName,
        },
      },
    });

    if (error) {
      throw new ApiError(error.message, 400, 'SIGNUP_FAILED');
    }

    return NextResponse.json(
      {
        user: data.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[auth/register]', error);
    return handleApiError(error);
  }
}
