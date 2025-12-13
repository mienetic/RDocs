# Sync Structs - Synchronization

`Mutex`, `RwLock`, `Condvar`, `Barrier` สำหรับ thread synchronization! 

---

## Mutex - Mutual Exclusion

::: pitfall
**ระวัง Deadlock!**
การเรียก `.lock()` ซ้ำใน Thread เดิมจะทำให้โปรแกรมค้าง (Deadlock) ทันที! ควรใช้ scope `{}` เพื่อปลด lock เมื่อเสร็จงาน
:::

<RustPlayground>

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
 let counter = Arc::new(Mutex::new(0));
 let mut handles = vec![];
 
 for _ in 0..10 {
 let counter = Arc::clone(&counter);
 let handle = thread::spawn(move || {
 let mut num = counter.lock().unwrap();
 *num += 1;
 });
 handles.push(handle);
 }
 
 for handle in handles {
 handle.join().unwrap();
 }
 
 println!("Result: {}", *counter.lock().unwrap());
}
```

</RustPlayground>

---

## RwLock - Read-Write Lock

::: observation
**เหมาะกับงานที่อ่านเยอะๆ**
ถ้างานส่วนใหญ่เป็นการ "อ่าน" (90%+) `RwLock` จะเร็วกว่า `Mutex` มาก แต่ถ้ารุมเขียนเยอะๆ อาจจะช้ากว่า
:::

<RustPlayground>

```rust
use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
 let data = Arc::new(RwLock::new(vec![1, 2, 3]));
 let mut handles = vec![];
 
 // หลาย readers พร้อมกันได้
 for i in 0..3 {
 let data = Arc::clone(&data);
 handles.push(thread::spawn(move || {
 let read = data.read().unwrap();
 println!("reader {}: {:?}", i, *read);
 }));
 }
 
 // writer ต้องรอ exclusive
 {
 let data = Arc::clone(&data);
 handles.push(thread::spawn(move || {
 let mut write = data.write().unwrap();
 write.push(4);
 println!("writer: {:?}", *write);
 }));
 }
 
 for handle in handles {
 handle.join().unwrap();
 }
 
 println!("final: {:?}", *data.read().unwrap());
}
```

</RustPlayground>

---

## Barrier - Wait for All Threads

<RustPlayground>

```rust
use std::sync::{Arc, Barrier};
use std::thread;

fn main() {
 let barrier = Arc::new(Barrier::new(3));
 let mut handles = vec![];
 
 for i in 0..3 {
 let barrier = Arc::clone(&barrier);
 handles.push(thread::spawn(move || {
 println!("thread {} before barrier", i);
 
 // รอจนทุก thread มาถึง
 barrier.wait();
 
 println!("thread {} after barrier", i);
 }));
 }
 
 for handle in handles {
 handle.join().unwrap();
 }
}
```

</RustPlayground>

---

## Once - One-time Initialization

<RustPlayground>

```rust
use std::sync::Once;

static INIT: Once = Once::new();
static mut CONFIG: Option<String> = None;

fn get_config() -> &'static str {
 INIT.call_once(|| {
 println!("initializing config...");
 unsafe {
 CONFIG = Some(String::from("production"));
 }
 });
 
 unsafe { CONFIG.as_ref().unwrap() }
}

fn main() {
 println!("first call: {}", get_config());
 println!("second call: {}", get_config()); // ไม่ initialize อีก
 println!("third call: {}", get_config());
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | Use case |
|------|----------|
| `Mutex<T>` | Exclusive access |
| `RwLock<T>` | Many readers, one writer |
| `Barrier` | Wait for all threads |
| `Condvar` | Condition variable |
| `Once` | One-time init |

### เปรียบเทียบ
| Feature | Mutex | RwLock |
|---------|-------|--------|
| Readers | 1 | Many |
| Writers | 1 | 1 |
| Overhead | Lower | Higher |
| Use case | General | Read-heavy |

---

[← I/O](./io) | [กลับ Index →](./index)
