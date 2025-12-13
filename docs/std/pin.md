# Pin - Pinned Memory

**std::pin** สำหรับรับประกันว่าค่าจะไม่ถูกย้ายใน memory! 

---

## Pin คืออะไร?

`Pin<P>` รับประกันว่า value ที่ P ชี้จะไม่ถูก **move**:
- จำเป็นสำหรับ async/await
- ใช้กับ self-referential types
- ป้องกัน unsafe behavior

:::tip เมื่อไหร่ใช้ Pin?
- เรียก `.await` บน futures
- Implement Future trait
- Self-referential structs
:::

---

## 1. พื้นฐาน Pin

<RustPlayground>

```rust
use std::pin::Pin;

fn main() {
 // Pin บน stack ด้วย pin! macro
 let mut value = 42;
 let pinned = std::pin::pin!(value);
 println!("pinned value: {}", pinned);
 
 // Pin บน heap ด้วย Box::pin
 let boxed = Box::pin(String::from("hello"));
 println!("boxed pinned: {}", boxed);
 
 // ไม่สามารถ move ค่าออกจาก Pin (ถ้า type ไม่ใช่ Unpin)
 // std::mem::swap(&mut *pinned, &mut other); // Error!
}
```

</RustPlayground>

---

## 2. Unpin Trait

<RustPlayground>

```rust
use std::pin::Pin;
use std::marker::Unpin;

// Types ที่ implement Unpin สามารถ move ได้แม้ถูก pin
// ส่วนใหญ่ของ types ใน Rust เป็น Unpin

fn main() {
 // i32 เป็น Unpin
 let mut a = 10;
 let mut b = 20;
 
 let mut pinned_a = std::pin::pin!(a);
 let pinned_b = std::pin::pin!(b);
 
 // Unpin types สามารถใช้ get_mut ได้
 *pinned_a.as_mut() = 100;
 println!("a: {}", pinned_a);
 
 // String ก็เป็น Unpin
 let mut s = String::from("hello");
 let mut pinned_s = std::pin::pin!(s);
 pinned_s.as_mut().push_str(" world");
 println!("s: {}", pinned_s);
}
```

</RustPlayground>

---

## 3. Pin กับ Futures

<RustPlayground>

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

// Future ต้องถูก pin ก่อน poll
struct MyFuture {
 value: i32,
}

impl Future for MyFuture {
 type Output = i32;
 
 fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
 // Pin<&mut Self> รับประกันว่า self ไม่ถูก move
 Poll::Ready(self.value * 2)
 }
}

fn main() {
 let future = MyFuture { value: 21 };
 
 // สร้าง pinned future
 let pinned = Box::pin(future);
 
 println!("Created a pinned future");
 // ปกติจะใช้ executor เช่น tokio เพื่อ run future
}
```

</RustPlayground>

---

## 4. Self-Referential Struct

<RustPlayground>

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

// Self-referential struct ต้องการ Pin

struct SelfRef {
 data: String,
 // pointer ชี้กลับไปที่ data (self-referential)
 ptr: *const String,
 // ทำให้ไม่ใช่ Unpin
 _pin: PhantomPinned,
}

impl SelfRef {
 fn new(data: &str) -> Pin<Box<Self>> {
 let s = SelfRef {
 data: data.to_string(),
 ptr: std::ptr::null(),
 _pin: PhantomPinned,
 };
 
 let mut boxed = Box::pin(s);
 
 // ตั้ง ptr ให้ชี้ไปที่ data
 let data_ptr = &boxed.data as *const String;
 
 // Safety: ไม่ย้าย data หลังจากนี้
 unsafe {
 let mut_ref = Pin::as_mut(&mut boxed);
 Pin::get_unchecked_mut(mut_ref).ptr = data_ptr;
 }
 
 boxed
 }
 
 fn get_data(&self) -> &str {
 &self.data
 }
 
 fn get_ptr_data(&self) -> &str {
 // Safety: ptr ยังคง valid เพราะถูก pin
 unsafe { &*self.ptr }
 }
}

fn main() {
 let pinned = SelfRef::new("Hello, Pin!");
 
 println!("data: {}", pinned.get_data());
 println!("ptr_data: {}", pinned.get_ptr_data());
 
 // ทั้งคู่ชี้ไปที่เดียวกัน
}
```

</RustPlayground>

---

## 5. Pin Methods

<RustPlayground>

```rust
use std::pin::Pin;

fn main() {
 let mut value = String::from("hello");
 
 // pin! macro (Rust 1.68+)
 let mut pinned = std::pin::pin!(value);
 
 // as_ref - Pin<&T>
 let ref_pin: Pin<&String> = pinned.as_ref();
 println!("as_ref: {}", ref_pin);
 
 // as_mut - Pin<&mut T> (สำหรับ Unpin types)
 pinned.as_mut().push_str(" world");
 println!("as_mut: {}", pinned);
 
 // get_ref - &T
 let inner_ref: &String = pinned.get_ref();
 println!("get_ref: {}", inner_ref);
 
 // get_mut - &mut T (เฉพาะ Unpin types)
 let inner_mut: &mut String = pinned.get_mut();
 inner_mut.push('!');
 println!("get_mut: {}", pinned);
 
 // into_inner (เฉพาะ Unpin types)
 // let owned = Pin::into_inner(pinned);
}
```

</RustPlayground>

---

## 6. Box::pin และ pin!

<RustPlayground>

```rust
use std::pin::Pin;

fn main() {
 // Box::pin - pin บน heap
 let heap_pinned: Pin<Box<i32>> = Box::pin(42);
 println!("heap pinned: {}", heap_pinned);
 
 // pin! macro - pin บน stack (Rust 1.68+)
 let stack_val = 100;
 let stack_pinned = std::pin::pin!(stack_val);
 println!("stack pinned: {}", stack_pinned);
 
 // ความแตกต่าง:
 // - Box::pin: allocate บน heap, return Pin<Box<T>>
 // - pin!: อยู่บน stack, shadowed variable
 
 // สำหรับ async, ปกติใช้ Box::pin
 fn returns_pinned() -> Pin<Box<String>> {
 Box::pin(String::from("from function"))
 }
 
 let from_fn = returns_pinned();
 println!("from function: {}", from_fn);
}
```

</RustPlayground>

---

## Quick Reference

### สร้าง Pin
| วิธี | คำอธิบาย | Location |
|-----|---------|----------|
| `Box::pin(v)` | Pin บน heap | Heap |
| `pin!(v)` | Pin บน stack | Stack |

### Pin Methods
| Method | คำอธิบาย | ต้องการ |
|--------|---------|--------|
| `as_ref()` | `Pin<&T>` | - |
| `as_mut()` | `Pin<&mut T>` | `mut` |
| `get_ref()` | `&T` | - |
| `get_mut()` | `&mut T` | Unpin |
| `into_inner()` | `T` | Unpin |

### Unpin
| Type | Unpin? |
|------|--------|
| primitives (i32, bool) | |
| String, Vec | |
| Box, Rc, Arc | |
| Futures (async blocks) | |
| PhantomPinned | |

### ใช้เมื่อไหร่
| สถานการณ์ | ใช้ |
|-----------|-----|
| async/await | `Pin<Box<Future>>` |
| Self-referential | `Pin + PhantomPinned` |
| Normal types | ไม่จำเป็น (Unpin) |

---

[← Box](./box) | [Future →](./future)
