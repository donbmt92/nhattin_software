import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { linkCode: string } }
) {
  try {
    const { linkCode } = params;
    
    if (!linkCode) {
      return NextResponse.json(
        { error: 'Mã affiliate link không hợp lệ' },
        { status: 400 }
      );
    }

    // Lấy IP của user
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';

    // Gọi API backend để track click và lấy redirect URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/affiliate/redirect/${linkCode}`, {
      method: 'GET',
      headers: {
        'X-Forwarded-For': ip,
        'User-Agent': request.headers.get('user-agent') || 'unknown',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Backend sẽ trả về redirect URL
      const data = await response.text();
      
      // Nếu backend redirect, lấy URL từ Location header
      const redirectUrl = response.headers.get('location') || '/';
      
      return NextResponse.redirect(redirectUrl);
    } else {
      // Nếu có lỗi, redirect về trang chủ
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    console.error('Error processing affiliate redirect:', error);
    // Redirect về trang chủ nếu có lỗi
    return NextResponse.redirect(new URL('/', request.url));
  }
}

