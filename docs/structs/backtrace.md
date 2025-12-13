# Backtrace (std::backtrace)

Types สำหรับ Stack Trace และ Debugging! 

---

## Backtrace

จับ Stack Trace สำหรับ debugging

<RustPlayground>

```rust
use std::backtrace::Backtrace;

fn deep_function() {
 let bt = Backtrace::capture();
 println!("Backtrace:\n{}", bt);
}

fn middle_function() {
 deep_function();
}

fn outer_function() {
 middle_function();
}

fn main() {
 // ต้อง set RUST_BACKTRACE=1 เพื่อเห็น backtrace
 outer_function();
}
```

</RustPlayground>

---

## Backtrace ใน Errors

<RustPlayground>

```rust
use std::backtrace::Backtrace;
use std::fmt;

#[derive(Debug)]
struct MyError {
 message: String,
 backtrace: Backtrace,
}

impl MyError {
 fn new(msg: &str) -> Self {
 MyError {
 message: msg.to_string(),
 backtrace: Backtrace::capture(),
 }
 }
}

impl fmt::Display for MyError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "{}\n\nBacktrace:\n{}", self.message, self.backtrace)
 }
}

fn problematic_function() -> Result<(), MyError> {
 Err(MyError::new("Something went wrong"))
}

fn main() {
 if let Err(e) = problematic_function() {
 eprintln!("Error: {}", e);
 }
}
```

</RustPlayground>

---

## BacktraceStatus

<RustPlayground>

```rust
use std::backtrace::{Backtrace, BacktraceStatus};

fn main() {
 let bt = Backtrace::capture();
 
 match bt.status() {
 BacktraceStatus::Captured => {
 println!("Backtrace captured!");
 println!("{}", bt);
 }
 BacktraceStatus::Disabled => {
 println!("Backtrace disabled.");
 println!("Set RUST_BACKTRACE=1 to enable.");
 }
 BacktraceStatus::Unsupported => {
 println!("Backtrace not supported.");
 }
 _ => println!("Unknown status"),
 }
}
```

</RustPlayground>

---

## Force Capture

<RustPlayground>

```rust
use std::backtrace::Backtrace;

fn main() {
 // force_capture: จับเสมอ ไม่ว่า RUST_BACKTRACE จะเป็นอะไร
 let bt = Backtrace::force_capture();
 
 println!("Forced backtrace:");
 println!("{}", bt);
}
```

</RustPlayground>

---

## Quick Reference

| Method | คำอธิบาย |
|--------|---------|
| `capture()` | จับ backtrace (ถ้าเปิด) |
| `force_capture()` | บังคับจับเสมอ |
| `status()` | ดูสถานะ |
| `disabled()` | สร้าง disabled backtrace |

---

## Environment Variables

```bash
# เปิด backtrace
export RUST_BACKTRACE=1

# แสดง full backtrace
export RUST_BACKTRACE=full
```

---

[← Lazy](/structs/lazy) | [Index →](/structs/)
