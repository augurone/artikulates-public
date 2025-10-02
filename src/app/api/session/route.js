import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const GET = async (req) => {
    const {
        cookies, 
        nextUrl: {
            searchParams
        }
    } = req;
    const redirectPath = searchParams.get('redirect');

    const response = NextResponse.redirect(redirectPath);
    const { value: sessionToken = '' } = cookies.get('sessionToken') || {};

    // If no sessionToken, generate a new one
    if (!sessionToken) {
        const newToken = uuidv4();
        
        response.cookies.set(
            'sessionToken',
            newToken,
            {
                path: '/',
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            }
        );
    }

    return response;
};
