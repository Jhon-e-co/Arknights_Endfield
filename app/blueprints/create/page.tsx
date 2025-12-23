"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageUploader } from '@/components/ui/image-uploader';
import { motion } from 'framer-motion';

const AVAILABLE_TAGS = [
  "Ferrium",
  "Peligun",
  "Kland Kuc",
  "Quartz",
  "Originium",
  "Power",
  "Logistics",
  "AIC",
  "Combat"
];

export default function CreateBlueprintPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    blueprintCode: '',
    title: '',
    description: '',
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsSubmitting(false);
      alert('Blueprint uploaded successfully!');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-2 border-zinc-200 rounded-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-black uppercase">
            UPLOAD <span className="bg-[#FCEE21] px-1">BLUEPRINT</span>
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Blueprint Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Blueprint Code *
                </label>
                <textarea
                  value={formData.blueprintCode}
                  onChange={(e) => handleInputChange('blueprintCode', e.target.value)}
                  placeholder="Paste your AIC code string here..."
                  className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2 min-h-[120px] font-mono text-sm resize-y"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter blueprint title..."
                  className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`
                        px-3 py-1 text-sm font-medium transition-colors border-2
                        ${selectedTags.includes(tag)
                          ? 'border-[#FCEE21] bg-[#FCEE21] text-black'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                        }
                      `}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your blueprint..."
                  className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2 min-h-[100px] resize-y"
                />
              </div>
            </div>
          </div>

          <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Preview Image</h2>
            <ImageUploader
              onImageSelect={setSelectedImage}
              selectedImage={selectedImage}
            />
          </div>

          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-zinc-200 bg-white rounded-none shadow-sm p-6"
            >
              <div className="flex items-center gap-4">
                <Loader2 className="w-6 h-6 animate-spin text-[#FCEE21]" />
                <div className="flex-1">
                  <p className="font-medium mb-2">Uploading blueprint...</p>
                  <div className="w-full h-2 bg-zinc-200 rounded-none overflow-hidden">
                    <motion.div
                      className="h-full bg-[#FCEE21]"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{Math.round(uploadProgress)}%</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-2 border-zinc-200 rounded-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold px-6 py-3 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  PUBLISH BLUEPRINT
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
