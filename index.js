import fs from "fs";
import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import moment from "moment";

const git = simpleGit();
const path = "./data.json";

const startDate = moment().subtract(1, "year").add(1, "day"); // 1 yil oldin bugundan keyingi kun
const endDate = moment(); // bugungi sana

// Kunlar oralig'ini olish
const getDatesBetween = (start, end) => {
  const dates = [];
  let curr = start.clone();
  while (curr.isSameOrBefore(end, "day")) {
    dates.push(curr.format());
    curr.add(1, "day");
  }
  return dates;
};

const dates = getDatesBetween(startDate, endDate);

// Har kuni 1 ta commit qilish uchun async funktsiya
const makeDailyCommits = async () => {
  for (const date of dates) {
    // data.json faylga sanani yozamiz
    jsonfile.writeFileSync(path, { date });

    // git add, commit (sanasi ko'rsatilgan), push
    await git.add([path])
             .commit(date, { "--date": date })
             .push("origin", "main"); // branch nomi kerak bo'lsa o'zgartiring

    console.log(`Committed for date: ${date}`);
  }
};

makeDailyCommits()
  .then(() => console.log("All daily commits pushed!"))
  .catch(err => console.error(err));