# Rust Cheat Sheet

รวมทุกอย่างที่ต้องรู้ใน Rust ไว้ในหน้าเดียว!

---

## Primitive Types

| Type | ขนาด | ตัวอย่าง |
|------|------|---------|
| `i8`, `i16`, `i32`, `i64`, `i128` | 1-16 bytes | Signed integers |
| `u8`, `u16`, `u32`, `u64`, `u128` | 1-16 bytes | Unsigned integers |
| `isize`, `usize` | pointer size | Platform-dependent |
| `f32`, `f64` | 4, 8 bytes | Floating point |
| `bool` | 1 byte | `true`, `false` |
| `char` | 4 bytes | `'a'`, `'ก'`, `''` |

---

## Common Collections

```rust
// Vector - Dynamic array
let mut v: Vec<i32> = vec![1, 2, 3];
v.push(4);

// HashMap - Key-value pairs
use std::collections::HashMap;
let mut map = HashMap::new();
map.insert("key", "value");

// String - Growable UTF-8
let mut s = String::from("Hello");
s.push_str(", World!");

// HashSet - Unique values
use std::collections::HashSet;
let set: HashSet<i32> = [1, 2, 3].into();
```

---

## Option & Result

```rust
// Option<T> - อาจมีหรือไม่มีค่า
let some: Option<i32> = Some(42);
let none: Option<i32> = None;

// Unwrap methods
some.unwrap(); // panic ถ้า None
some.unwrap_or(0); // default value
some.unwrap_or_default();// T::default()
some.expect("msg"); // panic with message

// Result<T, E> - อาจสำเร็จหรือ error
let ok: Result<i32, &str> = Ok(42);
let err: Result<i32, &str> = Err("error");

// ? operator
fn read_file() -> Result<String, std::io::Error> {
 let content = std::fs::read_to_string("file.txt")?;
 Ok(content)
}
```

---

## Control Flow

```rust
// if-else
if x > 0 {
 println!("positive");
} else if x < 0 {
 println!("negative");
} else {
 println!("zero");
}

// match
match value {
 0 => println!("zero"),
 1..=9 => println!("single digit"),
 _ => println!("other"),
}

// if let
if let Some(x) = option {
 println!("{}", x);
}

// while let
while let Some(x) = iter.next() {
 println!("{}", x);
}

// loops
for i in 0..10 { } // 0-9
for i in 0..=10 { } // 0-10
for item in vec.iter() { } // iterate
for (i, item) in vec.iter().enumerate() { }
```

---

## Ownership & Borrowing

```rust
// Ownership - ค่าหนึ่งมี owner เดียว
let s1 = String::from("hello");
let s2 = s1; // s1 ถูก move ไป s2

// Borrowing - ยืมค่า
fn len(s: &String) -> usize {
 s.len() // immutable borrow
}

fn append(s: &mut String) {
 s.push_str("!"); // mutable borrow
}

// Rules:
// 1. มี &mut ได้แค่ตัวเดียว หรือ
// 2. มี & ได้หลายตัว (แต่ไม่มี &mut พร้อมกัน)
```

---

## Structs & Enums

```rust
// Struct
struct Point {
 x: i32,
 y: i32,
}

impl Point {
 fn new(x: i32, y: i32) -> Self {
 Self { x, y }
 }

 fn distance(&self) -> f64 {
 ((self.x.pow(2) + self.y.pow(2)) as f64).sqrt()
 }
}

// Enum
enum Message {
 Quit,
 Move { x: i32, y: i32 },
 Write(String),
}

impl Message {
 fn process(&self) {
 match self {
 Message::Quit => println!("quit"),
 Message::Move { x, y } => println!("move to {},{}", x, y),
 Message::Write(s) => println!("write: {}", s),
 }
 }
}
```

---

## Traits

```rust
// Define trait
trait Summary {
 fn summarize(&self) -> String;

 // Default implementation
 fn preview(&self) -> String {
 format!("Read more: {}", self.summarize())
 }
}

// Implement trait
impl Summary for Article {
 fn summarize(&self) -> String {
 format!("{} by {}", self.title, self.author)
 }
}

// Trait bounds
fn notify<T: Summary>(item: &T) {
 println!("{}", item.summarize());
}

// Multiple bounds
fn process<T: Clone + Debug>(item: T) { }

// where clause
fn complex<T, U>(t: T, u: U)
where
 T: Clone + Debug,
 U: Display,
{ }
```

