# Networking - เครือข่าย

**std::net** สำหรับ TCP/UDP networking และจัดการ IP addresses! 

---

## net มีอะไร?

- **TCP**: `TcpListener`, `TcpStream`
- **UDP**: `UdpSocket`
- **IP**: `IpAddr`, `Ipv4Addr`, `Ipv6Addr`
- **Socket**: `SocketAddr`

---

## 1. IP Addresses

<RustPlayground>

```rust
use std::net::{IpAddr, Ipv4Addr, Ipv6Addr};

fn main() {
 // IPv4
 let ipv4 = Ipv4Addr::new(192, 168, 1, 1);
 println!("IPv4: {}", ipv4);
 println!("is_loopback: {}", ipv4.is_loopback());
 println!("is_private: {}", ipv4.is_private());
 
 // IPv6
 let ipv6 = Ipv6Addr::new(0, 0, 0, 0, 0, 0, 0, 1);
 println!("\nIPv6: {}", ipv6);
 println!("is_loopback: {}", ipv6.is_loopback());
 
 // IpAddr - รวมทั้ง v4 และ v6
 let ip: IpAddr = "127.0.0.1".parse().unwrap();
 match ip {
 IpAddr::V4(v4) => println!("\nV4: {}", v4),
 IpAddr::V6(v6) => println!("\nV6: {}", v6),
 }
 
 // ค่า special
 println!("\nLocalhost: {}", Ipv4Addr::LOCALHOST);
 println!("Broadcast: {}", Ipv4Addr::BROADCAST);
 println!("Unspecified: {}", Ipv4Addr::UNSPECIFIED);
}
```

</RustPlayground>

---

## 2. Socket Addresses

<RustPlayground>

```rust
use std::net::{SocketAddr, SocketAddrV4, Ipv4Addr};

fn main() {
 // SocketAddr = IP + Port
 let addr: SocketAddr = "127.0.0.1:8080".parse().unwrap();
 println!("SocketAddr: {}", addr);
 println!("IP: {}", addr.ip());
 println!("Port: {}", addr.port());
 
 // สร้างเอง
 let addr2 = SocketAddrV4::new(Ipv4Addr::new(192, 168, 1, 1), 3000);
 println!("\nCreated: {}", addr2);
 
 // แก้ไข port
 let mut addr3 = addr;
 addr3.set_port(9000);
 println!("New port: {}", addr3);
}
```

</RustPlayground>

---

## 3. TCP Server

<RustPlayground>

```rust
use std::net::TcpListener;
use std::io::{Read, Write};

fn main() {
 // สร้าง TCP listener
 let listener = TcpListener::bind("127.0.0.1:8080")
 .expect("cannot bind");
 
 println!("Server listening on {}", listener.local_addr().unwrap());
 
 // วิธี demo: รับแค่ 1 connection แล้วจบ
 // (ปกติจะ loop ไม่มีที่สิ้นสุด)
 
 // incoming() return iterator ของ connections
 for stream in listener.incoming().take(1) {
 match stream {
 Ok(mut stream) => {
 println!("New connection from: {}", stream.peer_addr().unwrap());
 
 // อ่าน request
 let mut buffer = [0; 1024];
 if let Ok(n) = stream.read(&mut buffer) {
 println!("Received: {} bytes", n);
 }
 
 // ส่ง response
 let response = "HTTP/1.1 200 OK\r\n\r\nHello!";
 stream.write_all(response.as_bytes()).unwrap();
 }
 Err(e) => println!("Connection failed: {}", e),
 }
 }
 
 println!("Server stopped");
}
```

</RustPlayground>

---

## 4. TCP Client

<RustPlayground>

```rust
use std::net::TcpStream;
use std::io::{Read, Write};
use std::time::Duration;

fn main() {
 // เชื่อมต่อ (ตัวอย่างนี้จะ error ถ้าไม่มี server)
 match TcpStream::connect("127.0.0.1:8080") {
 Ok(mut stream) => {
 println!("Connected to server!");
 
 // ตั้ง timeout
 stream.set_read_timeout(Some(Duration::from_secs(5))).unwrap();
 stream.set_write_timeout(Some(Duration::from_secs(5))).unwrap();
 
 // ส่ง request
 stream.write_all(b"GET / HTTP/1.1\r\n\r\n").unwrap();
 
 // อ่าน response
 let mut buffer = [0; 1024];
 match stream.read(&mut buffer) {
 Ok(n) => println!("Response: {}", String::from_utf8_lossy(&buffer[..n])),
 Err(e) => println!("Read error: {}", e),
 }
 }
 Err(e) => {
 println!("Could not connect: {}", e);
 println!("(This is expected if no server is running)");
 }
 }
 
 // connect_timeout - กำหนด timeout
 match TcpStream::connect_timeout(
 &"127.0.0.1:8080".parse().unwrap(),
 Duration::from_secs(3)
 ) {
 Ok(_) => println!("Connected with timeout!"),
 Err(e) => println!("Timeout connect failed: {}", e),
 }
}
```

