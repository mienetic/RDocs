# Async/Await Patterns

รวม Patterns สำหรับ Async Programming ใน Rust!

---

## 1 Basic Async Function

<RustPlayground>

```rust
// async fn คืน impl Future
async fn fetch_data() -> String {
 // จำลอง async operation
 "Hello, Async!".to_string()
}

async fn main_async() {
 let data = fetch_data().await;
 println!("{}", data);
}

fn main() {
 // ต้องมี runtime เพื่อรัน async
 // เช่น tokio, async-std
 println!("Use #[tokio::main] in real code");
}
```

</RustPlayground>

---

## 2 Tokio Runtime

```rust
// Cargo.toml:
// [dependencies]
// tokio = { version = "1", features = ["full"] }

use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
 println!("Starting...");

 sleep(Duration::from_secs(1)).await;

 println!("Done after 1 second!");
}
```

---

## 3 Concurrent Execution (join!)

```rust
use tokio::time::{sleep, Duration};

async fn task_a() -> i32 {
 sleep(Duration::from_secs(2)).await;
 println!("Task A done");
 1
}

async fn task_b() -> i32 {
 sleep(Duration::from_secs(1)).await;
 println!("Task B done");
 2
}

#[tokio::main]
async fn main() {
 // รันพร้อมกัน - ใช้เวลารวม 2 วินาที (ไม่ใช่ 3)
 let (a, b) = tokio::join!(task_a(), task_b());

 println!("Results: {} + {} = {}", a, b, a + b);
}
```

---

## 4 Racing with select!

```rust
use tokio::time::{sleep, Duration};
use tokio::select;

async fn slow_task() -> &'static str {
 sleep(Duration::from_secs(5)).await;
 "slow"
}

async fn fast_task() -> &'static str {
 sleep(Duration::from_secs(1)).await;
 "fast"
}

#[tokio::main]
async fn main() {
 // ใช้ตัวที่เสร็จก่อน
 let result = select! {
 r = slow_task() => r,
 r = fast_task() => r,
 };

 println!("Winner: {}", result); // "fast"
}
```

---

## 5 Timeout Pattern

```rust
use tokio::time::{timeout, Duration};

async fn long_operation() -> String {
 tokio::time::sleep(Duration::from_secs(10)).await;
 "Done".to_string()
}

#[tokio::main]
async fn main() {
 // Timeout หลัง 2 วินาที
 match timeout(Duration::from_secs(2), long_operation()).await {
 Ok(result) => println!("Result: {}", result),
 Err(_) => println!("Operation timed out!"),
 }
}
```

---

## 6 Spawning Tasks

```rust
use tokio::task;

#[tokio::main]
async fn main() {
 // Spawn task ที่รันเป็น background
 let handle = task::spawn(async {
 println!("Running in background");
 42
 });

 // ทำอย่างอื่นได้พร้อมกัน
 println!("Main continues...");

 // รอผลลัพธ์
 let result = handle.await.unwrap();
 println!("Task returned: {}", result);
}
```

---

## 7 Async Channels

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
 // Create channel with buffer size 32
 let (tx, mut rx) = mpsc::channel(32);

 // Sender task
 let tx_clone = tx.clone();
 tokio::spawn(async move {
 for i in 0..5 {
 tx_clone.send(i).await.unwrap();
 }
 });

 // Receiver
 drop(tx); // Drop original to close channel

 while let Some(value) = rx.recv().await {
 println!("Received: {}", value);
 }
}
```

---

## 8 Async Mutex

```rust
use tokio::sync::Mutex;
use std::sync::Arc;

#[tokio::main]
async fn main() {
 let counter = Arc::new(Mutex::new(0));

 let mut handles = vec![];

 for _ in 0..10 {
 let counter = Arc::clone(&counter);
 handles.push(tokio::spawn(async move {
 let mut num = counter.lock().await;
 *num += 1;
 }));
 }

 for handle in handles {
 handle.await.unwrap();
 }

 println!("Counter: {}", *counter.lock().await);
}
```

---

## 9 Error Handling in Async

```rust
use anyhow::Result;

async fn fetch_url(url: &str) -> Result<String> {
 // reqwest::get(url).await?.text().await
 Ok(format!("Content from {}", url))
}

async fn fetch_all() -> Result<Vec<String>> {
 let urls = vec!["http://a.com", "http://b.com"];

 let mut results = vec![];
 for url in urls {
 let content = fetch_url(url).await?;
 results.push(content);
 }

 Ok(results)
}

#[tokio::main]
async fn main() -> Result<()> {
 let results = fetch_all().await?;

 for r in results {
 println!("{}", r);
 }

 Ok(())
}
```

---

## Stream Processing

```rust
use tokio_stream::{self as stream, StreamExt};

#[tokio::main]
async fn main() {
 let mut stream = stream::iter(vec![1, 2, 3, 4, 5]);

 while let Some(value) = stream.next().await {
 println!("Value: {}", value);
 }

 // With map
 let stream = stream::iter(vec![1, 2, 3])
 .map(|x| x * 2);

 let collected: Vec<_> = stream.collect().await;
 println!("Doubled: {:?}", collected);
}
```

---

## Quick Reference

| Pattern | ใช้เมื่อไหร่ |
|---------|-----------|
| `async fn` | ทำงานที่ต้องรอ (I/O, network) |
| `.await` | รอ Future เสร็จ |
| `join!` | รันหลาย futures พร้อมกัน |
| `select!` | ใช้ตัวที่เสร็จก่อน |
| `timeout()` | จำกัดเวลา |
| `spawn()` | รัน background task |
| `mpsc` | Async channel |
| `Mutex` | Shared state |

---

## Common Pitfalls

1. **อย่าใช้ `std::sync::Mutex` ใน async** - ใช้ `tokio::sync::Mutex`
2. **อย่า block ใน async** - หลีกเลี่ยง `thread::sleep()` ใช้ `tokio::time::sleep()`
3. **ระวัง deadlock** - lock แล้ว await แล้ว lock อีกครั้ง
4. **`spawn` ต้อง `'static`** - ใช้ `Arc` หรือ clone data

---

[← Error Handling](/patterns/error-handling) | [Cheat Sheet →](/cheatsheet)
