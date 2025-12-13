# Smart Pointers

Smart Pointers คือ struct ที่ทำตัวเหมือน pointer แต่มีความสามารถพิเศษ!

## Pointer คืออะไร?

Pointer คือตัวแปรที่เก็บ memory address ของข้อมูลอื่น

| Type | คำอธิบาย |
|------|---------|
| `&T` | Reference - pointer ธรรมดา, borrow ข้อมูล |
| `Box<T>` | Ownership ของข้อมูลบน heap |
| `Rc<T>` | Reference Counting - หลาย owner |
| `Arc<T>` | Atomic Rc - ใช้กับ multi-thread |
| `RefCell<T>` | Interior mutability |

## Box - Heap Allocation

`Box<T>` เก็บข้อมูลบน heap แทน stack

### เมื่อไหร่ใช้ Box?

1. **ข้อมูลขนาดใหญ่** - ไม่อยาก copy บน stack
2. **Recursive types** - ไม่รู้ขนาดตอน compile
3. **Trait objects** - dyn Trait

<RustPlayground>

```rust
fn main() {
 // ค่าปกติอยู่บน stack
 let x = 5;
 println!("x on stack: {}", x);
 
 // Box เก็บค่าบน heap
 let boxed = Box::new(5);
 println!("boxed on heap: {}", boxed);
 
 // Dereference เพื่อเข้าถึงค่า
 let y = *boxed + 10;
 println!("dereferenced + 10: {}", y);
 
 // Box ใช้กับข้อมูลขนาดใหญ่
 let big_array = Box::new([0u8; 1000]);
 println!("big array length: {}", big_array.len());
}
```

</RustPlayground>

### Recursive Types กับ Box

<RustPlayground>

```rust
// Linked List ต้องใช้ Box เพราะ recursive
#[derive(Debug)]
enum List {
 Cons(i32, Box<List>), // Box ทำให้ขนาดคงที่
 Nil,
}

use List::{Cons, Nil};

fn main() {
 // สร้าง list: 1 -> 2 -> 3 -> Nil
 let list = Cons(1, 
 Box::new(Cons(2, 
 Box::new(Cons(3, 
 Box::new(Nil))))));
 
 println!("{:?}", list);
 
 // วน iterate
 print_list(&list);
}

fn print_list(list: &List) {
 match list {
 Cons(value, next) => {
 println!("Value: {}", value);
 print_list(next);
 }
 Nil => println!("End of list"),
 }
}
```

</RustPlayground>

## Rc - Reference Counting

`Rc<T>` ให้ค่าเดียวมี owner หลายคน (single-threaded only)

<RustPlayground>

```rust
use std::rc::Rc;

fn main() {
 // สร้าง Rc
 let a = Rc::new(String::from("hello"));
 println!("count after a: {}", Rc::strong_count(&a));
 
 // Clone เพิ่ม reference count (ไม่ได้ copy ข้อมูล!)
 let b = Rc::clone(&a);
 println!("count after b: {}", Rc::strong_count(&a));
 
 let c = Rc::clone(&a);
 println!("count after c: {}", Rc::strong_count(&a));
 
 // ทุกตัวชี้ไปที่ข้อมูลเดียวกัน
 println!("a = {}, b = {}, c = {}", a, b, c);
 
 // เมื่อ variable ออกจาก scope, count ลด
 {
 let d = Rc::clone(&a);
 println!("count in scope: {}", Rc::strong_count(&a));
 }
 println!("count after scope: {}", Rc::strong_count(&a));
}
```

</RustPlayground>

### ใช้ Rc เมื่อไหร่?

<RustPlayground>

```rust
use std::rc::Rc;

// ใช้ Rc เมื่อหลาย parts ของ program ต้องการอ่านข้อมูลเดียวกัน
#[derive(Debug)]
struct Node {
 value: i32,
 // parent อาจมีหลาย children ที่ reference
 children: Vec<Rc<Node>>,
}

fn main() {
 let leaf = Rc::new(Node {
 value: 10,
 children: vec![],
 });
 
 // หลาย nodes share leaf เดียวกัน
 let branch1 = Rc::new(Node {
 value: 5,
 children: vec![Rc::clone(&leaf)],
 });
 
 let branch2 = Rc::new(Node {
 value: 7,
 children: vec![Rc::clone(&leaf)],
 });
 
 println!("leaf count: {}", Rc::strong_count(&leaf)); // 3
 println!("branch1: {:?}", branch1);
 println!("branch2: {:?}", branch2);
}
```

</RustPlayground>

:::warning Rc ใช้ได้เฉพาะ single-threaded!
สำหรับ multi-threaded ใช้ `Arc<T>` (Atomic Reference Counted)
:::

## RefCell - Interior Mutability

`RefCell<T>` ให้แก้ไขค่าได้แม้มี immutable reference

