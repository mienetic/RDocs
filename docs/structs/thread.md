# Thread Structs - Threading

`JoinHandle`, `Thread`, `ThreadId` สำหรับ multi-threading! 

---

## thread::spawn + JoinHandle

<RustPlayground>

```rust
use std::thread;
use std::time::Duration;

fn main() {
 // สร้าง thread
 let handle = thread::spawn(|| {
 for i in 1..5 {
 println!("spawned thread: {}", i);
 thread::sleep(Duration::from_millis(100));
 }
 42 // return value
 });
 
 // main thread ทำงานต่อ
 for i in 1..3 {
 println!("main thread: {}", i);
 thread::sleep(Duration::from_millis(150));
 }
 
 // รอ thread เสร็จ
 let result = handle.join().unwrap();
 println!("thread returned: {}", result);
}
```

</RustPlayground>

---

## Thread Info

<RustPlayground>

```rust
use std::thread;

fn main() {
 // current thread
 let current = thread::current();
 println!("current thread:");
 println!(" name: {:?}", current.name());
 println!(" id: {:?}", current.id());
 
 // สร้าง thread พร้อมตั้งชื่อ
 let handle = thread::Builder::new()
 .name("worker".to_string())
 .spawn(|| {
 let t = thread::current();
 println!("\nworker thread:");
 println!(" name: {:?}", t.name());
 println!(" id: {:?}", t.id());
 })
 .unwrap();
 
 handle.join().unwrap();
}
```

</RustPlayground>

---

## Move Data to Thread

<RustPlayground>

```rust
use std::thread;

fn main() {
 let data = vec![1, 2, 3, 4, 5];
 
 // move ย้าย ownership ไปยัง thread
 let handle = thread::spawn(move || {
 println!("data in thread: {:?}", data);
 data.iter().sum::<i32>()
 });
 
 // data ไม่สามารถใช้ที่นี่ได้แล้ว
 // println!("{:?}", data); // ERROR!
 
 let sum = handle.join().unwrap();
 println!("sum = {}", sum);
}
```

</RustPlayground>

---

## Multiple Threads

<RustPlayground>

```rust
use std::thread;
use std::sync::Arc;

fn main() {
 let data = Arc::new(vec![1, 2, 3, 4, 5]);
 let mut handles = vec![];
 
 for i in 0..3 {
 let data = Arc::clone(&data);
 let handle = thread::spawn(move || {
 let sum: i32 = data.iter().sum();
 println!("thread {}: sum = {}", i, sum);
 });
 handles.push(handle);
 }
 
 for handle in handles {
 handle.join().unwrap();
 }
 
 println!("all threads done!");
}
```

</RustPlayground>

---

## Quick Reference

| Type | คำอธิบาย |
|------|---------|
| `JoinHandle<T>` | Handle สำหรับรอ thread |
| `Thread` | ข้อมูล thread |
| `ThreadId` | ID ของ thread |

### Functions
| Function | คำอธิบาย |
|----------|---------|
| `thread::spawn(f)` | สร้าง thread |
| `thread::current()` | thread ปัจจุบัน |
| `thread::sleep(d)` | หยุดรอ |
| `thread::park()` | พัก thread |

### JoinHandle Methods
| Method | คำอธิบาย |
|--------|---------|
| `join()` | รอ thread เสร็จ |
| `thread()` | ดูข้อมูล thread |
| `is_finished()` | เสร็จหรือยัง |

---

[← Net](./net) | [กลับ Index →](./index)
