# Network Enums

`IpAddr`, `SocketAddr`, `Shutdown` สำหรับ networking! 

---

## IpAddr - IPv4 หรือ IPv6

<RustPlayground>

```rust
use std::net::{IpAddr, Ipv4Addr, Ipv6Addr};

fn main() {
 // IpAddr มี 2 variants
 let v4: IpAddr = IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1));
 let v6: IpAddr = IpAddr::V6(Ipv6Addr::new(0, 0, 0, 0, 0, 0, 0, 1));
 
 println!("IPv4: {}", v4);
 println!("IPv6: {}", v6);
 
 // Parse จาก string
 let parsed: IpAddr = "192.168.1.1".parse().unwrap();
 println!("Parsed: {}", parsed);
 
 // ตรวจสอบประเภท
 match parsed {
 IpAddr::V4(ip) => println!("IPv4: {:?}", ip.octets()),
 IpAddr::V6(ip) => println!("IPv6: {:?}", ip.segments()),
 }
 
 // Methods
 println!("\nis_loopback: {}", v4.is_loopback());
 println!("is_ipv4: {}", v4.is_ipv4());
 println!("is_ipv6: {}", v6.is_ipv6());
}
```

</RustPlayground>

---

## SocketAddr - IP + Port

<RustPlayground>

```rust
use std::net::{SocketAddr, IpAddr, Ipv4Addr};

fn main() {
 // SocketAddr มี 2 variants
 let addr: SocketAddr = "127.0.0.1:8080".parse().unwrap();
 println!("SocketAddr: {}", addr);
 
 // แยก IP และ Port
 println!("IP: {}", addr.ip());
 println!("Port: {}", addr.port());
 
 // สร้างจาก components
 let ip = IpAddr::V4(Ipv4Addr::new(192, 168, 1, 1));
 let socket = SocketAddr::new(ip, 443);
 println!("Custom: {}", socket);
 
 // Match variants
 match addr {
 SocketAddr::V4(v4) => {
 println!("V4 - ip: {}, port: {}", v4.ip(), v4.port());
 }
 SocketAddr::V6(v6) => {
 println!("V6 - ip: {}, port: {}", v6.ip(), v6.port());
 }
 }
 
 // set_port
 let mut mutable = addr;
 mutable.set_port(9000);
 println!("Changed port: {}", mutable);
}
```

</RustPlayground>

---

## Shutdown - ปิด Connection

<RustPlayground>

```rust
use std::net::Shutdown;

fn main() {
 // Shutdown มี 3 variants
 println!("=== Shutdown variants ===");
 println!("Read - ปิดการอ่าน");
 println!("Write - ปิดการเขียน");
 println!("Both - ปิดทั้งคู่");
 
 // ตัวอย่างการใช้ (ต้องมี connection จริง)
 // stream.shutdown(Shutdown::Write).unwrap();
 
 let variants = [Shutdown::Read, Shutdown::Write, Shutdown::Both];
 for s in variants {
 println!("{:?}", s);
 }
}
```

</RustPlayground>

---

## Quick Reference

### IpAddr
| Variant | คำอธิบาย |
|---------|---------|
| `V4(Ipv4Addr)` | IPv4 address |
| `V6(Ipv6Addr)` | IPv6 address |

### IpAddr Methods
| Method | คำอธิบาย |
|--------|---------|
| `is_loopback()` | เป็น loopback ไหม |
| `is_multicast()` | เป็น multicast ไหม |
| `is_ipv4()` | เป็น IPv4 ไหม |
| `is_ipv6()` | เป็น IPv6 ไหม |

### SocketAddr
| Variant | คำอธิบาย |
|---------|---------|
| `V4(SocketAddrV4)` | IPv4 + port |
| `V6(SocketAddrV6)` | IPv6 + port |

### Shutdown
| Variant | คำอธิบาย |
|---------|---------|
| `Read` | ปิดการอ่าน |
| `Write` | ปิดการเขียน |
| `Both` | ปิดทั้งคู่ |

---

[← I/O](./io) | [Async →](./async)
