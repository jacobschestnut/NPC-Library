import { NPC } from "@/types/NPC";

type NPCCardProps = {
  npc: NPC;
};

export default function NPCCard({npc}: NPCCardProps) {
  return (
    <div className="w-full min-w-0 max-w-sm flex flex-col justify-center h-48 overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl dark:bg-slate-900">
      <div className="p-5">
        <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-white">{npc.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {npc.desc || "No description available."}
        </p>
        <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Record Audio 
        </button>
      </div>
    </div>
  );
}