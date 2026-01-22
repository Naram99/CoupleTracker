import * as FileSystem from "expo-file-system/legacy";

export type ImageType = "user" | "partner" | "cover";

const IMAGE_FILENAMES: Record<ImageType, string> = {
    user: "userImage.jpg",
    partner: "partnerImage.jpg",
    cover: "coverImage.jpg",
};

/**
 * Get the permanent file path for an image type
 */
export function getImagePath(imageType: ImageType): string {
    const filename = IMAGE_FILENAMES[imageType];
    return `${FileSystem.documentDirectory}${filename}`;
}

/**
 * Check if an image file exists at the given path
 */
export async function imageExists(uri: string): Promise<boolean> {
    try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        return fileInfo.exists;
    } catch (error) {
        console.error(`Error checking if image exists: ${error}`);
        return false;
    }
}

/**
 * Delete an image file if it exists
 */
export async function deleteImage(imageType: ImageType): Promise<void> {
    try {
        const imagePath = getImagePath(imageType);
        const exists = await imageExists(imagePath);
        if (exists) {
            await FileSystem.deleteAsync(imagePath, { idempotent: true });
        }
    } catch (error) {
        console.error(`Error deleting image: ${error}`);
        // Don't throw - deletion failure shouldn't block new image save
    }
}

/**
 * Copy image from picker URI to permanent storage
 * Deletes old image before copying new one
 */
export async function saveImageToPermanentStorage(
    sourceUri: string,
    imageType: ImageType,
): Promise<string> {
    try {
        // Delete old image first
        await deleteImage(imageType);

        // Get destination path
        const destinationPath = getImagePath(imageType);

        // Copy the image to permanent storage
        await FileSystem.copyAsync({
            from: sourceUri,
            to: destinationPath,
        });

        return destinationPath;
    } catch (error) {
        console.error(`Error saving image to permanent storage: ${error}`);
        throw error;
    }
}

/**
 * Validate if a stored URI is still accessible
 * Handles both old temporary URIs and new permanent paths
 */
export async function validateImageUri(
    uri: string | null,
): Promise<string | null> {
    if (!uri) {
        return null;
    }

    // Check if it's already a permanent path (starts with documentDirectory)
    if (uri.startsWith(FileSystem.documentDirectory || "")) {
        const exists = await imageExists(uri);
        return exists ? uri : null;
    }

    // For old temporary URIs, check if they still exist
    // If they don't, return null (image needs to be re-selected)
    const exists = await imageExists(uri);
    return exists ? uri : null;
}

/**
 * Get the permanent URI for an image type, or null if it doesn't exist
 */
export async function getImageUri(
    imageType: ImageType,
): Promise<string | null> {
    const imagePath = getImagePath(imageType);
    const exists = await imageExists(imagePath);
    return exists ? imagePath : null;
}

/**
 * Migrate old temporary URI to permanent storage if still accessible
 * Returns the permanent URI if migration succeeded, null otherwise
 */
export async function migrateImageUri(
    oldUri: string | null,
    imageType: ImageType,
): Promise<string | null> {
    if (!oldUri) {
        return null;
    }

    // If it's already a permanent path, just validate it
    if (oldUri.startsWith(FileSystem.documentDirectory || "")) {
        const exists = await imageExists(oldUri);
        return exists ? oldUri : null;
    }

    // Try to copy old temporary URI to permanent storage
    try {
        const exists = await imageExists(oldUri);
        if (exists) {
            return await saveImageToPermanentStorage(oldUri, imageType);
        }
    } catch (error) {
        console.error(`Error migrating image: ${error}`);
    }

    return null;
}
