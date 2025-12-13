# Atomic Enums

`Ordering` สำหรับ atomic operations! 

---

## Atomic Ordering คืออะไร?

`std::sync::atomic::Ordering` กำหนด memory ordering สำหรับ atomic operations

<RustPlayground>

```rust
use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;

fn main() {
 let counter = AtomicUsize::new(0);
 
 // Ordering::Relaxed - ไม่รับประกันลำดับกับ operations อื่น
 counter.fetch_add(1, Ordering::Relaxed);
 
 // Ordering::SeqCst - รับประกันลำดับเต็มที่ (ช้าสุด แต่ปลอดภัยสุด)
 counter.fetch_add(1, Ordering::SeqCst);
 
 // อ่านค่า
 let val = counter.load(Ordering::SeqCst);
 println!("counter: {}", val);
 
 // Ordering::Acquire/Release - สำหรับ synchronization
 counter.store(100, Ordering::Release);
 let loaded = counter.load(Ordering::Acquire);
 println!("after store: {}", loaded);
}
```

</RustPlayground>

---

## Ordering Variants

<RustPlayground>

```rust
use std::sync::atomic::{AtomicBool, Ordering};

fn main() {
 let flag = AtomicBool::new(false);
 
 println!("=== Ordering Variants ===");
 
 // Relaxed - weakest, แค่ atomic เท่านั้น
 flag.store(true, Ordering::Relaxed);
 let _ = flag.load(Ordering::Relaxed);
 println!("Relaxed: no ordering guarantees");
 
 // Release - สำหรับ store
 // Acquire - สำหรับ load
 flag.store(true, Ordering::Release);
 let _ = flag.load(Ordering::Acquire);
 println!("Release/Acquire: synchronizes-with relationship");
 
 // AcqRel - ทั้ง Acquire และ Release
 // ใช้กับ read-modify-write operations
 let _ = flag.compare_exchange(
 true, false, 
 Ordering::AcqRel, 
 Ordering::Relaxed
 );
 println!("AcqRel: for read-modify-write");
 
 // SeqCst - strongest, total order
 flag.store(false, Ordering::SeqCst);
 let _ = flag.load(Ordering::SeqCst);
 println!("SeqCst: strongest guarantees");
}
```

</RustPlayground>

---

## เมื่อไหร่ใช้ Ordering ไหน

<RustPlayground>

```rust
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::thread;

fn main() {
 let counter = Arc::new(AtomicUsize::new(0));
 
 // Counter: Relaxed พอ (แค่นับ ไม่ต้อง sync กับ data อื่น)
 let c = counter.clone();
 let handle = thread::spawn(move || {
 for _ in 0..1000 {
 c.fetch_add(1, Ordering::Relaxed);
 }
 });
 
 for _ in 0..1000 {
 counter.fetch_add(1, Ordering::Relaxed);
 }
 
 handle.join().unwrap();
 println!("Final counter: {}", counter.load(Ordering::Relaxed));
 
 // ถ้าไม่แน่ใจ ใช้ SeqCst
 println!("\nTip: When in doubt, use SeqCst");
}
```

</RustPlayground>

---

## Quick Reference

### Ordering
| Variant | ใช้กับ | คำอธิบาย |
|---------|-------|---------|
| `Relaxed` | load/store | ไม่มี synchronization |
| `Acquire` | load | ดู writes ก่อน Release |
| `Release` | store | writes เห็นได้โดย Acquire |
| `AcqRel` | read-modify-write | ทั้ง Acquire และ Release |
| `SeqCst` | ทุกอย่าง | Total ordering (ช้าสุด แต่ปลอดภัยสุด) |

### เลือก Ordering
| กรณี | Ordering |
|------|----------|
| Simple counter | `Relaxed` |
| Flag สำหรับ sync | `Acquire`/`Release` |
| ไม่แน่ใจ | `SeqCst` |

---

[← Env](./env-enum) | [Index →](./index)
