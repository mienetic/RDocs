# Cell Types - Interior Mutability

`Cell`, `RefCell`, `OnceCell` สำหรับ interior mutability! 

---

## Cell - สำหรับ Copy types

<RustPlayground>

```rust
use std::cell::Cell;

fn main() {
 let c = Cell::new(5);
 
 // อ่านค่า
 println!("value = {}", c.get());
 
 // เปลี่ยนค่า (แม้ไม่ได้ประกาศ mut!)
 c.set(10);
 println!("after set = {}", c.get());
 
 // replace - set และ return ค่าเก่า
 let old = c.replace(20);
 println!("old = {}, new = {}", old, c.get());
 
 // ใช้ใน struct
 struct Counter {
 value: Cell<u32>,
 }
 
 impl Counter {
 fn increment(&self) { // ไม่ต้อง &mut self!
 self.value.set(self.value.get() + 1);
 }
 }
 
 let counter = Counter { value: Cell::new(0) };
 counter.increment();
 counter.increment();
 println!("counter = {}", counter.value.get());
}
```

</RustPlayground>

---

## RefCell - Runtime Borrow Checking

<RustPlayground>

```rust
use std::cell::RefCell;

fn main() {
 let data = RefCell::new(vec![1, 2, 3]);
 
 // borrow() - immutable
 {
 let borrowed = data.borrow();
 println!("borrowed: {:?}", borrowed);
 }
 
 // borrow_mut() - mutable
 {
 let mut borrowed = data.borrow_mut();
 borrowed.push(4);
 borrowed.push(5);
 }
 
 println!("after mutation: {:?}", data.borrow());
 
 // try_borrow - ไม่ panic
 if let Ok(b) = data.try_borrow() {
 println!("try_borrow ok: {:?}", b);
 }
}
```

</RustPlayground>

---

## OnceCell - Initialize Once

<RustPlayground>

```rust
use std::cell::OnceCell;

fn main() {
 let cell: OnceCell<String> = OnceCell::new();
 
 assert!(cell.get().is_none());
 
 // set ได้ครั้งเดียว
 cell.set(String::from("hello")).unwrap();
 println!("value = {}", cell.get().unwrap());
 
 // set ครั้งที่ 2 จะ error
 let result = cell.set(String::from("world"));
 println!("second set: {:?}", result); // Err
 
 // get_or_init - lazy initialization
 let cell2: OnceCell<i32> = OnceCell::new();
 let value = cell2.get_or_init(|| {
 println!("computing...");
 42
 });
 println!("value = {}", value);
 
 // ครั้งต่อไปไม่ compute
 let value2 = cell2.get_or_init(|| 100);
 println!("value2 = {}", value2); // ยังเป็น 42
}
```

</RustPlayground>

---

## Rc + RefCell Pattern

<RustPlayground>

```rust
use std::rc::Rc;
use std::cell::RefCell;

fn main() {
 // Rc<RefCell<T>> = shared mutable data
 let data = Rc::new(RefCell::new(vec![1, 2, 3]));
 
 let data2 = Rc::clone(&data);
 let data3 = Rc::clone(&data);
 
 // ทุกคนแชร์และแก้ไขได้
 data.borrow_mut().push(4);
 data2.borrow_mut().push(5);
 data3.borrow_mut().push(6);
 
 println!("data = {:?}", data.borrow());
 println!("data2 = {:?}", data2.borrow());
 println!("data3 = {:?}", data3.borrow());
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | Copy? | Borrow check |
|------|-------|--------------|
| `Cell<T>` | T: Copy | None |
| `RefCell<T>` | Any | Runtime |
| `OnceCell<T>` | Any | Initialize once |
| `LazyCell<T>` | Any | Lazy init |
| `UnsafeCell<T>` | Any | None (unsafe) |

### เมื่อไหร่ใช้อะไร
| Situation | ใช้ |
|-----------|-----|
| Simple counter | `Cell<u32>` |
| Caching | `RefCell<Option<T>>` |
| Configuration | `OnceCell<Config>` |
| Shared mutable | `Rc<RefCell<T>>` |
| Thread-safe | `Arc<Mutex<T>>` |

---

[← Smart Pointers](./smart-pointers) | [I/O →](./io)
