# Async/Await

เขียน asynchronous code ใน Rust!

## Async คืออะไร?

Asynchronous programming ช่วยให้โปรแกรมทำงานหลายอย่างพร้อมกันโดยไม่ block

### เปรียบเทียบ Sync vs Async

| | Synchronous | Asynchronous |
|---|-------------|--------------|
| การทำงาน | รอจบก่อนไปต่อ | ไม่รอ สลับทำงานได้ |
| Thread | 1 task = 1 thread | หลาย tasks = 1 thread |
| Memory | ใช้เยอะ | ใช้น้อย |
| ใช้เมื่อ | CPU-bound | I/O-bound |

## Basic Async/Await

<RustPlayground>

```rust
// async fn return Future
async fn hello_async() -> String {
    String::from("Hello from async!")
}

// ตัวอย่าง async ง่ายๆ (ต้องใช้ runtime เช่น tokio)
async fn compute() -> i32 {
    let x = 10;
    let y = 20;
    x + y
}

fn main() {
    // Future ต้อง await หรือใช้ runtime
    // ใน playground ไม่มี runtime แสดงแค่ concept
    println!("Async functions created!");
    println!("They return Future<Output = T>");
}
```

</RustPlayground>

## Futures

Future คือ value ที่อาจยังไม่พร้อม

<RustPlayground>

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

// Custom Future (แบบ manual - ปกติไม่ต้องทำ)
struct MyFuture {
    complete: bool,
}

impl Future for MyFuture {
    type Output = String;
    
    fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
        if self.complete {
            Poll::Ready(String::from("Done!"))
        } else {
            self.complete = true;
            Poll::Pending
        }
    }
}

fn main() {
    println!("Future trait มี 2 states:");
    println!("- Poll::Pending = ยังไม่เสร็จ");
    println!("- Poll::Ready(value) = เสร็จแล้ว");
}
```

</RustPlayground>

## ใช้กับ Tokio Runtime

```toml
# Cargo.toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

```rust
use tokio::time::{sleep, Duration};

async fn task_one() {
    println!("Task 1 starting");
    sleep(Duration::from_secs(2)).await;
    println!("Task 1 done");
}

async fn task_two() {
    println!("Task 2 starting");
    sleep(Duration::from_secs(1)).await;
    println!("Task 2 done");
}

#[tokio::main]
async fn main() {
    // ทั้งสอง task ทำงานพร้อมกัน
    let (r1, r2) = tokio::join!(task_one(), task_two());
    
    println!("Both tasks completed!");
}
```

## async Block

<RustPlayground>

```rust
fn main() {
    // async block สร้าง Future inline
    let future = async {
        let x = 10;
        let y = 20;
        x + y
    };
    
    // async move - ย้าย ownership เข้าไป
    let name = String::from("Rust");
    
    let greet_future = async move {
        // name ถูก move เข้ามา
        format!("Hello, {}!", name)
    };
    
    // name ใช้ไม่ได้แล้ว
    // println!("{}", name);  // ERROR
    
    println!("Futures created but not executed");
    println!("Need runtime like tokio to run them");
}
```

</RustPlayground>

## Concurrent Execution

### join! - รันพร้อมกัน

```rust
use tokio::join;

async fn fetch_user() -> String {
    // simulate API call
    String::from("User data")
}

async fn fetch_posts() -> Vec<String> {
    // simulate API call
    vec![String::from("Post 1"), String::from("Post 2")]
}

#[tokio::main]
async fn main() {
    // รันพร้อมกัน, รอทั้งหมดเสร็จ
    let (user, posts) = join!(fetch_user(), fetch_posts());
    
    println!("User: {}", user);
    println!("Posts: {:?}", posts);
}
```

### select! - รอตัวแรกที่เสร็จ

```rust
use tokio::select;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    select! {
        _ = sleep(Duration::from_secs(1)) => {
            println!("1 second passed");
        }
        _ = sleep(Duration::from_secs(2)) => {
            println!("2 seconds passed");
        }
    }
    // แค่อันแรกที่เสร็จ (1 second) จะถูก run
}
```

## Spawning Tasks

```rust
use tokio::task;

#[tokio::main]
async fn main() {
    // spawn สร้าง independent task
    let handle = task::spawn(async {
        // ทำงานใน background
        println!("Running in background");
        42
    });
    
    // รอ task เสร็จ
    let result = handle.await.unwrap();
    println!("Task returned: {}", result);
}
```

## Error Handling ใน Async

```rust
use std::io;

async fn read_file(path: &str) -> Result<String, io::Error> {
    // simulate reading
    if path.is_empty() {
        Err(io::Error::new(io::ErrorKind::NotFound, "File not found"))
    } else {
        Ok(format!("Contents of {}", path))
    }
}

#[tokio::main]
async fn main() {
    // ใช้ ? กับ async ได้
    match read_file("test.txt").await {
        Ok(contents) => println!("{}", contents),
        Err(e) => println!("Error: {}", e),
    }
}
```

## Async Traits (Rust 2024)

Rust 2024 edition รองรับ async functions ใน traits:

```rust
// Rust 2024 Edition
trait Database {
    async fn connect(&self) -> Result<(), Error>;
    async fn query(&self, sql: &str) -> Result<Vec<Row>, Error>;
}

impl Database for PostgreSQL {
    async fn connect(&self) -> Result<(), Error> {
        // ...
    }
    
    async fn query(&self, sql: &str) -> Result<Vec<Row>, Error> {
        // ...
    }
}
```

## Async Closures (Rust 2024)

```rust
// Rust 2024: async closures
let fetch = async |url: &str| {
    // ทำ HTTP request
    format!("Response from {}", url)
};

// ใช้งาน
let result = fetch("https://example.com").await;
```

## Stream - Async Iterator

```rust
use tokio_stream::{self as stream, StreamExt};

#[tokio::main]
async fn main() {
    let mut stream = stream::iter(vec![1, 2, 3, 4, 5]);
    
    while let Some(value) = stream.next().await {
        println!("Got: {}", value);
    }
}
```

## Common Async Patterns

### Timeout

```rust
use tokio::time::{timeout, Duration};

#[tokio::main]
async fn main() {
    let result = timeout(
        Duration::from_secs(5),
        slow_operation()
    ).await;
    
    match result {
        Ok(value) => println!("Got: {:?}", value),
        Err(_) => println!("Timed out!"),
    }
}
```

### Retry

```rust
async fn fetch_with_retry(url: &str, max_retries: u32) -> Result<String, Error> {
    let mut attempts = 0;
    
    loop {
        match fetch(url).await {
            Ok(result) => return Ok(result),
            Err(e) if attempts < max_retries => {
                attempts += 1;
                sleep(Duration::from_secs(1)).await;
            }
            Err(e) => return Err(e),
        }
    }
}
```

## เปรียบเทียบ Async Runtimes

| Runtime | ข้อดี | ใช้เมื่อ |
|---------|------|---------|
| **Tokio** | Full-featured, popular | General use |
| **async-std** | std-like API | Familiar syntax |
| **smol** | Minimal | Lightweight apps |

## สรุป

| Concept | คำอธิบาย |
|---------|---------|
| `async fn` | Function ที่ return Future |
| `.await` | รอ Future เสร็จ |
| `tokio::spawn` | สร้าง task ใหม่ |
| `join!` | รันหลาย futures พร้อมกัน |
| `select!` | รอ future ตัวแรกที่เสร็จ |

---

[บทถัดไป: Macros](./macros)
