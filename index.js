import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit(); // simpleGit instance

// Bitta commit yaratish va push qilish
const createCommit = async (date) => {
  const data = { date };
  jsonfile.writeFileSync(path, data);

  await git.add([path])
           .commit(date, { "--date": date })
           .push("origin", "main"); // 'main' branch ga push qiladi
};

// Commitlarni yaratish (async rekursiya)
const makeCommits = async (n) => {
  if (n === 0) return;

  const x = random.int(0, 54 * 6); // 6 yil uchun haftalar
  const y = random.int(0, 6);      // haftaning kuni
  const date = moment("2020-01-01").add(x, "w").add(y, "d").format();

  console.log("Creating commit:", date);
  await createCommit(date);
  await makeCommits(n - 1);
};

// Masalan, 100 commit yaratish
makeCommits(100)
  .then(() => console.log("All commits pushed!"))
  .catch((err) => console.error("Error:", err));