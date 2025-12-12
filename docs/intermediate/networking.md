# Networking

สร้าง Network Applications ด้วย Rust! 🌐

:::tip Rust สำหรับ Networking = เหมาะมาก!
Memory safety และ zero-cost abstractions ทำให้ Rust เหมาะกับ network programming!
:::

---

## 1. TCP Basics

### 1.1 TCP Client

```rust
use std::io::{Read, Write};
use std::net::TcpStream;

fn main() -> std::io::Result<()> {
    // เชื่อมต่อไปยัง server
    let mut stream = TcpStream::connect("127.0.0.1:8080")?;
    
    // ส่งข้อมูล
    stream.write_all(b"Hello, Server!")?;
    
    // รับข้อมูลกลับ
    let mut buffer = [0; 1024];
    let n = stream.read(&mut buffer)?;
    
    println!("Received: {}", String::from_utf8_lossy(&buffer[..n]));
    
    Ok(())
}
```

### 1.2 TCP Server

```rust
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;

fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    
    loop {
        match stream.read(&mut buffer) {
            Ok(0) => break, // Connection closed
            Ok(n) => {
                println!("Received: {}", String::from_utf8_lossy(&buffer[..n]));
                stream.write_all(&buffer[..n]).unwrap();
            }
            Err(_) => break,
        }
    }
}

fn main() -> std::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:8080")?;
    println!("Server listening on port 8080");
    
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                thread::spawn(|| {
                    handle_client(stream);
                });
            }
            Err(e) => eprintln!("Error: {}", e),
        }
    }
    
    Ok(())
}
```

---

## 2. UDP

### 2.1 UDP Client

```rust
use std::net::UdpSocket;

fn main() -> std::io::Result<()> {
    let socket = UdpSocket::bind("127.0.0.1:0")?;
    
    // ส่ง datagram
    socket.send_to(b"Hello, UDP!", "127.0.0.1:8080")?;
    
    // รับ response
    let mut buffer = [0; 1024];
    let (n, src) = socket.recv_from(&mut buffer)?;
    
    println!("Received from {}: {}", src, String::from_utf8_lossy(&buffer[..n]));
    
    Ok(())
}
```

### 2.2 UDP Server

```rust
use std::net::UdpSocket;

fn main() -> std::io::Result<()> {
    let socket = UdpSocket::bind("127.0.0.1:8080")?;
    println!("UDP Server listening on port 8080");
    
    let mut buffer = [0; 1024];
    
    loop {
        let (n, src) = socket.recv_from(&mut buffer)?;
        println!("Received from {}: {}", src, String::from_utf8_lossy(&buffer[..n]));
        
        // Echo back
        socket.send_to(&buffer[..n], src)?;
    }
}
```

---

## 3. HTTP Client (reqwest)

### 3.1 Setup

```toml
[dependencies]
reqwest = { version = "0.11", features = ["json", "blocking"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### 3.2 Blocking Client

```rust
use reqwest::blocking::Client;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct Post {
    id: u32,
    title: String,
    body: String,
}

fn main() -> Result<(), reqwest::Error> {
    let client = Client::new();
    
    // GET request
    let response = client
        .get("https://jsonplaceholder.typicode.com/posts/1")
        .send()?;
    
    let post: Post = response.json()?;
    println!("Post: {:#?}", post);
    
    Ok(())
}
```

### 3.3 Async Client

```rust
use reqwest;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct NewPost {
    title: String,
    body: String,
    user_id: u32,
}

#[derive(Deserialize, Debug)]
struct Post {
    id: u32,
    title: String,
}

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let client = reqwest::Client::new();
    
    // GET
    let posts: Vec<Post> = client
        .get("https://jsonplaceholder.typicode.com/posts")
        .query(&[("_limit", "5")])
        .send()
        .await?
        .json()
        .await?;
    
    println!("Got {} posts", posts.len());
    
    // POST
    let new_post = NewPost {
        title: String::from("My Post"),
        body: String::from("Content here"),
        user_id: 1,
    };
    
    let response = client
        .post("https://jsonplaceholder.typicode.com/posts")
        .json(&new_post)
        .send()
        .await?;
    
    println!("Created: {:?}", response.status());
    
    Ok(())
}
```

---

## 4. DNS Lookup

```rust
use std::net::ToSocketAddrs;

fn main() {
    let host = "www.rust-lang.org:443";
    
    match host.to_socket_addrs() {
        Ok(addrs) => {
            for addr in addrs {
                println!("{}", addr);
            }
        }
        Err(e) => eprintln!("DNS lookup failed: {}", e),
    }
}
```

---

## 5. Async TCP with Tokio

### 5.1 Async Server

```rust
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:8080").await?;
    println!("Server listening on port 8080");
    
    loop {
        let (mut socket, addr) = listener.accept().await?;
        println!("New connection from {}", addr);
        
        tokio::spawn(async move {
            let mut buffer = [0; 1024];
            
            loop {
                match socket.read(&mut buffer).await {
                    Ok(0) => break,
                    Ok(n) => {
                        if socket.write_all(&buffer[..n]).await.is_err() {
                            break;
                        }
                    }
                    Err(_) => break,
                }
            }
        });
    }
}
```

### 5.2 Async Client

```rust
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut stream = TcpStream::connect("127.0.0.1:8080").await?;
    
    stream.write_all(b"Hello, async world!").await?;
    
    let mut buffer = [0; 1024];
    let n = stream.read(&mut buffer).await?;
    
    println!("Received: {}", String::from_utf8_lossy(&buffer[..n]));
    
    Ok(())
}
```

---

## 6. WebSocket (tokio-tungstenite)

### 6.1 Setup

```toml
[dependencies]
tokio-tungstenite = "0.20"
tokio = { version = "1", features = ["full"] }
futures-util = "0.3"
```

### 6.2 WebSocket Client

```rust
use tokio_tungstenite::connect_async;
use futures_util::{SinkExt, StreamExt};
use tungstenite::Message;

#[tokio::main]
async fn main() {
    let url = "wss://echo.websocket.org";
    
    let (mut ws_stream, _) = connect_async(url).await.expect("Failed to connect");
    println!("Connected!");
    
    // Send message
    ws_stream.send(Message::Text("Hello!".into())).await.unwrap();
    
    // Receive response
    if let Some(msg) = ws_stream.next().await {
        println!("Received: {:?}", msg);
    }
}
```

---

## 7. Error Handling

```rust
use std::io;
use thiserror::Error;

#[derive(Error, Debug)]
enum NetworkError {
    #[error("Connection failed: {0}")]
    ConnectionFailed(#[from] io::Error),
    
    #[error("Timeout")]
    Timeout,
    
    #[error("Invalid response")]
    InvalidResponse,
}

fn connect() -> Result<(), NetworkError> {
    // Simulated connection
    Ok(())
}
```

---

## 8. สรุป

| Protocol | Crate |
|----------|-------|
| TCP | `std::net` |
| UDP | `std::net` |
| HTTP | `reqwest` |
| WebSocket | `tokio-tungstenite` |
| Async I/O | `tokio` |

| Pattern | Use Case |
|---------|----------|
| Blocking | Simple scripts |
| Thread per connection | Moderate concurrency |
| Async (tokio) | High concurrency |

---

[บทถัดไป: Date & Time](/intermediate/datetime)
