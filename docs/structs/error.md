# Error Structs - การจัดการ Errors

`io::Error`, `ParseIntError` และ error types อื่นๆ! 

---

## io::Error

<RustPlayground>

```rust
use std::io::{self, ErrorKind};
use std::fs::File;

fn main() {
 // เกิดจากการ open file ที่ไม่มี
 match File::open("nonexistent.txt") {
 Ok(_) => println!("file opened"),
 Err(e) => {
 println!("error: {}", e);
 println!("kind: {:?}", e.kind());
 }
 }
 
 // สร้าง error เอง
 let custom_error = io::Error::new(
 ErrorKind::NotFound, 
 "custom error message"
 );
 println!("\ncustom: {}", custom_error);
 
 // ตรวจสอบ kind
 match custom_error.kind() {
 ErrorKind::NotFound => println!("not found!"),
 ErrorKind::PermissionDenied => println!("no permission!"),
 _ => println!("other error"),
 }
}
```

</RustPlayground>

---

## Parse Errors

<RustPlayground>

```rust
fn main() {
 // ParseIntError
 let result: Result<i32, _> = "abc".parse();
 match result {
 Ok(n) => println!("parsed: {}", n),
 Err(e) => println!("parse error: {}", e),
 }
 
 // ParseBoolError
 let result: Result<bool, _> = "yes".parse();
 match result {
 Ok(b) => println!("parsed: {}", b),
 Err(e) => println!("parse error: {}", e),
 }
 
 // ParseFloatError
 let result: Result<f64, _> = "3.14.15".parse();
 match result {
 Ok(f) => println!("parsed: {}", f),
 Err(e) => println!("parse error: {}", e),
 }
}
```

</RustPlayground>

---

## Custom Error Type

<RustPlayground>

```rust
use std::fmt;
use std::error::Error;

#[derive(Debug)]
struct MyError {
 message: String,
}

impl fmt::Display for MyError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "MyError: {}", self.message)
 }
}

impl Error for MyError {}

fn might_fail(fail: bool) -> Result<i32, MyError> {
 if fail {
 Err(MyError { message: "something went wrong".to_string() })
 } else {
 Ok(42)
 }
}

fn main() {
 match might_fail(true) {
 Ok(v) => println!("value: {}", v),
 Err(e) => {
 println!("error: {}", e);
 println!("debug: {:?}", e);
 }
 }
}
```

</RustPlayground>

---

## Error Propagation

<RustPlayground>

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file(path: &str) -> Result<String, io::Error> {
 let mut file = File::open(path)?; // ? propagates error
 let mut contents = String::new();
 file.read_to_string(&mut contents)?;
 Ok(contents)
}

fn main() {
 match read_file("/tmp/test.txt") {
 Ok(contents) => println!("contents: {}", contents),
 Err(e) => println!("error: {}", e),
 }
}
```

</RustPlayground>

---

## Quick Reference

### Common Error Types
| Type | มาจาก |
|------|------|
| `io::Error` | File, Network operations |
| `ParseIntError` | `"abc".parse::<i32>()` |
| `ParseFloatError` | `"abc".parse::<f64>()` |
| `ParseBoolError` | `"abc".parse::<bool>()` |
| `Utf8Error` | String conversion |
| `TryFromIntError` | Integer conversion |

### Error Kinds (io::ErrorKind)
| Kind | คำอธิบาย |
|------|---------|
| `NotFound` | ไม่พบไฟล์ |
| `PermissionDenied` | ไม่มีสิทธิ์ |
| `AlreadyExists` | มีอยู่แล้ว |
| `InvalidInput` | input ไม่ถูกต้อง |
| `TimedOut` | หมดเวลา |
| `Interrupted` | ถูก interrupt |

---

[← Channel](./channel) | [กลับ Index →](./index)
