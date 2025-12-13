# Box - Heap Allocation

**std::boxed::Box** สำหรับเก็บข้อมูลบน heap! 

---

## Box คืออะไร?

`Box<T>` = smart pointer ที่เก็บค่าบน heap:
- เป็นเจ้าของค่า (owns the value)
- Drop เมื่อ Box หมด scope
- ขนาดคงที่ (pointer size)

:::tip เมื่อไหร่ใช้ Box?
- Type ใหญ่มาก (ไม่อยาก copy)
- Recursive types (ขนาดไม่รู้ตอน compile)
- Trait objects (`Box<dyn Trait>`)
:::

---

## 1. สร้างและใช้ Box

<RustPlayground>

```rust
fn main() {
 // สร้าง Box
 let boxed = Box::new(42);
 println!("boxed: {}", boxed);
 
 // Deref อัตโนมัติ
 let value: i32 = *boxed;
 println!("value: {}", value);
 
 // Box ใหญ่
 let big_array = Box::new([0u8; 1000]);
 println!("big_array size on stack: {}", std::mem::size_of_val(&big_array));
 println!("actual array size: {} bytes", (*big_array).len());
 
 // Box จะ drop เมื่อหมด scope
 {
 let temp = Box::new(String::from("temporary"));
 println!("temp: {}", temp);
 } // temp drops here
 
 println!("Box สำเร็จ!");
}
```

</RustPlayground>

---

## 2. Recursive Types

<RustPlayground>

```rust
// Recursive type ต้องใช้ Box!

#[derive(Debug)]
enum List {
 Cons(i32, Box<List>), // Box ทำให้ขนาดคงที่
 Nil,
}

use List::{Cons, Nil};

fn main() {
 // สร้าง linked list: 1 -> 2 -> 3 -> Nil
 let list = Cons(1, 
 Box::new(Cons(2, 
 Box::new(Cons(3, 
 Box::new(Nil))))));
 
 println!("list: {:?}", list);
 
 // ขนาดของ List คงที่
 println!("size of List: {} bytes", std::mem::size_of::<List>());
}
```

</RustPlayground>

---

## 3. Binary Tree

<RustPlayground>

```rust
#[derive(Debug)]
struct TreeNode {
 value: i32,
 left: Option<Box<TreeNode>>,
 right: Option<Box<TreeNode>>,
}

impl TreeNode {
 fn new(value: i32) -> Self {
 TreeNode { value, left: None, right: None }
 }
 
 fn insert(&mut self, value: i32) {
 if value < self.value {
 match &mut self.left {
 Some(node) => node.insert(value),
 None => self.left = Some(Box::new(TreeNode::new(value))),
 }
 } else {
 match &mut self.right {
 Some(node) => node.insert(value),
 None => self.right = Some(Box::new(TreeNode::new(value))),
 }
 }
 }
}

fn main() {
 let mut root = TreeNode::new(5);
 root.insert(3);
 root.insert(7);
 root.insert(1);
 root.insert(4);
 
 println!("{:#?}", root);
}
```

</RustPlayground>

---

## 4. Trait Objects

<RustPlayground>

```rust
trait Animal {
 fn speak(&self) -> &str;
}

struct Dog;
struct Cat;

impl Animal for Dog {
 fn speak(&self) -> &str { "Woof!" }
}

impl Animal for Cat {
 fn speak(&self) -> &str { "Meow!" }
}

fn main() {
 // Box<dyn Trait> = trait object
 let animals: Vec<Box<dyn Animal>> = vec![
 Box::new(Dog),
 Box::new(Cat),
 Box::new(Dog),
 ];
 
 for animal in &animals {
 println!("{}", animal.speak());
 }
 
 // Return trait object
 fn random_animal(rng: bool) -> Box<dyn Animal> {
 if rng {
 Box::new(Dog)
 } else {
 Box::new(Cat)
 }
 }
 
 let a = random_animal(true);
 println!("Random: {}", a.speak());
}
```

</RustPlayground>

---

## 5. Box Methods

<RustPlayground>

```rust
fn main() {
 // into_raw / from_raw - raw pointer conversion
 let b = Box::new(42);
 let raw = Box::into_raw(b); // Box -> *mut T
 
 unsafe {
 println!("raw value: {}", *raw);
 
 // สร้าง Box กลับ (ต้อง drop!)
 let b2 = Box::from_raw(raw);
 println!("back to box: {}", b2);
 }
 
 // leak - ไม่ drop (ได้ 'static reference)
 let leaked: &'static str = Box::leak(Box::new(String::from("leaked")));
 println!("leaked: {}", leaked);
 
 // pin - สร้าง Pin<Box<T>>
 let pinned = Box::pin(42);
 println!("pinned: {}", pinned);
}
```

</RustPlayground>

---

## 6. Box vs Other Smart Pointers

<RustPlayground>

```rust
use std::rc::Rc;
use std::sync::Arc;

fn main() {
 // Box - single owner, heap allocated
 let box_val = Box::new(1);
 
 // Rc - multiple owners, single thread
 let rc_val = Rc::new(2);
 let rc_clone = Rc::clone(&rc_val);
 
 // Arc - multiple owners, multi-thread
 let arc_val = Arc::new(3);
 let arc_clone = Arc::clone(&arc_val);
 
 println!("Box: {}", box_val);
 println!("Rc: {} (count: {})", rc_val, Rc::strong_count(&rc_val));
 println!("Arc: {} (count: {})", arc_val, Arc::strong_count(&arc_val));
 
 // เปรียบเทียบขนาด
 println!("\nSizes:");
 println!("Box<i32>: {} bytes", std::mem::size_of::<Box<i32>>());
 println!("Rc<i32>: {} bytes", std::mem::size_of::<Rc<i32>>());
 println!("Arc<i32>: {} bytes", std::mem::size_of::<Arc<i32>>());
}
```

</RustPlayground>

---

## Quick Reference

### สร้าง Box
| วิธี | คำอธิบาย |
|-----|---------|
| `Box::new(v)` | สร้าง Box |
| `Box::pin(v)` | สร้าง `Pin<Box<T>>` |

### Methods
| Method | คำอธิบาย |
|--------|---------|
| `*boxed` | Deref ดึงค่า |
| `Box::into_raw(b)` | `*mut T` |
| `Box::from_raw(ptr)` | `Box<T>` (unsafe) |
| `Box::leak(b)` | `&'static T` |
| `Box::into_inner(b)` | ดึง T ออก |

### ใช้เมื่อไหร่
| สถานการณ์ | ใช้ |
|-----------|-----|
| Recursive type | `Box<Self>` |
| Trait object | `Box<dyn Trait>` |
| Large data | `Box<[u8; 1000000]>` |
| Single owner | `Box<T>` |
| Multiple owners | `Rc<T>` / `Arc<T>` |

### Box vs Stack
| | Stack | Box (Heap) |
|-|-------|------------|
| Allocation | เร็ว | ช้ากว่า |
| Size | ต้องรู้ compile time | ยืดหยุ่น |
| Lifetime | ตาม scope | drop เมื่อ Box drop |

---

[← Rc](./rc) | [Pin →](./pin)
