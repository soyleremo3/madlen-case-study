// Builds the submission PDF: inserts process-document.md into submission.html, then prints with headless Chrome.
// Usage: node deliverables/submission/build.cjs
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = __dirname;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

function mdToHtml(md) {
  let html = "";
  let inList = false;
  for (const line of md.split(/\r?\n/)) {
    if (line.startsWith("- ")) {
      if (!inList) html += "<ul>";
      inList = true;
      html += `<li>${inline(line.slice(2))}</li>`;
      continue;
    }
    if (inList) html += "</ul>";
    inList = false;
    if (line.startsWith("# ")) html += `<h1>${inline(line.slice(2))}</h1>`;
    else if (line.startsWith("## ")) html += `<h2>${inline(line.slice(3))}</h2>`;
    else if (line.trim()) html += `<p>${inline(line)}</p>`;
  }
  return inList ? html + "</ul>" : html;
}

const processMd = fs.readFileSync(path.join(dir, "..", "process-document.md"), "utf8");
const page = fs.readFileSync(path.join(dir, "submission.html"), "utf8").replace("<!--PROCESS-->", mdToHtml(processMd));
const built = path.join(dir, ".built.html");
fs.writeFileSync(built, page);

const chrome = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const pdf = path.join(dir, "madlen-case-study-submission.pdf");
execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--virtual-time-budget=8000",
  `--print-to-pdf=${pdf}`,
  "file:///" + built.replace(/\\/g, "/"),
], { stdio: "ignore" });
if (!process.env.KEEP) fs.unlinkSync(built);
console.log("wrote", pdf);
