const sports = [
  {
    name: "Pallavolo",
    category: "Sport di squadra",
    description:
      "Palleggio, bagher e gioco di squadra. Un venerdì per trovare il ritmo, un punto alla volta.",
    image:
      "https://images.unsplash.com/photo-1728971121667-80d6513f83e1?auto=format&fit=crop&w=1200&q=85",
    alt: "Giocatori impegnati in una partita di pallavolo in palestra",
  },
  {
    name: "Basket",
    category: "Sport di squadra",
    description:
      "Palleggio, passaggi e tiri a canestro. Alleniamo la coordinazione e impariamo a giocare insieme.",
    image:
      "https://images.unsplash.com/photo-1678032493201-ed4764b7d6f8?auto=format&fit=crop&w=1200&q=85",
    alt: "Pallone da basket su un campo da pallacanestro",
  },
  {
    name: "Calcio",
    category: "Sport di squadra",
    description:
      "Controllo di palla, passaggi e una partita insieme. Spazio al movimento e alla collaborazione.",
    image:
      "https://images.unsplash.com/photo-1660926655800-3d11219f390d?auto=format&fit=crop&w=1200&q=85",
    alt: "Pallone da calcio sul prato",
  },
  {
    name: "Badminton",
    category: "Sport con racchetta",
    description:
      "Servizio, scambi e precisione. Mettiamo alla prova i riflessi e il controllo dei movimenti.",
    image:
      "https://images.unsplash.com/photo-1564226803380-91139fdcb4d0?auto=format&fit=crop&w=1200&q=85",
    alt: "Volano bianco per il badminton",
  },
  {
    name: "Hockey",
    category: "Sport di squadra",
    description:
      "Passaggi, controllo e gioco di squadra. Un venerdì per lavorare velocità, precisione e collaborazione.",
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=85",
    alt: "Giocatori di hockey in campo durante una partita",
  },
];

const closures = {
  "2026-12-25": "Vacanze di Natale",
  "2027-01-01": "Vacanze di Natale",
  "2027-03-26": "Vacanze di Pasqua",
  "2027-04-30": "Ponte del 1° maggio",
};

// Modificare questa sequenza per scegliere il programma dell'intero anno.
// Venerdì 2 ottobre 2026: Badminton, Hockey, Calcio, Pallavolo, Basket.
const activityPlan = [3, 4, 2, 0, 1];
const lessons = [];
const firstLesson = new Date("2026-09-11T12:00:00Z");
const lastLesson = new Date("2027-06-08T12:00:00Z");
const cycleStartIndex = 3; // 2 ottobre 2026 è il 4° venerdì dall'inizio del calendario

for (
  let date = firstLesson, index = 0;
  date <= lastLesson;
  date.setUTCDate(date.getUTCDate() + 7), index += 1
) {
  const dateKey = date.toISOString().slice(0, 10);

  if (!closures[dateKey]) {
    lessons.push({
      date: dateKey,
      sport:
        activityPlan[
          (index - cycleStartIndex + activityPlan.length) %
            activityPlan.length
        ],
      skip: false,
    });
  }
}

const $ = (id) => document.getElementById(id);
const format = (date, options) =>
  new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    ...options,
  }).format(new Date(`${date}T12:00:00Z`));
const today = () =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

let showAll = false;
let current = null;

