# Concurrency Traits

`Send`, `Sync` สำหรับ thread safety! 

---

## Send - ส่งข้าม threads

<RustPlayground>

```rust
use std::thread;

fn main() {
 let data = vec![1, 2, 3, 4, 5];
 
 // Vec<i32> is Send, สามารถย้ายเข้า thread ได้
 let handle = thread::spawn(move || {
 let sum: i32 = data.iter().sum();
 println!("Sum in thread: {}", sum);
 sum
 });
 
 let result = handle.join().unwrap();
 println!("Result: {}", result);
 
 // String is Send
 let msg = String::from("Hello from main");
 let handle2 = thread::spawn(move || {
 println!("{}", msg);
 });
 handle2.join().unwrap();
}
```

</RustPlayground>

---

## Sync - Share ข้าม threads

<RustPlayground>

```rust
use std::sync::Arc;
use std::thread;

fn main() {
 // Arc<T> is Sync if T is Sync
 let data = Arc::new(vec![1, 2, 3, 4, 5]);
 
 let mut handles = vec![];
 
 for i in 0..3 {
 let data_clone = Arc::clone(&data);
 let handle = thread::spawn(move || {
 let sum: i32 = data_clone.iter().sum();
 println!("Thread {}: sum = {}", i, sum);
 });
 handles.push(handle);
 }
 
 for handle in handles {
 handle.join().unwrap();
 }
 
 println!("All threads done, data: {:?}", data);
}
```

</RustPlayground>

---

## Not Send / Not Sync

<RustPlayground>

```rust
use std::rc::Rc;
use std::cell::RefCell;

fn main() {
 // Rc is NOT Send - ใช้ได้แค่ใน thread เดียว
 let rc = Rc::new(42);
 println!("Rc value: {}", rc);
 
 // RefCell is NOT Sync - ไม่ปลอดภัยสำหรับ shared reference
 let cell = RefCell::new(10);
 *cell.borrow_mut() += 5;
 println!("RefCell value: {}", cell.borrow());
 
 // ใช้ Arc + Mutex แทน
 use std::sync::{Arc, Mutex};
 
 let shared = Arc::new(Mutex::new(0));
 println!("\nArc<Mutex<T>> is both Send and Sync!");
 println!("Value: {}", shared.lock().unwrap());
}
```

</RustPlayground>

---

## Send + Sync Combinations

<RustPlayground>

```rust
use std::sync::{Arc, Mutex, RwLock};
use std::thread;

fn main() {
 // Mutex สำหรับ exclusive access
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
 
 println!("Counter: {}", *counter.lock().unwrap());
 
 // RwLock สำหรับ multiple readers
 let data = Arc::new(RwLock::new(vec![1, 2, 3]));
 
 {
 let r = data.read().unwrap();
 println!("Read: {:?}", *r);
 }
 
 {
 let mut w = data.write().unwrap();
 w.push(4);
 }
 
 println!("After write: {:?}", *data.read().unwrap());
}
```

</RustPlayground>

---

## Quick Reference

### Marker Traits
| Trait | คำอธิบาย |
|-------|---------|
| `Send` | สามารถ move ข้าม threads |
| `Sync` | สามารถ share (&T) ข้าม threads |

### Common Types
| Type | Send | Sync |
|------|------|------|
| `i32`, primitives | | |
| `String`, `Vec<T>` | | |
| `Arc<T>` | if T: Send+Sync | if T: Send+Sync |
| `Mutex<T>` | if T: Send | if T: Send |
| `Rc<T>` | | |
| `RefCell<T>` | if T: Send | |
| `*const T` | | |

### Rules
- `T: Send` = ownership สามารถย้ายข้าม threads
- `T: Sync` = `&T` สามารถ share ข้าม threads
- `T: Sync` `&T: Send`

---

[← I/O](./io) | [Index →](./index)
