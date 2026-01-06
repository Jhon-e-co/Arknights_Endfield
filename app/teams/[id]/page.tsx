import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SquadActions } from "@/components/teams/squad-actions";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: squad } = await supabase
    .from("squads")
    .select(`
      title,
      description,
      likes,
      tags,
      profiles (username)
    `)
    .eq("id", id)
    .single();
  
  if (!squad) {
    return { 
      title: "Squad Not Found | Endfield Lab",
      description: "The requested squad could not be found."
    };
  }

  const author = squad.profiles?.username || 'Unknown';
  const descriptionSnippet = squad.description?.slice(0, 100) || '';
  const fullDescription = `Best team build: ${squad.title}. Likes: ${squad.likes || 0}. ${descriptionSnippet}${descriptionSnippet.length >= 100 ? '...' : ''}`;
  const primaryTag = squad.tags?.[0] || 'Squad';
  
  const ogImage = '/Logo/og-image.png';
  const imagesArray = ogImage ? [ogImage] : [];

  return {
    title: `${squad.title} - Best Team Build | Endfield Lab`,
    description: fullDescription,
    openGraph: {
      title: `${squad.title} - Best Team Build | Endfield Lab`,
      description: fullDescription,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: squad.title,
        },
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${squad.title} - Best Team Build | Endfield Lab`,
      description: fullDescription,
      images: imagesArray,
    },
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

interface DBCharacter {
  id: string;
  name: string;
  element: string;
  rarity: number;
  image_url: string;
}

export default async function SquadDetailPage({ params }: PageProps) {
  // Await params mainly for Next.js 15+ compatibility
  const { id } = await params;
  const supabase = await createClient();

  // 1. 获取队伍详情
  const { data: squad, error } = await supabase
    .from("squads")
    .select("*, profiles(username, avatar_url)")
    .eq("id", id)
    .single();

  if (error || !squad) {
    console.error("Squad not found error:", error);
    return notFound(); // 显示 Next.js 默认 404 或自定义 Not Found 组件
  }

  // 2. 获取该队伍的成员角色信息
  // squad.members 是一个 UUID 数组
  const memberIds = squad.members || [];
  let characters: DBCharacter[] = [];

  if (memberIds.length > 0) {
    const { data: chars } = await supabase
      .from("characters")
      .select("*")
      .in("id", memberIds);
    
    // 按 squad.members 的顺序重新排序角色 (保持 1,2,3,4 号位顺序)
  const charMap = new Map(chars?.map(c => [c.id, c]));
  characters = memberIds.map((mid: string) => charMap.get(mid)).filter(Boolean);
  }

  // 获取当前用户
  const { data: { user } } = await supabase.auth.getUser();

  // 获取用户的点赞和收藏状态
  let isLiked = false;
  let isCollected = false;

  if (user) {
    const [likeRes, collectRes] = await Promise.all([
      supabase.from("squad_likes").select("id").eq("user_id", user.id).eq("squad_id", id).single(),
      supabase.from("saved_squads").select("id").eq("user_id", user.id).eq("squad_id", id).single()
    ]);
    isLiked = !!likeRes.data;
    isCollected = !!collectRes.data;
  }

  // 元素颜色映射 (复制自 team-card 的逻辑，确保一致)
  const elementColors: Record<string, string> = {
    heat: "from-red-500 to-orange-600",
    cryo: "from-blue-400 to-cyan-500",
    electric: "from-yellow-400 to-amber-500",
    physical: "from-zinc-400 to-zinc-600",
    nature: "from-green-500 to-emerald-600",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/teams">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-[#FCEE21]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Squads
          </Button>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Characters Display (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Hero Section: 4 Characters */}
          <div className="grid grid-cols-4 gap-2 h-64 md:h-96 w-full bg-zinc-900 rounded-none overflow-hidden border border-zinc-800">
             {characters.map((char, index) => {
                const elementKey = (char.element || '').toLowerCase();
                const colorClass = elementColors[elementKey] || 'from-zinc-500 to-zinc-700';
                
                return (
                  <div key={char.id || index} className="relative group h-full border-r border-zinc-800 last:border-r-0">
                    {/* Character Image */}
                    <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500">
                      <Image
                        src={char.image_url || `/characters/${char.name}.webp`}
                        alt={char.name}
                        fill
                        className="object-cover"
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${colorClass} opacity-20 group-hover:opacity-10 mix-blend-overlay transition-opacity`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-4 left-0 w-full text-center z-10">
                       <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-br ${colorClass} text-white shadow-lg`}>
                          {/* Element Icon */}
                          <Image
                            src={`/images/elements/${elementKey}.webp`}
                            alt={char.element}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                       </div>
                       <p className="text-white font-bold text-sm md:text-lg uppercase tracking-wider">{char.name}</p>
                    </div>
                  </div>
                );
             })}
          </div>

          {/* Description Section */}
          <div className="bg-white p-8 border border-zinc-200">
            <h2 className="text-2xl font-bold mb-4 uppercase">Strategy Guide</h2>
            <div className="prose max-w-none text-zinc-600 whitespace-pre-line">
              {squad.description || "No description provided."}
            </div>
          </div>
        </div>

        {/* Right Column: Meta Info (1/3 width) */}
        <div className="space-y-6">
           <div className="bg-zinc-50 p-6 border border-zinc-200">
              <h1 className="text-3xl font-bold uppercase mb-2">{squad.title}</h1>
              
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-200">
                 <div className="w-10 h-10 relative rounded-full overflow-hidden bg-zinc-200">
                    <Image
                       src={squad.profiles?.avatar_url || "/images/avatars/default.png"}
                       alt="Author"
                       fill
                       className="object-cover"
                    />
                 </div>
                 <div>
                    <p className="text-sm text-zinc-500">Created by</p>
                    <Link href={`/users/${squad.author_id}`} className="font-bold hover:text-[#FCEE21] transition-colors">
                      {squad.profiles?.username || "Unknown"}
                    </Link>
                 </div>
              </div>

              <SquadActions squadId={squad.id} initialLikes={squad.likes || 0} initialIsLiked={isLiked} initialIsCollected={isCollected} />
           </div>
           
           {/* Tags (Optional) */}
           {squad.tags && squad.tags.length > 0 && (
             <div className="bg-white p-6 border border-zinc-200">
                <h3 className="font-bold mb-4 uppercase text-sm text-zinc-500">Tags</h3>
                <div className="flex flex-wrap gap-2">
                   {squad.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-zinc-100 text-zinc-600 text-sm font-medium border border-zinc-200">
                         {tag}
                      </span>
                   ))}
                </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
