"use client";
import React, { useState, useRef, useEffect } from "react";
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

// Add type declarations for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Settings {
  voiceEnabled: boolean;
  wakeWord: string;
  volume: number;
  speed: number;
  voice: SpeechSynthesisVoice | null;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

function VirtualAssistantContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    voiceEnabled: true,
    wakeWord: "hey assistant",
    volume: 1,
    speed: 1,
    voice: null,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const recognition = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef(window.speechSynthesis);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError("Speech recognition is not supported in your browser.");
        return;
      }

      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => (result as SpeechRecognitionResult)[0].transcript)
          .join("");
        setTranscript(transcript);

        if (event.results[0].isFinal) {
          if (transcript.toLowerCase().includes(settings.wakeWord.toLowerCase())) {
            handleVoiceInput(transcript.replace(settings.wakeWord, "").trim());
          }
        }
      };

      recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError("Error with speech recognition: " + event.error);
        setIsListening(false);
      };

      loadVoices();
    }
  }, []);

  const loadVoices = () => {
    const voices = synthesis.current.getVoices();
    setAvailableVoices(voices);
    if (voices.length > 0 && !settings.voice) {
      setSettings((prev) => ({ ...prev, voice: voices[0] }));
    }
  };

  const handleVoiceInput = async (input: string) => {
    if (!input) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/integrations/gemini/gemini1.5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (settings.voiceEnabled) {
        speak(assistantMessage.content);
      }
    } catch (err) {
      setError("Failed to get response from assistant. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if (synthesis.current.speaking) {
      synthesis.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = settings.voice;
    utterance.volume = settings.volume;
    utterance.rate = settings.speed;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthesis.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognition.current) {
      setError("Speech recognition is not available.");
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleVoiceInput(inputText);
      setInputText("");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 overflow-hidden p-4">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Virtual Assistant
            </h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-gray-800"
            >
              <i className="fas fa-cog text-xl"></i>
            </button>
          </div>

          {showSettings && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Voice Enabled</span>
                  <button
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        voiceEnabled: !prev.voiceEnabled,
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                      settings.voiceEnabled ? "bg-[#357AFF]" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        settings.voiceEnabled
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    ></div>
                  </button>
                </div>
                <div>
                  <label className="block text-sm mb-1">Wake Word</label>
                  <input
                    type="text"
                    value={settings.wakeWord}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        wakeWord: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Voice</label>
                  <select
                    value={settings.voice?.name}
                    onChange={(e) => {
                      const voice = availableVoices.find(
                        (v) => v.name === e.target.value
                      ) || null;
                      setSettings((prev) => ({ ...prev, voice }));
                    }}
                    className="w-full p-2 border rounded"
                  >
                    {availableVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    Volume ({settings.volume})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.volume}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        volume: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    Speed ({settings.speed}x)
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.speed}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        speed: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => {
                setError(null);
                if (isListening) {
                  toggleListening();
                }
              }}
              variant="danger"
              className="mb-4"
            />
          )}

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm p-4 mb-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.role === 'user' ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? "bg-[#357AFF] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="md" color="primary" />
                <span className="ml-2 text-gray-600">Assistant is thinking...</span>
              </div>
            )}
          </div>

          {transcript && (
            <div className="bg-gray-100 rounded-lg p-3 mb-4 text-gray-600">
              <div className="flex items-center">
                <i className="fas fa-microphone mr-2"></i>
                {transcript}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-lg border"
              disabled={loading}
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-lg ${
                isListening ? "bg-red-500" : "bg-[#357AFF]"
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              <i
                className={`fas ${isListening ? "fa-stop" : "fa-microphone"}`}
              ></i>
            </button>
            <button
              type="submit"
              className="bg-[#357AFF] text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !inputText.trim()}
            >
              {loading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </form>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <a href="/" className="flex flex-col items-center p-2 text-gray-600">
            <i className="fas fa-home text-xl"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
          <a
            href="/virtual-try-on"
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <i className="fas fa-camera text-xl"></i>
            <span className="text-xs mt-1">Try-On</span>
          </a>
          <a
            href="/skin-analysis"
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <i className="fas fa-magnifying-glass text-xl"></i>
            <span className="text-xs mt-1">Analysis</span>
          </a>
          <a
            href="/profile"
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <i className="fas fa-user text-xl"></i>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </div>
      </nav>
    </div>
  );
}

export default function VirtualAssistantPage() {
  return (
    <ErrorBoundary>
      <VirtualAssistantContent />
    </ErrorBoundary>
  );
} 