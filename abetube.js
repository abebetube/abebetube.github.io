    window.addEventListener("load", () => {
      setTimeout(() => {
        document.getElementById("splash").style.display = "none";
      }, 4000);
    });

    const API_KEY = "AIzaSyCKWg2Po9gpQTx2-SSadDOouTB04jBFAAU";
    let playlist = [];
    let currentIndex = 0;

    window.onload = () => loadFromCache();

    document.getElementById("searchInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchVideos();
      }
    });

    async function searchVideos() {
      const query = document.getElementById("searchInput").value.trim();
      if (!query) return;

      playlist = [];
      currentIndex = 0;
      document.getElementById("results").innerHTML = "";
      document.getElementById("player-container").innerHTML = "";

      const isURL = query.includes("youtube.com") || query.includes("youtu.be");
      if (isURL) {
        const match = query.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        const videoId = match ? match[1] : "";
        if (videoId && await checkEmbeddable(videoId)) {
          playlist = [{ videoId, title: "סרטון שהוזן", thumb: "" }];
          currentIndex = 0;
          saveToCache();
          playVideo(currentIndex);
        }
        return;
      }

      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query)}&type=video&key=${API_KEY}&maxResults=30`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        for (const item of data.items) {
          const vid = item.id.videoId;
          if (await checkEmbeddable(vid)) {
            playlist.push({
              videoId: vid,
              title: item.snippet.title,
              thumb: item.snippet.thumbnails.medium.url,
            });
          }
        }

        if (playlist.length === 0) return alert("לא נמצאו סרטונים ניתנים לניגון");

        currentIndex = 0;
        saveToCache();
        playVideo(currentIndex);
      } catch (e) {
        console.error("שגיאת חיפוש:", e);
      }
    }

    function playVideo(index) {
      const video = playlist[index];
      if (!video) return;

      document.getElementById("player-container").innerHTML =
        `<iframe id="ytplayer" src="https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1" allowfullscreen allow="autoplay"></iframe>`;

      setTimeout(() => {
        document.getElementById("player-container").scrollIntoView({ behavior: "smooth" });
      }, 500);

      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      playlist.forEach((v, i) => {
        if (i === index) return;
        const div = document.createElement("div");
        div.className = "video-item";
        div.onclick = () => {
          currentIndex = i;
          saveToCache();
          playVideo(i);
        };
        div.innerHTML = `<img src="${v.thumb}" alt="${v.title}"><div class="video-title">${v.title}</div>`;
        resultsDiv.appendChild(div);
      });

      setTimeout(() => setupPlayerEvents(), 1000);
    }

    

    function setupPlayerEvents() {
      if (typeof YT === "undefined" || typeof YT.Player === "undefined") return;
      new YT.Player("ytplayer", {
        events: {
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED && currentIndex + 1 < playlist.length) {
              currentIndex++;
              saveToCache();
              playVideo(currentIndex);
            }
          },
        },
      });
    }

    async function checkEmbeddable(id) {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${id}&key=${API_KEY}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        return data.items?.[0]?.status?.embeddable ?? false;
      } catch {
        return false;
      }
    }

    function saveToCache() {
      localStorage.setItem("abe_playlist", JSON.stringify(playlist));
      localStorage.setItem("abe_index", currentIndex);
    }

    function loadFromCache() {
      const list = localStorage.getItem("abe_playlist");
      const idx = localStorage.getItem("abe_index");
      if (list && idx !== null) {
        playlist = JSON.parse(list);
        currentIndex = parseInt(idx);
        playVideo(currentIndex);
      }
      function checkAndClearCache() {
  const lastClearTime = localStorage.getItem('lastCacheClearTime');
  const now = Date.now();

  if (!lastClearTime || now - lastClearTime > 86400000) { // 24 שעות במילישניות
    localStorage.clear(); // מחיקת המטמון
    localStorage.setItem('lastCacheClearTime', now);
  }
}
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com./iframe_api";
    document.head.appendChild(tag);
  
  

window.addEventListener("load", () => {

  const splash = document.getElementById("splash");
   checkAndClearCache();
  loadFromCache();
  let count = 0;
  const interval = setInterval(() => {
    launchFireworks();
    count++;
    if (count >= 4) clearInterval(interval);
  }, 700);

  setTimeout(() => {
    splash.style.display = "none";
  }, 4000);
});



// סקריפט להסתיר את המסך הפתיחה לאחר האנימציה ולהציג את התוכן
window.addEventListener('load', () => {
  const splash = document.getElementById('splash-screen');
  const mainContent = document.getElementById('main-content');

  // תן זמן לאנימציות להסתיים (לדוגמה 3 שניות)
  setTimeout(() => {
    splash.style.display = 'none'; // הסר את המסך הפתיחה
    mainContent.style.display = 'block'; // הצג את התוכן הראשי
  }, 3000); // תוכל לשנות את הזמן לפי אורך האנימציות שלך
});
