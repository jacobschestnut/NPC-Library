"use client";

import { useEffect, useRef, useState } from "react";

type Clip = {
  id: string;
  name: string;
  url: string;
};

export default function AudioRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [clips, setClips] = useState<Clip[]>([]);
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

          setClips((prev) => [...prev, newClip]);
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
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.stop();
    setIsRecording(false);
  };

  const deleteClip = (id: string) => {
    setClips((prev) => prev.filter((clip) => clip.id !== id));
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Record
      </button>

      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>

      <div className="sound-clips">
        {clips.map((clip) => (
          <article key={clip.id} className="clip">
            <audio controls src={clip.url} />
            <p>{clip.name}</p>
            <button onClick={() => deleteClip(clip.id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}