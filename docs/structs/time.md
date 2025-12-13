# Time Structs - เวลา

`Duration`, `Instant`, `SystemTime` สำหรับจัดการเวลา!

---

## Duration - ช่วงเวลา

<RustPlayground>

```rust
use std::time::Duration;

fn main() {
 // สร้าง Duration
 let secs = Duration::from_secs(5);
 let millis = Duration::from_millis(1500);
 let micros = Duration::from_micros(1000000);
 let nanos = Duration::from_nanos(1000000000);

 println!("5 secs = {:?}", secs);
 println!("1500 millis = {:?}", millis);
 println!("1000000 micros = {:?}", micros);
 println!("1000000000 nanos = {:?}", nanos);

 // อ่านค่า
 let d = Duration::new(5, 500_000_000); // 5.5 seconds
 println!("\n5.5 seconds:");
 println!(" as_secs = {}", d.as_secs());
 println!(" as_millis = {}", d.as_millis());
 println!(" subsec_nanos = {}", d.subsec_nanos());

 // คำนวณ
 let total = secs + millis;
 println!("\n5s + 1.5s = {:?}", total);
}
```

</RustPlayground>

---

## Instant - Monotonic Clock

<RustPlayground>

```rust
use std::time::Instant;
use std::thread::sleep;
use std::time::Duration;

fn main() {
 // จับเวลา
 let start = Instant::now();

 // ทำงานบางอย่าง
 sleep(Duration::from_millis(100));

 // วัดเวลาที่ผ่านไป
 let elapsed = start.elapsed();
 println!("elapsed = {:?}", elapsed);
 println!("elapsed ms = {}", elapsed.as_millis());

 // เปรียบเทียบ
 let now = Instant::now();
 println!("start < now: {}", start < now);

 // duration_since
 let duration = now.duration_since(start);
 println!("duration = {:?}", duration);
}
```

</RustPlayground>

---

## SystemTime - System Clock

<RustPlayground>

```rust
use std::time::{SystemTime, UNIX_EPOCH, Duration};

fn main() {
 // เวลาปัจจุบัน
 let now = SystemTime::now();
 println!("now = {:?}", now);

 // Unix timestamp
 match now.duration_since(UNIX_EPOCH) {
 Ok(duration) => {
 println!("unix timestamp = {} seconds", duration.as_secs());
 println!("unix millis = {} ms", duration.as_millis());
 }
 Err(e) => println!("error: {}", e),
 }

 // เพิ่ม/ลด เวลา
 let future = now + Duration::from_secs(3600);
 let past = now - Duration::from_secs(3600);
 println!("\n+1 hour = {:?}", future);
 println!("-1 hour = {:?}", past);
}
```

</RustPlayground>

---

## Quick Reference

| Type | คำอธิบาย | Use case |
|------|---------|---------|
| `Duration` | ช่วงเวลา | Timeout, delay |
| `Instant` | Monotonic clock | Benchmark |
| `SystemTime` | System clock | Timestamps |

### Duration Methods
| Method | ตัวอย่าง |
|--------|---------|
| `from_secs(n)` | `Duration::from_secs(5)` |
| `from_millis(n)` | `Duration::from_millis(500)` |
| `as_secs()` | `d.as_secs()` |
| `as_millis()` | `d.as_millis()` |

### Instant Methods
| Method | คำอธิบาย |
|--------|---------|
| `now()` | เวลาปัจจุบัน |
| `elapsed()` | เวลาที่ผ่านไป |
| `duration_since()` | ความต่างระหว่าง 2 instant |

---

[← Path](./path) | [Net →](./net)
