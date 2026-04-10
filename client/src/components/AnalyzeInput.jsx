import { useRef, useState, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { getKeyboardLayout } from "./keyboardLayouts";
const CATEGORY_OPTIONS = [
  "Not Sure",
  "Property",
  "Domestic Violence",
  "Maintenance",
  "Custody",
  "Dowry",
];

const SUGGESTION_RULES = [
  {
    category: "Domestic Violence",
    keywords: ["abuse", "violence", "hit", "assault", "harassment", "cruelty"],
  },
  {
    category: "Maintenance",
    keywords: ["money", "financial support", "maintenance", "alimony", "expense"],
  },
  {
    category: "Custody",
    keywords: ["child", "custody", "guardian", "visitation", "minor"],
  },
  {
    category: "Property",
    keywords: ["property", "land", "house", "plot", "ownership"],
  },
  {
    category: "Dowry",
    keywords: ["dowry", "gift demand", "bride", "in-laws"],
  },
];

// Safely extract the component in case Vite wraps it in a default object
const VirtualKeyboard = Keyboard.default || Keyboard;

// Component for user to input legal case text or upload a PDF for analysis
export default function AnalyzeInput({ onAnalyze, loading }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Not Sure");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [layoutName, setLayoutName] = useState("default");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voiceStatusMessage, setVoiceStatusMessage] = useState("");
  const keyboardRef = useRef(null);
  const fileInputRef = useRef(null);

  const onKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
  };

  // Sync keyboard when user highlights text and deletes it, or types physically
  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setInput(text);
    }
  }, [text]);

  // Manage keyboard visibility based on language or file selection
  useEffect(() => {
    if (file || selectedLanguage === "English") {
      setShowKeyboard(false);
    } else {
      setShowKeyboard(true); // Auto-show for other languages
    }
  }, [file, selectedLanguage]);

  function getSuggestedCategories(inputText) {
    const normalized = String(inputText || "").toLowerCase();
    if (!normalized.trim()) {
      return [];
    }

    const matches = SUGGESTION_RULES
      .map(({ category, keywords }) => ({
        category,
        score: keywords.reduce(
          (count, keyword) => count + (normalized.includes(keyword) ? 1 : 0),
          0
        ),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.category);

    return matches.slice(0, 3);
  }

// Validates if the selected file is a PDF and sets it to state
  function processFile(selected) {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      return;
    }
    setFile(selected);
  }

// Handles changes in the file input element
  function handleFileChange(e) {
    processFile(e.target.files?.[0]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

// Clears the selected PDF file
  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const startRecording = () => {
    try {
      if (isRecording || recognition) return;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Live voice transcription is not supported in this browser. Please type your query.");
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;

      // Language mapping for live typing
      const langMap = {
        "English": "en-US", "Hindi": "hi-IN", "Marathi": "mr-IN",
        "Bengali": "bn-IN", "Tamil": "ta-IN", "Telugu": "te-IN",
        "Gujarati": "gu-IN", "Kannada": "kn-IN", "Malayalam": "ml-IN",
        "Odia": "or-IN", "Punjabi": "pa-IN", "Assamese": "as-IN", "Urdu": "ur-PK"
      };
      rec.lang = langMap[selectedLanguage] || "en-US";

      const existingText = text.trim();
      const transcriptPrefix = existingText ? `${existingText} ` : "";
      let localFinalTranscript = "";

      rec.onstart = () => {
        setIsRecording(true);
        setVoiceStatusMessage("Listening... Tap mic again to stop.");
      };

      rec.onerror = (event) => {
        console.error("Live typing error:", event.error);
        setIsRecording(false);
        setVoiceStatusMessage("Voice input had an issue. You can edit the text and continue.");
      };

      let sessionFinalText = "";

      rec.onresult = (event) => {
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Add a space if needed to prevent merging like "मेरापति"
            const needsSpace = sessionFinalText.length > 0 && 
                               !sessionFinalText.endsWith(" ") && 
                               !chunk.startsWith(" ");
            sessionFinalText += (needsSpace ? " " : "") + chunk;
          } else {
            interimText += chunk;
          }
        }

        const newContent = `${sessionFinalText}${interimText}`.trim();
        setText(`${transcriptPrefix}${newContent}`.trim());
      };

      rec.onend = () => {
        setIsRecording(false);
        setRecognition(null);
        setVoiceStatusMessage("Recording stopped. Review/edit the transcript, then click Analyze Situation.");
      };

      setRecognition(rec);
      rec.start();
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Could not access microphone. Please check permissions.");
      setIsRecording(false);
      setVoiceStatusMessage("");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

// Submits the case text or file for legal analysis
  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();

    if (!file && !trimmed) {
      return;
    }

    const categoryToSend =
      selectedCategory && selectedCategory !== "Not Sure" ? selectedCategory : undefined;

    if (file) {
      await onAnalyze({ file, category: categoryToSend, language: selectedLanguage });
      return;
    }

    const payloadText = categoryToSend
      ? `[Category: ${categoryToSend}]\n${trimmed}`
      : trimmed;

    await onAnalyze({ text: payloadText, category: categoryToSend, language: selectedLanguage });
  }

  const MIN_CHARS = 50;
  const charCount = text.trim().length;
  const meetsMinimum = charCount >= MIN_CHARS;
  const canSubmit = !loading && (Boolean(file) || meetsMinimum);
  const suggestedCategories = !file ? getSuggestedCategories(text) : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="app-card ui-border-highlight animate-popIn p-6 sm:p-7 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="ui-icon-enhance w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="font-headline text-2xl font-semibold text-text-primary">Start your consultation</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="w-full sm:w-1/3">
          <label className="block text-xs font-label font-bold text-text-secondary uppercase tracking-wider mb-2">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={loading}
            className="w-full app-input ui-border-highlight px-4 py-2 text-sm text-text-primary bg-surface/80 shadow-sm appearance-none outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
            <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="Assamese">Assamese (অসমীয়া)</option>
            <option value="Urdu">Urdu (اردو)</option>
          </select>
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading || Boolean(file) || isRecording}
          placeholder={isRecording 
              ? "Listening to your voice... Speak clearly." 
              : selectedLanguage === "English" 
                  ? "Explain your situation here. Use your own words..."
                  : `Explain your situation here. You may write in ${selectedLanguage.split(" ")[0]}...`}
          className={`w-full h-40 app-input ui-border-highlight px-4 py-3 text-base leading-relaxed transition-all duration-200 ${!file && charCount > 0 && !meetsMinimum ? 'border-amber-400/60 focus:border-amber-400' : ''} ${isRecording ? 'ring-2 ring-red-500/50 border-red-500/50' : ''}`}
        />
        
        {/* Voice Input Button */}
        {!file && !loading && (
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isRecording 
                ? "bg-red-500 text-white animate-pulse scale-110" 
                : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
            }`}
            title={isRecording ? "Stop Recording" : "Start Voice Input"}
          >
            {isRecording ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Character counter -- only shown when typing text (not uploading PDF) */}
      {!file && (
        <div className="mt-2 px-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`font-label text-xs font-medium transition-colors duration-200 ${
              charCount === 0
                ? 'text-text-secondary'
                : meetsMinimum
                ? 'text-green-500'
                : 'text-amber-400'
            }`}>
              {charCount === 0
                ? `Minimum ${MIN_CHARS} characters required`
                : meetsMinimum
                ? `${charCount} chars — ✓ Ready to analyze`
                : `${charCount} / ${MIN_CHARS} — ${MIN_CHARS - charCount} more needed`}
            </span>
            <span className="font-label text-xs text-text-secondary">{charCount} chars</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1 rounded-full bg-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                meetsMinimum ? 'bg-green-500' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (charCount / MIN_CHARS) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {!file && voiceStatusMessage && (
        <p className={`mt-2 px-1 font-label text-xs ${isRecording ? "text-red-500" : "text-text-secondary"}`}>
          {voiceStatusMessage}
        </p>
      )}

      {/* Keyboard Toggle */}
      {selectedLanguage !== "English" && !file && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors px-3 py-1.5 rounded-full ui-border-highlight ${
              showKeyboard 
                ? "bg-primary/20 text-primary border-primary/50" 
                : "bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {showKeyboard ? "Hide Keyboard" : `⌨️ Show ${selectedLanguage} Keyboard`}
          </button>
        </div>
      )}

      {/* Virtual Keyboard */}
      {showKeyboard && selectedLanguage !== "English" && !file && (
        <div className={`mt-2 p-1.5 bg-surface/90 rounded-xl ui-border-highlight shadow-lg animate-popIn ${isRecording ? 'opacity-40 pointer-events-none' : ''}`}>
          <style>{`
            .my-custom-theme.hg-theme-default {
              background-color: transparent;
              padding: 5px;
            }
            .my-custom-theme .hg-button {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              color: var(--color-text-primary, #ffffff);
              box-shadow: 0 2px 0 rgba(0,0,0,0.2);
            }
            .my-custom-theme .hg-button:active {
              background: rgba(255, 255, 255, 0.1);
            }
          `}</style>
          <VirtualKeyboard
            keyboardRef={(r) => (keyboardRef.current = r)}
            layoutName={layoutName}
            layout={getKeyboardLayout(selectedLanguage) || { default: ["{bksp}"] }}
            onChange={(input) => !isRecording && setText(input)}
            onKeyPress={onKeyPress}
            theme="hg-theme-default hg-layout-default my-custom-theme"
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((option) => {
          const active = selectedCategory === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedCategory(option)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition ${
                active
                  ? "bg-primary/15 text-primary border border-primary/40"
                  : "bg-surface text-text-primary border border-border hover:text-primary ui-border-highlight"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className="mt-2 px-1 text-xs text-text-secondary">
        Not sure? We&apos;ll analyze it for you.
      </p>

      {!file && suggestedCategories.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-secondary">Suggested categories:</span>
          {suggestedCategories.map((suggested) => (
            <button
              key={`suggested-${suggested}`}
              type="button"
              onClick={() => setSelectedCategory(suggested)}
              className="px-3 py-1 rounded-full text-xs font-medium border border-primary/30 text-primary bg-primary/10 hover:bg-primary/15 transition"
            >
              {suggested}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors ui-border-highlight ui-button-enhance"
          disabled={loading}
        >
          <svg className="ui-icon-enhance w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Attach PDF (optional)
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />

        {file && (
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs text-primary">
            <span className="max-w-45 truncate">{file.name}</span>
            <button
              type="button"
              onClick={removeFile}
              className="ui-icon-enhance text-primary hover:opacity-80"
              aria-label="Remove attached PDF"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 w-full app-button-primary ui-button-soft ui-button-shine font-label font-semibold text-base py-4 disabled:opacity-55 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing Situation..." : "Analyze Situation"}
      </button>
    </form>
  );
}