</RustPlayground>

---

## 5. UDP

<RustPlayground>

```rust
use std::net::UdpSocket;

fn main() {
 // สร้าง UDP socket
 let socket = UdpSocket::bind("127.0.0.1:0")
 .expect("cannot bind");
 
 println!("Socket bound to: {}", socket.local_addr().unwrap());
 
 // connect - กำหนด default destination
 // (UDP ไม่ได้ connect จริงๆ แค่จำ address)
 socket.connect("127.0.0.1:8080").ok();
 
 // send - ส่งไป connected address
 match socket.send(b"Hello UDP!") {
 Ok(n) => println!("Sent {} bytes", n),
 Err(e) => println!("Send failed: {} (expected - no receiver)", e),
 }
 
 // send_to - ส่งไป specific address
 match socket.send_to(b"Hello!", "127.0.0.1:8081") {
 Ok(n) => println!("Sent {} bytes to 8081", n),
 Err(e) => println!("Send to failed: {}", e),
 }
 
 // recv_from - รับพร้อมรู้ว่าจากใคร
 socket.set_nonblocking(true).unwrap();
 let mut buf = [0; 1024];
 match socket.recv_from(&mut buf) {
 Ok((n, addr)) => println!("Received {} bytes from {}", n, addr),
 Err(e) => println!("No data: {} (expected - no sender)", e),
 }
}
```

</RustPlayground>

---

## 6. Non-blocking และ Timeout

<RustPlayground>

```rust
use std::net::TcpListener;
use std::time::Duration;

fn main() {
 let listener = TcpListener::bind("127.0.0.1:0").unwrap();
 println!("Listening on: {}", listener.local_addr().unwrap());
 
 // Non-blocking mode
 listener.set_nonblocking(true).expect("cannot set nonblocking");
 
 // พยายาม accept (จะ return error ทันทีถ้าไม่มี connection)
 match listener.accept() {
 Ok((stream, addr)) => println!("Got connection from {}", addr),
 Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
 println!("No connection waiting (non-blocking)");
 }
 Err(e) => println!("Accept error: {}", e),
 }
 
 // TCP stream with timeouts
 // (ต้องมี connection จริงถึงจะใช้ได้)
 // stream.set_read_timeout(Some(Duration::from_secs(5))).unwrap();
 // stream.set_write_timeout(Some(Duration::from_secs(5))).unwrap();
 // stream.set_nodelay(true).unwrap(); // Disable Nagle's algorithm
}
```

</RustPlayground>

---

## 7. DNS Lookup

<RustPlayground>

```rust
use std::net::ToSocketAddrs;

fn main() {
 // ToSocketAddrs trait แปลง hostname เป็น addresses
 let host = "localhost:80";
 
 match host.to_socket_addrs() {
 Ok(addrs) => {
 println!("Addresses for '{}':", host);
 for addr in addrs {
 println!(" {}", addr);
 }
 }
 Err(e) => println!("Lookup failed: {}", e),
 }
 
 // ลอง domain จริง
 let domain = "example.com:443";
 match domain.to_socket_addrs() {
 Ok(addrs) => {
 println!("\nAddresses for '{}':", domain);
 for addr in addrs {
 println!(" {}", addr);
 }
 }
 Err(e) => println!("Lookup failed: {}", e),
 }
}
```

</RustPlayground>

---

## Quick Reference

### IP Types
| Type | คำอธิบาย |
|------|---------|
| `IpAddr` | V4 หรือ V6 |
| `Ipv4Addr` | IPv4 เท่านั้น |
| `Ipv6Addr` | IPv6 เท่านั้น |
| `SocketAddr` | IP + Port |

### TCP
| Type/Method | คำอธิบาย |
|-------------|---------|
| `TcpListener::bind()` | สร้าง server |
| `listener.incoming()` | รับ connections |
| `TcpStream::connect()` | เชื่อมต่อ server |
| `stream.read()` | อ่านข้อมูล |
| `stream.write()` | เขียนข้อมูล |

### UDP
| Method | คำอธิบาย |
|--------|---------|
| `UdpSocket::bind()` | สร้าง socket |
| `socket.send()` | ส่ง (connected) |
| `socket.send_to()` | ส่งไป address |
| `socket.recv()` | รับ |
| `socket.recv_from()` | รับพร้อม address |

### Options
| Method | คำอธิบาย |
|--------|---------|
| `set_nonblocking()` | non-blocking mode |
| `set_read_timeout()` | read timeout |
| `set_write_timeout()` | write timeout |
| `set_nodelay()` | disable Nagle |

---

[← Process](./process) | [Time →](./time)
