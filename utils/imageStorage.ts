import { File, Paths } from "expo-file-system";

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
    return `${Paths.document.uri}${filename}`;
}

/**
 * Get the File instance for an image type
 */
export function getImageFile(imageType: ImageType): File {
    const filename = IMAGE_FILENAMES[imageType];
    return new File(Paths.document, filename);
}

/**
 * Check if an image file exists at the given path
 */
export function imageExists(uri: string): boolean {
    try {
        const file = new File(uri);
        return file.exists;
    } catch (error) {
        console.error(`Error checking if image exists: ${error}`);
        return false;
    }
}

/**
 * Delete an image file if it exists
 */
export function deleteImage(imageType: ImageType): void {
    try {
        const file = getImageFile(imageType);
        if (file.exists) {
            file.delete();
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
export function saveImageToPermanentStorage(
    sourceUri: string,
    imageType: ImageType,
): string {
    try {
        // Delete old image first
        deleteImage(imageType);

        // Get destination file
        const destinationFile = getImageFile(imageType);

        // Copy the image to permanent storage
        const sourceFile = new File(sourceUri);
        sourceFile.copy(destinationFile);

        return destinationFile.uri;
    } catch (error) {
        console.error(`Error saving image to permanent storage: ${error}`);
        throw error;
    }
}

/**
 * Validate if a stored URI is still accessible
 * Handles both old temporary URIs and new permanent paths
 */
export function validateImageUri(uri: string | null): string | null {
    if (!uri) {
        return null;
    }

    // Check if it's already a permanent path (starts with document directory)
    const documentUri = Paths.document.uri;
    if (uri.startsWith(documentUri)) {
        const exists = imageExists(uri);
        return exists ? uri : null;
    }

    // For old temporary URIs, check if they still exist
    // If they don't, return null (image needs to be re-selected)
    const exists = imageExists(uri);
    return exists ? uri : null;
}

/**
 * Get the permanent URI for an image type, or null if it doesn't exist
 */
export function getImageUri(imageType: ImageType): string | null {
    const file = getImageFile(imageType);
    return file.exists ? file.uri : null;
}

/**
 * Migrate old temporary URI to permanent storage if still accessible
 * Returns the permanent URI if migration succeeded, null otherwise
 */
export function migrateImageUri(
    oldUri: string | null,
    imageType: ImageType,
): string | null {
    if (!oldUri) {
        return null;
    }

    // If it's already a permanent path, just validate it
    const documentUri = Paths.document.uri;
    if (oldUri.startsWith(documentUri)) {
        const exists = imageExists(oldUri);
        return exists ? oldUri : null;
    }

    // Try to copy old temporary URI to permanent storage
    try {
        const exists = imageExists(oldUri);
        if (exists) {
            return saveImageToPermanentStorage(oldUri, imageType);
        }
    } catch (error) {
        console.error(`Error migrating image: ${error}`);
    }

    return null;
}
