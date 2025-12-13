# Time Constants

`std::time` constants สำหรับ time handling!

---

## UNIX_EPOCH

<RustPlayground>

```rust
use std::time::{SystemTime, UNIX_EPOCH};

fn main() {
 println!("=== UNIX_EPOCH ===");
 println!("UNIX_EPOCH = {:?}", UNIX_EPOCH);

 // คำนวณเวลาปัจจุบัน (Unix timestamp)
 let now = SystemTime::now();
 match now.duration_since(UNIX_EPOCH) {
 Ok(duration) => {
 let secs = duration.as_secs();
 println!("\nCurrent Unix timestamp: {} seconds", secs);

 // แปลงเป็นวินาที นาที ชั่วโมง
 let days = secs / 86400;
 let years = days / 365;
 println!("Days since epoch: {}", days);
 println!("~Years since 1970: {}", years);
 }
 Err(e) => {
 println!("Time went backwards! {:?}", e);
 }
 }
}
```

</RustPlayground>

---

## Duration กับ UNIX_EPOCH

<RustPlayground>

```rust
use std::time::{Duration, SystemTime, UNIX_EPOCH};

fn main() {
 // สร้าง SystemTime จาก Unix timestamp
 let timestamp: u64 = 1700000000; // Nov 14, 2023
 let time = UNIX_EPOCH + Duration::from_secs(timestamp);
 println!("Timestamp {} = {:?}", timestamp, time);

 // คำนวณ difference
 let now = SystemTime::now();
 let epoch_duration = now.duration_since(UNIX_EPOCH).unwrap();
 let target_duration = time.duration_since(UNIX_EPOCH).unwrap();

 if epoch_duration > target_duration {
 let diff = epoch_duration - target_duration;
 println!("Past: {} seconds ago", diff.as_secs());
 } else {
 let diff = target_duration - epoch_duration;
 println!("Future: in {} seconds", diff.as_secs());
 }
}
```

</RustPlayground>

---

## Measuring Time

<RustPlayground>

```rust
use std::time::{Instant, Duration};

fn main() {
 println!("=== Measuring elapsed time ===");

 // ใช้ Instant (monotonic clock) สำหรับ measure
 let start = Instant::now();

 // ทำงานบางอย่าง
 let mut sum = 0u64;
 for i in 0..1_000_000 {
 sum += i;
 }

 let elapsed = start.elapsed();
 println!("Sum: {}", sum);
 println!("Elapsed: {:?}", elapsed);
 println!(" {} ms", elapsed.as_millis());
 println!(" {} µs", elapsed.as_micros());
 println!(" {} ns", elapsed.as_nanos());

 // Duration constants
 println!("\n=== Duration ===");
 let one_sec = Duration::from_secs(1);
 let half = Duration::from_millis(500);
 println!("1 second = {:?}", one_sec);
 println!("500 ms = {:?}", half);
}
```

</RustPlayground>

---

## Quick Reference

### Time Constants
| Constant | คำอธิบาย |
|----------|---------|
| `UNIX_EPOCH` | January 1, 1970 00:00:00 UTC |

### Duration Methods
| Method | คำอธิบาย |
|--------|---------|
| `from_secs(s)` | สร้างจากวินาที |
| `from_millis(ms)` | สร้างจาก milliseconds |
| `from_micros(µs)` | สร้างจาก microseconds |
| `from_nanos(ns)` | สร้างจาก nanoseconds |
| `as_secs()` | ได้วินาที |
| `as_millis()` | ได้ milliseconds |

### Time Structs
| Struct | คำอธิบาย |
|--------|---------|
| `SystemTime` | Wall clock time (สามารถย้อนกลับได้) |
| `Instant` | Monotonic time (สำหรับ measure) |
| `Duration` | ระยะเวลา |

---

[← Path](./path) | [Index →](./index)
