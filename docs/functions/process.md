# Process Functions (std::process)

Functions สำหรับจัดการ Process! 

---

## exit

ออกจาก Process ทันที

<RustPlayground>

```rust
use std::process;

fn main() {
 println!("Starting...");
 
 let success = true;
 
 if success {
 println!("Done!");
 process::exit(0); // Exit code 0 = success
 } else {
 eprintln!("Error occurred!");
 process::exit(1); // Exit code != 0 = error
 }
 
 // โค้ดด้านล่างนี้จะไม่ถูกเรียก
 println!("This won't print");
}
```

</RustPlayground>

---

## abort

ยกเลิก Process แบบทันที (ไม่รัน destructors)

<RustPlayground>

```rust
use std::process;

fn main() {
 println!("About to abort...");
 
 // abort() หยุดทันที ไม่รัน Drop
 // ใช้เมื่อเจอ unrecoverable error
 
 // process::abort(); // Uncomment เพื่อทดสอบ
 
 println!("Program continues...");
}
```

</RustPlayground>

---

## id

ดึง Process ID ปัจจุบัน

<RustPlayground>

```rust
use std::process;

fn main() {
 let pid = process::id();
 println!("Process ID: {}", pid);
}
```

</RustPlayground>

---

## Command

สร้างและรัน External Process

<RustPlayground>

```rust
use std::process::Command;

fn main() {
 // รัน command และดึง output
 let output = Command::new("echo")
 .arg("Hello from Rust!")
 .output()
 .expect("Failed to execute");
 
 println!("stdout: {}", String::from_utf8_lossy(&output.stdout));
 println!("Exit code: {:?}", output.status.code());
}
```

</RustPlayground>

---

## Quick Reference

| Function/Type | คำอธิบาย | Return Type |
|---------------|---------|-------------|
| `exit(code)` | ออกจาก process | `!` (never returns) |
| `abort()` | ยกเลิกทันที | `!` |
| `id()` | Process ID | `u32` |
| `Command::new(prog)` | สร้าง command | `Command` |

---

[← I/O](./io) | [Pointer →](./ptr)
