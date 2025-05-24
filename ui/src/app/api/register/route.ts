import { NextResponse, NextRequest } from 'next/server';

/**
 * Handles the registration POST request
 * Forwards the request to Django backend
 */
export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const body = await request.json();
    
    const response = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Status 202 from Django means Accepted
    if (response.status === 202) {
      return NextResponse.json({}, { status: 200 });
    }
    
    // Forward any error from the Django backend
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
