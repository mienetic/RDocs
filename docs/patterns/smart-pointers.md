# Smart Pointers Patterns

Pattern สำหรับใช้ Smart Pointers อย่างถูกต้อง! 

---

## Box - Heap Allocation

<RustPlayground>

```rust
// Box ใช้เมื่อ:
// 1. ขนาดไม่รู้ตอน compile
// 2. ข้อมูลใหญ่มาก
// 3. Recursive types

// Recursive type (ต้องใช้ Box)
enum List {
 Cons(i32, Box<List>),
 Nil,
}

use List::{Cons, Nil};

fn main() {
 let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
 
 // Box สำหรับ heap allocation
 let boxed = Box::new(5);
 println!("Boxed value: {}", *boxed);
}
```

</RustPlayground>

---

## Rc - Reference Counting

<RustPlayground>

```rust
use std::rc::Rc;

fn main() {
 let data = Rc::new(vec![1, 2, 3]);
 
 // Clone เพิ่ม reference count (ไม่ clone data)
 let data2 = Rc::clone(&data);
 let data3 = Rc::clone(&data);
 
 println!("Reference count: {}", Rc::strong_count(&data));
 println!("Data: {:?}", data);
 
 drop(data2);
 println!("After drop: {}", Rc::strong_count(&data));
}
```

</RustPlayground>

---

## Arc - Thread-Safe Rc

<RustPlayground>

```rust
use std::sync::Arc;
use std::thread;

fn main() {
 let data = Arc::new(vec![1, 2, 3, 4, 5]);
 
 let mut handles = vec![];
 
 for i in 0..3 {
 let data = Arc::clone(&data);
 let handle = thread::spawn(move || {
 println!("Thread {}: {:?}", i, data);
 });
 handles.push(handle);
 }
 
 for handle in handles {
 handle.join().unwrap();
 }
}
```

</RustPlayground>

---

## RefCell - Interior Mutability

<RustPlayground>

```rust
use std::cell::RefCell;

fn main() {
 let data = RefCell::new(5);
 
 // borrow แบบ runtime check
 {
 let r = data.borrow();
 println!("Value: {}", *r);
 }
 
 // mutable borrow
 {
 let mut w = data.borrow_mut();
 *w += 1;
 }
 
 println!("New value: {}", data.borrow());
}
```

</RustPlayground>

---

## `Rc<RefCell<T>>` Pattern

<RustPlayground>

```rust
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct Node {
 value: i32,
 children: Vec<Rc<RefCell<Node>>>,
}

fn main() {
 let root = Rc::new(RefCell::new(Node {
 value: 1,
 children: vec![],
 }));
 
 let child1 = Rc::new(RefCell::new(Node {
 value: 2,
 children: vec![],
 }));
 
 // เพิ่ม child (ต้อง borrow_mut)
 root.borrow_mut().children.push(Rc::clone(&child1));
 
 // อ่านค่า
 println!("Root: {:?}", root.borrow());
}
```

</RustPlayground>

---

## Cow - Clone on Write

<RustPlayground>

```rust
use std::borrow::Cow;

fn process(input: &str) -> Cow<str> {
 if input.contains(' ') {
 // ต้อง clone เพราะ modify
 Cow::Owned(input.replace(' ', "_"))
 } else {
 // ไม่ต้อง clone
 Cow::Borrowed(input)
 }
}

fn main() {
 let s1 = process("hello"); // Borrowed
 let s2 = process("hello world"); // Owned
 
 println!("s1: {} (borrowed: {})", s1, matches!(&s1, Cow::Borrowed(_)));
 println!("s2: {} (borrowed: {})", s2, matches!(&s2, Cow::Borrowed(_)));
}
```

</RustPlayground>

---

## Quick Reference

| Type | Thread-Safe | Mutability | Use Case |
|------|-------------|------------|----------|
| `Box<T>` | Yes | | Heap allocation |
| `Rc<T>` | | | Shared ownership (single thread) |
| `Arc<T>` | | | Shared ownership (multi thread) |
| `Cell<T>` | | | Copy types |
| `RefCell<T>` | | | Runtime borrow check |
| `Mutex<T>` | | | Thread-safe mutation |
| `RwLock<T>` | | | Many readers, one writer |
| `Cow<T>` | - | - | Clone only when needed |

---

[← Newtype](/patterns/newtype) | [Iterator Patterns →](/patterns/iterator)
