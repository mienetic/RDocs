# Rc - Reference Counting

**std::rc** มี smart pointers สำหรับแชร์ ownership (single-thread)! 

---

## Rc คืออะไร?

`Rc<T>` = Reference Counted pointer:
- หลาย owners ได้
- Clone เพิ่ม reference count
- Drop ลด count
- ค่า drop เมื่อ count = 0

:::warning Single-thread เท่านั้น!
Rc ไม่ thread-safe ใช้ `Arc` สำหรับ multi-thread
:::

---

## 1. สร้างและใช้ Rc

<RustPlayground>

```rust
use std::rc::Rc;

fn main() {
 // สร้าง Rc
 let data = Rc::new(vec![1, 2, 3]);
 println!("data: {:?}", data);
 println!("count: {}", Rc::strong_count(&data));
 
 // Clone = เพิ่ม reference count (ไม่ clone ข้อมูล!)
 let data2 = Rc::clone(&data);
 let data3 = data.clone(); // เหมือนกัน
 
 println!("count after clone: {}", Rc::strong_count(&data));
 
 // ทุกตัวชี้ไปที่เดียวกัน
 println!("data == data2: {}", Rc::ptr_eq(&data, &data2));
 
 // Drop ลด count
 drop(data2);
 println!("count after drop: {}", Rc::strong_count(&data));
 
 drop(data3);
 println!("count after another drop: {}", Rc::strong_count(&data));
 
 // data ยังใช้ได้!
 println!("data: {:?}", data);
}
```

</RustPlayground>

---

## 2. Rc + RefCell Pattern

<RustPlayground>

```rust
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct Counter {
 value: i32,
}

fn main() {
 // Rc<RefCell<T>> = shared mutable data
 let counter = Rc::new(RefCell::new(Counter { value: 0 }));
 
 let c1 = Rc::clone(&counter);
 let c2 = Rc::clone(&counter);
 
 // แก้ไขผ่าน c1
 c1.borrow_mut().value += 10;
 println!("after c1: {:?}", counter.borrow());
 
 // แก้ไขผ่าน c2
 c2.borrow_mut().value += 5;
 println!("after c2: {:?}", counter.borrow());
 
 // อ่านจาก counter
 println!("final: {}", counter.borrow().value);
}
```

</RustPlayground>

---

## 3. Weak References

<RustPlayground>

```rust
use std::rc::{Rc, Weak};

fn main() {
 let strong = Rc::new("hello");
 
 // Weak ไม่เพิ่ม strong count
 let weak: Weak<&str> = Rc::downgrade(&strong);
 
 println!("strong count: {}", Rc::strong_count(&strong));
 println!("weak count: {}", Rc::weak_count(&strong));
 
 // upgrade: Weak -> Option<Rc>
 if let Some(rc) = weak.upgrade() {
 println!("upgraded: {}", rc);
 }
 
 // Drop strong reference
 drop(strong);
 
 // upgrade จะได้ None
 match weak.upgrade() {
 Some(rc) => println!("still alive: {}", rc),
 None => println!("value was dropped"),
 }
}
```

</RustPlayground>

---

## 4. ป้องกัน Cycle ด้วย Weak

<RustPlayground>

```rust
use std::rc::{Rc, Weak};
use std::cell::RefCell;

#[derive(Debug)]
struct Node {
 value: i32,
 // parent เป็น Weak ป้องกัน cycle!
 parent: RefCell<Weak<Node>>,
 children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
 let parent = Rc::new(Node {
 value: 1,
 parent: RefCell::new(Weak::new()),
 children: RefCell::new(vec![]),
 });
 
 let child = Rc::new(Node {
 value: 2,
 parent: RefCell::new(Rc::downgrade(&parent)),
 children: RefCell::new(vec![]),
 });
 
 parent.children.borrow_mut().push(Rc::clone(&child));
 
 println!("parent: {}", parent.value);
 println!("child: {}", child.value);
 
 // เข้าถึง parent จาก child
 if let Some(p) = child.parent.borrow().upgrade() {
 println!("child's parent: {}", p.value);
 }
 
 println!("parent strong_count: {}", Rc::strong_count(&parent));
 println!("child strong_count: {}", Rc::strong_count(&child));
}
```

</RustPlayground>

---

## 5. Rc Methods

<RustPlayground>

```rust
use std::rc::Rc;

fn main() {
 let rc = Rc::new(42);
 
 // strong_count / weak_count
 println!("strong: {}", Rc::strong_count(&rc));
 println!("weak: {}", Rc::weak_count(&rc));
 
 // ptr_eq - เปรียบเทียบ pointer
 let rc2 = Rc::clone(&rc);
 let rc3 = Rc::new(42);
 
 println!("rc == rc2 (ptr): {}", Rc::ptr_eq(&rc, &rc2)); // true
 println!("rc == rc3 (ptr): {}", Rc::ptr_eq(&rc, &rc3)); // false
 
 // try_unwrap - ดึง value ถ้า count = 1
 let single = Rc::new("single");
 match Rc::try_unwrap(single) {
 Ok(val) => println!("unwrapped: {}", val),
 Err(_) => println!("multiple references"),
 }
 
 // get_mut - ได้ &mut ถ้า count = 1
 let mut single2 = Rc::new(10);
 if let Some(val) = Rc::get_mut(&mut single2) {
 *val = 20;
 }
 println!("after get_mut: {}", single2);
 
 // make_mut - clone ถ้ามี references อื่น
 let mut shared = Rc::new(5);
 let _other = Rc::clone(&shared);
 *Rc::make_mut(&mut shared) = 100; // clones first
 println!("after make_mut: {}", shared);
}
```

</RustPlayground>

---

## Quick Reference

### Rc Methods
| Method | คำอธิบาย |
|--------|---------|
| `Rc::new(v)` | สร้าง Rc |
| `Rc::clone(&rc)` | เพิ่ม ref count |
| `Rc::strong_count(&rc)` | จำนวน strong refs |
| `Rc::weak_count(&rc)` | จำนวน weak refs |
| `Rc::downgrade(&rc)` | สร้าง Weak |
| `Rc::ptr_eq(&a, &b)` | เปรียบเทียบ ptr |
| `Rc::try_unwrap(rc)` | ดึง value |
| `Rc::get_mut(&mut rc)` | `Option<&mut T>` |
| `Rc::make_mut(&mut rc)` | clone if needed |

### Weak Methods
| Method | คำอธิบาย |
|--------|---------|
| `Weak::new()` | สร้าง empty Weak |
| `weak.upgrade()` | `Option<Rc<T>>` |
| `weak.strong_count()` | strong refs |

### Rc vs Arc
| | Rc | Arc |
|-|----|----|
| Thread-safe | | |
| Performance | เร็วกว่า | ช้ากว่า |
| ใช้เมื่อ | single-thread | multi-thread |

---

[← Sync](./sync) | [Box →](./box)
