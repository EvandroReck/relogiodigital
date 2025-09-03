const $ = (sel) => document.querySelector(sel);

const elHH = $("#hh");
const elMM = $("#mm");
const elSS = $("#ss");
const elAMPM = $("#ampm");
const elDate = $("#date");
const elTzName = $("#tzName");
const elUtcOffset = $("#utcOffset");
const btnToggle = $("#formatToggle");
const nowLink = $("#nowLink");

let is24h = true;

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
elTzName.textContent = tz;

function updateOffset(date = new Date()){
  const mins = date.getTimezoneOffset(); // minutos atrás do UTC (Brasil = +180)
  const sign = mins > 0 ? "-" : "+";
  const abs = Math.abs(mins);
  const hh = String(Math.floor(abs / 60)).padStart(2,"0");
  const mm = String(abs % 60).padStart(2,"0");
  elUtcOffset.textContent = `UTC${sign}${hh}:${mm}`;
}

function formatDate(date){
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  
  const out = formatter.format(date);
  return out.charAt(0).toLowerCase() === out.charAt(0)
    ? out.charAt(0).toLowerCase() + out.slice(1)
    : out;
}

function renderTime(){
  const now = new Date();

  
  let h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  if (!is24h){
    const ampm = h >= 12 ? "PM" : "AM";
    elAMPM.textContent = ampm;
    elAMPM.style.display = "inline-block";
    h = h % 12 || 12;
  } else {
    elAMPM.textContent = "";
    elAMPM.style.display = "none";
  }

  elHH.textContent = String(h).padStart(2,"0");
  elMM.textContent = String(m).padStart(2,"0");
  elSS.textContent = String(s).padStart(2,"0");

  
  elDate.textContent = formatDate(now);
  updateOffset(now);
}


btnToggle.addEventListener("click", () => {
  is24h = !is24h;
  btnToggle.setAttribute("aria-pressed", String(!is24h));
  btnToggle.querySelector(".btn-text").innerHTML = `<strong>${is24h ? "24H" : "12H"}</strong>`;
  renderTime();
  pulseSep();
});


function pulseSep(){
  document.querySelectorAll(".sep").forEach(el=>{
    el.style.animation = "none";
    // força reflow para reiniciar animação
    void el.offsetWidth;
    el.style.animation = "";
  });
}


nowLink.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  // flash pequeno
  document.querySelector(".clock-card").animate(
    [{ boxShadow: "0 0 0 0 rgba(124,77,255,0)" },
     { boxShadow: "0 0 0 16px rgba(124,77,255,.14)" },
     { boxShadow: "0 0 0 0 rgba(124,77,255,0)" }],
    { duration: 800, easing: "ease-out" }
  );
});


renderTime();
setInterval(renderTime, 250);
