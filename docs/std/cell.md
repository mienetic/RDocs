# Cell - Interior Mutability

**std::cell** มี types สำหรับแก้ไขข้อมูลผ่าน shared reference! 

---

## Cell คืออะไร?

ปกติ Rust ไม่ให้แก้ไขผ่าน `&T` (shared reference) แต่ Cell types ทำได้:

| Type | ใช้เมื่อ | Thread-safe |
|------|--------|-------------|
| `Cell<T>` | T เป็น Copy | |
| `RefCell<T>` | ต้อง borrow | |
| `OnceCell<T>` | set ครั้งเดียว | |
| `Mutex<T>` / `RwLock<T>` | ข้าม threads | |

:::tip เมื่อไหร่ใช้?
- `Cell` - สำหรับ Copy types ที่ต้อง mutate
- `RefCell` - ต้องการ borrow at runtime
- ทั้งคู่ **ไม่** thread-safe!
:::

---

## 1. Cell

<RustPlayground>

```rust
use std::cell::Cell;

fn main() {
 // Cell - สำหรับ Copy types
 let x = Cell::new(5);
 
 // get - อ่านค่า (copy ออกมา)
 println!("x: {}", x.get());
 
 // set - เปลี่ยนค่า (ผ่าน &Cell!)
 x.set(10);
 println!("after set: {}", x.get());
 
 // replace - set และได้ค่าเก่า
 let old = x.replace(20);
 println!("old: {}, new: {}", old, x.get());
 
 // take - ดึงค่าออก ใส่ default กลับ
 let val = x.take(); // x becomes 0
 println!("took: {}, x now: {}", val, x.get());
 
 // update - แก้ไขด้วย closure
 x.set(5);
 let doubled = x.update(|v| v * 2);
 println!("updated to: {}", doubled);
}
```

</RustPlayground>

---

## 2. Cell in Structs

<RustPlayground>

```rust
use std::cell::Cell;

struct Counter {
 value: Cell<i32>,
}

impl Counter {
 fn new() -> Self {
 Counter { value: Cell::new(0) }
 }
 
 // &self แต่ยังแก้ไข value ได้!
 fn increment(&self) {
 self.value.set(self.value.get() + 1);
 }
 
 fn get(&self) -> i32 {
 self.value.get()
 }
}

fn main() {
 let counter = Counter::new();
 
 counter.increment();
 counter.increment();
 counter.increment();
 
 println!("Count: {}", counter.get());
 
 // ใช้ได้แม้ counter ไม่ใช่ mut!
 let borrowed = &counter;
 borrowed.increment();
 println!("After borrow increment: {}", counter.get());
}
```

</RustPlayground>

---

## 3. RefCell

<RustPlayground>

```rust
use std::cell::RefCell;

fn main() {
 // RefCell - borrow checking at runtime
 let data = RefCell::new(vec![1, 2, 3]);
 
 // borrow - ยืมอ่าน (&T)
 {
 let borrowed = data.borrow();
 println!("Borrowed: {:?}", *borrowed);
 } // borrow หมดตรงนี้
 
 // borrow_mut - ยืมแก้ไข (&mut T)
 {
 let mut borrowed_mut = data.borrow_mut();
 borrowed_mut.push(4);
 println!("After push: {:?}", *borrowed_mut);
 }
 
 // หลาย read borrows พร้อมกันได้
 {
 let b1 = data.borrow();
 let b2 = data.borrow();
 println!("b1: {:?}, b2: {:?}", *b1, *b2);
 }
 
 // แต่! read + write พร้อมกัน จะ panic
 // let r = data.borrow();
 // let w = data.borrow_mut(); // PANIC!
 
 println!("Final: {:?}", data.borrow());
}
```

</RustPlayground>

---

## 4. RefCell Panic

<RustPlayground>

```rust
use std::cell::RefCell;

fn main() {
 let data = RefCell::new(42);
 
 // try_borrow - return Result แทน panic
 match data.try_borrow() {
 Ok(r) => println!("Got read: {}", *r),
 Err(e) => println!("Borrow failed: {}", e),
 }
 
 // Simulate conflict
 let _write = data.borrow_mut();
 
 // try_borrow ขณะมี write borrow
 match data.try_borrow() {
 Ok(_) => println!("Read succeeded (unexpected)"),
 Err(e) => println!("Read failed as expected: {}", e),
 }
 
 // try_borrow_mut ขณะมี write borrow
 match data.try_borrow_mut() {
 Ok(_) => println!("Write succeeded (unexpected)"),
 Err(e) => println!("Write failed as expected: {}", e),
 }
 
 drop(_write);
 
 // ตอนนี้ borrow ได้แล้ว
 println!("After drop: {}", data.borrow());
}
```

