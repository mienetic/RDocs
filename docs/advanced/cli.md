# CLI Development

สร้าง Command-Line Application ด้วย Rust! 

:::tip Rust สำหรับ CLI = เจ๋งมาก!
Binary เล็ก เร็ว และ cross-compile ได้ง่าย! เหมาะมากสำหรับ CLI tools!
:::

---

## 1. เริ่มต้น CLI

### 1.1 Basic CLI

<RustPlayground>

```rust
use std::env;

fn main() {
 // ดึง command-line arguments
 let args: Vec<String> = env::args().collect();
 
 println!("Program: {}", args[0]);
 println!("Arguments: {:?}", &args[1..]);
 
 if args.len() > 1 {
 println!("First arg: {}", args[1]);
 }
}
```

</RustPlayground>

### 1.2 Environment Variables

<RustPlayground>

```rust
use std::env;

fn main() {
 // ดึง environment variable
 match env::var("HOME") {
 Ok(val) => println!("HOME = {}", val),
 Err(_) => println!("HOME not set"),
 }
 
 // หรือใช้ unwrap_or
 let user = env::var("USER").unwrap_or(String::from("unknown"));
 println!("USER = {}", user);
 
 // ดู current directory
 let cwd = env::current_dir().unwrap();
 println!("CWD = {:?}", cwd);
}
```

</RustPlayground>

---

## 2. clap - Argument Parser

### 2.1 Setup

```toml
# Cargo.toml
[dependencies]
clap = { version = "4", features = ["derive"] }
```

### 2.2 Basic Usage

```rust
use clap::Parser;

/// A simple CLI tool
#[derive(Parser, Debug)]
#[command(name = "mytool")]
#[command(about = "A simple CLI tool", long_about = None)]
struct Args {
 /// Name of the person to greet
 #[arg(short, long)]
 name: String,
 
 /// Number of times to greet
 #[arg(short, long, default_value_t = 1)]
 count: u8,
 
 /// Use verbose output
 #[arg(short, long)]
 verbose: bool,
}

fn main() {
 let args = Args::parse();
 
 for _ in 0..args.count {
 if args.verbose {
 println!("Hello, {}! (verbose mode)", args.name);
 } else {
 println!("Hello, {}!", args.name);
 }
 }
}
```

```bash
# Usage
mytool --name Alice --count 3
mytool -n Bob -c 2 -v
mytool --help
```

### 2.3 Subcommands

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "myapp")]
struct Cli {
 #[command(subcommand)]
 command: Commands,
}

#[derive(Subcommand)]
enum Commands {
 /// Create a new project
 New {
 /// Project name
 name: String,
 },
 /// Build the project
 Build {
 /// Build in release mode
 #[arg(short, long)]
 release: bool,
 },
 /// Run the project
 Run {
 /// Arguments to pass
 #[arg(trailing_var_arg = true)]
 args: Vec<String>,
 },
}

fn main() {
 let cli = Cli::parse();

 match cli.command {
 Commands::New { name } => {
 println!("Creating project: {}", name);
 }
 Commands::Build { release } => {
 if release {
 println!("Building in release mode");
 } else {
 println!("Building in debug mode");
 }
 }
 Commands::Run { args } => {
 println!("Running with args: {:?}", args);
 }
 }
}
```

---

## 3. Colored Output

### 3.1 Setup

```toml
[dependencies]
colored = "2"
```

### 3.2 Usage

```rust
use colored::*;

fn main() {
 println!("{}", "This is green".green());
 println!("{}", "This is red".red().bold());
 println!("{}", "This is blue on yellow".blue().on_yellow());
 
 // Status messages
 println!("{} Operation successful!", "".green().bold());
 println!("{} Warning: check input", "".yellow().bold());
 println!("{} Error occurred!", "".red().bold());
}
```

---

## 4. Progress Bars

### 4.1 Setup

```toml
[dependencies]
indicatif = "0.17"
```

### 4.2 Usage

```rust
use indicatif::{ProgressBar, ProgressStyle};
use std::thread::sleep;
use std::time::Duration;

fn main() {
 let pb = ProgressBar::new(100);
 pb.set_style(
 ProgressStyle::default_bar()
 .template("{spinner:.green} [{elapsed_precise}] [{bar:40.cyan/blue}] {pos}/{len} ({eta})")
 .unwrap()
 .progress_chars("#>-"),
 );

 for _ in 0..100 {
 pb.inc(1);
 sleep(Duration::from_millis(50));
 }
 
 pb.finish_with_message("Done!");
}
```

---

## 5. User Input

### 5.1 Basic Input

<RustPlayground>

```rust
use std::io::{self, Write};

