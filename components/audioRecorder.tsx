"use client";

import { useEffect, useRef, useState } from "react";

interface AudioRecorderProps {
  onIsRecordingChange: (isRecording: boolean) => void;
}

type Clip = {
  id: string;
  name: string;
  url: string;
};

export default function AudioRecorder({ onIsRecordingChange }: AudioRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [clip, setClip] = useState<Clip | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      console.log("getUserMedia not supported");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = (e: BlobEvent) => {
          chunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType })

          chunksRef.current = [];

          const url = URL.createObjectURL(blob);

          const name = prompt("Enter clip name") || "Untitled";

          const newClip: Clip = {
            id: crypto.randomUUID(),
            name: name,
            url: url
          }

          setClip(newClip);
        }
      })
      .catch((err) => {
        console.error("getUserMedia error:", err);
      });

  }, []);

  const startRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.start();
    setIsRecording(true);
    onIsRecordingChange(true);
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.stop();
    setIsRecording(false);
    onIsRecordingChange(false);
  };

  const deleteClip = () => {
    setClip(null);
  };

  return (
    <div>
      {(!isRecording && !clip) && <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={startRecording}>
        Record
      </button>}
      {isRecording && <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-red-600 hover:bg-blue-700" onClick={stopRecording}>
        Stop Recording
      </button>}
      {clip && 
        <div className="">
          <audio controls src={clip?.url} />
          <button onClick={() => deleteClip()}>
            Delete
          </button>
        </div>
      }
    </div>
  );
}