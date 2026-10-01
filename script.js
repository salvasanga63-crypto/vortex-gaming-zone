const RAWG_API_KEY = "YOUR_RAWG_API_KEY";
const BASE_URL = "https://api.rawg.io/api/games";

const fallbackGames = [
  {
    id: 1,
    name: "Cyberpunk Nexus",
    released: "2025-04-18",
    metacritic: 94,
    background_image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    genres: [{ name: "Action" }, { name: "RPG" }],
    website: "https://store.steampowered.com",
    platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 5" } }],
  },
  {
    id: 2,
    name: "Nebula Drift",
    released: "2024-11-08",
    metacritic: 91,
    background_image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
    genres: [{ name: "Adventure" }, { name: "Sci-Fi" }],
    website: "https://store.epicgames.com",
    platforms: [{ platform: { name: "PC" } }, { platform: { name: "Xbox Series X|S" } }],
  },
  {
    id: 3,
    name: "Shadow Protocol",
    released: "2024-09-25",
    metacritic: 88,
    background_image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=80",
    genres: [{ name: "Strategy" }, { name: "FPS" }],
    website: "https://www.gog.com",
    platforms: [{ platform: { name: "PC" } }],
  },
  {
    id: 4,
    name: "Iron Horizon",
    released: "2025-01-12",
    metacritic: 90,
    background_image:
      "https://images.unsplash.com/photo-1528819622761-eab8d7c2bfd5?auto=format&fit=crop&w=900&q=80",
    genres: [{ name: "Shooter" }, { name: "Multiplayer" }],
    website: "https://www.xbox.com",
    platforms: [{ platform: { name: "PC" } }, { platform: { name: "Xbox One" } }],
  },
  {
    id: 5,
    name: "Arcane Echoes",
    released: "2023-12-02",
    metacritic: 87,
    background_image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    genres: [{ name: "RPG" }, { name: "Fantasy" }],
    website: "https://store.playstation.com",
    platforms: [{ platform: { name: "PlayStation 5" } }, { platform: { name: "PC" } }],
  },
  {
    id: 6,
    name: "Crimson Orbit",
    released: "2024-06-30",
    metacritic: 92,
    background_image:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80",
    genres: [{ name: "Space" }, { name: "Adventure" }],
    website: "https://www.origin.com",
    platforms: [{ platform: { name: "PC" } }, { platform: { name: "Nintendo Switch" } }],
  },
  {
    id: 7,
    name: "Zero Gravity",
    released: "2025-02-14",
    metacritic: 89,
    background_image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
    genres: [{ name: "Simulation" }, { name: "Racing" }],
    website: "https://www.gog.com",
    platforms: [{ platform: { name: "PC" } }],
  },
  {
    id: 8,
    name: "Volt Run",
    released: "2024-08-10",
    metacritic: 85,
    background_image:
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=900&q=80",
    genres: [{ name: "Arcade" }, { name: "Racing" }],
    website: "https://store.steampowered.com",
    platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 5" } }],
  },
];

const state = {
  games: [],
  filteredGames: [],
  selectedGenre: "All",
  featuredGame: null,
  featuredIndex: 0,
};

let heroAutoPlayTimer = null;
const HERO_AUTO_PLAY_DELAY = 5000;

const gamesContainer = document.querySelector("#games-container");
const genreFilters = document.querySelector("#genre-filters");
const searchInput = document.querySelector("#search-input");
const themeToggle = document.querySelector("#theme-toggle");
const heroTitle = document.querySelector("#hero-title");
const heroScore = document.querySelector("#hero-score");
const heroPlatforms = document.querySelector("#hero-platforms");
const heroYear = document.querySelector("#hero-year");
const heroDescription = document.querySelector("#hero-description");
const heroDownloadButton = document.querySelector("#hero-download-btn");
const heroDetailsButton = document.querySelector("#hero-details-btn");
const heroPrevButton = document.querySelector("#hero-prev");
const heroNextButton = document.querySelector("#hero-next");
const heroDots = document.querySelector("#hero-dots");
const modal = document.querySelector("#game-modal");
const modalTitle = document.querySelector("#modal-title");
const modalMeta = document.querySelector("#modal-meta");
const modalDescription = document.querySelector("#modal-description");
const modalTags = document.querySelector("#modal-tags");
const modalImage = document.querySelector("#modal-image");
const modalStoreButton = document.querySelector(".modal-store-btn");
const modalCloseButton = document.querySelector(".modal-close-btn");
const modalCloseX = document.querySelector(".modal-close");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mainNav = document.querySelector(".main-nav");

const defaultTheme = localStorage.getItem("vortex-theme") || "dark";
document.documentElement.setAttribute("data-theme", defaultTheme);
themeToggle.setAttribute("aria-pressed", String(defaultTheme === "light"));

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("vortex-theme", nextTheme);
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "light"));
});

mobileMenuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
  });
});

