# Time - เวลา

**std::time** สำหรับวัดเวลา delay และจัดการ duration!

---

## time มีอะไร?

- **Duration** - ช่วงเวลา (5 seconds, 100 ms)
- **Instant** - เวลาสำหรับวัด (monotonic)
- **SystemTime** - เวลาจริง (wall clock)

:::tip Instant vs SystemTime
- `Instant` - สำหรับวัดเวลาที่ผ่านไป (ไม่ย้อนกลับ)
- `SystemTime` - สำหรับบอกเวลาจริง (อาจเปลี่ยนได้)
:::

---

## 1. Duration

<RustPlayground>

```rust
use std::time::Duration;

fn main() {
 // สร้าง Duration
 let five_secs = Duration::from_secs(5);
 let hundred_millis = Duration::from_millis(100);
 let fifty_micros = Duration::from_micros(50);
 let ten_nanos = Duration::from_nanos(10);

 println!("5 secs: {:?}", five_secs);
 println!("100 ms: {:?}", hundred_millis);
 println!("50 µs: {:?}", fifty_micros);
 println!("10 ns: {:?}", ten_nanos);

 // from_secs_f64 - จาก float
 let half_sec = Duration::from_secs_f64(0.5);
 println!("0.5 sec: {:?}", half_sec);

 // เข้าถึงค่า
 let d = Duration::new(5, 500_000_000); // 5.5 seconds
 println!("\n5.5 secs:");
 println!(" as_secs: {}", d.as_secs()); // 5
 println!(" as_millis: {}", d.as_millis()); // 5500
 println!(" as_micros: {}", d.as_micros()); // 5500000
 println!(" as_nanos: {}", d.as_nanos()); // 5500000000
 println!(" as_secs_f64: {}", d.as_secs_f64()); // 5.5
}
```

</RustPlayground>

---

## 2. Duration Math

<RustPlayground>

```rust
use std::time::Duration;

fn main() {
 let a = Duration::from_secs(5);
 let b = Duration::from_millis(500);

 // บวก
 let sum = a + b;
 println!("5s + 500ms = {:?}", sum);

 // ลบ (saturating = ไม่ติดลบ)
 let diff = a.saturating_sub(b);
 println!("5s - 500ms = {:?}", diff);

 // คูณ
 let triple = a * 3;
 println!("5s * 3 = {:?}", triple);

 // หาร
 let half = a / 2;
 println!("5s / 2 = {:?}", half);

 // เปรียบเทียบ
 println!("\n5s > 500ms: {}", a > b);
 println!("5s == 5000ms: {}", a == Duration::from_millis(5000));

 // Zero และ MAX
 println!("\nZero: {:?}", Duration::ZERO);
 println!("MAX: {:?}", Duration::MAX);

 // is_zero
 println!("ZERO.is_zero(): {}", Duration::ZERO.is_zero());
}
```

</RustPlayground>

---

## 3. Instant - วัดเวลา

<RustPlayground>

```rust
use std::time::Instant;
use std::thread;
use std::time::Duration;

fn main() {
 // จับเวลาเริ่ม
 let start = Instant::now();

 // ทำงานบางอย่าง
 thread::sleep(Duration::from_millis(100));

 // วัดเวลาที่ผ่านไป
 let elapsed = start.elapsed();
 println!("Elapsed: {:?}", elapsed);
 println!("In millis: {} ms", elapsed.as_millis());

 // Instant อีกแบบ
 let now = Instant::now();
 thread::sleep(Duration::from_millis(50));
 let later = Instant::now();

 // duration_since
 let duration = later.duration_since(now);
 println!("\nduration_since: {:?}", duration);

 // ลบ Instant
 let diff = later - now;
 println!("later - now: {:?}", diff);

 // checked_duration_since (ป้องกันกรณี later < now)
 match now.checked_duration_since(later) {
 Some(d) => println!("Duration: {:?}", d),
 None => println!("later is after now (as expected)"),
 }
}
```

</RustPlayground>

---

## 4. Benchmark Pattern

<RustPlayground>

```rust
use std::time::Instant;

fn slow_function() -> i32 {
 let mut sum = 0;
 for i in 0..1_000_000 {
 sum += i;
 }
 sum
}

fn main() {
 // วัดเวลา function
 let start = Instant::now();
 let result = slow_function();
 let duration = start.elapsed();

 println!("Result: {}", result);
 println!("Time: {:?}", duration);
 println!("Time: {:.2} ms", duration.as_secs_f64() * 1000.0);

 // วัดหลายรอบ
 let iterations = 10;
 let start = Instant::now();
 for _ in 0..iterations {
 let _ = slow_function();
 }
 let total = start.elapsed();
 let average = total / iterations;

 println!("\n{} iterations:", iterations);
 println!(" Total: {:?}", total);
 println!(" Average: {:?}", average);
}
```

