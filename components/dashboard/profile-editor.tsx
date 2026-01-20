"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProfileEditorProps {
  user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  profile: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function ProfileEditor({ user, profile }: ProfileEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || "");
  const [characters, setCharacters] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      loadCharacters();
    }
  }, [isOpen]);

  const loadCharacters = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("characters")
      .select("id, name, image_url")
      .order("name");
    if (data) {
      const getAvatarPath = (originalPath: string) => {
        const filename = originalPath.split('/').pop();
        return `/images/avatars/${filename}`;
      };
      setCharacters(data.map(char => ({
        ...char,
        avatar_url: getAvatarPath(char.image_url)
      })));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        avatar_url: selectedAvatar,
      })
      .eq("id", user.id);

    if (!error) {
      router.refresh();
      setIsOpen(false);
    } else {
      console.error("Error updating profile:", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-zinc-900 text-white hover:bg-[#FCEE21] hover:text-black rounded-none transition-colors font-bold"
      >
        Edit Profile
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Edit Profile">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border-2 border-zinc-200 focus:border-[#FCEE21] focus:outline-none rounded-none"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-2">
              Select Avatar
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedAvatar(char.avatar_url)}
                  className={`relative aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                    selectedAvatar === char.avatar_url
                      ? "border-[#FCEE21] ring-2 ring-[#FCEE21]"
                      : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <img
                    src={char.avatar_url}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedAvatar === char.avatar_url && (
                    <div className="absolute inset-0 bg-[#FCEE21]/20 flex items-center justify-center">
                      <span className="text-2xl">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-2 border-zinc-200 rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
