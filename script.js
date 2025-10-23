// Dynamic year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll to Projects section
document.getElementById("viewProjects").addEventListener("click", () => {
  document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
});

// Typing animation for terminal
const terminal = document.querySelector(".terminal");
const lines = [
  "user@shubhfront:~$ Welcome to Shubham's terminal portfolio",
  "user@shubhfront:~$ Python | Web Dev | C/C++",
  "user@shubhfront:~$ Let's explore!"
];
let i = 0, j = 0;

function typeLine() {
  if(i < lines.length) {
    terminal.textContent = lines.slice(0,i).join('\n') + '\n' + lines[i].slice(0,j);
    j++;
    if(j > lines[i].length) { i++; j=0; setTimeout(typeLine, 500); }
    else { setTimeout(typeLine, 50); }
  }
}

setTimeout(typeLine, 500);