---

## Error Handling

```rust
// Custom Error
#[derive(Debug)]
struct MyError {
 message: String,
}

impl std::fmt::Display for MyError {
 fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
 write!(f, "{}", self.message)
 }
}

impl std::error::Error for MyError {}

// thiserror crate (recommended)
use thiserror::Error;

#[derive(Error, Debug)]
enum AppError {
 #[error("IO error: {0}")]
 Io(#[from] std::io::Error),

 #[error("Parse error: {0}")]
 Parse(String),
}
```

---

## Async/Await

```rust
// async function
async fn fetch_data() -> String {
 "data".to_string()
}

// await
async fn main_async() {
 let data = fetch_data().await;
 println!("{}", data);
}

// tokio runtime
#[tokio::main]
async fn main() {
 let result = fetch_data().await;
}

// concurrent
let (a, b) = tokio::join!(
 fetch_a(),
 fetch_b(),
);

// select
tokio::select! {
 result = fetch_a() => println!("a: {:?}", result),
 result = fetch_b() => println!("b: {:?}", result),
}
```

---

## Concurrency

```rust
use std::thread;
use std::sync::{Arc, Mutex};

// Spawn thread
let handle = thread::spawn(|| {
 println!("Hello from thread!");
});
handle.join().unwrap();

// Shared state
let counter = Arc::new(Mutex::new(0));
let counter_clone = Arc::clone(&counter);

thread::spawn(move || {
 let mut num = counter_clone.lock().unwrap();
 *num += 1;
});

// Channel
use std::sync::mpsc;
let (tx, rx) = mpsc::channel();
tx.send("message").unwrap();
let received = rx.recv().unwrap();
```

---

## File I/O

```rust
use std::fs;
use std::io::{Read, Write};

// Simple read/write
let content = fs::read_to_string("file.txt")?;
fs::write("output.txt", "Hello")?;

// Buffered I/O
use std::io::BufReader;
let file = fs::File::open("file.txt")?;
let reader = BufReader::new(file);

for line in reader.lines() {
 println!("{}", line?);
}
```

---

## Useful Macros

| Macro | คำอธิบาย |
|-------|---------|
| `println!`, `print!` | Output to stdout |
| `eprintln!`, `eprint!` | Output to stderr |
| `format!` | Create formatted String |
| `vec!` | Create Vec |
| `dbg!` | Debug print + return value |
| `todo!` | Mark unfinished code |
| `unimplemented!` | Mark unimplemented |
| `panic!` | Cause panic |
| `assert!`, `assert_eq!` | Assertions |

---

## Standard Library Highlights

### Memory
- `mem::size_of::<T>()` - ขนาด type
- `mem::swap(&mut a, &mut b)` - สลับค่า
- `drop(value)` - Drop ทันที

### Comparison
- `cmp::min(a, b)` - ค่าน้อยกว่า
- `cmp::max(a, b)` - ค่ามากกว่า

### Iterators
- `iter::once(v)` - 1 ค่า
- `iter::repeat(v)` - ซ้ำๆ
- `iter::empty()` - ว่าง

### Type Info
- `any::type_name::<T>()` - ชื่อ type

---

## Essential Cargo Commands

```bash
cargo new <name>      # Create new project
cargo build           # Build debug
cargo build --release # Build release (optimized)
cargo check           # Check errors (fast)
cargo run             # Run debug
cargo test            # Run tests
cargo fmt             # Format code
cargo clippy          # Linter (finds common mistakes)
cargo update          # Update dependencies
cargo doc --open      # Generate & open docs
```

---

## Quick Links

- [Traits](/traits/) | [Structs](/structs/) | [Enums](/enums/)
- [Functions](/functions/) | [Macros](/macros/) | [Constants](/constants/)
- [Primitives](/primitives/) | [Std Library](/std/)
