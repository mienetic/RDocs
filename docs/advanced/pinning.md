# Pinning

ทำความเข้าใจ Pin และ Unpin สำหรับ async และ self-referential types! 

:::tip ทำไมต้องมี Pin?
Pin รับประกันว่าค่าจะไม่ถูกย้าย (move) ใน memory - สำคัญสำหรับ async futures และ types ที่ reference ตัวเอง!
:::

---

## 1. ปัญหาที่ Pin แก้ได้

### 1.1 Self-Referential Types

<RustPlayground>

```rust
// ตัวอย่าง: struct ที่ชี้ไปหาตัวเอง
struct SelfRef {
 value: String,
 // pointer ชี้ไปหา value ของตัวเอง
 // ถ้า struct ถูก move, pointer จะชี้ผิดที่!
}

fn main() {
 let s = SelfRef {
 value: String::from("Hello"),
 };
 
 println!("Value: {}", s.value);
 
 // ถ้า move s ไปที่อื่น และมี self-reference
 // pointer จะ invalid!
}
```

</RustPlayground>

### 1.2 ปัญหาใน Async

```rust
async fn example() {
 let s = String::from("hello");
 some_async_fn(&s).await; // borrow ข้าม .await
 println!("{}", s);
}
// Future ที่สร้างจาก async fn อาจมี self-reference!
// ถ้า Future ถูก move ขณะ await, references จะ invalid
```

---

## 2. Pin Basics

### 2.1 Pin คืออะไร?

<RustPlayground>

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

fn main() {
 // Pin ห่อ pointer type (Box, &mut, etc.)
 let mut data = Box::new(42);
 
 // สร้าง Pin
 let pinned: Pin<Box<i32>> = Box::pin(42);
 
 // อ่านค่าได้ปกติ
 println!("Pinned value: {}", *pinned);
 
 // แต่ move ไม่ได้ (สำหรับ !Unpin types)
}
```

</RustPlayground>

### 2.2 Unpin Trait

<RustPlayground>

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

// ส่วนใหญ่ types implement Unpin
// = สามารถ move ได้แม้อยู่ใน Pin

fn main() {
 // i32 implements Unpin = move ได้
 let mut pinned = Box::pin(42i32);
 
 // สามารถ get_mut ได้เพราะ i32: Unpin
 let value = Pin::into_inner(pinned);
 println!("Moved out: {}", value);
}
```

</RustPlayground>

| Trait | Meaning |
|-------|---------|
| `Unpin` | Safe to move even when pinned |
| `!Unpin` | Must NOT be moved once pinned |

---

## 3. Creating !Unpin Types

<RustPlayground>

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

struct NotUnpin {
 data: String,
 _pin: PhantomPinned, // ทำให้เป็น !Unpin
}

impl NotUnpin {
 fn new(data: &str) -> Self {
 NotUnpin {
 data: data.to_string(),
 _pin: PhantomPinned,
 }
 }
}

fn main() {
 // ต้องใช้ Box::pin
 let pinned = Box::pin(NotUnpin::new("Hello"));
 
 println!("Data: {}", pinned.data);
 
 // ไม่สามารถ move ออกมาได้
 // let moved = Pin::into_inner(pinned); // Error!
}
```

</RustPlayground>

---

## 4. Pin Projections

### 4.1 Accessing Pinned Fields

<RustPlayground>

```rust
use std::pin::Pin;

struct MyStruct {
 field1: String,
 field2: i32,
}

impl MyStruct {
 // Safe projection: field2 ไม่ใช่ self-referential
 fn field2(self: Pin<&Self>) -> &i32 {
 &self.get_ref().field2
 }
 
 // หรือใช้ get_ref()
 fn field1(self: Pin<&Self>) -> &String {
 &self.get_ref().field1
 }
}

