# Marker Structs - Type Markers

`PhantomData`, `Pin` สำหรับ advanced type system! 

---

## PhantomData คืออะไร?

`PhantomData` ใช้เมื่อ:
- ต้องการให้ struct "ถือ" type แต่ไม่มี data จริง
- สำหรับ lifetime parameters ที่ไม่ได้ใช้
- บอก compiler เกี่ยวกับ ownership

---

## PhantomData ตัวอย่างพื้นฐาน

<RustPlayground>

```rust
use std::marker::PhantomData;

// Struct ที่มี type parameter แต่ไม่ใช้จริง
struct Id<T> {
 id: u64,
 _marker: PhantomData<T>,
}

struct User;
struct Product;

fn main() {
 let user_id: Id<User> = Id { 
 id: 1, 
 _marker: PhantomData 
 };
 
 let product_id: Id<Product> = Id { 
 id: 1, 
 _marker: PhantomData 
 };
 
 println!("User ID: {}", user_id.id);
 println!("Product ID: {}", product_id.id);
 
 // compile error! type ต่างกัน
 // user_id = product_id;
}
```

</RustPlayground>

---

## PhantomData กับ Lifetimes

<RustPlayground>

```rust
use std::marker::PhantomData;

struct Ref<'a, T> {
 ptr: *const T,
 _marker: PhantomData<&'a T>,
}

impl<'a, T> Ref<'a, T> {
 fn new(reference: &'a T) -> Self {
 Ref {
 ptr: reference as *const T,
 _marker: PhantomData,
 }
 }
 
 fn get(&self) -> &T {
 unsafe { &*self.ptr }
 }
}

fn main() {
 let x = 42;
 let r = Ref::new(&x);
 println!("value: {}", r.get());
}
```

</RustPlayground>

---

## Pin - ป้องกัน Move

<RustPlayground>

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

// Struct ที่ไม่ควร move
struct Unmovable {
 data: String,
 _pin: PhantomPinned,
}

fn main() {
 // Pin ป้องกันการ move
 let mut boxed = Box::pin(Unmovable {
 data: "Hello".to_string(),
 _pin: PhantomPinned,
 });
 
 // ใช้งานผ่าน Pin
 let pinned: Pin<&Unmovable> = boxed.as_ref();
 println!("data: {}", pinned.data);
 
 // ไม่สามารถ move ออกจาก Pin ได้
 // let moved = *boxed; // ERROR!
}
```

</RustPlayground>

---

## Pin กับ Async

<RustPlayground>

```rust
use std::pin::Pin;
use std::future::Future;

// Future ต้องถูก Pin เมื่อ poll
async fn example() -> i32 {
 42
}

fn main() {
 let future = example();
 
 // Pin future ก่อน poll
 let pinned = Box::pin(future);
 
 println!("Future created (not polled)");
 
 // ใน async runtime จะ poll pin
 // pinned.as_mut().poll(cx)
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย |
|------|---------|
| `PhantomData&lt;T&gt;` | Zero-sized marker |
| `PhantomPinned` | Opt-out of Unpin |
| `Pin&lt;P&gt;` | Pinned pointer |

### PhantomData Uses
| Use Case | ตัวอย่าง |
|----------|---------|
| Type tag | `Id&lt;User&gt;` vs `Id&lt;Product&gt;` |
| Lifetime | `PhantomData&lt;&'a T&gt;` |
| Ownership | บอก drop behavior |

### Pin Methods
| Method | คำอธิบาย |
|--------|---------|
| `new(p)` | สร้าง Pin (ถ้า Unpin) |
| `new_unchecked(p)` | สร้าง Pin (unsafe) |
| `as_ref()` | ได้ `Pin&lt;&T&gt;` |
| `as_mut()` | ได้ `Pin&lt;&mut T&gt;` |
| `get_ref()` | ได้ &T |
| `get_mut()` | ได้ &mut T (ถ้า Unpin) |

---

[← Fmt](./fmt) | [กลับ Index →](./index)
