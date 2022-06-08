"use strict";

const region = document.getElementById("region"),
  errors = document.getElementById("errors"),
  seed = document.getElementById("seed"),
  generateSeed = document.getElementById("generate-seed"),
  tbody = document.getElementById("tbody"),
  csv = document.getElementById("csv");

const random = () => Math.floor(Math.random() * (1e10 + 0) - 0);

let PAGE = 1;
let loading = false;
let fakeData = [];
seed.value = random();

const generator = debounce(rerender);
generator();

region.addEventListener("change", generator);
errors.addEventListener("change", generator);
seed.addEventListener("change", generator);
csv.addEventListener("click", downloadCSV);
generateSeed.addEventListener("click", () => {
  seed.value = random();
  generator();
});

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}

function rerender() {
  loading = true;
  setTimeout(() => loading = false, 50);
  tbody.innerHTML = "";
  fakeData = [];

  for (let i = 0; i < PAGE; i++) {
    generate(i + 1);
  }
}

function generate(page = PAGE) {
  errors.value = +errors.value ?? 0;
  seed.value = +seed.value ?? 0;
  getData(page).then(data => {
    fakeData = fakeData.concat(data);
    fillTable(data);
  });
}

async function getData(page) {
  const data =
    await fetch("http://localhost:8000/?" +
      `page=${page}&` +
      `seed=${seed.value}&` +
      `errors=${errors.value}&` +
      `locale=${region.value}&`
    );
  return await data.json();
}

function fillTable(data) {
  for (const row of data) {
    const tr = createRow(row);
    tbody.appendChild(tr);
  }
}

function createRow(row) {
  const tr = document.createElement("tr");

  for (const column in row) {
    const td = document.createElement("td");
    td.textContent = row[column];
    tr.appendChild(td);
  }

  return tr;
}

function downloadCSV() {
  let csv = "";
  for (let row = 0; row < fakeData.length; row++) {
    const keysAmount = Object.keys(fakeData[row]).length;
    let keysCounter = 0;

    if (row === 0) {
      for (const key in fakeData[row]) {
        csv += key + (keysCounter + 1 < keysAmount ? ";" : "\r\n");
        keysCounter++;
      }
      keysCounter = 0;
      for (const key in fakeData[row]) {
        csv += fakeData[row][key] +
          (keysCounter + 1 < keysAmount ? ";" : "\r\n");
        keysCounter++;
      }
    } else {
      for (const key in fakeData[row]) {
        csv += fakeData[row][key] +
          (keysCounter + 1 < keysAmount ? ";" : "\r\n");
        keysCounter++;
      }
    }

    keysCounter = 0;
  }

  const link = document.createElement("a");
  link.id = "download-csv";
  link.setAttribute(
    "href", "data:text/plain;charset=utf-8," + encodeURIComponent(csv)
  );
  link.setAttribute("download", "fake-users.csv");
  document.body.appendChild(link);
  document.querySelector("#download-csv").click();
  document.body.removeChild(link);
}

const check = debounce(checkNewPage);
window.addEventListener("scroll", () => {
  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;

  check(scrollTop + clientHeight >= scrollHeight - 5 && !loading);
}, {
  passive: true
});

function checkNewPage(condition) {
  if (condition) {
    PAGE++;
    generate();
  }
}
