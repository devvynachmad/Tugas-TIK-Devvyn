const DB_NAME = "SONIQ_DATABASE";
const STORE_NAME = "songs";
let songs = [];

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = event => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id"
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getSongs() {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function saveSong(song) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");

        tx.objectStore(STORE_NAME).put(song);

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

async function deleteSong(id) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");

        tx.objectStore(STORE_NAME).delete(id);

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

// Memuat ulang database ke variabel songs
async function refreshSongs() {
    songs = await getSongs();

    renderLibrary();

    const countElement = document.getElementById("songCount");

    if (countElement) {
        countElement.textContent = songs.length;
    }
}

// Menambahkan lagu baru
async function addSong() {
    const title = document.getElementById("songTitle").value.trim();
    const artist = document.getElementById("songArtist").value.trim();
    const genre = document.getElementById("songGenre").value.trim();
    const file = document.getElementById("songFile").files[0];

    if (!title || !artist || !file) {
        alert("Isi judul, artist, dan pilih file audio!");
        return;
    }

    const song = {
        id: crypto.randomUUID(),
        title,
        artist,
        genre: genre || "Unknown",
        audio: file
    };

    try {
        await saveSong(song);
        await refreshSongs();

        document.getElementById("songTitle").value = "";
        document.getElementById("songArtist").value = "";
        document.getElementById("songGenre").value = "";
        document.getElementById("songFile").value = "";

        alert("Track successfully added!");
    } catch (error) {
        console.error(error);
        alert("Failed to save track.");
    }
}

// Menampilkan library
function renderLibrary() {
    const container = document.getElementById("libraryList");

    if (!container) return;

    if (songs.length === 0) {
        container.innerHTML = "<p>Library masih kosong.</p>";
        return;
    }

    container.innerHTML = songs.map(song => `
        <div class="song-item">
            <div>
                <strong>${escapeHTML(song.title)}</strong>
                <p>${escapeHTML(song.artist)} · ${escapeHTML(song.genre)}</p>
            </div>

            <button onclick="removeSong('${song.id}')">
                DELETE
            </button>
        </div>
    `).join("");
}

async function removeSong(id) {
    if (!confirm("Hapus lagu ini dari library?")) return;

    await deleteSong(id);
    await refreshSongs();
}
