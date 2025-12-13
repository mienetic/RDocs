# Env Enums

`VarError` สำหรับ environment variable errors! 

---

## VarError

<RustPlayground>

```rust
use std::env::{self, VarError};

fn main() {
 // VarError มี 2 variants
 match env::var("PROBABLY_NOT_SET") {
 Ok(val) => println!("Value: {}", val),
 Err(e) => {
 match e {
 VarError::NotPresent => {
 println!("Environment variable not set");
 }
 VarError::NotUnicode(os_str) => {
 println!("Value is not valid UTF-8: {:?}", os_str);
 }
 }
 }
 }
 
 // ตรวจสอบ vars ที่มีอยู่
 println!("\n=== Some env vars ===");
 for (key, value) in env::vars().take(3) {
 println!("{}: {}", key, 
 if value.len() > 30 { 
 format!("{}...", &value[..30]) 
 } else { 
 value 
 });
 }
}
```

</RustPlayground>

---

## Handling VarError

<RustPlayground>

```rust
use std::env::{self, VarError};

fn get_config(key: &str) -> Result<String, String> {
 env::var(key).map_err(|e| {
 match e {
 VarError::NotPresent => format!("{} is not set", key),
 VarError::NotUnicode(_) => format!("{} contains invalid UTF-8", key),
 }
 })
}

fn main() {
 // Helper function
 match get_config("MY_CONFIG") {
 Ok(val) => println!("Config: {}", val),
 Err(msg) => println!("Error: {}", msg),
 }
 
 // ใช้ unwrap_or_default
 let home = env::var("HOME").unwrap_or_default();
 println!("HOME: {}", home);
 
 // ใช้ ok() แปลงเป็น Option
 let maybe_path = env::var("PATH").ok();
 println!("PATH exists: {}", maybe_path.is_some());
}
```

</RustPlayground>

---

## Quick Reference

### VarError
| Variant | คำอธิบาย |
|---------|---------|
| `NotPresent` | Variable ไม่มีอยู่ |
| `NotUnicode(OsString)` | ค่าไม่ใช่ valid UTF-8 |

---

[← Path](./path-enum) | [Atomic →](./atomic)
