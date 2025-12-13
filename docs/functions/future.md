# Future Functions (std::future)

Functions สำหรับ Async/Await!

---

## ready

สร้าง Future ที่พร้อมให้ค่าทันที

<RustPlayground>

```rust
use std::future;

async fn example() {
 // ready() สร้าง Future ที่ resolve ทันที
 let value = future::ready(42).await;
 println!("Value: {}", value);

 // เหมาะสำหรับ return ค่าจาก async fn
 // ที่ไม่ต้องรอ I/O
}

fn main() {
 // ใน real code จะใช้กับ runtime เช่น tokio
 println!("future::ready creates an immediately ready Future");
}
```

</RustPlayground>

---

## pending

สร้าง Future ที่ไม่มีวัน resolve

<RustPlayground>

```rust
use std::future;

async fn timeout_example() {
 // pending() ไม่มีวัน resolve
 // มักใช้กับ select! เพื่อรอ condition อื่น

 // ตัวอย่าง (pseudo-code):
 // select! {
 // _ = future::pending::<()>() => unreachable!(),
 // result = some_async_operation() => result,
 // }
}

fn main() {
 println!("future::pending creates a Future that never resolves");
}
```

</RustPlayground>

---

## poll_fn

สร้าง Future จาก closure

<RustPlayground>

```rust
use std::future::poll_fn;
use std::task::Poll;

async fn custom_future() {
 let mut counter = 0;

 let result = poll_fn(|_cx| {
 counter += 1;
 if counter >= 3 {
 Poll::Ready(counter)
 } else {
 Poll::Pending // ยังไม่พร้อม
 }
 }).await;

 println!("Result: {}", result);
}

fn main() {
 println!("poll_fn creates a Future from a closure");
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Return Type |
|----------|---------|-------------|
| `ready(value)` | Future ที่พร้อมทันที | `Ready<T>` |
| `pending()` | Future ที่ไม่ resolve | `Pending<T>` |
| `poll_fn(f)` | Future จาก closure | `PollFn<F>` |

---

[← Compare](./cmp) | [I/O →](./io)
