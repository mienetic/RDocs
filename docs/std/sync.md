# Sync - ซิงค์ข้อมูลระหว่าง Threads

**std::sync** มี primitives สำหรับแชร์ข้อมูลระหว่าง threads อย่างปลอดภัย! 

---

## sync มีอะไร?

| Type | ใช้ทำอะไร |
|------|---------|
| `Arc<T>` | แชร์ ownership ระหว่าง threads |
| `Mutex<T>` | exclusive access (ทีละ thread) |
| `RwLock<T>` | หลาย readers หรือ 1 writer |
| `mpsc` | channels สำหรับส่งข้อมูล |
| `Barrier` | รอให้ทุก thread มาถึง |
| `Condvar` | condition variable |

---

## 1. Arc - Atomic Reference Count

<RustPlayground>

```rust
use std::sync::Arc;
use std::thread;

fn main() {
 // Arc - แชร์ ownership ระหว่าง threads
 let data = Arc::new(vec![1, 2, 3, 4, 5]);
 let mut handles = vec![];
 
 for i in 0..3 {
 // clone Arc (ไม่ clone ข้อมูล แค่เพิ่ม reference count)
 let data_clone = Arc::clone(&data);
 
 let handle = thread::spawn(move || {
 println!("Thread {} sees: {:?}", i, data_clone);
 });
 handles.push(handle);
 }
 
 for h in handles {
 h.join().unwrap();
 }
 
 // Arc ยังใช้ได้ใน main
 println!("Main sees: {:?}", data);
 println!("Strong count: {}", Arc::strong_count(&data));
}
```

</RustPlayground>

---

## 2. Mutex - Mutual Exclusion

<RustPlayground>

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
 // Mutex - ทีละ thread เท่านั้นที่เข้าถึงได้
 let counter = Arc::new(Mutex::new(0));
 let mut handles = vec![];
 
 for _ in 0..10 {
 let counter = Arc::clone(&counter);
 let handle = thread::spawn(move || {
 // lock() - ได้ MutexGuard
 let mut num = counter.lock().unwrap();
 *num += 1;
 // ปลดล็อคอัตโนมัติเมื่อ guard หมด scope
 });
 handles.push(handle);
 }
 
 for h in handles {
 h.join().unwrap();
 }
 
 println!("Final count: {}", *counter.lock().unwrap());
}
```

</RustPlayground>

---

## 3. Mutex Poisoning

<RustPlayground>

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
 let data = Arc::new(Mutex::new(vec![1, 2, 3]));
 let data2 = Arc::clone(&data);
 
 // Thread ที่ panic ขณะถือ lock
 let handle = thread::spawn(move || {
 let _guard = data2.lock().unwrap();
 panic!("Oops!"); // Mutex becomes poisoned
 });
 
 let _ = handle.join(); // Thread panicked
 
 // lock() จะ return Err ถ้า poisoned
 match data.lock() {
 Ok(guard) => println!("Data: {:?}", *guard),
 Err(poisoned) => {
 println!("Mutex was poisoned!");
 // ยังสามารถ recover ได้
 let guard = poisoned.into_inner();
 println!("Recovered data: {:?}", *guard);
 }
 }
}
```

</RustPlayground>

---

## 4. RwLock - Read/Write Lock

<RustPlayground>

```rust
use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
 // RwLock - หลาย readers หรือ 1 writer
 let data = Arc::new(RwLock::new(5));
 
 let mut handles = vec![];
 
 // หลาย readers พร้อมกัน
 for i in 0..3 {
 let data = Arc::clone(&data);
 handles.push(thread::spawn(move || {
 let r = data.read().unwrap();
 println!("Reader {}: {}", i, *r);
 }));
 }
 
 // Writer - exclusive
 let data_w = Arc::clone(&data);
 handles.push(thread::spawn(move || {
 let mut w = data_w.write().unwrap();
 *w += 10;
 println!("Writer updated to: {}", *w);
 }));
 
 for h in handles {
 h.join().unwrap();
 }
 
 println!("Final: {}", *data.read().unwrap());
}
```

