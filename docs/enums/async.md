# Async Enums

`Poll` สำหรับ async/await! 

---

## Poll - สถานะ Future

`Poll` enum ใช้โดย async runtime เพื่อตรวจสอบว่า Future พร้อมหรือยัง

<RustPlayground>

```rust
use std::task::Poll;

fn main() {
 // Poll มี 2 variants
 let ready: Poll<i32> = Poll::Ready(42);
 let pending: Poll<i32> = Poll::Pending;
 
 println!("ready: {:?}", ready);
 println!("pending: {:?}", pending);
 
 // Pattern matching
 match ready {
 Poll::Ready(value) => println!("Value is ready: {}", value),
 Poll::Pending => println!("Still waiting..."),
 }
 
 // is_ready / is_pending
 println!("\nready.is_ready(): {}", ready.is_ready());
 println!("pending.is_pending(): {}", pending.is_pending());
}
```

</RustPlayground>

---

## Poll Methods

<RustPlayground>

```rust
use std::task::Poll;

fn main() {
 let ready: Poll<i32> = Poll::Ready(10);
 let pending: Poll<i32> = Poll::Pending;
 
 // map - แปลงค่าถ้า Ready
 let doubled = ready.map(|n| n * 2);
 println!("map Ready(10) * 2: {:?}", doubled);
 
 let mapped_pending = pending.map(|n| n * 2);
 println!("map Pending: {:?}", mapped_pending);
 
 // map_ok / map_err สำหรับ Poll<Result<T, E>>
 let result_poll: Poll<Result<i32, &str>> = Poll::Ready(Ok(5));
 let mapped = result_poll.map(|r| r.map(|n| n + 10));
 println!("Poll<Result>: {:?}", mapped);
}
```

</RustPlayground>

---

## Poll ใน Custom Future

<RustPlayground>

```rust
use std::task::Poll;
use std::future::Future;
use std::pin::Pin;
use std::task::Context;

// Simple counter future
struct CountDown {
 count: u32,
}

impl Future for CountDown {
 type Output = &'static str;
 
 fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
 if self.count == 0 {
 Poll::Ready("Done!")
 } else {
 println!("Counting: {}", self.count);
 self.count -= 1;
 // ในจริงจะ wake ทีหลัง
 Poll::Pending
 }
 }
}

fn main() {
 // สาธิต (ไม่ได้ run จริง)
 println!("Poll::Ready - Future เสร็จแล้ว มีค่า");
 println!("Poll::Pending - Future ยังไม่เสร็จ รอต่อ");
 
 let countdown = CountDown { count: 3 };
 println!("\nCreated CountDown future");
 
 // ใน async runtime จะ poll จนกว่าจะ Ready
}
```

</RustPlayground>

---

## Quick Reference

### Poll
| Variant | คำอธิบาย |
|---------|---------|
| `Ready(T)` | Future เสร็จแล้ว มีค่า T |
| `Pending` | Future ยังไม่เสร็จ |

### Poll Methods
| Method | คำอธิบาย |
|--------|---------|
| `is_ready()` | เสร็จแล้วไหม |
| `is_pending()` | รออยู่ไหม |
| `map(f)` | แปลงค่า Ready |

### การใช้งาน Poll
1. **Async Runtime** poll Future
2. ถ้าได้ `Pending` → register waker แล้วรอ
3. เมื่อพร้อม → waker จะปลุก
4. poll อีกครั้ง → ได้ `Ready(value)`

---

[← Net](./net) | [Channel →](./channel)
