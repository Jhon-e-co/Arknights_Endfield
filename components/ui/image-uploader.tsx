"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string, file?: File) => void;
  selectedImage?: string;
  onError?: (error: string) => void;
}

export function ImageUploader({ onImageSelect, selectedImage, onError }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [error, setError] = useState('');

  const handleFileSelect = (file: File) => {
    setError('');
    
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      onError?.('Please select a valid image file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 2MB');
      onError?.('Image must be smaller than 2MB');
      setSelectedFile(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    onImageSelect(imageUrl, file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onImageSelect('', undefined);
    setSelectedFile(undefined);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
      
      {error && (
        <div className="mb-3 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {selectedImage ? (
        <div className="relative w-full aspect-video border-2 border-[#FCEE21] bg-zinc-900">
          <img
            src={selectedImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/80 text-white p-2 hover:bg-black/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            w-full aspect-video border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
            ${isDragging ? 'border-[#FCEE21] bg-zinc-800' : 'border-zinc-300 hover:border-zinc-400'}
          `}
        >
          <Upload className="w-12 h-12 text-zinc-400 mb-2" />
          <p className="text-sm font-medium text-zinc-600">
            Drop image here or click to upload
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports: JPG, PNG, WebP (Max 2MB)
          </p>
        </div>
      )}
    </div>
  );
}
