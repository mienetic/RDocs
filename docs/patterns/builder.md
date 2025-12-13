# Builder Pattern

Pattern สำหรับสร้าง Object แบบ step-by-step! 

---

## ทำไมต้องใช้ Builder?

- มี parameters หลายตัว (หลีกเลี่ยง constructor ยาว)
- บาง parameters เป็น optional
- ต้องการ validate ก่อนสร้าง
- ทำให้ code อ่านง่ายขึ้น

---

## Basic Builder

<RustPlayground>

```rust
#[derive(Debug)]
struct Server {
 host: String,
 port: u16,
 max_connections: u32,
 timeout: u64,
}

struct ServerBuilder {
 host: String,
 port: u16,
 max_connections: u32,
 timeout: u64,
}

impl ServerBuilder {
 fn new() -> Self {
 ServerBuilder {
 host: "localhost".to_string(),
 port: 8080,
 max_connections: 100,
 timeout: 30,
 }
 }
 
 fn host(mut self, host: &str) -> Self {
 self.host = host.to_string();
 self
 }
 
 fn port(mut self, port: u16) -> Self {
 self.port = port;
 self
 }
 
 fn max_connections(mut self, max: u32) -> Self {
 self.max_connections = max;
 self
 }
 
 fn timeout(mut self, timeout: u64) -> Self {
 self.timeout = timeout;
 self
 }
 
 fn build(self) -> Server {
 Server {
 host: self.host,
 port: self.port,
 max_connections: self.max_connections,
 timeout: self.timeout,
 }
 }
}

fn main() {
 let server = ServerBuilder::new()
 .host("0.0.0.0")
 .port(3000)
 .max_connections(1000)
 .build();
 
 println!("{:?}", server);
}
```

</RustPlayground>

---

## Builder with Validation

<RustPlayground>

```rust
#[derive(Debug)]
struct Email {
 address: String,
}

struct EmailBuilder {
 address: Option<String>,
}

impl EmailBuilder {
 fn new() -> Self {
 EmailBuilder { address: None }
 }
 
 fn address(mut self, addr: &str) -> Self {
 self.address = Some(addr.to_string());
 self
 }
 
 fn build(self) -> Result<Email, &'static str> {
 let address = self.address.ok_or("Email address is required")?;
 
 if !address.contains('@') {
 return Err("Invalid email format");
 }
 
 Ok(Email { address })
 }
}

fn main() {
 let email = EmailBuilder::new()
 .address("test@example.com")
 .build();
 
 println!("{:?}", email);
 
 let invalid = EmailBuilder::new()
 .address("invalid")
 .build();
 
 println!("{:?}", invalid);
}
```

</RustPlayground>

---

## derive_builder Crate

```rust
use derive_builder::Builder;

#[derive(Builder, Debug)]
struct Config {
 #[builder(default = "\"localhost\".to_string()")]
 host: String,
 
 #[builder(default = "8080")]
 port: u16,
 
 #[builder(setter(into))]
 database_url: String,
}

fn main() {
 let config = ConfigBuilder::default()
 .database_url("postgres://localhost/db")
 .build()
 .unwrap();
}
```

---

## Quick Reference

| Pattern | ใช้เมื่อ |
|---------|--------|
| Basic Builder | Parameters หลายตัว |
| Builder + Result | ต้อง validate |
| derive_builder | ลด boilerplate |

---

[← Async](/patterns/async) | [Newtype →](/patterns/newtype)
