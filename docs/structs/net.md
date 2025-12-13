# Net Structs - Networking

`TcpListener`, `TcpStream`, `UdpSocket` สำหรับ networking! 

---

## TcpListener - TCP Server

<RustPlayground>

```rust
use std::net::TcpListener;
use std::io::{Read, Write};

fn main() {
 // Note: ตัวอย่างนี้ต้องรันบน local machine
 // ใน playground อาจไม่ทำงาน
 
 println!("TCP Server Example:");
 println!(" let listener = TcpListener::bind(\"127.0.0.1:8080\")?;");
 println!(" for stream in listener.incoming() {{");
 println!(" handle_connection(stream?);");
 println!(" }}");
 
 // แสดงวิธีใช้
 println!("\nMethods:");
 println!(" bind(addr) - สร้าง listener");
 println!(" incoming() - รับ connections");
 println!(" local_addr() - ดู address");
}
```

</RustPlayground>

---

## TcpStream - TCP Connection

<RustPlayground>

```rust
use std::io::{Read, Write};

fn main() {
 println!("TCP Stream Example:");
 println!(" let mut stream = TcpStream::connect(\"example.com:80\")?;");
 println!(" stream.write_all(b\"GET / HTTP/1.1\\r\\n\")?;");
 println!(" let mut buffer = [0; 1024];");
 println!(" stream.read(&mut buffer)?;");
 
 println!("\nMethods:");
 println!(" connect(addr) - เชื่อมต่อ");
 println!(" read() - อ่านข้อมูล");
 println!(" write() - เขียนข้อมูล");
 println!(" shutdown() - ปิด connection");
 println!(" set_timeout() - ตั้ง timeout");
}
```

</RustPlayground>

---

## UdpSocket - UDP

<RustPlayground>

```rust
fn main() {
 println!("UDP Socket Example:");
 println!(" let socket = UdpSocket::bind(\"127.0.0.1:8080\")?;");
 println!(" socket.send_to(b\"hello\", \"127.0.0.1:9000\")?;");
 println!(" let mut buf = [0; 1024];");
 println!(" let (size, src) = socket.recv_from(&mut buf)?;");
 
 println!("\nMethods:");
 println!(" bind(addr) - สร้าง socket");
 println!(" send_to() - ส่งไปที่ address");
 println!(" recv_from() - รับข้อมูล");
 println!(" connect() - กำหนด default address");
}
```

</RustPlayground>

---

## IP Addresses

<RustPlayground>

```rust
use std::net::{IpAddr, Ipv4Addr, Ipv6Addr, SocketAddr};

fn main() {
 // IPv4
 let ipv4 = Ipv4Addr::new(192, 168, 1, 1);
 println!("IPv4: {}", ipv4);
 println!(" is_loopback: {}", ipv4.is_loopback());
 println!(" is_private: {}", ipv4.is_private());
 
 // IPv6
 let ipv6 = Ipv6Addr::new(0, 0, 0, 0, 0, 0, 0, 1);
 println!("\nIPv6: {}", ipv6);
 println!(" is_loopback: {}", ipv6.is_loopback());
 
 // IpAddr (either v4 or v6)
 let ip: IpAddr = "127.0.0.1".parse().unwrap();
 println!("\nIpAddr: {}", ip);
 
 // SocketAddr (IP + port)
 let addr: SocketAddr = "127.0.0.1:8080".parse().unwrap();
 println!("SocketAddr: {}", addr);
 println!(" ip: {}", addr.ip());
 println!(" port: {}", addr.port());
}
```

</RustPlayground>

---

## Quick Reference

| Type | คำอธิบาย |
|------|---------|
| `TcpListener` | TCP server (รับ connections) |
| `TcpStream` | TCP client/connection |
| `UdpSocket` | UDP socket |
| `IpAddr` | IPv4 หรือ IPv6 |
| `SocketAddr` | IP + port |

### TCP Pattern
```rust
// Server
let listener = TcpListener::bind("127.0.0.1:8080")?;
for stream in listener.incoming() {
 handle(stream?);
}

// Client
let mut stream = TcpStream::connect("127.0.0.1:8080")?;
stream.write_all(data)?;
```

---

[← Time](./time) | [Thread →](./thread)
