import React, { useState } from "react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import toast from "react-hot-toast";
import { Copy, Check } from "lucide-react";
import "./UrlForm.css";

const generateShortCode = (length: number = 6) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const isValidHttpUrl = (value: string): string | null => {
  try {
    const url = value.startsWith("http")
      ? new URL(value)
      : new URL(`https://${value}`);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    const hostname = url.hostname;

    // Reject single-word hostnames like "abc"
    if (!hostname.includes(".") && hostname !== "localhost") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
};

const UrlForm: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validatedUrl = isValidHttpUrl(originalUrl.trim());

    if (!validatedUrl) {
      setError(
        "Please enter a valid URL (e.g. google.com or https://example.com)",
      );
      toast.error("Invalid URL");
      return;
    }

    setLoading(true);

    try {
      const shortCode = generateShortCode();

      await setDoc(doc(db, "shortUrls", shortCode), {
        clicks: 0,
        createdAt: Timestamp.now(),
        originalUrl: validatedUrl,
        createdUrl: `${window.location.origin}/url-shortener/${shortCode}`,
      });

      setShortUrl(`${window.location.origin}/url-shortener/${shortCode}`);
     
      setOriginalUrl("");
      toast.success("Short URL created!");
    } catch {
      toast.error("Failed to save URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="url-form">
      <form onSubmit={handleSubmit}>
        <input
          className="url-input"
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="Enter URL here"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />
        {error && <div className="error-text">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className={`submit-btn ${loading ? "loading" : ""}`}
        >
          {loading ? "Saving..." : "Shorten"}
        </button>
      </form>

      {shortUrl && (
        <div className="short-url">
          <div>
            Short URL:{" "}
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </div>

          <button
            className="copy-btn"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? <Check size={20} color="green" /> : <Copy size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
