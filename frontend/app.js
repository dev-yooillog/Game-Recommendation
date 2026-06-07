const SAMPLE_GAMES = [
  { id: "G000001", title: "Eternal Odyssey",      genre: "Role-Playing", platform: "PlayStation 5",   mc: 91, us: 8.8, sales: 2.1,  gem: true  },
  { id: "G000002", title: "Dragon Chronicles VI",  genre: "Role-Playing", platform: "PlayStation 5",   mc: 88, us: 8.5, sales: 18.4, gem: false },
  { id: "G000003", title: "Shadow Realm",          genre: "Role-Playing", platform: "PlayStation 5",   mc: 85, us: 8.2, sales: 3.7,  gem: true  },
  { id: "G000004", title: "Final Legacy",          genre: "Role-Playing", platform: "PlayStation 5",   mc: 84, us: 8.6, sales: 22.1, gem: false },
  { id: "G000005", title: "Lost Kingdoms",         genre: "Role-Playing", platform: "PlayStation 5",   mc: 83, us: 7.9, sales: 4.2,  gem: true  },
  { id: "G000006", title: "Mythic Quest",          genre: "Role-Playing", platform: "PlayStation 5",   mc: 82, us: 8.1, sales: 31.5, gem: false },
  { id: "G000007", title: "Arcane Legacy",         genre: "Role-Playing", platform: "PlayStation 5",   mc: 80, us: 7.8, sales: 1.9,  gem: true  },
  { id: "G000008", title: "Heroes Reborn",         genre: "Role-Playing", platform: "PlayStation 5",   mc: 79, us: 7.6, sales: 28.7, gem: false },
  { id: "G000009", title: "Valor of Destiny",      genre: "Role-Playing", platform: "PlayStation 5",   mc: 78, us: 7.5, sales: 19.2, gem: false },
  { id: "G000010", title: "The Elder Realm",       genre: "Role-Playing", platform: "PlayStation 5",   mc: 77, us: 7.4, sales: 44.8, gem: false },
  { id: "G000011", title: "Apex Warriors",         genre: "Action",       platform: "PlayStation 5",   mc: 89, us: 8.7, sales: 2.8,  gem: true  },
  { id: "G000012", title: "Combat Zone X",         genre: "Action",       platform: "PlayStation 5",   mc: 86, us: 8.3, sales: 38.2, gem: false },
  { id: "G000013", title: "Steel Horizon",         genre: "Shooter",      platform: "PlayStation 5",   mc: 84, us: 8.1, sales: 41.6, gem: false },
  { id: "G000014", title: "Veil of Shadows",       genre: "Adventure",    platform: "PlayStation 5",   mc: 90, us: 8.9, sales: 3.1,  gem: true  },
  { id: "G000015", title: "Speed King 2",          genre: "Racing",       platform: "Nintendo Switch", mc: 76, us: 7.2, sales: 29.4, gem: false },
  { id: "G000016", title: "Neon Fighter",          genre: "Fighting",     platform: "Xbox One",        mc: 81, us: 7.9, sales: 4.8,  gem: true  },
  { id: "G000017", title: "Soccer World",          genre: "Sports",       platform: "PlayStation 5",   mc: 73, us: 7.1, sales: 52.3, gem: false },
  { id: "G000018", title: "Tiny Worlds",           genre: "Platform",     platform: "Nintendo Switch", mc: 87, us: 8.4, sales: 2.3,  gem: true  },
  { id: "G000019", title: "Battle Arena Pro",      genre: "Fighting",     platform: "PlayStation 5",   mc: 79, us: 7.7, sales: 17.9, gem: false },
  { id: "G000020", title: "Dark Forest",           genre: "Adventure",    platform: "PC",              mc: 83, us: 8.2, sales: 1.4,  gem: true  },
];

const compositeScore = g => g.mc * 0.7 + g.us * 10 * 0.3;
const maxSales = Math.max(...SAMPLE_GAMES.map(g => g.sales));

