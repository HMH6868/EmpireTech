import { NextResponse } from 'next/server';

export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function handleApiError(error: unknown): NextResponse {
  const isProduction = process.env.NODE_ENV === 'production';

  // Xử lý ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error.code && { code: error.code }),
      },
      { status: error.statusCode }
    );
  }

  // Xử lý Error thông thường
  if (error instanceof Error) {
    // Log stack trace (không expose ra client khi production)
    if (!isProduction) {
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: isProduction ? 'Internal server error' : error.message,
      },
      { status: 500 }
    );
  }

  // Xử lý lỗi không xác định
  console.error('Unknown error:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
    },
    { status: 500 }
  );
}
