import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Generate a client token for the browser to upload the file
        // We restrict uploads to images
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB limit
          // We can optionally add a token payload, useful if we needed to pass auth context
          tokenPayload: JSON.stringify({
            // example: userId: user.id
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This fires after the upload is completed on Vercel's end
        console.log('Blob upload completed', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