fn main() {
 print!("Enter your name: ");
 io::stdout().flush().unwrap();
 
 let mut name = String::new();
 io::stdin().read_line(&mut name).unwrap();
 let name = name.trim();
 
 println!("Hello, {}!", name);
}
```

</RustPlayground>

### 5.2 dialoguer (Interactive)

```toml
[dependencies]
dialoguer = "0.11"
```

```rust
use dialoguer::{Confirm, Input, Select, MultiSelect};

fn main() {
 // Text input
 let name: String = Input::new()
 .with_prompt("What's your name?")
 .interact_text()
 .unwrap();

 // Confirmation
 let confirmed = Confirm::new()
 .with_prompt("Do you want to continue?")
 .default(true)
 .interact()
 .unwrap();

 // Single select
 let options = vec!["Option 1", "Option 2", "Option 3"];
 let selection = Select::new()
 .with_prompt("Choose an option")
 .items(&options)
 .default(0)
 .interact()
 .unwrap();

 // Multi select
 let choices = MultiSelect::new()
 .with_prompt("Pick your languages")
 .items(&["Rust", "Python", "JavaScript", "Go"])
 .interact()
 .unwrap();

 println!("Name: {}", name);
 println!("Confirmed: {}", confirmed);
 println!("Selected: {}", options[selection]);
 println!("Languages: {:?}", choices);
}
```

---

## 6. Exit Codes

<RustPlayground>

```rust
use std::process;

fn main() {
 let success = true;
 
 if success {
 println!("Success!");
 process::exit(0); // Exit code 0 = success
 } else {
 eprintln!("Error occurred!");
 process::exit(1); // Non-zero = error
 }
}
```

</RustPlayground>

::: danger ระวังการใช้ process::exit
`std::process::exit` จะปิดโปรแกรม **ทันที** โดยไม่เรียก `drop` ของตัวแปรต่างๆ (Destructors don't run!)
ถ้าต้องการให้ clean up (เช่น flush file, close db), ให้ return `Result` ออกจาก `main` แทน
:::

---

## 7. Example CLI Tool

### 7.1 Todo CLI

```rust
use clap::{Parser, Subcommand};
use std::fs;
use serde::{Serialize, Deserialize};

#[derive(Parser)]
#[command(name = "todo")]
#[command(about = "A simple todo CLI")]
struct Cli {
 #[command(subcommand)]
 command: Commands,
}

#[derive(Subcommand)]
enum Commands {
 /// Add a new todo
 Add { text: String },
 /// List all todos
 List,
 /// Mark todo as done
 Done { id: usize },
 /// Remove a todo
 Remove { id: usize },
}

#[derive(Serialize, Deserialize, Debug)]
struct Todo {
 id: usize,
 text: String,
 done: bool,
}

#[derive(Serialize, Deserialize, Default)]
struct Todos {
 items: Vec<Todo>,
 next_id: usize,
}

impl Todos {
 fn load() -> Self {
 fs::read_to_string("todos.json")
 .ok()
 .and_then(|s| serde_json::from_str(&s).ok())
 .unwrap_or_default()
 }

 fn save(&self) {
 let json = serde_json::to_string_pretty(self).unwrap();
 fs::write("todos.json", json).unwrap();
 }

 fn add(&mut self, text: String) {
 let todo = Todo {
 id: self.next_id,
 text,
 done: false,
 };
 self.items.push(todo);
 self.next_id += 1;
 self.save();
 }

 fn list(&self) {
 for todo in &self.items {
 let status = if todo.done { "" } else { " " };
 println!("[{}] {} - {}", status, todo.id, todo.text);
 }
 }

 fn done(&mut self, id: usize) {
 if let Some(todo) = self.items.iter_mut().find(|t| t.id == id) {
 todo.done = true;
 self.save();
 println!("Marked {} as done!", id);
 }
 }

 fn remove(&mut self, id: usize) {
 self.items.retain(|t| t.id != id);
 self.save();
 println!("Removed {}!", id);
 }
}

fn main() {
 let cli = Cli::parse();
 let mut todos = Todos::load();

 match cli.command {
 Commands::Add { text } => todos.add(text),
 Commands::List => todos.list(),
 Commands::Done { id } => todos.done(id),
 Commands::Remove { id } => todos.remove(id),
 }
}
```

---

## 8. Cross-Compilation

```bash
# ติดตั้ง target
rustup target add x86_64-unknown-linux-musl
rustup target add x86_64-pc-windows-gnu
rustup target add x86_64-apple-darwin

# Build for Linux
cargo build --release --target x86_64-unknown-linux-musl

# Build for Windows
cargo build --release --target x86_64-pc-windows-gnu

# Build for macOS
cargo build --release --target x86_64-apple-darwin
```

---

## 9. สรุป

| Crate | Purpose |
|-------|---------|
| `clap` | Argument parsing |
| `colored` | Colored output |
| `indicatif` | Progress bars |
| `dialoguer` | Interactive prompts |
| `serde` | Config files |
| `anyhow` | Error handling |

---

[บทถัดไป: Web Development](/advanced/web)
