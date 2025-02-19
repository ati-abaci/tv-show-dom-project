async function fetchShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const shows = await response.json();

    const limitedShows = shows.slice(0, 100);
    displayShows(limitedShows);
    setupSearch(limitedShows);
  } catch (error) {
    console.error("Error fetching shows:", error.message);
    alert("Failed to fetch shows.");
  }
}

function displayShows(shows) {
  const container = document.getElementById("shows-container");
  container.innerHTML = "";

  shows.forEach((show) => {
    const showLink = document.createElement("a");
    showLink.href = `assets/pages/episodePage.html?showId=${
      show.id
    }&showName=${encodeURIComponent(show.name)}`;
    showLink.classList.add("show-card");
    const imageUrl =
      show.image?.medium || "https://via.placeholder.com/210x295?text=No+Image";
    const genres = show.genres.join(", ") || "No Genre";
    const score = show.rating?.average || "N/A";

    showLink.innerHTML = `
        <div class="image-container">
          <img src="${imageUrl}" alt="${show.name}">
          <div class="overlay">
            <p><strong>Name:</strong> ${show.name}</p>
            <p><strong>Genre:</strong> ${genres}</p>
            <p><strong>Score:</strong> ${score}</p>
          </div>
        </div>
      `;

    container.appendChild(showLink);
  });
}
function setupSearch(shows) {
  const searchInput = document.querySelector(".search-input");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredShows = shows.filter((show) =>
      show.name.toLowerCase().includes(query)
    );
    displayShows(filteredShows);
  });
}

document.addEventListener("DOMContentLoaded", fetchShows);
