# Memory Functions (std::mem)

Functions สำหรับจัดการ Memory และค่าต่างๆ! 

---

## size_of

หาขนาดของ type (ใน bytes)

<RustPlayground>

```rust
use std::mem;

fn main() {
 println!("i8: {} bytes", mem::size_of::<i8>());
 println!("i32: {} bytes", mem::size_of::<i32>());
 println!("i64: {} bytes", mem::size_of::<i64>());
 println!("String: {} bytes", mem::size_of::<String>());
 println!("Vec<i32>: {} bytes", mem::size_of::<Vec<i32>>());
 println!("Option<i32>: {} bytes", mem::size_of::<Option<i32>>());
 
 // size_of_val สำหรับหาขนาดจากค่า
 let arr = [1, 2, 3, 4, 5];
 println!("arr: {} bytes", mem::size_of_val(&arr));
}
```

</RustPlayground>

---

## swap

สลับค่าระหว่าง 2 ตัวแปร

<RustPlayground>

```rust
use std::mem;

fn main() {
 let mut a = 10;
 let mut b = 20;
 
 println!("Before: a = {}, b = {}", a, b);
 
 mem::swap(&mut a, &mut b);
 
 println!("After: a = {}, b = {}", a, b);
 
 // ใช้กับ struct ก็ได้
 let mut v1 = vec![1, 2, 3];
 let mut v2 = vec![4, 5, 6];
 
 mem::swap(&mut v1, &mut v2);
 println!("v1: {:?}, v2: {:?}", v1, v2);
}
```

</RustPlayground>

---

## take

ดึงค่าออกมาและแทนที่ด้วย Default

<RustPlayground>

```rust
use std::mem;

fn main() {
 let mut s = String::from("Hello");
 
 // ดึงค่าออก แทนที่ด้วย String::default() (empty string)
 let taken = mem::take(&mut s);
 
 println!("taken: {}", taken); // "Hello"
 println!("s: '{}'", s); // ""
 
 // ใช้กับ Option
 let mut opt = Some(42);
 let taken_opt = mem::take(&mut opt);
 
 println!("taken_opt: {:?}", taken_opt); // Some(42)
 println!("opt: {:?}", opt); // None
}
```

</RustPlayground>

---

## replace

แทนที่ค่าและ return ค่าเดิม

<RustPlayground>

```rust
use std::mem;

fn main() {
 let mut x = 5;
 
 // แทนที่ด้วย 10, return ค่าเดิม (5)
 let old = mem::replace(&mut x, 10);
 
 println!("old: {}", old); // 5
 println!("x: {}", x); // 10
 
 // ใช้กับ enum
 #[derive(Debug)]
 enum State { Running, Stopped }
 
 let mut state = State::Running;
 let old_state = mem::replace(&mut state, State::Stopped);
 
 println!("old_state: {:?}", old_state);
 println!("state: {:?}", state);
}
```

</RustPlayground>

---

## drop

Drop ค่าทันที (เรียก destructor)

<RustPlayground>

```rust
use std::mem;

fn main() {
 let s = String::from("Hello");
 
 println!("Before drop: {}", s);
 
 // Drop ทันที (ไม่ต้องรอจบ scope)
 drop(s);
 
 // println!("{}", s); // Error: s ถูก drop แล้ว
 
 println!("After drop");
 
 // ประโยชน์: ปล่อย lock ก่อนจบ scope
 use std::sync::Mutex;
 let mutex = Mutex::new(5);
 {
 let mut guard = mutex.lock().unwrap();
 *guard = 10;
 drop(guard); // ปล่อย lock ทันที
 
 // ทำอย่างอื่นต่อโดยไม่ถือ lock
 println!("Lock released early");
 }
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | ตัวอย่าง |
|----------|---------|---------|
| `size_of::<T>()` | ขนาดของ type | `size_of::<i32>()` → 4 |
| `size_of_val(&v)` | ขนาดของค่า | `size_of_val(&arr)` |
| `swap(&mut a, &mut b)` | สลับค่า | - |
| `take(&mut v)` | ดึงค่า แทน default | - |
| `replace(&mut v, new)` | แทนค่า return เดิม | - |
| `drop(v)` | Drop ทันที | - |

---

[← Index](./index) | [File System →](./fs)
