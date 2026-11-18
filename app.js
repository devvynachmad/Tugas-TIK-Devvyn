document.addEventListener("DOMContentLoaded", () => {
    console.log("SONIQ SYSTEM ONLINE");

    refreshSongs();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", searchSongs);
    }

    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", () => {
            document.querySelectorAll("nav a")
                .forEach(a => a.classList.remove("active"));

            link.classList.add("active");
        });
    });
});

// Pencarian lagu
function searchSongs() {
    const keyword = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const results = songs.filter(song =>
        song.title.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword) ||
        song.genre.toLowerCase().includes(keyword)
    );

    const container = document.getElementById("searchResults");

    if (results.length === 0) {
        container.innerHTML = "<p>No tracks found.</p>";
        return;
    }

    container.innerHTML = results.map(song => `
        <div class="song-item">
            <div>
                <strong>${escapeHTML(song.title)}</strong>
                <p>${escapeHTML(song.artist)} — ${escapeHTML(song.genre)}</p>
            </div>
            <button onclick="previewSong('${song.id}')">▶</button>
        </div>
    `).join("");
}

// Escape text supaya metadata lagu tidak dianggap HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}
