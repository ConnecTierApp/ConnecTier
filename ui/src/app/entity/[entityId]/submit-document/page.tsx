"use client";

import React, { useState } from "react";
import type { FC } from "react";
import { useParams } from "next/navigation";


// Microphone SVG as a component for easy styling
const MicrophoneIcon: FC<{ active: boolean }> = ({ active }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="80"
    height="80"
    viewBox="0 0 24 24"
    className={`drop-shadow-xl transition-colors duration-300 ${active ? "text-red-500" : "text-neutral-800"}`}
    fill="currentColor"
  >
    <circle cx="12" cy="12" r="12" fill="white" className="opacity-90" />
    <rect x="9" y="4" width="6" height="12" rx="3" className="fill-current" />
    <rect x="10.5" y="16" width="3" height="2" rx="1" className="fill-current" />
    <rect x="8" y="18" width="8" height="2" rx="1" className="fill-current" />
  </svg>
);

const SubmitDocumentPage: FC = () => {
  // Get entityId from route params
  const params = useParams();
  const entityId = (params?.entityId as string) || "";

  console.log("entityId", entityId);

  // Audio recording state
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  // Note: mediaStream is only used for starting/stopping tracks, not in render
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start/stop recording
  const handleMicClick = async () => {
    if (!recording) {
      setSuccess(false);
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(stream);
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        setAudioChunks([]);
        recorder.ondataavailable = (e) => {
          setAudioChunks((prev) => [...prev, e.data]);
        };
        recorder.onstop = () => {
          const blob = new Blob(audioChunks.concat(), { type: 'audio/webm' });
          setAudioBlob(blob);
          setAudioUrl(URL.createObjectURL(blob));
          stream.getTracks().forEach((track) => track.stop());
        };
        recorder.start();
        setRecording(true);
      } catch {
        setError("Could not access microphone.");
      }
    } else {
      mediaRecorder?.stop();
      setRecording(false);
    }
  };

  // Submit audio to backend
  const handleSubmit = async () => {
    if (!audioBlob) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      const res = await fetch(`/api/entities/${entityId}/transcribe/`, {
        method: "POST",
        body: formData,
      });
      if (res.status === 201) {
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.detail || "Failed to transcribe audio.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 relative overflow-hidden">
      <div className="flex flex-col items-center gap-8 z-10">
        {/* Audio playback (if available) */}
        <div className="w-[340px] h-[80px] flex items-center justify-center bg-white/80 rounded-xl shadow-lg">
          {audioUrl ? (
            <audio controls src={audioUrl} className="w-full" />
          ) : (
            <span className="text-neutral-400 text-lg">Start recording to add audio</span>
          )}
        </div>
        {/* Mic button */}
        <button
          type="button"
          aria-label={recording ? "Stop recording" : "Start recording"}
          onClick={handleMicClick}
          className="relative z-10 bg-white/80 rounded-full shadow-xl p-8 hover:scale-105 active:scale-95 transition-transform border-4 border-white focus:outline-none focus:ring-4 focus:ring-blue-300"
          disabled={submitting}
        >
          <MicrophoneIcon active={recording} />
          <span className="sr-only">{recording ? "Stop recording" : "Start recording"}</span>
        </button>
        {/* Submit button */}
        {audioBlob && !recording && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
        {/* Success/Error messages */}
        {success && <div className="text-green-600 font-semibold mt-2">Transcript submitted!</div>}
        {error && <div className="text-red-500 font-semibold mt-2">{error}</div>}
      </div>
      {/* Glow effect */}
      <div
        className={`absolute z-0 rounded-full blur-2xl opacity-40 transition-all duration-500 ${recording ? "bg-red-400 w-80 h-80" : "bg-blue-300 w-64 h-64"}`}
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        aria-hidden="true"
      />
    </main>
  );
};

export default SubmitDocumentPage;
