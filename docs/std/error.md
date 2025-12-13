# Error - จัดการข้อผิดพลาด

**std::error** มี Error trait ที่เป็นมาตรฐานสำหรับจัดการ errors! 

---

## Error คืออะไร?

`Error` trait เป็นหัวใจของระบบ error handling ใน Rust:
- ทุก error types ควร implement
- ให้ข้อความอธิบาย error
- สามารถ chain errors (error A เกิดจาก error B)
- ใช้กับ `?` operator และ `Result`

:::tip Error vs panic
- **Error** = ข้อผิดพลาดที่คาดไว้ สามารถจัดการได้ (เช่น file not found)
- **panic** = ข้อผิดพลาดร้ายแรง ไม่ควรเกิด (เช่น bug ใน code)
:::

---

## 1. สร้าง Custom Error

<RustPlayground>

```rust
use std::error::Error;
use std::fmt;

// สร้าง custom error struct
#[derive(Debug)]
struct MyError {
 message: String,
}

// ต้อง implement Display (แสดงข้อความ user-friendly)
impl fmt::Display for MyError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 // ข้อความที่ผู้ใช้จะเห็น
 write!(f, "เกิดข้อผิดพลาด: {}", self.message)
 }
}

// implement Error trait (ส่วนใหญ่ใช้ default implementations)
impl Error for MyError {}

fn main() {
 let err = MyError { 
 message: "ไฟล์ไม่พบ".to_string() 
 };
 
 // Display - สำหรับผู้ใช้
 println!("Display: {}", err);
 
 // Debug - สำหรับ developers
 println!("Debug: {:?}", err);
 
 // ใช้เป็น trait object
 let err_ref: &dyn Error = &err;
 println!("Error trait: {}", err_ref);
}
```

</RustPlayground>

---

## 2. Error Chain (Wrapping Errors)

<RustPlayground>

```rust
use std::error::Error;
use std::fmt;

// Error ระดับล่าง - เกิดจาก I/O
#[derive(Debug)]
struct IoError(String);

impl fmt::Display for IoError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "IO Error: {}", self.0)
 }
}
impl Error for IoError {}

// Error ระดับบน - wrap error ระดับล่าง
#[derive(Debug)]
struct AppError {
 msg: String,
 source: Option<Box<dyn Error>>, // เก็บ error ต้นเหตุ
}

impl fmt::Display for AppError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "Application Error: {}", self.msg)
 }
}

impl Error for AppError {
 // source() return error ต้นเหตุ
 fn source(&self) -> Option<&(dyn Error + 'static)> {
 // แปลง Option<Box<dyn Error>> -> Option<&dyn Error>
 self.source.as_ref().map(|e| e.as_ref())
 }
}

fn main() {
 // สร้าง error chain
 let io_err = IoError("ไม่สามารถอ่านไฟล์".to_string());
 let app_err = AppError {
 msg: "โหลด config ไม่สำเร็จ".to_string(),
 source: Some(Box::new(io_err)),
 };
 
 // แสดง error chain ทั้งหมด
 println!("=== Error Chain ===");
 let mut current: Option<&dyn Error> = Some(&app_err);
 let mut level = 0;
 
 while let Some(err) = current {
 println!("{}: {}", level, err);
 current = err.source();
 level += 1;
 }
}
```

</RustPlayground>

---

## 3. `Box<dyn Error>` - Dynamic Error

<RustPlayground>

```rust
use std::error::Error;
use std::fs::File;

// Return any error type ด้วย Box<dyn Error>
// ดีสำหรับ prototyping แต่ไม่รู้ type จริงๆ
fn may_fail() -> Result<(), Box<dyn Error>> {
 // io::Error จาก File::open
 let _file = File::open("ไฟล์ที่ไม่มี.txt")?;
 
 // ParseIntError จาก parse
 let _num: i32 = "not a number".parse()?;
 
 Ok(())
}

// Thread-safe version: Box<dyn Error + Send + Sync>
fn thread_safe_error() -> Result<(), Box<dyn Error + Send + Sync>> {
 Err("เกิดข้อผิดพลาดที่ safe กับ threads".into())
}

fn main() {
 // จัดการ error
 match may_fail() {
 Ok(_) => println!("สำเร็จ!"),
 Err(e) => {
 println!("Error: {}", e);
 
 // ตรวจสอบ source
 if let Some(source) = e.source() {
 println!(" ต้นเหตุ: {}", source);
 }
 }
 }
 
 if let Err(e) = thread_safe_error() {
 println!("Thread-safe error: {}", e);
 }
}
```

</RustPlayground>

---

## 4. Error Enum (แนะนำ!)

<RustPlayground>

```rust
use std::error::Error;
use std::fmt;
use std::io;
use std::num::ParseIntError;

// Enum รวม error types ทั้งหมดที่อาจเกิด
#[derive(Debug)]
enum ConfigError {
 IoError(io::Error),
 ParseError(ParseIntError),
 InvalidValue(String),
}

impl fmt::Display for ConfigError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 match self {
 ConfigError::IoError(e) => write!(f, "ข้อผิดพลาด I/O: {}", e),
 ConfigError::ParseError(e) => write!(f, "แปลงตัวเลขไม่ได้: {}", e),
 ConfigError::InvalidValue(s) => write!(f, "ค่าไม่ถูกต้อง: {}", s),
 }
 }
}

impl Error for ConfigError {
 fn source(&self) -> Option<&(dyn Error + 'static)> {
 match self {
 ConfigError::IoError(e) => Some(e),
 ConfigError::ParseError(e) => Some(e),
 ConfigError::InvalidValue(_) => None,
 }
 }
}

// From trait ให้ใช้ ? operator ได้
impl From<io::Error> for ConfigError {
 fn from(err: io::Error) -> Self {
 ConfigError::IoError(err)
 }
}

impl From<ParseIntError> for ConfigError {
 fn from(err: ParseIntError) -> Self {
 ConfigError::ParseError(err)
 }
}

fn read_config() -> Result<i32, ConfigError> {
 // io::Error แปลงเป็น ConfigError อัตโนมัติ
 let content = std::fs::read_to_string("config.txt")?;
 
 // ParseIntError แปลงเป็น ConfigError อัตโนมัติ
 let value: i32 = content.trim().parse()?;
 
 // ตรวจสอบค่าเอง
 if value < 0 {
 return Err(ConfigError::InvalidValue("ค่าต้องไม่ติดลบ".to_string()));
 }
 
 Ok(value)
}

fn main() {
 match read_config() {
 Ok(value) => println!("Config: {}", value),
 Err(e) => {
 println!("{}", e);
 if let Some(source) = e.source() {
 println!(" ต้นเหตุ: {}", source);
 }
 }
 }
}
```

