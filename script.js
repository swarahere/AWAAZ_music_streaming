
const songs = [
  {
    id: 1,
    title: "Namastute",
    artist: "Seedhe Maut",
    album: "न",
    cover: "https://picsum.photos/seed/dhh1/400",
    audio: "songs/namastute.mp3"
  },
  {
    id: 2,
    title: "No Cap",
    artist: "KR$NA",
    album: "Single",
    cover: "https://picsum.photos/seed/dhh2/400",
    audio: "songs/no-cap.mp3"
  },
  {
    id: 3,
    title: "Gumaan",
    artist: "Young Stunners",
    album: "Single",
    cover: "https://picsum.photos/seed/dhh3/400",
    audio: "songs/gumaan.mp3"
  },
  {
    id: 4,
    title: "3:59 AM",
    artist: "DIVINE",
    album: "Punya Paap",
    cover: "https://picsum.photos/seed/dhh4/400",
    audio: "songs/359am.mp3"
  },
  {
    id: 5,
    title: "Agency",
    artist: "Talha Anjum, Rap Demon",
    album: "Single",
    cover: "https://picsum.photos/seed/dhh5/400",
    audio: "songs/agency.mp3"
  },
  {
    id: 6,
    title: "Sheikh Chilli",
    artist: "Raftaar",
    album: "Single",
    cover: "https://picsum.photos/seed/dhh6/400",
    audio: "songs/sheikh-chilli.mp3"
  },
  {
    id: 7,
    title: "Nanchaku",
    artist: "Seedhe Maut, MC STAN",
    album: "न",
    cover: "https://picsum.photos/seed/dhh7/400",
    audio: "songs/nanchaku.mp3"
  },
  {
    id: 8,
    title: "Makasam",
    artist: "KR$NA",
    album: "Single",
    cover: "https://picsum.photos/seed/dhh8/400",
    audio: "songs/makasam.mp3"
  },
  {
    id: 9,
    title: "Downers At Dusk",
    artist: "Talha Anjum",
    album: "Open Letter",
    cover: "https://picsum.photos/seed/dhh9/400",
    audio: "songs/downers-at-dusk.mp3"
  },
  {
    id: 10,
    title: "Khatta Flow",
    artist: "Seedhe Maut, KR$NA",
    album: "Lunch Break",
    cover: "https://picsum.photos/seed/dhh10/400",
    audio: "songs/khatta-flow.mp3"
  },
  {
    id: 11,
    title: "100 Million",
    artist: "DIVINE, Karan Aujla",
    album: "Street Dreams",
    cover: "https://picsum.photos/seed/dhh11/400",
    audio: "songs/100-million.mp3"
  },
  {
    id: 12,
    title: "Hona Hi Tha",
    artist: "Karma",
    album: "Single",
    cover: "https://picsum.photos/seed/dhh12/400",
    audio: "songs/hona-hi-tha.mp3"
  }
];

const audio = document.getElementById("audio");
const grid = document.getElementById("songGrid");
const search = document.getElementById("search");

let currentIndex = 0;
let currentView = "home";
let selectedPlaylist = null;

let favorites = JSON.parse(localStorage.getItem("awaazFavorites") || "[]");
let playlists = JSON.parse(localStorage.getItem("awaazPlaylists") || "{}");

function saveData() {
  localStorage.setItem("awaazFavorites", JSON.stringify(favorites));
  localStorage.setItem("awaazPlaylists", JSON.stringify(playlists));
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function renderSongs() {
  const query = search.value.toLowerCase().trim();

  let visible = songs.filter(song =>
    song.title.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query) ||
    song.album.toLowerCase().includes(query)
  );

  if (currentView === "favorites") {
    visible = visible.filter(song => favorites.includes(song.id));
  }

  if (currentView === "playlists" && selectedPlaylist) {
    const ids = playlists[selectedPlaylist] || [];
    visible = visible.filter(song => ids.includes(song.id));
  }

  grid.innerHTML = "";
  document.getElementById("songCount").textContent =
    `${visible.length} TRACKS`;

  if (!visible.length) {
    grid.innerHTML = '<p class="empty">No tracks found.</p>';
    return;
  }

  visible.forEach(song => {
    const card = document.createElement("div");
    card.className = "song-card";

    const liked = favorites.includes(song.id);

    card.innerHTML = `
      <img src="${song.cover}" alt="Cover artwork">
      <h4>${song.title}</h4>
      <p>${song.artist}</p>
      <p class="album">${song.album}</p>
      <div class="card-actions">
        <button class="play-song">▶ PLAY</button>
        <button class="favorite ${liked ? "liked" : ""}">
          ${liked ? "♥" : "♡"}
        </button>
        <button class="add-playlist">＋</button>
      </div>
    `;

    card.querySelector("img").onclick = () => playSong(song.id);
    card.querySelector(".play-song").onclick = () => playSong(song.id);
    card.querySelector(".favorite").onclick = () => toggleFavorite(song.id);
    card.querySelector(".add-playlist").onclick = () => addToPlaylist(song.id);

    grid.appendChild(card);
  });
}

