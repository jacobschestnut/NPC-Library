"use client";

import { NPC } from "@/types/NPC";
import { useEffect, useRef, useState, useCallback } from "react";

interface AudioRecorderProps {
  onIsRecordingChange: (isRecording: boolean) => void;
  currentNPC: NPC;
}

export default function AudioRecorder({
  onIsRecordingChange,
  currentNPC,
}: AudioRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [clip, setClip] = useState<{
    id: string;
    url: string;
  } | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const loadExistingAudio = async () => {
      try {
        const res = await fetch(`/api/npc/${currentNPC.id}/audio`);

        if (!res.ok) return;

        const data = await res.json().catch(() => null);

        if (!data?.url) return;

        setClip({
          id: crypto.randomUUID(),
          url: data.url,
        });
      } catch (err) {
        console.error("Failed to load audio:", err);
      }
    };

    loadExistingAudio();
  }, [currentNPC.id]);

  const handleUpload = useCallback(async (blob: Blob) => {
    const res = await fetch("/api/upload-url");
    const { url, key } = await res.json();

    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "audio/webm",
      },
      body: blob,
    });

    await fetch("/api/audio/save", {
      method: "POST",
      body: JSON.stringify({
        key,
        npcId: currentNPC.id,
      }),
    });

    const audioRes = await fetch(`/api/npc/${currentNPC.id}/audio`);
    const { url: signedUrl } = await audioRes.json();

    return signedUrl;
  }, [currentNPC.id]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      console.log("getUserMedia not supported");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e: BlobEvent) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType,
          });

          chunksRef.current = [];

          const signedUrl = await handleUpload(blob);

          setClip({
            id: crypto.randomUUID(),
            url: signedUrl,
          });
        };
      })
      .catch((err) => {
        console.error("getUserMedia error:", err);
      });
  }, [handleUpload]);

  const startRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (clip && !window.confirm("Replace existing clip?")) {
      return;
    }

    setClip(null);
    recorder.start();
    setIsRecording(true);
    onIsRecordingChange(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    onIsRecordingChange(false);
  };

  return (
    <div>
      {clip && (
        <div>
          <audio
            className="w-full mt-4 px-2 h-12"
            controls
            src={clip.url}
          />
        </div>
      )}

      {!clip && (
        <p className="h-12 mt-4 w-full rounded-lg px-4 py-2 text-white text-center">
          No clip found.
        </p>
      )}

      {!isRecording && (
        <button
          className="h-12 cursor-pointer mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={startRecording}
        >
          Record
        </button>
      )}

      {isRecording && (
        <button
          className="h-12 cursor-pointer mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-red-600 hover:bg-blue-700"
          onClick={stopRecording}
        >
          Stop Recording
        </button>
      )}
    </div>
  );
}