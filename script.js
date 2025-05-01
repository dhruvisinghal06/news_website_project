const API_KEY = "1ba114e1700746d681de6d690deedf42";
const BASE_URL = "https://newsapi.org/v2/everything?q=";

const cardsContainer = document.getElementById("cards-container");
const templateCard = document.getElementById("template-news-card");

const searchBtn = document.querySelector(".search-button");
const searchInput = document.querySelector(".news-input");
const navItems = document.querySelectorAll(".nav-item");

window.addEventListener("load", () => fetchNews("latest"));

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchNews(query);
    }
});

navItems.forEach(item => {
    item.addEventListener("click", () => {
        fetchNews(item.textContent.trim());
    });
});

async function fetchNews(query) {
    const url = `${BASE_URL}${encodeURIComponent(query)}&apiKey=${API_KEY}&pageSize=8`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "ok") {
            bindData(data.articles);
        } else {
            console.error("Error fetching news:", data.message);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function bindData(articles) {
    // Clear the existing content in the container before adding new data
    cardsContainer.innerHTML = "";

    // Loop through each article and create the necessary DOM elements
    articles.forEach((article) => {
        // Skip articles that do not have required fields (image, title, description, url)
        if (!article.urlToImage || !article.title || !article.description || !article.url) return;

        // Clone the template for each article
        const clone = templateCard.content.cloneNode(true);

        // Get the elements inside the cloned template
        const img = clone.getElementById("news-img");
        const title = clone.getElementById("news-title");
        const desc = clone.getElementById("news-desc");
        const source = clone.getElementById("news-source");

        // Set the values for each article's fields
        img.src = article.urlToImage;
        title.textContent = article.title;
        desc.textContent = article.description;

        // Format the date to a human-readable format (India time zone)
        const date = new Date(article.publishedAt).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
        });
        source.textContent = `${article.source.name} • ${date}`;

        // Add click event to the card to open the article in a new tab
        clone.querySelector(".card").addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        // Add the cloned card to the single container
        cardsContainer.appendChild(clone);
    });
}




const darkModeToggle = document.querySelector(".dark-mode-toggle");
const body = document.body;
const nav = document.querySelector("nav");
const cards = document.querySelectorAll(".card");
const newsDesc = document.querySelectorAll(".news-desc");
const newsTitle = document.querySelectorAll(".news-title");
const newsSource = document.querySelectorAll(".news-source");

// Check if dark mode is already enabled in localStorage
if (localStorage.getItem("dark-mode") === "enabled") {
    enableDarkMode();
}

// Toggle dark mode when button is clicked
darkModeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Enable Dark Mode
function enableDarkMode() {
    body.classList.add("dark-mode");
    nav.classList.add("dark-mode");
    cards.forEach(card => card.classList.add("dark-mode"));
    newsDesc.forEach(desc => desc.classList.add("dark-mode"));
    newsTitle.forEach(title => title.classList.add("dark-mode"));
    newsSource.forEach(source => source.classList.add("dark-mode"));
    localStorage.setItem("dark-mode", "enabled");
}

// Disable Dark Mode
function disableDarkMode() {
    body.classList.remove("dark-mode");
    nav.classList.remove("dark-mode");
    cards.forEach(card => card.classList.remove("dark-mode"));
    newsDesc.forEach(desc => desc.classList.remove("dark-mode"));
    newsTitle.forEach(title => title.classList.remove("dark-mode"));
    newsSource.forEach(source => source.classList.remove("dark-mode"));
    localStorage.setItem("dark-mode", "disabled");
}