<RustPlayground>

```rust
use std::cell::RefCell;

fn main() {
 // RefCell ให้ borrow rules ตอน runtime แทน compile-time
 let data = RefCell::new(5);
 
 // borrow() = immutable borrow
 println!("Before: {}", data.borrow());
 
 // borrow_mut() = mutable borrow
 *data.borrow_mut() += 10;
 
 println!("After: {}", data.borrow());
 
 // หลาย immutable borrows ได้
 {
 let r1 = data.borrow();
 let r2 = data.borrow();
 println!("r1 = {}, r2 = {}", r1, r2);
 }
}
```

</RustPlayground>

:::danger Runtime Panic!
RefCell ตรวจสอบ borrow rules ตอน runtime
ถ้าละเมิดกฎ = panic!

```rust
let data = RefCell::new(5);
let r1 = data.borrow();
let r2 = data.borrow_mut(); // PANIC! already borrowed
```
:::

### RefCell กับ Rc

<RustPlayground>

```rust
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
 // Rc กับ RefCell = หลาย owner + แก้ไขได้
 let shared = Rc::new(RefCell::new(vec![1, 2, 3]));
 
 // Clone references
 let a = Rc::clone(&shared);
 let b = Rc::clone(&shared);
 let c = Rc::clone(&shared);
 
 // ทุกคนแก้ไขได้
 a.borrow_mut().push(4);
 b.borrow_mut().push(5);
 c.borrow_mut().push(6);
 
 println!("shared: {:?}", shared.borrow());
 // [1, 2, 3, 4, 5, 6]
}
```

</RustPlayground>

::: pitfall
**ระวัง Reference Cycles!**
ถ้าคุณใช้ `Rc` และ `RefCell` ชี้หากันเองเป็นวงกลม (A -> B -> A)
Reference Count จะไม่มีวันเป็น 0 และ memory จะ **ไม่ถูก free (Memory Leak)**
ถ้าต้องทำ Circular Reference ให้ใช้ **`Weak<T>`** ช่วย
:::

## Cell - Copy Types

`Cell<T>` สำหรับ Copy types ไม่ต้อง borrow

<RustPlayground>

```rust
use std::cell::Cell;

fn main() {
 let counter = Cell::new(0);
 
 // get() และ set() ไม่ต้อง borrow
 println!("Initial: {}", counter.get());
 
 counter.set(10);
 println!("After set: {}", counter.get());
 
 // ใช้ใน struct ที่ต้องการ interior mutability
 let point = Point { x: Cell::new(0), y: Cell::new(0) };
 point.x.set(10);
 point.y.set(20);
 println!("Point: ({}, {})", point.x.get(), point.y.get());
}

struct Point {
 x: Cell<i32>,
 y: Cell<i32>,
}
```

</RustPlayground>

## เปรียบเทียบ Smart Pointers

| Type | Owner | Mutability | Thread-safe | ใช้เมื่อ |
|------|-------|------------|-------------|---------|
| Box | 1 | ตาม ownership | Yes | Heap allocation |
| Rc | หลาย | No | No | Shared ownership |
| Arc | หลาย | No | Yes | Multi-threaded sharing |
| RefCell | 1 | Runtime check | No | Interior mutability |
| Mutex | 1 | Runtime check | Yes | Thread-safe mutability |
| Cell | 1 | Yes (Copy types) | No | Simple interior mut |

## Deref และ Drop Traits

<RustPlayground>

```rust
use std::ops::Deref;

// Custom smart pointer
struct MyBox<T>(T);

impl<T> MyBox<T> {
 fn new(x: T) -> MyBox<T> {
 MyBox(x)
 }
}

// Deref ให้ใช้ * กับ custom type ได้
impl<T> Deref for MyBox<T> {
 type Target = T;
 
 fn deref(&self) -> &T {
 &self.0
 }
}

// Drop ทำงานตอน value ออกจาก scope
impl<T> Drop for MyBox<T> {
 fn drop(&mut self) {
 println!("Dropping MyBox!");
 }
}

fn main() {
 let x = MyBox::new(5);
 println!("Value: {}", *x); // ใช้ Deref
 
 // x ออกจาก scope ที่นี่, Drop ถูกเรียก
}
```

</RustPlayground>

## Memory Layout Comparison

```
Stack: Heap:
 
 let x = 5 
 
 5 
 
 
 let b = Box 
 5 
 ptr 
 
 
```

## สรุป

| Pointer | Memory | การใช้งาน |
|---------|--------|----------|
| Box | Heap | ข้อมูลใหญ่, recursive types |
| Rc | Heap | หลาย owner (single-thread) |
| Arc | Heap | หลาย owner (multi-thread) |
| RefCell | Stack/Heap | Interior mutability |

---

[บทถัดไป: Async/Await](./async)
