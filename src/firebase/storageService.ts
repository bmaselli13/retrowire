/**
 * Upload user avatar (converts to base64 for Firestore storage)
 * This approach works on Firebase free tier without requiring Storage
 */
export async function uploadAvatar(uid: string, file: File): Promise<string> {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image must be less than 5MB');
  }
  
  // Resize and compress image
  const resizedImage = await resizeImage(file, 200, 200);
  
  // Convert to base64 for Firestore storage
  const base64 = await blobToBase64(resizedImage);
  return base64;
}

/**
 * Delete user avatar (no-op for base64, just return to keep API consistent)
 */
export async function deleteAvatar(uid: string): Promise<void> {
  // No-op: base64 avatars are stored in Firestore user profile
  // They're deleted when profile field is updated
  return;
}

/**
 * Resize image to specified dimensions
 */
async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    img.onload = () => {
      // Calculate new dimensions
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/jpeg',
        0.9 // Quality (0.9 = 90%)
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load image
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Process project thumbnail (already base64, just validate and compress if needed)
 */
export async function uploadProjectThumbnail(
  userId: string,
  projectId: string,
  thumbnail: string
): Promise<string> {
  // Thumbnail is already base64 from canvas
  // Just return it - will be stored directly in Firestore
  return thumbnail;
}

/**
 * Delete project thumbnail (no-op for base64)
 */
export async function deleteProjectThumbnail(
  userId: string,
  projectId: string
): Promise<void> {
  // No-op: base64 thumbnails are stored in Firestore project document
  return;
}

/**
 * Convert Blob to base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