</RustPlayground>

---

## 5. SystemTime - เวลาจริง

<RustPlayground>

```rust
use std::time::{SystemTime, UNIX_EPOCH, Duration};

fn main() {
 // เวลาปัจจุบัน
 let now = SystemTime::now();
 println!("Now: {:?}", now);

 // Unix timestamp (seconds since 1970)
 match now.duration_since(UNIX_EPOCH) {
 Ok(d) => {
 println!("Unix timestamp: {} secs", d.as_secs());
 println!("Unix timestamp: {} ms", d.as_millis());
 }
 Err(e) => println!("Time went backwards: {}", e),
 }

 // UNIX_EPOCH
 println!("\nUNIX_EPOCH: {:?}", UNIX_EPOCH);

 // บวก/ลบเวลา
 let one_hour = Duration::from_secs(3600);
 let one_hour_ago = now - one_hour;
 let one_hour_later = now + one_hour;

 if let Ok(diff) = now.duration_since(one_hour_ago) {
 println!("\n1 hour ago was {:?} ago", diff);
 }
}
```

</RustPlayground>

---

## 6. Sleep

<RustPlayground>

```rust
use std::time::{Duration, Instant};
use std::thread;

fn main() {
 println!("Starting...");

 // sleep - หยุดพัก
 let start = Instant::now();
 thread::sleep(Duration::from_millis(100));
 println!("Slept for {:?}", start.elapsed());

 // sleep ที่แม่นยำขึ้น
 fn precise_sleep(duration: Duration) {
 let start = Instant::now();
 thread::sleep(duration);
 let actual = start.elapsed();
 println!("Requested: {:?}, Actual: {:?}", duration, actual);
 }

 precise_sleep(Duration::from_millis(50));
 precise_sleep(Duration::from_millis(10));
 precise_sleep(Duration::from_nanos(1_000_000)); // 1 ms
}
```

</RustPlayground>

---

## 7. Timeout Pattern

<RustPlayground>

```rust
use std::time::{Duration, Instant};
use std::thread;

fn work_with_timeout(timeout: Duration) -> Result<String, &'static str> {
 let start = Instant::now();

 // Simulate work that checks for timeout
 loop {
 // Check timeout
 if start.elapsed() > timeout {
 return Err("Timeout!");
 }

 // Simulate work
 thread::sleep(Duration::from_millis(100));

 // Pretend we're done
 if start.elapsed() > Duration::from_millis(250) {
 return Ok("Done!".to_string());
 }
 }
}

fn main() {
 // With enough timeout
 match work_with_timeout(Duration::from_secs(1)) {
 Ok(result) => println!("Success: {}", result),
 Err(e) => println!("Error: {}", e),
 }

 // With short timeout
 match work_with_timeout(Duration::from_millis(200)) {
 Ok(result) => println!("Success: {}", result),
 Err(e) => println!("Error: {}", e),
 }
}
```

</RustPlayground>

---

## Quick Reference

### Duration
| Method | คำอธิบาย |
|--------|---------|
| `from_secs(n)` | n วินาที |
| `from_millis(n)` | n มิลลิวินาที |
| `from_micros(n)` | n ไมโครวินาที |
| `from_nanos(n)` | n นาโนวินาที |
| `from_secs_f64(f)` | จาก float |
| `as_secs()` | เป็นวินาที |
| `as_millis()` | เป็นมิลลิวินาที |
| `as_secs_f64()` | เป็น float |

### Instant
| Method | คำอธิบาย |
|--------|---------|
| `now()` | เวลาปัจจุบัน |
| `elapsed()` | เวลาที่ผ่านไป |
| `duration_since(other)` | ต่างจาก other |

### SystemTime
| Method | คำอธิบาย |
|--------|---------|
| `now()` | เวลาจริงปัจจุบัน |
| `duration_since(UNIX_EPOCH)` | Unix timestamp |
| `+` / `-` Duration | บวก/ลบเวลา |

### Sleep
| Function | คำอธิบาย |
|----------|---------|
| `thread::sleep(d)` | หยุดพัก |

---

[← Networking](./net) | [Thread →](./thread)
