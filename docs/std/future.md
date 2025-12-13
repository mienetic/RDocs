# Future - Async Programming

**std::future** มี traits พื้นฐานสำหรับ asynchronous programming! 

---

## Future คืออะไร?

`Future` คือค่าที่จะพร้อมในอนาคต:
- `async fn` return Future
- ใช้ `.await` เพื่อรอผลลัพธ์
- ไม่ block thread (non-blocking)

:::tip ใช้กับ Runtime
std::future แค่กำหนด traits ต้องใช้ runtime เช่น `tokio` หรือ `async-std` เพื่อ run futures
:::

---

## 1. async/await พื้นฐาน

<RustPlayground>

```rust
// async fn return impl Future
async fn hello() -> String {
 String::from("Hello, async!")
}

async fn add(a: i32, b: i32) -> i32 {
 a + b
}

async fn greet(name: &str) -> String {
 format!("Hello, {}!", name)
}

fn main() {
 // Future ยังไม่ทำงานจนกว่าจะ await
 let future = hello();
 println!("Future created (not yet executed)");
 
 // ต้องใช้ runtime เพื่อ execute
 // เช่น tokio::main หรือ block_on
 
 // แสดง type ของ future
 println!("Future type: std::future::Future<Output = String>");
}
```

</RustPlayground>

---

## 2. Future Trait

<RustPlayground>

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

// Custom Future
struct CountDown {
 count: u32,
}

impl Future for CountDown {
 type Output = String;
 
 fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
 if self.count == 0 {
 Poll::Ready("Blast off!".to_string())
 } else {
 println!("Countdown: {}", self.count);
 self.count -= 1;
 // ในจริงจะใช้ cx.waker() เพื่อ schedule re-poll
 Poll::Pending
 }
 }
}

fn main() {
 let countdown = CountDown { count: 3 };
 println!("Created CountDown future");
 
 // poll ต้องใช้ executor
 // ที่นี่แค่แสดงโครงสร้าง
}
```

</RustPlayground>

---

## 3. Poll และ Waker

<RustPlayground>

```rust
use std::task::Poll;

fn main() {
 // Poll<T> มี 2 variants
 let ready: Poll<i32> = Poll::Ready(42);
 let pending: Poll<i32> = Poll::Pending;
 
 // ตรวจสอบ
 println!("ready.is_ready(): {}", ready.is_ready());
 println!("pending.is_pending(): {}", pending.is_pending());
 
 // map
 let doubled = ready.map(|x| x * 2);
 println!("doubled: {:?}", doubled);
 
 // match
 match ready {
 Poll::Ready(val) => println!("Got value: {}", val),
 Poll::Pending => println!("Not ready yet"),
 }
 
 // ready! macro (return Pending if not ready)
 // let value = std::task::ready!(some_poll);
}
```

</RustPlayground>

---

## 4. async block

<RustPlayground>

```rust
use std::future::Future;

fn main() {
 // async block สร้าง Future
 let future = async {
 println!("Inside async block");
 42
 };
 
 // async block สามารถ capture variables
 let name = String::from("Rust");
 let greeting = async move {
 format!("Hello, {}!", name)
 };
 
 // async block กับ conditions
 let conditional = async {
 if true {
 "yes"
 } else {
 "no"
 }
 };
 
 println!("Created async blocks");
 
 // เหล่านี้เป็น Future ต้อง await ใน async context
}
```

</RustPlayground>

---

## 5. Combining Futures

<RustPlayground>

```rust
// ตัวอย่างโครงสร้าง - ต้องใช้ runtime จริงๆ

async fn fetch_user() -> String {
 // simulate async work
 "Alice".to_string()
}

async fn fetch_data() -> Vec<i32> {
 vec![1, 2, 3]
}

async fn process() -> String {
 // Sequential: รอทีละอัน
 let user = fetch_user().await;
 let data = fetch_data().await;
 
 format!("{}: {:?}", user, data)
}

// Concurrent: รอพร้อมกัน (ต้องใช้ join!)
// let (user, data) = tokio::join!(fetch_user(), fetch_data());

fn main() {
 let _future = process();
 println!("Created combined future");
 
 // ใน runtime จริง:
 // #[tokio::main]
 // async fn main() {
 // let result = process().await;
 // println!("{}", result);
 // }
}
```

</RustPlayground>

---

## 6. Pin และ Future

<RustPlayground>

```rust
use std::future::Future;
use std::pin::Pin;

// Boxed future - ใช้บ่อยใน trait objects
type BoxFuture<'a, T> = Pin<Box<dyn Future<Output = T> + Send + 'a>>;

fn returns_future() -> BoxFuture<'static, i32> {
 Box::pin(async {
 42
 })
}

// Generic function ที่รับ Future
fn execute_future<F>(future: F) 
where 
 F: Future<Output = i32>
{
 println!("Would execute future here");
 // ต้องใช้ executor จริงๆ
}

fn main() {
 let boxed = returns_future();
 println!("Created BoxFuture");
 
 let inline = async { 100 };
 execute_future(inline);
}
```

</RustPlayground>

---

## 7. ตัวอย่างกับ Tokio

```rust
// ต้องเพิ่ม tokio ใน Cargo.toml:
// [dependencies]
// tokio = { version = "1", features = ["full"] }

use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
 println!("Starting...");
 
 // async sleep ไม่ block thread
 sleep(Duration::from_secs(1)).await;
 
 println!("After 1 second");
 
 // Concurrent execution
 let (a, b) = tokio::join!(
 async { 1 + 1 },
 async { 2 + 2 }
 );
 
 println!("Results: a={}, b={}", a, b);
 
 // Spawn tasks
 let handle = tokio::spawn(async {
 sleep(Duration::from_millis(100)).await;
 "from spawned task"
 });
 
 let result = handle.await.unwrap();
 println!("{}", result);
}
```

:::info ต้องใช้ Runtime
code ด้านบนต้องใช้ tokio runtime จะไม่ทำงานใน Rust Playground ปกติ
:::

---

## Quick Reference

### Future Trait
```rust
trait Future {
 type Output;
 fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
```

### Poll
| Variant | ความหมาย |
|---------|----------|
| `Poll::Ready(val)` | พร้อม มีค่า |
| `Poll::Pending` | ยังไม่พร้อม |

### async/await
| Syntax | คำอธิบาย |
|--------|---------|
| `async fn f()` | ฟังก์ชัน async |
| `async { ... }` | async block |
| `future.await` | รอผลลัพธ์ |

### Common Patterns
| Pattern | ใช้เมื่อ |
|---------|--------|
| `Box::pin(async {...})` | Dynamic dispatch |
| `impl Future<Output=T>` | Static dispatch |
| `async move { }` | Capture ownership |

### Runtimes
| Runtime | ใช้สำหรับ |
|---------|---------|
| tokio | Production, full-featured |
| async-std | Simple async runtime |
| futures | Utilities only |
| smol | Lightweight |

---

[← Pin](./pin) | [Index →](./index)
