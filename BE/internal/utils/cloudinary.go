package utils

import (
	"strings"
)

// ExtractPublicID takes a full Cloudinary URL and extracts the public ID.
// Example: https://res.cloudinary.com/demo/image/upload/v1611111111/folder/image_name.jpg
// Result: folder/image_name
func ExtractPublicID(url string) string {
	parts := strings.Split(url, "/")
	if len(parts) == 0 {
		return ""
	}

	// Look for the "upload" path segment
	uploadIndex := -1
	for i, part := range parts {
		if part == "upload" {
			uploadIndex = i
			break
		}
	}

	if uploadIndex == -1 || uploadIndex+2 >= len(parts) {
		return ""
	}

	// The public ID includes the folder and file name (without extension)
	// Example: v1611111111/folder/image_name.jpg -> folder/image_name
	// parts[uploadIndex+1] is typically the version, so we start at uploadIndex+2
	publicIDParts := parts[uploadIndex+2:]
	publicID := strings.Join(publicIDParts, "/")

	// Remove extension
	dotIndex := strings.LastIndex(publicID, ".")
	if dotIndex != -1 {
		publicID = publicID[:dotIndex]
	}

	return publicID
}