function createSkeletonGrid() {
  gamesContainer.innerHTML = "";
  const skeletonGrid = document.createElement("div");
  skeletonGrid.className = "loading-grid";

  Array.from({ length: 8 }).forEach(() => {
    const card = document.createElement("div");
    card.className = "skeleton-card";
    card.innerHTML = `
      <div class="skeleton-media"></div>
      <div class="skeleton-body">
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
        <div style="display:flex; margin-top:14px;">
          <span class="skeleton-pill"></span>
          <span class="skeleton-pill"></span>
        </div>
      </div>
    `;
    skeletonGrid.appendChild(card);
  });

  gamesContainer.appendChild(skeletonGrid);
}

function getGameUrl(game) {
  if (game?.website) return game.website;
  if (game?.store?.url) return game.store.url;
  if (game?.stores?.[0]?.store?.domain) return `https://${game.stores[0].store.domain}`;
  return "https://store.steampowered.com";
}

function normalizeGame(game) {
  const rawPlatforms = game.platforms || [];
  const platformNames = rawPlatforms
    .map((entry) => entry?.platform?.name)
    .filter(Boolean)
    .slice(0, 2);

  const genres = (game.genres || []).map((genre) => genre.name).slice(0, 3);

  return {
    ...game,
    id: game.id,
    name: game.name || "Untitled Game",
    releaseYear: game.released ? new Date(game.released).getFullYear() : "N/A",
    metacritic: game.metacritic ?? 0,
    image: game.background_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    genres,
    website: getGameUrl(game),
    platforms: platformNames.length ? platformNames : ["PC"],
  };
}

function renderHero(game) {
  if (!game) return;

  state.featuredGame = game;
  heroTitle.innerHTML = game.name.replace(/\s+/g, " ").trim();
  heroScore.textContent = `${game.metacritic || "N/A"}`;
  heroPlatforms.textContent = game.platforms.join(" / ");
  heroYear.textContent = String(game.releaseYear);
  heroDescription.textContent = game.description_raw
    ? game.description_raw.slice(0, 165) + (game.description_raw.length > 165 ? "..." : "")
    : "Explore a cinematic, high-octane world packed with action, strategy, and unforgettable adventures.";

  const heroBackground = game.image;
  const heroElement = document.querySelector(".hero");
  heroElement.style.background = `
    linear-gradient(90deg, rgba(7, 9, 17, 0.94) 0%, rgba(7, 9, 17, 0.73) 38%, rgba(7, 9, 17, 0.25) 100%),
    linear-gradient(180deg, rgba(7, 9, 17, 0) 0%, rgba(7, 9, 17, 0.85) 100%),
    url('${heroBackground}') center/cover no-repeat`;

  heroDownloadButton.onclick = () => openExternalLink(game.website);
  heroDetailsButton.onclick = () => openModal(game);
}

function renderHeroDots() {
  if (!heroDots) return;

  heroDots.innerHTML = "";
  const slides = state.games.slice(0, 4);

  slides.forEach((game, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `slider-dot ${state.featuredIndex === index ? "active" : ""}`;
    dot.setAttribute("aria-label", `Show featured game ${index + 1}: ${game.name}`);
    dot.addEventListener("click", () => {
      state.featuredIndex = index;
      renderHero(slides[index]);
      renderHeroDots();
    });
    heroDots.appendChild(dot);
  });
}

function resetHeroAutoPlay() {
  if (heroAutoPlayTimer) {
    clearInterval(heroAutoPlayTimer);
  }

  heroAutoPlayTimer = setInterval(() => {
    changeFeaturedSlide(1);
  }, HERO_AUTO_PLAY_DELAY);
}

function changeFeaturedSlide(direction) {
  const slides = state.games.slice(0, 4);
  if (!slides.length) return;

  state.featuredIndex = (state.featuredIndex + direction + slides.length) % slides.length;
  renderHero(slides[state.featuredIndex]);
  renderHeroDots();
}