</RustPlayground>

---

## 5. Standard Error Types

<RustPlayground>

```rust
use std::io;
use std::num::ParseIntError;
use std::str::Utf8Error;

fn main() {
 // io::Error - I/O operations
 let io_err: io::Result<()> = Err(io::Error::new(
 io::ErrorKind::NotFound,
 "ไม่พบไฟล์"
 ));
 println!("IO Error: {:?}", io_err);
 
 // io::ErrorKind - ประเภทของ io error
 let kinds = [
 io::ErrorKind::NotFound,
 io::ErrorKind::PermissionDenied,
 io::ErrorKind::ConnectionRefused,
 io::ErrorKind::InvalidInput,
 ];
 println!("\n=== IO Error Kinds ===");
 for kind in kinds {
 println!(" {:?}", kind);
 }
 
 // ParseIntError - parse ตัวเลขไม่ได้
 let parse_err: Result<i32, ParseIntError> = "abc".parse();
 println!("\nParseIntError: {:?}", parse_err);
 
 // Utf8Error - invalid UTF-8
 let bytes = [0xff, 0xfe]; // invalid UTF-8
 let utf8_err = std::str::from_utf8(&bytes);
 println!("Utf8Error: {:?}", utf8_err);
}
```

</RustPlayground>

---

## 6. การใช้ thiserror crate

```rust
// thiserror ช่วยสร้าง Error ง่ายขึ้น!
// เพิ่ม: thiserror = "1" ใน Cargo.toml

use thiserror::Error;

#[derive(Error, Debug)]
enum MyError {
 #[error("ไม่พบข้อมูล: {0}")]
 NotFound(String),
 
 #[error("ไม่มีสิทธิ์เข้าถึง")]
 PermissionDenied,
 
 #[error("ข้อผิดพลาด I/O")]
 IoError(#[from] std::io::Error), // auto From!
 
 #[error("แปลงตัวเลขไม่ได้: {0}")]
 ParseError(#[from] std::num::ParseIntError),
}

fn example() -> Result<(), MyError> {
 let _content = std::fs::read_to_string("file.txt")?; // auto convert!
 let _num: i32 = "abc".parse()?; // auto convert!
 Ok(())
}
```

:::info ต้องเพิ่ม dependency
code ด้านบนต้องเพิ่ม `thiserror = "1"` ใน Cargo.toml
:::

---

## 7. การใช้ anyhow crate

```rust
// anyhow สำหรับ application code (ไม่ใช่ library)
// เพิ่ม: anyhow = "1" ใน Cargo.toml

use anyhow::{Context, Result, bail, anyhow};

fn read_config() -> Result<i32> {
 // context เพิ่มข้อมูล error
 let content = std::fs::read_to_string("config.txt")
 .context("ไม่สามารถอ่านไฟล์ config")?;
 
 let value: i32 = content.trim().parse()
 .context("config ต้องเป็นตัวเลข")?;
 
 // bail! = return Err(...)
 if value < 0 {
 bail!("ค่า config ต้องไม่ติดลบ");
 }
 
 // anyhow! = สร้าง error
 if value > 100 {
 return Err(anyhow!("ค่า config ต้องไม่เกิน 100"));
 }
 
 Ok(value)
}
```

:::info ต้องเพิ่ม dependency
code ด้านบนต้องเพิ่ม `anyhow = "1"` ใน Cargo.toml
:::

---

## Quick Reference

### Error Trait
```rust
pub trait Error: Debug + Display {
 fn source(&self) -> Option<&(dyn Error + 'static)> { None }
}
```

### สร้าง Custom Error
| ขั้นตอน | คำอธิบาย |
|--------|---------|
| 1. `#[derive(Debug)]` | ต้องมี Debug |
| 2. `impl Display` | ข้อความสำหรับผู้ใช้ |
| 3. `impl Error` | อาจ override source() |
| 4. `impl From<E>` | ใช้ ? operator |

### Error Types
| Return Type | ใช้เมื่อ |
|-------------|--------|
| `Result<T, MyError>` | library code (specific) |
| `Result<T, Box<dyn Error>>` | prototyping |
| `anyhow::Result<T>` | application code |

### Crates ช่วย
| Crate | ใช้สำหรับ |
|-------|---------|
| `thiserror` | สร้าง Error (libraries) |
| `anyhow` | จัดการ Error (apps) |

### Common Errors
| Error Type | เกิดจาก |
|------------|--------|
| `io::Error` | File, Network |
| `ParseIntError` | `"abc".parse::<i32>()` |
| `Utf8Error` | Invalid UTF-8 |
| `TryFromIntError` | Number conversion |

---

[← Ptr](./ptr) | [Panic →](./panic)
