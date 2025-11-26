import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import app from './config';

const storage = getStorage(app);

/**
 * Upload user avatar to Firebase Storage
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
  
  // Upload to Firebase Storage
  const avatarRef = ref(storage, `avatars/${uid}/avatar.jpg`);
  await uploadBytes(avatarRef, resizedImage);
  
  // Get download URL
  const downloadURL = await getDownloadURL(avatarRef);
  return downloadURL;
}

/**
 * Delete user avatar from Firebase Storage
 */
export async function deleteAvatar(uid: string): Promise<void> {
  const avatarRef = ref(storage, `avatars/${uid}/avatar.jpg`);
  
  try {
    await deleteObject(avatarRef);
  } catch (error: any) {
    // Ignore if file doesn't exist
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
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
 * Upload project thumbnail
 */
export async function uploadProjectThumbnail(
  userId: string,
  projectId: string,
  thumbnail: string
): Promise<string> {
  // Convert base64 to blob
  const blob = await (await fetch(thumbnail)).blob();
  
  // Upload to Firebase Storage
  const thumbnailRef = ref(storage, `projects/${userId}/${projectId}/thumbnail.png`);
  await uploadBytes(thumbnailRef, blob);
  
  // Get download URL
  const downloadURL = await getDownloadURL(thumbnailRef);
  return downloadURL;
}

/**
 * Delete project thumbnail
 */
export async function deleteProjectThumbnail(
  userId: string,
  projectId: string
): Promise<void> {
  const thumbnailRef = ref(storage, `projects/${userId}/${projectId}/thumbnail.png`);
  
  try {
    await deleteObject(thumbnailRef);
  } catch (error: any) {
    // Ignore if file doesn't exist
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}
