'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, X, Check, AlertCircle } from 'lucide-react';
// import { uploadProfilePhoto } from '@/services/upload-service';

interface PhotoUploadProps {
  currentPhotoUrl: string;
  onPhotoUpload: (photoUrl: string) => void;
  employeeId: number;
}

export function PhotoUpload({ onPhotoUpload, employeeId }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setSuccess('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // const photoUrl = await uploadProfilePhoto(
      //   file,
      //   employeeId,
      //   (progress) => {
      //     setUploadProgress(progress);
      //   }
      // );
      const photoUrl = '';

      onPhotoUpload(photoUrl);
      setSuccess('Photo uploaded successfully!');
      setPreviewUrl(null);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to upload photo. Please try again.');
      console.error('Photo upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {!previewUrl ? (
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="flex items-center space-x-2"
        >
          <Camera className="h-4 w-4" />
          <span>Change Photo</span>
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={previewUrl || '/placeholder.svg'}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-gray-600 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center space-x-1"
            >
              <Upload className="h-3 w-3" />
              <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={triggerFileSelect}
              disabled={isUploading}
            >
              <Camera className="h-3 w-3 mr-1" />
              Change
            </Button>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, GIF</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Recommended: Square images (1:1 ratio)</p>
      </div>
    </div>
  );
}
