/**
 * Random Aya Generator
 * Fetches random Quran verses from the Al-Quran Cloud API
 */

// Constants
const API_BASE_URL = "https://api.alquran.cloud/v1/ayah";
const TOTAL_AYAT = 6348;
const LOADING_TEXT = "جار التحميل...";
const BUTTON_TEXT = "آيَاتِ";

// DOM Elements
const quoteText = document.querySelector(".quote");
const quoteBtn = document.querySelector("button[type='button']");
const authorName = document.querySelector(".name");
const copyBtn = document.querySelector(".copy");
const twitterBtn = document.querySelector(".twitter");
const facebookBtn = document.querySelector(".facebook");

/**
 * Generates a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sets the loading state of the button
 * @param {boolean} isLoading - Whether the button should be in loading state
 */
function setLoadingState(isLoading) {
  if (isLoading) {
    quoteBtn.classList.add("loading");
    quoteBtn.textContent = LOADING_TEXT;
    quoteBtn.disabled = true;
  } else {
    quoteBtn.classList.remove("loading");
    quoteBtn.textContent = BUTTON_TEXT;
    quoteBtn.disabled = false;
  }
}

/**
 * Fetches and displays a random Quran verse
 */
async function fetchRandomAya() {
  try {
    setLoadingState(true);

    const randomAyaNumber = getRandomNumber(1, TOTAL_AYAT);
    const response = await fetch(`${API_BASE_URL}/${randomAyaNumber}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !data.data.text) {
      throw new Error("Invalid API response: missing verse data");
    }

    quoteText.textContent = data.data.text;
    authorName.textContent = data.data.surah?.name || "";

  } catch (error) {
    console.error("Error fetching verse:", error);
    quoteText.textContent = "حدث خطأ أثناء جلب الآية. يرجى المحاولة مرة أخرى.";
    authorName.textContent = "";
  } finally {
    setLoadingState(false);
  }
}

/**
 * Copies the current verse to clipboard
 */
async function copyToClipboard() {
  try {
    const textToCopy = quoteText.textContent || "";
    await navigator.clipboard.writeText(textToCopy);
    
    // Visual feedback
    copyBtn.classList.add("active");
    setTimeout(() => {
      copyBtn.classList.remove("active");
    }, 500);
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = quoteText.textContent || "";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
}

/**
 * Shares the current verse on Twitter
 */
function shareOnTwitter() {
  const verseText = encodeURIComponent(quoteText.textContent || "");
  const twitterUrl = `https://twitter.com/intent/tweet?text=${verseText}`;
  window.open(twitterUrl, "_blank");
}

/**
 * Shares the current verse on Facebook
 */
function shareOnFacebook() {
  const verseText = encodeURIComponent(quoteText.textContent || "");
  const currentUrl = encodeURIComponent(window.location.href);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${verseText}`;
  window.open(facebookUrl, "_blank");
}

// Event Listeners
copyBtn.addEventListener("click", copyToClipboard);
copyBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    copyToClipboard();
  }
});

twitterBtn.addEventListener("click", shareOnTwitter);
twitterBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    shareOnTwitter();
  }
});

facebookBtn.addEventListener("click", shareOnFacebook);
facebookBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    shareOnFacebook();
  }
});

quoteBtn.addEventListener("click", fetchRandomAya);

// Initialize: Load a random verse on page load
window.addEventListener("DOMContentLoaded", () => {
  fetchRandomAya();
});
