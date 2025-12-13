# Thread Functions (std::thread)

Functions สำหรับจัดการ Threads! 

---

## spawn

สร้าง Thread ใหม่

<RustPlayground>

```rust
use std::thread;
use std::time::Duration;

fn main() {
 // สร้าง thread ใหม่
 let handle = thread::spawn(|| {
 for i in 1..5 {
 println!("Thread: {}", i);
 thread::sleep(Duration::from_millis(100));
 }
 42 // Return value
 });
 
 // Main thread ทำงานต่อ
 for i in 1..3 {
 println!("Main: {}", i);
 thread::sleep(Duration::from_millis(150));
 }
 
 // รอ thread จบและรับค่า
 let result = handle.join().unwrap();
 println!("Thread returned: {}", result);
}
```

</RustPlayground>

---

## sleep

หยุดพัก Thread

<RustPlayground>

```rust
use std::thread;
use std::time::{Duration, Instant};

fn main() {
 let start = Instant::now();
 
 println!("Sleeping for 500ms...");
 thread::sleep(Duration::from_millis(500));
 
 println!("Slept for {:?}", start.elapsed());
}
```

</RustPlayground>

---

## current

ดึงข้อมูล Thread ปัจจุบัน

<RustPlayground>

```rust
use std::thread;

fn main() {
 let current = thread::current();
 
 println!("Thread name: {:?}", current.name());
 println!("Thread id: {:?}", current.id());
 
 // สร้าง thread พร้อมตั้งชื่อ
 let handle = thread::Builder::new()
 .name("worker".to_string())
 .spawn(|| {
 let me = thread::current();
 println!("Worker thread: {:?}", me.name());
 })
 .unwrap();
 
 handle.join().unwrap();
}
```

</RustPlayground>

---

## yield_now

บอก OS ให้สลับไป thread อื่น

<RustPlayground>

```rust
use std::thread;

fn main() {
 let handle = thread::spawn(|| {
 for i in 0..3 {
 println!("Thread A: {}", i);
 thread::yield_now(); // ให้ thread อื่นทำงาน
 }
 });
 
 for i in 0..3 {
 println!("Main: {}", i);
 thread::yield_now();
 }
 
 handle.join().unwrap();
}
```

</RustPlayground>

---

## available_parallelism

ดูจำนวน CPU cores ที่ใช้ได้

<RustPlayground>

```rust
use std::thread;

fn main() {
 match thread::available_parallelism() {
 Ok(count) => println!("Available parallelism: {}", count),
 Err(e) => println!("Could not determine: {}", e),
 }
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `spawn(f)` | สร้าง thread | `JoinHandle<T>` |
| `sleep(dur)` | หยุดพัก | `()` |
| `current()` | Thread ปัจจุบัน | `Thread` |
| `yield_now()` | ให้ thread อื่นทำงาน | `()` |
| `park()` | พัก thread | `()` |
| `unpark()` | ปลุก parked thread | `()` |
| `available_parallelism()` | จำนวน cores | `Result<NonZero>` |
| `scope(f)` | Scoped threads | `R` |

---

[← Environment](./env) | [Compare →](./cmp)
