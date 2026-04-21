import { useState } from "react";
import AudioRecorder from "@/components/audioRecorder";
import { NPC } from "@/types/NPC";

type NPCCardProps = {
  npc: NPC;
};

export default function NPCCard({npc}: NPCCardProps) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="w-full min-w-0 max-w-sm flex flex-col justify-center overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl dark:bg-slate-900">
      <div className="p-5">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{npc.name}</h3>
          {isRecording && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {npc.desc || "No description available."}
        </p>
        <AudioRecorder currentNPC={npc} onIsRecordingChange={setIsRecording}/>
      </div>
    </div>
  );
}