function render() {
  const now = today();
  current =
    lessons.find((lesson) => lesson.date >= now && !lesson.skip) || null;
  const sport = current ? sports[current.sport] : sports[0];

  $("week-status").textContent = !current
    ? "Anno concluso"
    : current.date === now
      ? "Oggi in palestra"
      : "Prossimo venerdì";
  $("hero-date").textContent = current
    ? format(current.date, { day: "numeric", month: "long", year: "numeric" })
    : "8 giugno 2027";
  $("activity").textContent = current ? sport.name : "Ci vediamo presto.";
  $("description").textContent = current
    ? sport.description
    : "Il programma di quest'anno è terminato. Tutte le lezioni restano nel calendario.";
  $("category").textContent = current
    ? sport.category
    : "Anno scolastico 2026–2027";
  $("sport-image").src = sport.image;
  $("sport-image").alt = sport.alt;
  $("image-caption").textContent = current
    ? sport.name
    : "Educazione fisica · 2026–2027";

  const visibleLessons = lessons.filter(
    (lesson) => showAll || lesson.date >= now,
  );
  $("count").textContent = `${visibleLessons.length} venerdì di attività`;
  $("calendar").replaceChildren();

  let month = "";
  let grid;

  for (const lesson of visibleLessons) {
    if (lesson.date.slice(0, 7) !== month) {
      month = lesson.date.slice(0, 7);
      const heading = document.createElement("h3");
      heading.className = "month-title";
      heading.textContent = `${format(lesson.date, { month: "long" })} ${lesson.date.slice(0, 4)}`;
      $("calendar").append(heading);

      grid = document.createElement("div");
      grid.className = "lesson-grid";
      $("calendar").append(grid);
    }

    const lessonSport = sports[lesson.sport];
    const card = document.createElement("div");
    card.className = `lesson${lesson === current ? " current" : ""}`;
    card.setAttribute("role", "article");
    card.innerHTML = `
			<span class="lesson-top">
				<span class="lesson-date">${Number(lesson.date.slice(8))}<small>VEN</small></span>
				${lesson === current ? `<span class="lesson-tag">${lesson.date === now ? "Oggi" : "Prossima"}</span>` : ""}
			</span>
			<span class="lesson-name">${lessonSport.name}</span>
			<span class="lesson-category">${lessonSport.category}</span>
		`;
    grid.append(card);
  }

  if (!visibleLessons.length) {
    const message = document.createElement("p");
    message.textContent =
      "Nessuna lezione in arrivo. Apri “Tutto l’anno” per rivedere il programma.";
    $("calendar").append(message);
  }

  $("upcoming").classList.toggle("active", !showAll);
  $("all").classList.toggle("active", showAll);
  $("upcoming").setAttribute("aria-pressed", String(!showAll));
  $("all").setAttribute("aria-pressed", String(showAll));
}

function downloadPdf() {
  const jsPDF = window.jspdf?.jsPDF;

  if (!jsPDF) {
    window.alert(
      "Il PDF non può essere creato senza una connessione Internet.",
    );
    return;
  }

  const documentPdf = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 16;
  const pageHeight = documentPdf.internal.pageSize.getHeight();
  let y = 18;

  documentPdf.setTextColor(25, 45, 39);
  documentPdf.setFontSize(18);
  documentPdf.text("Programma sport e attivita 4AI", margin, y);
  y += 8;

  documentPdf.setFontSize(11);
  documentPdf.setTextColor(90, 105, 95);
  documentPdf.text("Anno scolastico 2026-2027", margin, y);
  y += 12;

  documentPdf.setDrawColor(220, 226, 217);
  documentPdf.line(margin, y, 194, y);
  y += 10;

  documentPdf.setTextColor(25, 45, 39);
  documentPdf.setFontSize(11);

  for (const lesson of lessons) {
    if (y > pageHeight - 18) {
      documentPdf.addPage();
      y = 18;
    }

    const lessonDate = format(lesson.date, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    documentPdf.text(lessonDate, margin, y);
    documentPdf.text(sports[lesson.sport].name, 145, y);
    y += 7;
  }

  if (y > pageHeight - 35) {
    documentPdf.addPage();
    y = 18;
  }

  y += 7;
  documentPdf.setFontSize(10);
  documentPdf.setTextColor(90, 105, 95);
  documentPdf.text(
    "Sospensioni: 25 dicembre 2026, 1 gennaio, 26 marzo e 30 aprile 2027.",
    margin,
    y,
  );
  documentPdf.save("programma-sport-attivita-4AI-2026-2027.pdf");
}

$("upcoming").addEventListener("click", () => {
  showAll = false;
  render();
});

$("all").addEventListener("click", () => {
  showAll = true;
  render();
});

$("download-pdf").addEventListener("click", downloadPdf);

render();
setInterval(render, 60000);
