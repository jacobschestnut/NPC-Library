"use client";

import { useEffect, useState } from "react";
import { NPC } from "@/types/NPC";
import NPCCard from "@/components/npcCard";
import NPCForm from "@/components/npcForm";
import Navbar from "@/components/navbar";

export default function Home() {
  const [npcs, setNPCs] = useState<NPC[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const loadNPCs = async () => {
      try {
        const res = await fetch("/api/npc");
        const data: NPC[] = await res.json();
        setNPCs(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadNPCs();
  }, []);

  const handleNPCCreated = async () => {
    try {
      const res = await fetch("/api/npc");
      const data: NPC[] = await res.json();
      setNPCs(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <Navbar onToggleForm={() => setIsFormVisible(prev => !prev)} />
      <main className="flex flex-col justify-center items-center gap-4 mt-4">
        <NPCForm 
          onCreated={handleNPCCreated} 
          isVisible={isFormVisible}
        />
        <ul className="w-3/4 grid gap-4 grid-cols-1 2xl:grid-cols-4 list-none">
          {npcs.map((npc) => (
            <li key={npc.id} className="flex justify-center">
              <NPCCard npc={npc} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}