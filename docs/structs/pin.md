# Pin Types (std::pin)

Types สำหรับ Pinned Memory! 

---

## ทำไมต้องใช้ Pin?

- ป้องกันการ move ของ self-referential types
- จำเป็นสำหรับ async/await
- Futures ต้องถูก pin ก่อน poll

---

## Basic Pin

<RustPlayground>

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

// Self-referential struct
struct SelfRef {
 value: String,
 pointer: *const String,
 _pin: PhantomPinned,
}

impl SelfRef {
 fn new(value: &str) -> Pin<Box<Self>> {
 let mut boxed = Box::new(SelfRef {
 value: value.to_string(),
 pointer: std::ptr::null(),
 _pin: PhantomPinned,
 });
 
 let self_ptr = &boxed.value as *const String;
 boxed.pointer = self_ptr;
 
 // Pin มัน!
 Box::into_pin(boxed)
 }
 
 fn get_value(self: Pin<&Self>) -> &str {
 &self.value
 }
 
 fn get_pointer_value(self: Pin<&Self>) -> &str {
 unsafe { &*self.pointer }
 }
}

fn main() {
 let pinned = SelfRef::new("Hello!");
 
 println!("Value: {}", pinned.as_ref().get_value());
 println!("Via pointer: {}", pinned.as_ref().get_pointer_value());
}
```

</RustPlayground>

---

## Pin กับ Futures

<RustPlayground>

```rust
use std::pin::Pin;
use std::future::Future;
use std::task::{Context, Poll};

// Custom Future
struct MyFuture {
 value: i32,
}

impl Future for MyFuture {
 type Output = i32;
 
 fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
 // Pinned self ป้องกัน move ระหว่าง polls
 Poll::Ready(self.value * 2)
 }
}

fn main() {
 let future = MyFuture { value: 21 };
 println!("Created future with value: {}", future.value);
}
```

</RustPlayground>

---

## pin! Macro

<RustPlayground>

```rust
use std::pin::pin;

async fn my_async_fn() -> i32 {
 42
}

fn main() {
 // pin! macro สำหรับ stack pinning
 let mut future = pin!(my_async_fn());
 
 // ตอนนี้ future ถูก pin บน stack
 println!("Future pinned on stack");
}
```

</RustPlayground>

---

## Unpin Trait

<RustPlayground>

```rust
use std::pin::Pin;

// Types ที่ implement Unpin สามารถย้ายได้แม้จะ pin
fn move_unpinned<T: Unpin>(pinned: Pin<&mut T>) -> &mut T {
 // get_mut ใช้ได้กับ Unpin types
 Pin::get_mut(pinned)
}

fn main() {
 let mut value = 42;
 let pinned = Pin::new(&mut value);
 
 // i32 implement Unpin โดยอัตโนมัติ
 let mutable_ref = Pin::into_inner(pinned);
 *mutable_ref = 100;
 
 println!("Value: {}", value);
}
```

</RustPlayground>

---

## Quick Reference

| Type/Trait | คำอธิบาย |
|------------|---------|
| `Pin<P>` | Wrapper ที่ป้องกัน move |
| `Unpin` | Trait - สามารถ move ได้ |
| `PhantomPinned` | Marker - ไม่ implement Unpin |
| `pin!` | Macro สำหรับ stack pin |

---

## เมื่อไหร่ต้องใช้ Pin?

| Use Case | ต้องใช้ Pin? |
|----------|-------------|
| Self-referential types | |
| Async/Futures | |
| Normal structs | |
| Standard library types | |

---

[← Lazy](/structs/lazy) | [Waker →](/structs/waker)
