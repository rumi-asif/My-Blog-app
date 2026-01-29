import crypto from 'crypto';

interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename: string;
}

// Support common env var names and CLOUDINARY_URL (cloudinary://api_key:api_secret@cloud_name)
let CLOUD_NAME = process.env.NEXT_CLOUDINARY_CLOUD_NAME as string | undefined;
let API_KEY = process.env.NEXT_CLOUDINARY_API_KEY as string | undefined;
let API_SECRET = process.env.NEXT_CLOUDINARY_SECRET as string | undefined;

const CLOUDINARY_URL = process.env.CLOUDINARY_URL as string | undefined;
if ((!CLOUD_NAME || !API_KEY || !API_SECRET) && CLOUDINARY_URL) {
  try {
    // Example: cloudinary://123456789012345:abcdefg@mycloud
    const url = new URL(CLOUDINARY_URL);
    CLOUD_NAME = url.hostname || CLOUD_NAME;
    API_KEY = url.username || API_KEY;
    API_SECRET = url.password || API_SECRET;
  } catch {}
}

// Fallback aliases some teams use
CLOUD_NAME = CLOUD_NAME || (process.env.CLOUD_NAME as string | undefined);
API_KEY = API_KEY || (process.env.CLOUDINARY_KEY as string | undefined);
API_SECRET = API_SECRET || (process.env.CLOUDINARY_SECRET as string | undefined);

export function assertCloudinaryEnvConfigured() {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error(
      'Cloudinary env vars are missing. Set one of: (CLOUDINARY_URL) or (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).'
    );
  }
}

export async function uploadImageToCloudinary(options: {
  fileBuffer: Buffer;
  filename?: string;
  folder?: string;
  overwrite?: boolean;
}): Promise<CloudinaryUploadResult> {
  assertCloudinaryEnvConfigured();

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = options.folder || 'next-gen-blog';
  const overwrite = options.overwrite ?? false;
  // Force conversion to JPG for web compatibility (handles HEIC, etc.)
  const format = 'jpg';

  // Build signature - must include all signed parameters
  const paramsToSign = `folder=${folder}&format=${format}&overwrite=${overwrite}&timestamp=${timestamp}${API_SECRET!}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  // Create FormData for server-side (Node.js)
  const formData = new FormData();
  // Convert buffer to Blob properly
  const blob = new Blob([new Uint8Array(options.fileBuffer)], { type: 'image/jpeg' });
  formData.append('file', blob, options.filename || 'upload.jpg');
  formData.append('api_key', API_KEY!);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);
  formData.append('overwrite', String(overwrite));
  // Convert HEIC and other unsupported formats to JPG for web compatibility
  formData.append('format', format);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  console.log('🌐 Uploading to Cloudinary:', endpoint);
  const response = await fetch(endpoint, { 
    method: 'POST', 
    body: formData 
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Cloudinary upload failed:', response.status, errorText);
    throw new Error(`Cloudinary upload failed: ${response.status} ${errorText}`);
  }
  
  const result = await response.json() as CloudinaryUploadResult;
  console.log('✅ Cloudinary upload result:', {
    secure_url: result.secure_url,
    public_id: result.public_id,
    format: result.format
  });
  
  return result;
}


