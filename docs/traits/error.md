# Error Trait

`Error` trait มาตรฐานสำหรับการจัดการ Error ใน Rust! 

---

## The Error Trait

`std::error::Error` เป็น trait ที่ใช้ระบุว่า type นี้เป็น Error

<RustPlayground>

```rust
use std::fmt;
use std::error::Error;

#[derive(Debug)]
struct CustomError {
 details: String,
}

impl CustomError {
 fn new(msg: &str) -> CustomError {
 CustomError { details: msg.to_string() }
 }
}

// 1. ต้องมี Display
impl fmt::Display for CustomError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "CustomError: {}", self.details)
 }
}

// 2. Implement Error (ปกติไม่ต้องมี body ก็ได้)
impl Error for CustomError {
 fn description(&self) -> &str {
 &self.details
 }
}

fn make_error() -> Result<(), CustomError> {
 Err(CustomError::new("Something went wrong"))
}

fn main() {
 match make_error() {
 Ok(_) => println!("Success!"),
 Err(e) => {
 println!("Error found: {}", e);
 println!("Debug info: {:?}", e);
 }
 }
}
```

</RustPlayground>

---

## Boxing Errors

การใช้ `Box<dyn Error>` เพื่อ return error หลายรูปแบบ

<RustPlayground>

```rust
use std::error::Error;
use std::fmt;

#[derive(Debug)]
struct ErrorA;
impl fmt::Display for ErrorA {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { write!(f, "Error A") }
}
impl Error for ErrorA {}

#[derive(Debug)]
struct ErrorB;
impl fmt::Display for ErrorB {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { write!(f, "Error B") }
}
impl Error for ErrorB {}

// Return trait object
fn perform_task(variant: i32) -> Result<(), Box<dyn Error>> {
 if variant == 1 {
 Err(Box::new(ErrorA))
 } else {
 Err(Box::new(ErrorB))
 }
}

fn main() {
 if let Err(e) = perform_task(1) {
 println!("Got error: {}", e);
 }
}
```

</RustPlayground>

---

## Quick Reference

### Error Trait
| Trait | Requirement | คำอธิบาย |
|-------|-------------|---------|
| `Error` | `Debug` + `Display` | Base trait สำหรับ errors |
| `source()` | - | สำหรับ Chain errors (Lower level error) |

---

[← Future](./future) | [Any →](./any)