fn main() {
 let pinned = Box::pin(MyStruct {
 field1: "Hello".to_string(),
 field2: 42,
 });
 
 let pin_ref = pinned.as_ref();
 println!("field1: {}", pin_ref.field1());
 println!("field2: {}", pin_ref.field2());
}
```

</RustPlayground>

### 4.2 pin-project crate

```toml
[dependencies]
pin-project = "1"
```

```rust
use pin_project::pin_project;
use std::pin::Pin;

#[pin_project]
struct MyFuture {
 #[pin]
 inner: InnerFuture, // pinned projection
 
 value: i32, // unpinned projection
}

impl MyFuture {
 fn poll(self: Pin<&mut Self>) {
 let this = self.project();
 // this.inner: Pin<&mut InnerFuture>
 // this.value: &mut i32
 }
}
```

---

## 5. Pin in Async

### 5.1 Why Futures Need Pin

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

// Future trait requires Pin<&mut Self>
// เพราะ async fn สร้าง Future ที่อาจ self-reference
trait Future {
 type Output;
 
 fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
```

### 5.2 Pinning Futures

<RustPlayground>

```rust
use std::pin::Pin;
use std::future::Future;

async fn my_async_fn() -> i32 {
 42
}

fn main() {
 // สร้าง future
 let fut = my_async_fn();
 
 // Pin บน stack
 let pinned = std::pin::pin!(fut);
 
 // หรือ Pin บน heap
 let boxed_future = Box::pin(my_async_fn());
 
 println!("Future created (not polled yet)");
}
```

</RustPlayground>

### 5.3 pin! Macro

```rust
use std::pin::pin;

async fn example() {
 let future = some_async_fn();
 
 // Pin บน stack
 let pinned = pin!(future);
 
 // ใช้งาน pinned future
 // pinned.await; // สำหรับ async context
}
```

---

## 6. Common Patterns

### 6.1 Implementing Future

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

struct MyFuture {
 value: i32,
}

impl Future for MyFuture {
 type Output = i32;
 
 fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
 // เข้าถึง self ผ่าน get_mut (ถ้า Unpin)
 Poll::Ready(self.get_mut().value)
 }
}
```

### 6.2 Self-Referential Struct with Pin

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;
use std::ptr::NonNull;

struct SelfReferential {
 data: String,
 ptr: Option<NonNull<String>>,
 _pin: PhantomPinned,
}

impl SelfReferential {
 fn new(data: &str) -> Self {
 SelfReferential {
 data: data.to_string(),
 ptr: None,
 _pin: PhantomPinned,
 }
 }
 
 fn init(self: Pin<&mut Self>) {
 let this = unsafe { self.get_unchecked_mut() };
 let ptr = NonNull::from(&this.data);
 this.ptr = Some(ptr);
 }
 
 fn get_data(self: Pin<&Self>) -> &str {
 &self.get_ref().data
 }
 
 fn get_ptr_data(self: Pin<&Self>) -> Option<&String> {
 self.get_ref().ptr.map(|ptr| unsafe { ptr.as_ref() })
 }
}
```

---

## 7. Pin Summary Table

| Type | `Unpin`? | Can move when pinned? |
|------|----------|----------------------|
| `i32`, `String`, etc. | Yes | Yes |
| `&T`, `&mut T` | Yes | Yes |
| `PhantomPinned` | No | No |
| Most `Future` types | No | No |

---

## 8. สรุป

| Concept | Description |
|---------|-------------|
| `Pin<P>` | Wraps pointer, restricts access |
| `Unpin` | Marker: safe to move when pinned |
| `PhantomPinned` | Makes type `!Unpin` |
| `Box::pin(x)` | Create pinned box |
| `pin!(x)` | Pin on stack (macro) |
| `get_ref()` | Get `&T` from `Pin<&T>` |
| `get_mut()` | Get `&mut T` if `T: Unpin` |
| Projection | Access fields of pinned struct |

---

[บทถัดไป: Error Handling Patterns](/advanced/error-patterns)
