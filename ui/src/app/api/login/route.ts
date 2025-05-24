import { NextResponse, NextRequest } from 'next/server';

/**
 * Handles the login POST request
 * Forwards the request to Django backend
 */
export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const body = await request.json();
    
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    // Set cookie on successful login
    if (response.ok && data.token) {
      const responseObj = NextResponse.json(data);
      
      // Set the JWT cookie
      responseObj.cookies.set({
        name: 'jwt',
        value: data.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
      
      return responseObj;
    }
    
    // Forward any error from the Django backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
