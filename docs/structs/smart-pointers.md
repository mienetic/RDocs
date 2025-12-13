# Smart Pointers - พอยน์เตอร์อัจฉริยะ

`Box`, `Rc`, `Arc`, `Weak` สำหรับจัดการ memory! 

---

## Box - Heap Allocation

::: best-practice
**ใช้ Box กับ Recursive Types**
โครงสร้างข้อมูลแบบหมุนวน (เช่น Linked List) ต้องใช้ `Box` เพราะ Compiler ต้องรู้ขนาดที่แน่นอนของ Struct
:::

<RustPlayground>

```rust
fn main() {
 // Box เก็บค่าบน heap
 let b = Box::new(5);
 println!("b = {}", b);
 
 // ใช้กับ recursive types
 #[derive(Debug)]
 enum List {
 Cons(i32, Box<List>),
 Nil,
 }
 
 let list = List::Cons(1, 
 Box::new(List::Cons(2, 
 Box::new(List::Cons(3, 
 Box::new(List::Nil))))));
 
 println!("list = {:?}", list);
 
 // ขนาดคงที่บน stack
 println!("Box size = {} bytes", std::mem::size_of::<Box<[i32; 100]>>());
}
```

</RustPlayground>

---

## Rc - Reference Counting

::: caution
**ระวัง Reference Cycles!**
ถ้ามี `Rc` ชี้หากันเองเป็นวงกลม (A -> B -> A) ค่าจะไม่ถูก drop (memory leak)
ต้องใช้ `Weak` เพื่อแก้ปัญหานี้!
:::

<RustPlayground>

```rust
use std::rc::Rc;

fn main() {
 // Rc แชร์ ownership ได้
 let data = Rc::new(vec![1, 2, 3]);
 
 println!("count = {}", Rc::strong_count(&data)); // 1
 
 let data2 = Rc::clone(&data);
 println!("count = {}", Rc::strong_count(&data)); // 2
 
 let data3 = Rc::clone(&data);
 println!("count = {}", Rc::strong_count(&data)); // 3
 
 // ทุก Rc ชี้ไปที่ data เดียวกัน
 println!("data = {:?}", data);
 println!("data2 = {:?}", data2);
 println!("data3 = {:?}", data3);
 
 drop(data3);
 println!("count after drop = {}", Rc::strong_count(&data)); // 2
}
```

</RustPlayground>

---

## Arc - Atomic Reference Counting

::: recommendation
**`Rc` vs `Arc`**
ใช้ `Rc` ใน Single Thread เพราะเร็วกว่า
ใช้ `Arc` เฉพาะเมื่อต้องแชร์ข้อมูลข้าม Threads เท่านั้น (Atomic operation แพงกว่า)
:::

<RustPlayground>

```rust
use std::sync::Arc;
use std::thread;

fn main() {
 // Arc ใช้ข้าม threads ได้ (thread-safe Rc)
 let data = Arc::new(vec![1, 2, 3, 4, 5]);
 
 let mut handles = vec![];
 
 for i in 0..3 {
 let data = Arc::clone(&data);
 let handle = thread::spawn(move || {
 println!("thread {}: sum = {}", i, data.iter().sum::<i32>());
 });
 handles.push(handle);
 }
 
 for handle in handles {
 handle.join().unwrap();
 }
 
 println!("main: data = {:?}", data);
}
```

</RustPlayground>

---

## Weak - Weak Reference

<RustPlayground>

```rust
use std::rc::{Rc, Weak};

fn main() {
 let strong = Rc::new("hello");
 let weak: Weak<_> = Rc::downgrade(&strong);
 
 println!("strong count = {}", Rc::strong_count(&strong));
 println!("weak count = {}", Rc::weak_count(&strong));
 
 // Weak ต้อง upgrade เพื่อใช้งาน
 if let Some(value) = weak.upgrade() {
 println!("value = {}", value);
 }
 
 // drop strong reference
 drop(strong);
 
 // Weak ไม่สามารถ upgrade ได้แล้ว
 match weak.upgrade() {
 Some(_) => println!("still alive"),
 None => println!("value was dropped"),
 }
}
```

</RustPlayground>

---

## Cow - Clone-on-Write

<RustPlayground>

```rust
use std::borrow::Cow;

fn process(input: &str) -> Cow<str> {
 if input.contains(' ') {
 // ต้อง clone เพราะแก้ไขค่า
 Cow::Owned(input.replace(' ', "_"))
 } else {
 // ไม่ต้อง clone - ใช้ reference
 Cow::Borrowed(input)
 }
}

fn main() {
 let s1 = process("hello"); // Borrowed
 let s2 = process("hello world"); // Owned
 
 println!("s1 = {} (borrowed: {})", s1, matches!(s1, Cow::Borrowed(_)));
 println!("s2 = {} (borrowed: {})", s2, matches!(s2, Cow::Borrowed(_)));
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | Thread-safe | Use case |
|------|-------------|----------|
| `Box<T>` | | Heap allocation |
| `Rc<T>` | | Shared ownership (single thread) |
| `Arc<T>` | | Shared ownership (multi thread) |
| `Weak<T>` | depends | Prevent reference cycles |
| `Cow<T>` | depends | Clone only when needed |

### เมื่อไหร่ใช้อะไร
| Situation | ใช้ |
|-----------|-----|
| Recursive type | `Box` |
| Large data on heap | `Box` |
| Shared read-only (single thread) | `Rc` |
| Shared read-only (multi thread) | `Arc` |
| Parent-child with cycles | `Rc` + `Weak` |
| Avoid unnecessary clones | `Cow` |

---

[← Collections](./collections) | [Cell Types →](./cell)
