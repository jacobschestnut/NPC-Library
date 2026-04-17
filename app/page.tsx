"use client";

import { useEffect, useState } from "react";
import { NPC } from "@/types/NPC";
import NPCCard from "@/components/npcCard";

export default function Home() {
  const [npcs, setNPCs] = useState<NPC[]>([])

  useEffect(() => {
    async function loadNPCs() {
      try {
        const res = await fetch('/api/npcs')
        const data: NPC[] = await res.json()
        setNPCs(data)
      } catch (error) {
        console.log(error)
      }
    }
    loadNPCs();
  }, []);

  return (
    <div className="">
      <main className="p-10 flex justify-center">
        <ul className="w-3/4 grid gap-4 grid-cols-1 xl:grid-cols-4 list-none">
          {npcs.map((npc) => (
            <li key={npc.id} className="flex justify-center">
              <NPCCard npc={npc}/>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