const state = { sort: "composite", mode: "personalized", ratio: 0.1, query: "", genre: "", platform: "" };

function getPipeline() {
  let pool = [...SAMPLE_GAMES];
  if (state.query)    pool = pool.filter(g => g.title.toLowerCase().includes(state.query.toLowerCase()));
  if (state.genre)    pool = pool.filter(g => g.genre === state.genre);
  if (state.platform) pool = pool.filter(g => g.platform === state.platform);

  if (state.mode === "popular") {
    return pool.sort((a, b) => b.sales - a.sales).slice(0, 10);
  }

  const gems    = pool.filter(g =>  g.gem).sort((a, b) => compositeScore(b) - compositeScore(a));
  const regular = pool.filter(g => !g.gem).sort((a, b) => compositeScore(b) - compositeScore(a));
  const n = 10;
  const ni = Math.max(1, Math.round(n * state.ratio));
  let result = [...regular.slice(0, n - ni), ...gems.slice(0, ni)];

  if (state.sort === "sales")      result.sort((a, b) => b.sales - a.sales);
  if (state.sort === "metacritic") result.sort((a, b) => b.mc - a.mc);
  if (state.sort === "composite")  result.sort((a, b) => compositeScore(b) - compositeScore(a));

  return result;
}

function render() {
  const list = getPipeline();
  const gemCount = list.filter(g => g.gem).length;

  document.getElementById("results-count").innerHTML =
    `<strong>${list.length}개</strong> 결과 · ${state.mode === "personalized" ? "개인화 추천" : "인기순 추천"}`;

  const pill = document.getElementById("gem-pill");
  if (state.mode === "personalized" && gemCount > 0) {
    pill.style.display = "flex";
    document.getElementById("gem-pill-txt").textContent = `숨겨진 보석 ${gemCount}개 포함`;
  } else {
    pill.style.display = "none";
  }

  document.getElementById("inject-row").style.display =
    state.mode === "personalized" ? "flex" : "none";

  if (!list.length) {
    document.getElementById("card-list").innerHTML = '<div class="empty">검색 결과가 없습니다</div>';
    return;
  }

  document.getElementById("card-list").innerHTML = list.map((g, i) => {
    const barW  = Math.round(g.sales / maxSales * 100);
    const isTop = i < 3;
    return `
      <div class="card${g.gem ? " gem" : ""}">
        <div class="rank${isTop ? " top" : ""}">${i + 1}</div>
        <div class="card-body">
          <div class="title-row">
            <span class="card-title">${g.title}</span>
            ${g.gem ? '<span class="gem-tag">보석</span>' : ""}
          </div>
          <span class="card-sub">${g.genre} · ${g.platform}</span>
        </div>
        <div class="card-right">
          <span class="score sc-blue">MC ${g.mc}</span>
          <span class="score sc-teal">U ${g.us.toFixed(1)}</span>
          <div class="sales-wrap">
            <span class="sales-num">${g.sales.toFixed(1)}M</span>
            <div class="bar-track">
              <div class="bar-fill${g.gem ? " gem-bar" : ""}" style="width:${barW}%"></div>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");
}

// 정렬 버튼
document.querySelectorAll(".sbtn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sbtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.sort = btn.dataset.sort;
    render();
  });
});

// 모드 버튼
document.querySelectorAll(".mbtn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mbtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.mode = btn.dataset.mode;
    render();
  });
});

document.getElementById("inject-slider").addEventListener("input", e => {
  state.ratio = parseInt(e.target.value) / 100;
  document.getElementById("inject-val").textContent = `${e.target.value}%`;
});

document.getElementById("search").addEventListener("input", e => {
  state.query = e.target.value;
  render();
});

document.getElementById("genre-sel").addEventListener("change", e => {
  state.genre = e.target.value;
  render();
});

document.getElementById("platform-sel").addEventListener("change", e => {
  state.platform = e.target.value;
  render();
});

document.getElementById("run-btn").addEventListener("click", render);

render();