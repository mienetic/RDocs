# Future Trait

`Future` trait หัวใจของ Async Rust!

---

## Future Basics

`Future` คือค่าที่จะมีในอนาคต (Asynchronous computation)

<RustPlayground>

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

struct SimpleFuture {
 count: u32,
}

impl Future for SimpleFuture {
 type Output = u32;

 fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
 self.count += 1;
 if self.count < 3 {
 println!("Polling... {}", self.count);
 // ปลุกตัวเองให้ poll อีกครั้ง (ในของจริงจะรอ IO event)
 cx.waker().wake_by_ref();
 Poll::Pending
 } else {
 Poll::Ready(self.count)
 }
 }
}

// จำลองการรัน Executor (ปกติใช้ tokio::main)
fn block_on<F: Future>(mut future: F) -> F::Output {
 use std::task::{RawWaker, RawWakerVTable, Waker};

 fn dummy_raw_waker() -> RawWaker {
 fn no_op(_: *const ()) {}
 fn clone(_: *const ()) -> RawWaker { dummy_raw_waker() }
 let vtable = &RawWakerVTable::new(clone, no_op, no_op, no_op);
 RawWaker::new(std::ptr::null(), vtable)
 }

 let waker = unsafe { Waker::from_raw(dummy_raw_waker()) };
 let mut cx = Context::from_waker(&waker);
 let mut future = unsafe { Pin::new_unchecked(&mut future) };

 loop {
 match future.as_mut().poll(&mut cx) {
 Poll::Ready(val) => return val,
 Poll::Pending => continue,
 }
 }
}

fn main() {
 let future = SimpleFuture { count: 0 };
 let result = block_on(future);
 println!("Future completed: {}", result);
}
```

</RustPlayground>

---

## Async / Await

ในทางปฏิบัติ เราใช้ `async fn` ซึ่ง return Future อัตโนมัติ

<RustPlayground>

```rust
use std::future::Future;

// async fn returns "impl Future<Output = i32>"
async fn calculate() -> i32 {
 println!("Calculating...");
 42
}

async fn do_work() {
 println!("Start work");
 let result = calculate().await;
 println!("Got result: {}", result);
}

// Mock executor
fn main() {
 // ในโปรแกรมจริงใช้ #[tokio::main]
 // let future = do_work();
 // block_on(future);
 println!("Async example syntax check (requires runtime to execute)");
}
```

</RustPlayground>

---

## Quick Reference

### Future Trait
| Trait | Method | คำอธิบาย |
|-------|--------|---------|
| `Future` | `poll` | ขับเคลื่อน state machine |

### Async Types
| Keyword | คำอธิบาย |
|---------|---------|
| `async fn` | ฟังก์ชันที่ return Future |
| `.await` | รอ Future จนเสร็จ (non-blocking) |
| `Pin` | ตรึงตำแหน่งใน memory (จำเป็นสำหรับ Future) |
| `Context` | เก็บ Waker สำหรับแจ้งเตือน |
| `Poll` | Enum: `Ready(T)` หรือ `Pending` |

---

[← Memory](./memory) | [Index →](./index)
