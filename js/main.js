//Select DOM
const quoteText = document.querySelector(".quote"),
  quoteBtn = document.querySelector("button"),
  authorName = document.querySelector(".name"),
  copyBtn = document.querySelector(".copy"),
  twitterBtn = document.querySelector(".twitter"),
  synth = speechSynthesis;

//Functions

async function randomQuote() {
  quoteBtn.classList.add("loading");
  quoteBtn.innerText = "جار التحميل...";

  let numberinsurah = Math.floor(Math.random() * (6348 - 1 + 1)) + 1;

  const api = "https://api.alquran.cloud/v1/ayah";
  const response = await fetch(`${api}/${numberinsurah}`);
  const data = await response.json();

  quoteText.innerText = data.data.text;
  authorName.innerText = data.data.surah.name || "";

  quoteBtn.classList.remove("loading");
  quoteBtn.innerText = "آيَاتِ";
}

//Event Listeners

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(quoteText.innerText);
});

twitterBtn.addEventListener("click", () => {
  let twitterUrl = `https://twitter.com/intent/tweet?url=${quoteText.innerText}`;
  window.open(twitterUrl, "_blank");
});

quoteBtn.addEventListener("click", randomQuote);

window.onload = function () {
  quoteBtn.click();
};
