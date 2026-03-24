import fs from "fs";
import path from "path";
import moment from "moment";
import random from "random";

const args = process.argv.slice(2);
const command = args[0];

// ===== PASSWORD GENERATOR =====
const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let pass = "";
  for (let i = 0; i < 12; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  console.log("🔑 Password:", pass);
};

// ===== TODO APP =====
const todoFile = "./todos.json";

const loadTodos = () => {
  if (!fs.existsSync(todoFile)) return [];
  return JSON.parse(fs.readFileSync(todoFile));
};

const saveTodos = (todos) => {
  fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2));
};

const addTodo = (task) => {
  const todos = loadTodos();
  todos.push({ task, date: moment().format() });
  saveTodos(todos);
  console.log("✅ Added:", task);
};

const listTodos = () => {
  const todos = loadTodos();
  console.log("📝 TODOS:");
  todos.forEach((t, i) => console.log(i + 1, t.task));
};

// ===== FILE ORGANIZER =====
const organizeFiles = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const ext = path.extname(file);
    if (!ext) return;

    const folder = path.join(dir, ext.replace(".", ""));
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    fs.renameSync(
      path.join(dir, file),
      path.join(folder, file)
    );
  });

  console.log("📁 Files organized!");
};

// ===== TIME LOGGER =====
const logTime = () => {
  const log = `Time: ${moment().format()}\n`;
  fs.appendFileSync("time.log", log);
  console.log("⏱️ Time logged");
};

// ===== RANDOM NUMBER =====
const randomNumber = () => {
  console.log("🎲 Random:", random.int(1, 100));
};

// ===== API FETCH (simple) =====
const fetchAPI = async () => {
  const res = await fetch("https://api.github.com");
  const data = await res.json();
  console.log("🌐 GitHub API:", data.current_user_url);
};

// ===== COMMAND HANDLER =====
switch (command) {
  case "pass":
    generatePassword();
    break;

  case "add":
    addTodo(args.slice(1).join(" "));
    break;

  case "list":
    listTodos();
    break;

  case "organize":
    organizeFiles(args[1] || ".");
    break;

  case "time":
    logTime();
    break;

  case "random":
    randomNumber();
    break;

  case "api":
    fetchAPI();
    break;

  default:
    console.log(`
🚀 Dev Toolkit CLI

Commands:
pass              → generate password
add "task"        → add todo
list              → list todos
organize [dir]    → organize files
time              → log time
random            → random number
api               → test API
`);
}