"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";

import { Button } from "@/components/ui/button";
import { uploadProfilePhoto } from "@/actions/upload";
import { isLocalImageUrl } from "@/lib/utils";

type PhotoUploadProps = Readonly<{
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}>;

const MAX_FILE_SIZE_MB = 10;
const COMPRESSED_MAX_SIZE_MB = 1; // Compress to max 1MB
const MAX_WIDTH_OR_HEIGHT = 800; // Max dimension for profile photos

export function PhotoUpload({ value, onChange, disabled }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size before processing
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadStatus("Compressing...");

    try {
      // Compress the image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: COMPRESSED_MAX_SIZE_MB,
        maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
        useWebWorker: true,
        fileType: "image/webp", // Convert to WebP for better compression
      });

      setUploadStatus("Uploading...");

      const formData = new FormData();
      formData.append("file", compressedFile);

      const result = await uploadProfilePhoto(formData);

      if (result.success) {
        onChange(result.url);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleRemove() {
    onChange("");
    setError(null);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border">
              {/* Use unoptimized for local development URLs */}
              <Image
                src={value}
                alt="Profile photo"
                fill
                className="object-cover"
                unoptimized={isLocalImageUrl(value)}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-1 -top-1 h-6 w-6"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border bg-card transition-colors hover:border-primary hover:bg-card/80"
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
          </button>
        )}

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadStatus ?? "Processing..."}
              </>
            ) : value ? (
              "Change photo"
            ) : (
              "Upload photo"
            )}
          </Button>
          <p className="mt-1 text-xs text-muted-foreground">
            JPEG, PNG, WebP or GIF. Max {MAX_FILE_SIZE_MB}MB. Auto-compressed.
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
