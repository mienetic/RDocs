# Waker & Context (std::task)

Types สำหรับ Async Task Management!

---

## Waker

ใช้ปลุก async task เมื่อพร้อม

<RustPlayground>

```rust
use std::task::{Waker, RawWaker, RawWakerVTable};
use std::ptr;

// สร้าง dummy waker สำหรับ demo
fn create_waker() -> Waker {
 fn clone(_: *const ()) -> RawWaker {
 RawWaker::new(ptr::null(), &VTABLE)
 }
 fn wake(_: *const ()) {}
 fn wake_by_ref(_: *const ()) {}
 fn drop(_: *const ()) {}

 static VTABLE: RawWakerVTable = RawWakerVTable::new(
 clone,
 wake,
 wake_by_ref,
 drop,
 );

 let raw = RawWaker::new(ptr::null(), &VTABLE);
 unsafe { Waker::from_raw(raw) }
}

fn main() {
 let waker = create_waker();

 // ปลุก task
 waker.wake_by_ref();

 println!("Task woken!");
}
```

</RustPlayground>

---

## Context

Context สำหรับ polling futures

<RustPlayground>

```rust
use std::pin::Pin;
use std::future::Future;
use std::task::{Context, Poll, Waker, RawWaker, RawWakerVTable};
use std::ptr;

struct SimpleFuture {
 completed: bool,
}

impl Future for SimpleFuture {
 type Output = &'static str;

 fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
 if self.completed {
 Poll::Ready("Done!")
 } else {
 self.completed = true;
 // ในความเป็นจริง จะ schedule wake ที่นี่
 // cx.waker().wake_by_ref();
 Poll::Pending
 }
 }
}

fn main() {
 // สร้าง waker และ context
 fn noop_clone(_: *const ()) -> RawWaker {
 RawWaker::new(ptr::null(), &VTABLE)
 }
 fn noop(_: *const ()) {}

 static VTABLE: RawWakerVTable = RawWakerVTable::new(
 noop_clone, noop, noop, noop,
 );

 let waker = unsafe {
 Waker::from_raw(RawWaker::new(ptr::null(), &VTABLE))
 };
 let mut cx = Context::from_waker(&waker);

 let mut future = SimpleFuture { completed: false };
 let mut pinned = Pin::new(&mut future);

 // Poll ครั้งแรก
 match pinned.as_mut().poll(&mut cx) {
 Poll::Ready(v) => println!("Ready: {}", v),
 Poll::Pending => println!("Still pending..."),
 }

 // Poll ครั้งที่สอง
 match pinned.poll(&mut cx) {
 Poll::Ready(v) => println!("Ready: {}", v),
 Poll::Pending => println!("Still pending..."),
 }
}
```

</RustPlayground>

---

## Wake Pattern

```rust
use std::task::Wake;
use std::sync::Arc;

// Implement Wake trait (ง่ายกว่า manual vtable)
struct MyWaker {
 // สามารถเก็บ thread handle, channel, etc.
}

impl Wake for MyWaker {
 fn wake(self: Arc<Self>) {
 println!("Task woken via Arc!");
 }

 fn wake_by_ref(self: &Arc<Self>) {
 println!("Task woken by ref!");
 }
}

fn create_waker() -> std::task::Waker {
 Arc::new(MyWaker {}).into()
}
```

---

## Quick Reference

| Type | คำอธิบาย |
|------|---------|
| `Waker` | ปลุก async task |
| `Context` | Context สำหรับ polling |
| `RawWaker` | Low-level waker |
| `RawWakerVTable` | VTable สำหรับ waker ops |
| `Wake` | Trait สำหรับง่ายสร้าง waker |

---

## Methods

| Method | คำอธิบาย |
|--------|---------|
| `wake()` | ปลุกและ consume waker |
| `wake_by_ref()` | ปลุกโดยไม่ consume |
| `will_wake(other)` | เปรียบเทียบ wakers |
| `clone()` | Clone waker |

---

[← Pin](/structs/pin) | [BStr →](/structs/bstr)
