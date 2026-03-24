import fs from "fs";
import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import moment from "moment";

const git = simpleGit();
const path = "./data.json";

// 1 yil ichidagi barcha kunlarni olish
const getDates = () => {
  const dates = [];
  let start = moment().subtract(1, "year");
  let end = moment();

  while (start.isSameOrBefore(end)) {
    dates.push(start.clone().format());
    start.add(1, "day");
  }

  return dates;
};

const makeCommitsFast = async () => {
  const dates = getDates();

  for (const date of dates) {
    // har kuni 5 ta commit (ko‘proq qilish mumkin)
    for (let i = 0; i < 5; i++) {
      jsonfile.writeFileSync(path, { date, i });

      await git.add([path]);
      await git.commit(date, { "--date": date });
    }

    console.log("Done:", date);
  }

  // 🔥 faqat oxirida 1 marta push
  await git.push("origin", "main");

  console.log("🚀 ALL COMMITS PUSHED!");
};

makeCommitsFast();