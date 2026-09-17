const cities = [
  { id: "new-york", city: "New York", country: "USA", zone: "America/New_York", flag: "🇺🇸" },
  { id: "los-angeles", city: "Los Angeles", country: "USA", zone: "America/Los_Angeles", flag: "🇺🇸" },
  { id: "london", city: "London", country: "UK", zone: "Europe/London", flag: "🇬🇧" },
  { id: "paris", city: "Paris", country: "France", zone: "Europe/Paris", flag: "🇫🇷" },
  { id: "dubai", city: "Dubai", country: "UAE", zone: "Asia/Dubai", flag: "🇦🇪" },
  { id: "mumbai", city: "Mumbai", country: "India", zone: "Asia/Kolkata", flag: "🇮🇳" },
  { id: "delhi", city: "New Delhi", country: "India", zone: "Asia/Kolkata", flag: "🇮🇳" },
  { id: "singapore", city: "Singapore", country: "Singapore", zone: "Asia/Singapore", flag: "🇸🇬" },
  { id: "tokyo", city: "Tokyo", country: "Japan", zone: "Asia/Tokyo", flag: "🇯🇵" },
  { id: "seoul", city: "Seoul", country: "South Korea", zone: "Asia/Seoul", flag: "🇰🇷" },
  { id: "beijing", city: "Beijing", country: "China", zone: "Asia/Shanghai", flag: "🇨🇳" },
  { id: "sydney", city: "Sydney", country: "Australia", zone: "Australia/Sydney", flag: "🇦🇺" },
  { id: "auckland", city: "Auckland", country: "New Zealand", zone: "Pacific/Auckland", flag: "🇳🇿" },
  { id: "berlin", city: "Berlin", country: "Germany", zone: "Europe/Berlin", flag: "🇩🇪" },
  { id: "moscow", city: "Moscow", country: "Russia", zone: "Europe/Moscow", flag: "🇷🇺" },
  { id: "toronto", city: "Toronto", country: "Canada", zone: "America/Toronto", flag: "🇨🇦" },
  { id: "sao-paulo", city: "São Paulo", country: "Brazil", zone: "America/Sao_Paulo", flag: "🇧🇷" },
  { id: "cape-town", city: "Cape Town", country: "South Africa", zone: "Africa/Johannesburg", flag: "🇿🇦" }
];

const state = {
  selected: ["new-york", "london", "dubai", "tokyo"],
  hour12: false,
  dark: false
};

const $ = (id) => document.getElementById(id);
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time zone";

function populateSelect() {
  $("citySelect").innerHTML = '<option value="">Choose a city…</option>';
  cities.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.flag}  ${c.city}, ${c.country}`;
    opt.disabled = state.selected.includes(c.id);
    $("citySelect").appendChild(opt);
  });
}

function formatTime(date, zone) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: state.hour12
  }).format(date);
}

function formatDate(date, zone) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: zone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function offsetMinutes(date, zone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date).reduce((o, p) => (o[p.type] = p.value, o), {});
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}

function offsetLabel(minutes) {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function localTimeParts(date) {
  return {
    time: formatTime(date, localZone),
    date: formatDate(date, localZone)
  };
}

function differenceText(date, zone) {
  const diff = offsetMinutes(date, zone) - offsetMinutes(date, localZone);
  if (diff === 0) return "Same as you";
  const sign = diff > 0 ? "+" : "−";
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}${m ? `h ${m}m` : "h"} vs you`;
}

function render(now = new Date()) {
  const local = localTimeParts(now);
  $("localTime").textContent = local.time;
  $("localDate").textContent = local.date;
  $("localZone").textContent = localZone;
  $("formatBtn").textContent = state.hour12 ? "12H" : "24H";
  $("footerYear").textContent = `© ${now.getFullYear()}`;

  const grid = $("clockGrid");
  grid.innerHTML = "";

  if (!state.selected.length) {
    grid.innerHTML = '<div class="empty"><strong>No cities selected</strong>Add a city above to start comparing time zones.</div>';
    return;
  }

  state.selected.forEach(id => {
    const c = cities.find(x => x.id === id);
    if (!c) return;
    const card = document.createElement("article");
    card.className = "clock-card";
    card.innerHTML = `
      <div class="card-top">
        <div class="city">
          <span class="flag" aria-hidden="true">${c.flag}</span>
          <div>
            <h4>${c.city}</h4>
            <p>${c.country}</p>
          </div>
        </div>
        <button class="remove-btn" type="button" data-remove="${c.id}" aria-label="Remove ${c.city}">×</button>
      </div>
      <div class="clock-time">${formatTime(now, c.zone)}</div>
      <div class="clock-date">${formatDate(now, c.zone)}</div>
      <span class="offset">${offsetLabel(offsetMinutes(now, c.zone))}</span>
      <span class="diff">${differenceText(now, c.zone)}</span>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selected = state.selected.filter(id => id !== btn.dataset.remove);
      populateSelect();
      render(new Date());
    });
  });
}

$("addBtn").addEventListener("click", () => {
  const id = $("citySelect").value;
  if (!id || state.selected.includes(id)) return;
  state.selected.push(id);
  populateSelect();
  $("citySelect").value = "";
  render(new Date());
});

$("citySelect").addEventListener("change", () => {
  $("addBtn").disabled = !$("citySelect").value;
});

$("clearBtn").addEventListener("click", () => {
  state.selected = [];
  populateSelect();
  $("citySelect").value = "";
  $("addBtn").disabled = true;
  render(new Date());
});

$("formatBtn").addEventListener("click", () => {
  state.hour12 = !state.hour12;
  render(new Date());
});

$("themeBtn").addEventListener("click", () => {
  state.dark = !state.dark;
  document.documentElement.dataset.theme = state.dark ? "dark" : "light";
  $("themeBtn").textContent = state.dark ? "☀" : "☾";
});

populateSelect();
$("addBtn").disabled = true;
render(new Date());
setInterval(() => render(new Date()), 1000);