</RustPlayground>

---

## 5. Channels (mpsc)

<RustPlayground>

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
 // mpsc = multiple producer, single consumer
 let (tx, rx) = mpsc::channel();
 
 // Producer thread
 let tx1 = tx.clone();
 thread::spawn(move || {
 let messages = vec!["hi", "from", "thread"];
 for msg in messages {
 tx1.send(msg).unwrap();
 thread::sleep(Duration::from_millis(100));
 }
 });
 
 // Another producer
 thread::spawn(move || {
 tx.send("another sender").unwrap();
 });
 
 // Consumer (main thread)
 println!("=== Received ===");
 for received in rx {
 println!("{}", received);
 }
}
```

</RustPlayground>

---

## 6. sync_channel (bounded)

<RustPlayground>

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
 // sync_channel - bounded channel (มี capacity)
 let (tx, rx) = mpsc::sync_channel(2); // capacity = 2
 
 thread::spawn(move || {
 for i in 1..=5 {
 println!("Sending: {}", i);
 tx.send(i).unwrap();
 println!("Sent: {}", i);
 }
 });
 
 thread::sleep(std::time::Duration::from_millis(500));
 
 // รับข้อความ
 for msg in rx {
 println!("Received: {}", msg);
 }
}
```

</RustPlayground>

---

## 7. Barrier

<RustPlayground>

```rust
use std::sync::{Arc, Barrier};
use std::thread;

fn main() {
 // Barrier - รอให้ทุก thread มาถึง
 let barrier = Arc::new(Barrier::new(3));
 let mut handles = vec![];
 
 for i in 0..3 {
 let b = Arc::clone(&barrier);
 handles.push(thread::spawn(move || {
 println!("Thread {} before barrier", i);
 
 // รอที่ barrier จนกว่าทุก thread จะมาถึง
 b.wait();
 
 println!("Thread {} after barrier", i);
 }));
 }
 
 for h in handles {
 h.join().unwrap();
 }
}
```

</RustPlayground>

---

## 8. Once

<RustPlayground>

```rust
use std::sync::Once;

static INIT: Once = Once::new();
static mut DATA: Option<String> = None;

fn get_data() -> &'static str {
 // call_once - รันแค่ครั้งเดียว
 INIT.call_once(|| {
 println!("Initializing...");
 unsafe {
 DATA = Some("Initialized!".to_string());
 }
 });
 
 unsafe {
 DATA.as_ref().unwrap()
 }
}

fn main() {
 // เรียกหลายครั้ง แต่ init แค่ครั้งเดียว
 println!("1: {}", get_data());
 println!("2: {}", get_data());
 println!("3: {}", get_data());
 
 // ดูสถานะ
 println!("is_completed: {}", INIT.is_completed());
}
```

</RustPlayground>

---

## Quick Reference

### Sharing
| Type | คำอธิบาย |
|------|---------|
| `Arc<T>` | Thread-safe Rc |
| `Mutex<T>` | Exclusive lock |
| `RwLock<T>` | Multiple readers / 1 writer |

### Mutex/RwLock
| Method | คำอธิบาย |
|--------|---------|
| `lock()` | Exclusive access |
| `try_lock()` | Non-blocking lock |
| `read()` | Read lock (RwLock) |
| `write()` | Write lock (RwLock) |

### Channels
| Function | คำอธิบาย |
|----------|---------|
| `channel()` | Unbounded channel |
| `sync_channel(n)` | Bounded (capacity n) |
| `tx.send(v)` | ส่งข้อมูล |
| `rx.recv()` | รับ (blocking) |
| `rx.try_recv()` | รับ (non-blocking) |

### Synchronization
| Type | คำอธิบาย |
|------|---------|
| `Barrier` | รอทุก thread |
| `Once` | ทำครั้งเดียว |
| `Condvar` | Condition variable |

---

[← Thread](./thread) | [Cell →](./cell)