</RustPlayground>

---

## 5. Rc + RefCell Pattern

<RustPlayground>

```rust
use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
struct Node {
 value: i32,
 children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
 // Rc<RefCell<T>> หรือ RefCell<Rc<T>> สำหรับ shared mutable data
 let root = Rc::new(Node {
 value: 1,
 children: RefCell::new(vec![]),
 });
 
 let child1 = Rc::new(Node {
 value: 2,
 children: RefCell::new(vec![]),
 });
 
 let child2 = Rc::new(Node {
 value: 3,
 children: RefCell::new(vec![]),
 });
 
 // เพิ่ม children ผ่าน shared reference
 root.children.borrow_mut().push(Rc::clone(&child1));
 root.children.borrow_mut().push(Rc::clone(&child2));
 
 println!("Root: {:?}", root);
 println!("Children count: {}", root.children.borrow().len());
}
```

</RustPlayground>

---

## 6. OnceCell

<RustPlayground>

```rust
use std::cell::OnceCell;

fn main() {
 // OnceCell - set ได้ครั้งเดียว
 let cell: OnceCell<String> = OnceCell::new();
 
 // get - return Option<&T>
 assert!(cell.get().is_none());
 
 // set - return Err ถ้า set แล้ว
 cell.set("first".to_string()).unwrap();
 println!("After first set: {:?}", cell.get());
 
 // set อีกครั้งจะ fail
 match cell.set("second".to_string()) {
 Ok(_) => println!("Set succeeded (unexpected)"),
 Err(e) => println!("Set failed: '{}'", e),
 }
 
 // get_or_init - get หรือ init ถ้าว่าง
 let cell2: OnceCell<i32> = OnceCell::new();
 let val = cell2.get_or_init(|| {
 println!("Computing...");
 42
 });
 println!("Value: {}", val);
 
 // เรียกอีกครั้งไม่ compute ใหม่
 let val2 = cell2.get_or_init(|| {
 println!("Computing again..."); // จะไม่ถูกเรียก
 100
 });
 println!("Value again: {}", val2);
}
```

</RustPlayground>

---

## 7. LazyCell (Rust 1.80+)

<RustPlayground>

```rust
// LazyCell - OnceCell + initialization function
// Available in Rust 1.80+

// use std::cell::LazyCell;

fn main() {
 // Simulate LazyCell behavior with OnceCell
 use std::cell::OnceCell;
 
 struct LazyValue {
 cell: OnceCell<String>,
 }
 
 impl LazyValue {
 fn new() -> Self {
 LazyValue { cell: OnceCell::new() }
 }
 
 fn get(&self) -> &str {
 self.cell.get_or_init(|| {
 println!("Lazily initializing...");
 "Lazy value!".to_string()
 })
 }
 }
 
 let lazy = LazyValue::new();
 
 println!("Created, not yet initialized");
 println!("First access: {}", lazy.get());
 println!("Second access: {}", lazy.get());
}
```

</RustPlayground>

---

## Quick Reference

### Cell
| Method | คำอธิบาย |
|--------|---------|
| `new(v)` | สร้าง Cell |
| `get()` | อ่านค่า (copy) |
| `set(v)` | ตั้งค่า |
| `replace(v)` | ตั้งค่า ได้ค่าเก่า |
| `take()` | ดึงค่า ใส่ default |

### RefCell
| Method | คำอธิบาย |
|--------|---------|
| `new(v)` | สร้าง RefCell |
| `borrow()` | ยืมอ่าน |
| `borrow_mut()` | ยืมแก้ไข |
| `try_borrow()` | ยืมอ่าน (Result) |
| `try_borrow_mut()` | ยืมแก้ไข (Result) |

### OnceCell
| Method | คำอธิบาย |
|--------|---------|
| `new()` | สร้างว่าง |
| `get()` | อ่าน (Option) |
| `set(v)` | ตั้งค่าครั้งเดียว |
| `get_or_init(f)` | get หรือ init |

### เมื่อไหร่ใช้อะไร
| ต้องการ | ใช้ |
|---------|-----|
| Mutate Copy type | `Cell<T>` |
| Borrow at runtime | `RefCell<T>` |
| Init once | `OnceCell<T>` |
| Thread-safe mutate | `Mutex<T>` |
| Thread-safe once | `OnceLock<T>` |

---

[← Sync](./sync) | [Operators →](./ops)
