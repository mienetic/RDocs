# Panic Functions (std::panic)

Functions สำหรับจัดการ Panic! 

---

## catch_unwind

จับ panic และแปลงเป็น Result

<RustPlayground>

```rust
use std::panic;

fn main() {
 // catch_unwind จับ panic
 let result = panic::catch_unwind(|| {
 println!("About to panic!");
 panic!("Oh no!");
 });
 
 match result {
 Ok(_) => println!("No panic"),
 Err(e) => {
 println!("Caught panic!");
 if let Some(s) = e.downcast_ref::<&str>() {
 println!("Panic message: {}", s);
 }
 }
 }
 
 println!("Program continues after panic!");
}
```

</RustPlayground>

---

## resume_unwind

ส่งต่อ panic ที่จับไว้

<RustPlayground>

```rust
use std::panic;

fn main() {
 let result = panic::catch_unwind(|| {
 panic!("Inner panic!");
 });
 
 match result {
 Ok(_) => println!("No panic"),
 Err(e) => {
 println!("Caught panic, logging...");
 // ทำ logging หรือ cleanup
 
 // ส่ง panic ต่อ
 // panic::resume_unwind(e); // Uncomment to re-panic
 }
 }
 
 println!("Done");
}
```

</RustPlayground>

---

## set_hook

ตั้ง Custom Panic Handler

<RustPlayground>

```rust
use std::panic;

fn main() {
 // ตั้ง custom panic hook
 panic::set_hook(Box::new(|info| {
 println!("Custom panic handler!");
 if let Some(location) = info.location() {
 println!("Panic at {}:{}", 
 location.file(), 
 location.line()
 );
 }
 if let Some(s) = info.payload().downcast_ref::<&str>() {
 println!("Message: {}", s);
 }
 }));
 
 // ทดสอบ hook (ใน production จะรัน panic จริง)
 println!("Hook set successfully!");
 
 // panic!("Test panic"); // Uncomment to test
}
```

</RustPlayground>

---

## take_hook

ดึง Panic Hook ปัจจุบันออก

<RustPlayground>

```rust
use std::panic;

fn main() {
 // ตั้ง hook ของเรา
 panic::set_hook(Box::new(|_| {
 println!("Custom hook");
 }));
 
 // ดึง hook ออก
 let old_hook = panic::take_hook();
 
 println!("Hook taken!");
 
 // ตอนนี้ใช้ default hook แล้ว
 // สามารถเรียก old_hook manually ได้
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `catch_unwind(f)` | จับ panic | `Result<R, Box<dyn Any>>` |
| `resume_unwind(e)` | ส่ง panic ต่อ | `!` |
| `set_hook(hook)` | ตั้ง handler | `()` |
| `take_hook()` | ดึง hook ออก | `Box<dyn Fn>` |
| `Location::caller()` | ตำแหน่ง panic | `&Location` |

---

[← Iterator](./iter) | [Any →](./any)