function renderGenreFilters() {
  const allGenres = ["All", ...new Set(state.games.flatMap((game) => game.genres))];

  genreFilters.innerHTML = "";
  allGenres.forEach((genre) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-badge ${state.selectedGenre === genre ? "active" : ""}`;
    button.textContent = genre;
    button.setAttribute("aria-label", `Filter by ${genre}`);
    button.addEventListener("click", () => {
      state.selectedGenre = genre;
      renderGenreFilters();
      applyFilters();
    });
    genreFilters.appendChild(button);
  });
}

function renderCards(games) {
  gamesContainer.innerHTML = "";

  if (!games.length) {
    gamesContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 28px; border:1px solid var(--line); border-radius:18px; background: rgba(255,255,255,0.02); color: var(--muted); text-align:center;">
        No games matched your search.
      </div>
    `;
    return;
  }

  games.forEach((game) => {
    const card = document.createElement("article");
    card.className = "game-card";

    const cardLink = game.website || "https://store.steampowered.com";

    card.innerHTML = `
      <img class="game-image" src="${game.image}" alt="${game.name}" loading="lazy" />
      <div class="game-body">
        <div class="game-header">
          <h3 class="game-title">${game.name}</h3>
          <span class="rating-pill">${game.metacritic || "N/A"}</span>
        </div>

        <div class="game-meta">
          <span>${game.releaseYear}</span>
          <span>•</span>
          <span>${game.platforms[0]}</span>
        </div>

        <div class="game-genres">
          ${(game.genres || []).slice(0, 3).map((genre) => `<span class="genre-tag">${genre}</span>`).join("")}
        </div>

        <div class="card-actions">
          <button class="card-action" type="button" data-action="download" data-link="${cardLink}">Download</button>
          <button class="card-link" type="button" data-action="details" data-name="${game.name}">Details</button>
        </div>
      </div>
    `;

    const buttons = card.querySelectorAll("[data-action]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        if (action === "download") {
          openExternalLink(button.dataset.link);
        } else {
          openModal(game);
        }
      });
    });

    gamesContainer.appendChild(card);
  });
}

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filtered = state.games.filter((game) => {
    const matchesGenre = state.selectedGenre === "All" || game.genres.includes(state.selectedGenre);
    const matchesSearch =
      !searchTerm ||
      game.name.toLowerCase().includes(searchTerm) ||
      game.genres.some((genre) => genre.toLowerCase().includes(searchTerm));

    return matchesGenre && matchesSearch;
  });

  state.filteredGames = filtered;
  renderCards(filtered);
}

function openExternalLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function openModal(game) {
  if (!game || !modal) return;

  modalTitle.textContent = game.name;
  modalMeta.innerHTML = `
    <span>${game.releaseYear}</span>
    <span>•</span>
    <span>${game.platforms.join(" / ")}</span>
    <span>•</span>
    <span>Metacritic ${game.metacritic || "N/A"}</span>
  `;
  modalDescription.textContent = game.description_raw || "An action-packed experience designed for players who love big worlds, big stakes, and big wins.";
  modalTags.innerHTML = (game.genres || []).map((genre) => `<span class="genre-tag">${genre}</span>`).join("");
  modalImage.style.backgroundImage = `url('${game.image}')`;
  modalStoreButton.onclick = () => openExternalLink(game.website || "https://store.steampowered.com");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

async function fetchGames() {
  createSkeletonGrid();

  const requestUrl = `${BASE_URL}?key=${RAWG_API_KEY}&page_size=12&ordering=-metacritic`;

  try {
    if (RAWG_API_KEY === "YOUR_RAWG_API_KEY") {
      throw new Error("Using fallback dataset");
    }

    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(`RAWG request failed with status ${response.status}`);
    }

    const data = await response.json();
    state.games = (data.results || []).slice(0, 8).map(normalizeGame);
  } catch (error) {
    console.warn("RAWG fetch failed, using fallback games:", error);
    state.games = fallbackGames.map((game) => ({
      ...game,
      genres: game.genres.map((genre) => genre.name),
      releaseYear: new Date(game.released).getFullYear(),
      metacritic: game.metacritic,
      image: game.background_image,
      platforms: game.platforms.map((entry) => entry.platform.name),
      website: game.website,
      description_raw: "A stylish, high-stakes adventure with intense action and immersive world-building.",
    }));
  }

  if (!state.games.length) {
    state.games = fallbackGames.map((game) => ({
      ...game,
      genres: game.genres.map((genre) => genre.name),
      releaseYear: new Date(game.released).getFullYear(),
      metacritic: game.metacritic,
      image: game.background_image,
      platforms: game.platforms.map((entry) => entry.platform.name),
      website: game.website,
      description_raw: "A stylish, high-stakes adventure with intense action and immersive world-building.",
    }));
  }

  state.filteredGames = [...state.games];
  state.featuredIndex = 0;
  renderGenreFilters();
  renderHero(state.games[0]);
  renderHeroDots();
  renderCards(state.filteredGames);
  resetHeroAutoPlay();
}

searchInput.addEventListener("input", applyFilters);
heroPrevButton.addEventListener("click", () => {
  changeFeaturedSlide(-1);
  resetHeroAutoPlay();
});
heroNextButton.addEventListener("click", () => {
  changeFeaturedSlide(1);
  resetHeroAutoPlay();
});
heroDots.addEventListener("click", (event) => {
  const dot = event.target.closest(".slider-dot");
  if (!dot) return;

  const index = Array.from(heroDots.children).indexOf(dot);
  if (index >= 0) {
    state.featuredIndex = index;
    renderHero(state.games.slice(0, 4)[index]);
    renderHeroDots();
    resetHeroAutoPlay();
  }
});
modalCloseButton.addEventListener("click", closeModal);
modalCloseX.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal='true']")) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

fetchGames();
