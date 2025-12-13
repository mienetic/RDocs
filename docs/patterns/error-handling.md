# Error Handling Patterns

รวม Patterns สำหรับจัดการ Errors ใน Rust!

---

## 1 Basic: Result & Option

<RustPlayground>

```rust
fn main() {
 // Option - ค่าที่อาจไม่มี
 let maybe: Option<i32> = Some(42);

 // Result - การดำเนินการที่อาจ fail
 let result: Result<i32, &str> = Ok(42);

 // Unwrap methods
 println!("unwrap: {}", maybe.unwrap());
 println!("unwrap_or: {}", None::<i32>.unwrap_or(0));
 println!("unwrap_or_else: {}", None::<i32>.unwrap_or_else(|| 99));

 // map/and_then
 let doubled = maybe.map(|x| x * 2);
 let chained = maybe.and_then(|x| Some(x + 1));

 println!("doubled: {:?}", doubled);
 println!("chained: {:?}", chained);
}
```

</RustPlayground>

---

## 2 The ? Operator

<RustPlayground>

```rust
use std::fs;
use std::io;

fn read_username() -> Result<String, io::Error> {
 // ? จะ return early ถ้า Err
 let content = fs::read_to_string("hello.txt")?;
 Ok(content.trim().to_string())
}

fn main() {
 match read_username() {
 Ok(name) => println!("Username: {}", name),
 Err(e) => println!("Error: {}", e),
 }
}
```

</RustPlayground>

---

## 3 Custom Error Types

<RustPlayground>

```rust
use std::fmt;
use std::error::Error;

#[derive(Debug)]
enum AppError {
 NotFound(String),
 InvalidInput(String),
 DatabaseError(String),
}

impl fmt::Display for AppError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 match self {
 AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
 AppError::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
 AppError::DatabaseError(msg) => write!(f, "DB error: {}", msg),
 }
 }
}

impl Error for AppError {}

fn find_user(id: u32) -> Result<String, AppError> {
 if id == 0 {
 Err(AppError::InvalidInput("ID cannot be 0".into()))
 } else if id > 100 {
 Err(AppError::NotFound(format!("User {} not found", id)))
 } else {
 Ok(format!("User{}", id))
 }
}

fn main() {
 match find_user(0) {
 Ok(user) => println!("Found: {}", user),
 Err(e) => println!("Error: {}", e),
 }
}
```

</RustPlayground>

---

## 4 Error Conversion with From

<RustPlayground>

```rust
use std::io;
use std::num::ParseIntError;
use std::fmt;

#[derive(Debug)]
enum MyError {
 Io(io::Error),
 Parse(ParseIntError),
}

impl fmt::Display for MyError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 match self {
 MyError::Io(e) => write!(f, "IO: {}", e),
 MyError::Parse(e) => write!(f, "Parse: {}", e),
 }
 }
}

// From trait ให้ใช้ ? ได้
impl From<io::Error> for MyError {
 fn from(err: io::Error) -> Self {
 MyError::Io(err)
 }
}

impl From<ParseIntError> for MyError {
 fn from(err: ParseIntError) -> Self {
 MyError::Parse(err)
 }
}

fn read_and_parse() -> Result<i32, MyError> {
 let content = std::fs::read_to_string("number.txt")?;
 let num: i32 = content.trim().parse()?;
 Ok(num)
}

fn main() {
 println!("Result: {:?}", read_and_parse());
}
```

</RustPlayground>

---

## 5 `Box<dyn Error>` Pattern

<RustPlayground>

```rust
use std::error::Error;

// ใช้ Box<dyn Error> สำหรับ errors หลายประเภท
fn do_something() -> Result<(), Box<dyn Error>> {
 let _file = std::fs::File::open("test.txt")?;
 let _num: i32 = "42".parse()?;
 Ok(())
}

fn main() {
 if let Err(e) = do_something() {
 println!("Error: {}", e);
 }
}
```

</RustPlayground>

---

## 6 anyhow & thiserror Crates

```rust
// anyhow - สำหรับ Application code
use anyhow::{Result, Context, bail};

fn fetch_data() -> Result<String> {
 let content = std::fs::read_to_string("data.txt")
 .context("Failed to read data file")?;

 if content.is_empty() {
 bail!("Data file is empty");
 }

 Ok(content)
}

// thiserror - สำหรับ Library code
use thiserror::Error;

#[derive(Error, Debug)]
enum DataError {
 #[error("File not found: {path}")]
 NotFound { path: String },

 #[error("Parse error: {0}")]
 ParseError(#[from] std::num::ParseIntError),

 #[error("IO error")]
 Io(#[from] std::io::Error),
}
```

---

## 7 Early Return Pattern

<RustPlayground>

```rust
fn process_data(input: Option<&str>) -> Result<i32, &'static str> {
 // Early return ถ้า None
 let data = input.ok_or("No input provided")?;

 // Early return ถ้า empty
 if data.is_empty() {
 return Err("Input is empty");
 }

 // Early return ถ้า parse fail
 let num: i32 = data.parse().map_err(|_| "Parse failed")?;

 // Happy path
 Ok(num * 2)
}

fn main() {
 println!("{:?}", process_data(Some("21")));
 println!("{:?}", process_data(None));
 println!("{:?}", process_data(Some("")));
 println!("{:?}", process_data(Some("abc")));
}
```

</RustPlayground>

---

## Quick Reference

| Pattern | ใช้เมื่อไหร่ |
|---------|-----------|
| `unwrap()` | Prototyping, ตอนมั่นใจว่าไม่ fail |
| `expect("msg")` | เพิ่ม context ตอน panic |
| `?` | Propagate errors ขึ้นไป |
| `match` | Handle แต่ละ case แยก |
| `unwrap_or(default)` | Fallback เป็นค่า default |
| `map_err(f)` | แปลง error type |
| `Box<dyn Error>` | รับ errors หลายประเภท |
| `anyhow` | Application-level errors |
| `thiserror` | Library-level errors |

---

[← Cheat Sheet](/cheatsheet) | [Async Patterns →](/patterns/async)
