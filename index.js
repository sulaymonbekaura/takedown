import fs from "fs";
import jsonfile from "jsonfile";
import simpleGit from "simple-git";
import moment from "moment";

const git = simpleGit();
const path = "./data.json";

const TOTAL_COMMITS = 50000;

// 1 yil kunlari
const getDates = () => {
  const dates = [];
  let start = moment().subtract(1, "year");
  let end = moment();

  while (start.isSameOrBefore(end)) {
    dates.push(start.clone());
    start.add(1, "day");
  }

  return dates;
};

const makeCommitsFast = async () => {
  const dates = getDates();
  const commitsPerDay = Math.ceil(TOTAL_COMMITS / dates.length);

  let count = 0;

  for (const dateObj of dates) {
    const date = dateObj.format();

    for (let i = 0; i < commitsPerDay; i++) {
      if (count >= TOTAL_COMMITS) break;

      jsonfile.writeFileSync(path, {
        date,
        index: count,
      });

      await git.add([path]);
      await git.commit(`commit ${count}`, {
        "--date": date,
      });

      count++;
    }

    console.log(`Done: ${date} (${count})`);
    if (count >= TOTAL_COMMITS) break;
  }

  await git.push("origin", "main");

  console.log("🚀 50,000 COMMITS PUSHED!");
};

makeCommitsFast();