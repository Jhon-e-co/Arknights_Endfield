"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { CharacterAvatar } from '@/components/teams/character-avatar';
import { CHARACTERS, Character } from '@/lib/mock-data';
import { motion } from 'framer-motion';

const AVAILABLE_TAGS = [
  "Freeze",
  "Burn",
  "Burst",
  "Sustained",
  "CC",
  "Support",
  "Tank",
  "DPS",
  "Hybrid",
  "Versatile"
];

export default function CreateSquadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<(Character | null)[]>([null, null, null, null]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleSlotClick = (index: number) => {
    setSelectedSlot(index);
    setDialogOpen(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (selectedSlot !== null) {
      const newSelection = [...selectedCharacters];
      newSelection[selectedSlot] = character;
      setSelectedCharacters(newSelection);
      setDialogOpen(false);
      setSelectedSlot(null);
    }
  };

  const handleRemoveCharacter = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = [...selectedCharacters];
    newSelection[index] = null;
    setSelectedCharacters(newSelection);
  };

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
    const filledSlots = selectedCharacters.filter(c => c !== null);
    if (filledSlots.length === 0) {
      alert('Please select at least one character for your squad.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Squad created successfully!');
      router.push('/teams');
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
            CREATE <span className="bg-[#FCEE21] px-1">SQUAD</span>
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-4xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Select Your Team (Max 4)</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedCharacters.map((character, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSlotClick(index)}
                  className={`
                    relative aspect-square border-2 cursor-pointer transition-all
                    ${character 
                      ? 'border-zinc-400 bg-zinc-100' 
                      : 'border-dashed border-zinc-300 bg-zinc-50 hover:border-zinc-400'
                    }
                  `}
                >
                  {character ? (
                    <>
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleRemoveCharacter(index, e)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-bold text-center py-1">
                        {character.name}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                      <Plus className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Slot {index + 1}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Squad Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Squad Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter squad title..."
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
                  placeholder="Describe your squad strategy..."
                  className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2 min-h-[120px] resize-y"
                />
              </div>
            </div>
          </div>

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
                  Creating...
                </>
              ) : (
                'CREATE SQUAD'
              )}
            </Button>
          </div>
        </form>
      </motion.div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Select Character"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CHARACTERS.map((character) => (
            <motion.button
              key={character.id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCharacterSelect(character)}
              className="border-2 border-zinc-200 bg-white hover:border-zinc-400 transition-colors p-2"
            >
              <CharacterAvatar character={character} size="lg" showName />
            </motion.button>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
