const urlParams = new URLSearchParams(window.location.search);
const showId = urlParams.get("showId");
const showName = decodeURIComponent(urlParams.get("showName"));

document.getElementById("show-title").textContent = `Episodes of ${showName}`;

async function fetchEpisodes() {
  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const episodes = await response.json();
    displayEpisodes(episodes);
    setupEpisodeDropdown(episodes);
  } catch (error) {
    console.error("Error fetching episodes:", error.message);
    alert("Failed to fetch episodes.");
  }
}

function displayEpisodes(episodes) {
  const container = document.querySelector(".episodes-container");
  container.innerHTML = "";

  episodes.forEach((episode) => {
    // Create the episode card
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");

    const imageUrl =
      episode.image?.medium ||
      "https://via.placeholder.com/210x295?text=No+Image";

    episodeCard.innerHTML = `
      <img src="${imageUrl}" alt="${episode.name}">
      <div class="card-info">
        <h4>${episode.name}</h4>
        <p><strong>Season:</strong> ${episode.season}, <strong>Episode:</strong> ${episode.number}</p>
      </div>
      <button class="play-button" data-episode-url="${episode.url}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </button>
    `;
    const playButton = episodeCard.querySelector(".play-button");
    playButton.addEventListener("click", () => {
      const episodeUrl = playButton.getAttribute("data-episode-url");
      if (episodeUrl) {
        window.open(episodeUrl, "_blank");
      }
    });

    container.appendChild(episodeCard);
  });
}
function setupEpisodeDropdown(episodes) {
  const dropdown = document.getElementById("episode-dropdown");

  dropdown.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode";
  dropdown.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${
      episode.name
    }`;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", (event) => {
    const selectedId = event.target.value;
    if (selectedId) {
      const selectedEpisode = episodes.find((e) => e.id == selectedId);
      displayEpisodes([selectedEpisode]);
    } else {
      displayEpisodes(episodes);
    }
  });
}

document.addEventListener("DOMContentLoaded", fetchEpisodes);
