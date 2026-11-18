let currentAudio = null;

function playAudio(file, onEnded = null) {
    stopAudio();

    const url = URL.createObjectURL(file);

    currentAudio = new Audio(url);

    currentAudio.onended = () => {
        URL.revokeObjectURL(url);

        if (onEnded) onEnded();
    };

    currentAudio.onerror = () => {
        URL.revokeObjectURL(url);
        console.error("Audio playback error");
    };

    currentAudio.play().catch(error => {
        console.error("Unable to play audio:", error);
    });

    return currentAudio;
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;

        if (currentAudio.src.startsWith("blob:")) {
            URL.revokeObjectURL(currentAudio.src);
        }

        currentAudio = null;
    }
}

// Preview lagu dari Finder
function previewSong(id) {
    const song = songs.find(item => item.id === id);

    if (!song) return;

    playAudio(song.audio);
}