function playSong(id) {
  const index = songs.findIndex(song => song.id === id);
  if (index === -1) return;

  currentIndex = index;
  const song = songs[index];

  audio.src = song.audio;

  document.getElementById("playerCover").src = song.cover;
  document.getElementById("playerTitle").textContent = song.title;
  document.getElementById("playerArtist").textContent = song.artist;

  audio.play().catch(() => {
    alert(
      "Audio file unavailable.\n\n" +
      "Add an authorized MP3 file at:\n" + song.audio
    );
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  saveData();
  renderSongs();
}

function addToPlaylist(id) {
  const names = Object.keys(playlists);

  if (!names.length) {
    alert("Create a playlist first!");
    return;
  }

  const name = prompt(
    "Enter playlist name:\n" + names.join(", ")
  );

  if (name === null) return;

  if (!Object.prototype.hasOwnProperty.call(playlists, name)) {
    alert("Playlist not found.");
    return;
  }

  if (!playlists[name].includes(id)) {
    playlists[name].push(id);
    saveData();
  }

  alert("Track added to playlist!");
}

function renderPlaylists() {
  const list = document.getElementById("playlistList");
  list.innerHTML = "";

  Object.keys(playlists).forEach(name => {
    const row = document.createElement("div");
    row.className = "playlist-row";
    row.textContent = `${name} (${playlists[name].length} tracks)`;

    row.onclick = () => {
      selectedPlaylist = name;
      document.getElementById("sectionTitle").textContent = name.toUpperCase();
      renderSongs();
    };

    list.appendChild(row);
  });
}

document.getElementById("createPlaylist").onclick = () => {
  const name = prompt("Enter playlist name:");

  if (!name || !name.trim()) return;

  const cleanName = name.trim();

  if (Object.prototype.hasOwnProperty.call(playlists, cleanName)) {
    alert("Playlist already exists!");
    return;
  }

  playlists[cleanName] = [];
  saveData();
  renderPlaylists();
  alert("Playlist created!");
};

document.querySelectorAll(".nav").forEach(button => {
  button.onclick = () => {
    document.querySelectorAll(".nav").forEach(b =>
      b.classList.remove("active")
    );

    button.classList.add("active");
    currentView = button.dataset.view;
    selectedPlaylist = null;

    document.getElementById("playlistPanel").classList.toggle(
      "hidden", currentView !== "playlists"
    );

    const titles = {
      home: "APNI AWAAZ. APNE BARS.",
      favorites: "YOUR LIKED TRACKS ♥",
      playlists: "YOUR PLAYLISTS"
    };

    document.getElementById("pageTitle").textContent =
      titles[currentView];

    document.getElementById("sectionTitle").textContent =
      currentView === "favorites"
        ? "YOUR FAVORITES"
        : "THE UNDERGROUND COLLECTION";

    renderPlaylists();
    renderSongs();
  };
});

search.addEventListener("input", renderSongs);

document.getElementById("heroPlay").onclick = () => {
  document.getElementById("songGrid").scrollIntoView({
    behavior: "smooth"
  });
};

document.getElementById("playPause").onclick = () => {
  if (!audio.src) {
    playSong(songs[0].id);
  } else if (audio.paused) {
    audio.play().catch(() => alert("Unable to play this track."));
  } else {
    audio.pause();
  }
};

document.getElementById("next").onclick = () => {
  playSong(songs[(currentIndex + 1) % songs.length].id);
};

document.getElementById("previous").onclick = () => {
  playSong(songs[(currentIndex - 1 + songs.length) % songs.length].id);
};

audio.onplay = () => {
  document.getElementById("playPause").textContent = "⏸";
};

audio.onpause = () => {
  document.getElementById("playPause").textContent = "▶";
};

audio.ontimeupdate = () => {
  document.getElementById("currentTime").textContent =
    formatTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    document.getElementById("seek").value =
      (audio.currentTime / audio.duration) * 100;
  }
};

audio.onloadedmetadata = () => {
  document.getElementById("duration").textContent =
    formatTime(audio.duration);
};

document.getElementById("seek").oninput = e => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (e.target.value / 100) * audio.duration;
  }
};

document.getElementById("volume").oninput = e => {
  audio.volume = e.target.value / 100;
};

audio.volume = 0.7;

audio.onended = () => {
  playSong(songs[(currentIndex + 1) % songs.length].id);
};

renderSongs();
renderPlaylists();
