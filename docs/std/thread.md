# Thread - หลาย Thread

**std::thread** สำหรับรันโค้ดพร้อมกันหลาย threads! 

---

## thread คืออะไร?

Thread คือการรันโค้ดหลายส่วนพร้อมกัน:
- **Main thread** - thread หลักที่โปรแกรมเริ่ม
- **Spawned threads** - threads ที่สร้างขึ้นมา

:::warning ข้อควรระวัง
- Threads แชร์ memory ต้องระวังเรื่อง data races
- ใช้ `Arc` สำหรับ share ownership
- ใช้ `Mutex` สำหรับ mutable access
:::

---

## 1. spawn Thread

<RustPlayground>

```rust
use std::thread;
use std::time::Duration;

fn main() {
 // spawn - สร้าง thread ใหม่
 let handle = thread::spawn(|| {
 for i in 1..5 {
 println!("Thread ลูก: {}", i);
 thread::sleep(Duration::from_millis(100));
 }
 });
 
 // Main thread ทำงานต่อ
 for i in 1..3 {
 println!("Main thread: {}", i);
 thread::sleep(Duration::from_millis(150));
 }
 
 // join - รอให้ thread จบ
 handle.join().expect("Thread panicked!");
 println!("ทุก thread จบแล้ว!");
}
```

</RustPlayground>

---

## 2. Move Ownership ไป Thread

<RustPlayground>

```rust
use std::thread;

fn main() {
 let data = vec![1, 2, 3, 4, 5];
 
 // move - ย้าย ownership เข้า thread
 let handle = thread::spawn(move || {
 println!("Thread ได้รับ data: {:?}", data);
 // data เป็นของ thread นี้แล้ว
 let sum: i32 = data.iter().sum();
 sum // return ค่าออกจาก thread
 });
 
 // data ใช้ไม่ได้แล้วตรงนี้!
 // println!("{:?}", data); // Error!
 
 // รับค่าจาก thread
 let result = handle.join().expect("Thread failed");
 println!("ผลรวมจาก thread: {}", result);
}
```

</RustPlayground>

---

## 3. หลาย Threads

<RustPlayground>

```rust
use std::thread;

fn main() {
 let mut handles = vec![];
 
 // สร้างหลาย threads
 for i in 0..5 {
 let handle = thread::spawn(move || {
 println!("Thread {} กำลังทำงาน", i);
 i * i // return i^2
 });
 handles.push(handle);
 }
 
 // รอทุก thread และเก็บผลลัพธ์
 let results: Vec<i32> = handles
 .into_iter()
 .map(|h| h.join().unwrap())
 .collect();
 
 println!("ผลลัพธ์: {:?}", results);
}
```

</RustPlayground>

---

## 4. Thread Info

<RustPlayground>

```rust
use std::thread;
use std::time::Duration;

fn main() {
 // current - thread ปัจจุบัน
 let current = thread::current();
 println!("Main thread: {:?}", current.id());
 
 // ตั้งชื่อ thread
 let builder = thread::Builder::new()
 .name("worker".to_string())
 .stack_size(32 * 1024); // 32 KB stack
 
 let handle = builder.spawn(|| {
 let me = thread::current();
 println!("Thread name: {:?}", me.name());
 println!("Thread id: {:?}", me.id());
 }).unwrap();
 
 handle.join().unwrap();
 
 // available_parallelism - จำนวน cores
 match thread::available_parallelism() {
 Ok(n) => println!("\nAvailable cores: {}", n),
 Err(e) => println!("Cannot determine: {}", e),
 }
}
```

</RustPlayground>

---

## 5. Scoped Threads (Rust 1.63+)

<RustPlayground>

```rust
use std::thread;

fn main() {
 let data = vec![1, 2, 3, 4, 5];
 let mut results = Vec::new();
 
 // scope - threads ที่จบก่อนออกจาก scope
 thread::scope(|s| {
 // สามารถยืม data ได้! (ไม่ต้อง move)
 s.spawn(|| {
 println!("Thread 1 sees: {:?}", data);
 });
 
 s.spawn(|| {
 println!("Thread 2 sees: {:?}", data);
 });
 
 // ยังแก้ไข results จาก main thread ได้
 results.push(42);
 }); // รอทุก thread จบก่อนออกจาก scope
 
 // data และ results ยังใช้ได้!
 println!("data: {:?}", data);
 println!("results: {:?}", results);
}
```

</RustPlayground>

---

## 6. Thread Sleep และ Yield

<RustPlayground>

```rust
use std::thread;
use std::time::Duration;

fn main() {
 // sleep - หยุดพัก
 println!("Sleeping for 100ms...");
 thread::sleep(Duration::from_millis(100));
 println!("Woke up!");
 
 // yield_now - ให้ threads อื่นทำงาน
 let handle = thread::spawn(|| {
 for i in 0..3 {
 println!("Worker: {}", i);
 thread::yield_now(); // ให้ thread อื่นทำงาน
 }
 });
 
 for i in 0..3 {
 println!("Main: {}", i);
 thread::yield_now();
 }
 
 handle.join().unwrap();
 
 // park / unpark - รอ signal
 let parked = thread::spawn(|| {
 thread::park(); // รอจนกว่าจะ unpark
 println!("Thread was unparked!");
 });
 
 thread::sleep(Duration::from_millis(100));
 parked.thread().unpark(); // ปลุก thread
 parked.join().unwrap();
}
```

</RustPlayground>

---

## 7. Handle Panics

<RustPlayground>

```rust
use std::thread;

fn main() {
 // Thread panic ไม่ทำให้โปรแกรมล่ม
 let handle = thread::spawn(|| {
 panic!("Thread crashed!");
 });
 
 // join จะ return Err ถ้า thread panic
 match handle.join() {
 Ok(_) => println!("Thread finished normally"),
 Err(e) => {
 println!("Thread panicked!");
 // พยายามดึง panic message
 if let Some(s) = e.downcast_ref::<&str>() {
 println!("Panic message: {}", s);
 }
 }
 }
 
 println!("Main thread continues!");
 
 // catch_unwind ภายใน thread
 let safe_handle = thread::spawn(|| {
 std::panic::catch_unwind(|| {
 panic!("Caught panic!");
 }).ok();
 "Thread survived"
 });
 
 let result = safe_handle.join().unwrap();
 println!("Result: {}", result);
}
```

</RustPlayground>

---

## Quick Reference

### สร้าง Thread
| Method | คำอธิบาย |
|--------|---------|
| `thread::spawn(f)` | สร้าง thread |
| `thread::scope(f)` | scoped threads |
| `Builder::new()` | ตั้งค่าก่อนสร้าง |
| `.name(s)` | ตั้งชื่อ |
| `.stack_size(n)` | กำหนด stack |

### JoinHandle
| Method | คำอธิบาย |
|--------|---------|
| `join()` | รอให้จบ |
| `thread()` | ได้ Thread reference |
| `is_finished()` | จบแล้วไหม |

### Thread Control
| Method | คำอธิบาย |
|--------|---------|
| `sleep(d)` | หยุดพัก |
| `yield_now()` | ให้ thread อื่น |
| `park()` | รอ signal |
| `unpark()` | ปลุก thread |
| `current()` | thread ปัจจุบัน |

### Thread Info
| Method | คำอธิบาย |
|--------|---------|
| `.id()` | Thread ID |
| `.name()` | ชื่อ thread |
| `available_parallelism()` | จำนวน cores |

---

[← Time](./time) | [Sync →](./sync)
