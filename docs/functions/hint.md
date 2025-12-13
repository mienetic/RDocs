# Hint Functions (std::hint)

Functions สำหรับ Compiler Hints และ Optimization! 

---

## black_box

ป้องกัน Compiler Optimization (สำหรับ Benchmarks)

<RustPlayground>

```rust
use std::hint;

fn main() {
 let x = 42;
 
 // black_box ป้องกัน compiler optimize ออก
 let result = hint::black_box(x * 2);
 
 println!("Result: {}", result);
 
 // ใช้ใน benchmarks เพื่อให้ compiler
 // ไม่ optimize code ที่เราต้องการวัด
}
```

</RustPlayground>

---

## spin_loop

บอก CPU ว่ากำลัง busy-wait

<RustPlayground>

```rust
use std::hint;
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;
use std::time::Duration;

fn main() {
 let flag = AtomicBool::new(false);
 
 // Spin loop ที่รอ flag
 // (ใน production ควรใช้ mutex หรือ condvar แทน)
 let mut count = 0;
 while !flag.load(Ordering::Relaxed) {
 hint::spin_loop(); // บอก CPU ว่า busy-wait
 count += 1;
 if count > 1000 { break; }
 }
 
 println!("Loop finished after {} iterations", count);
}
```

</RustPlayground>

---

## unreachable_unchecked

บอก compiler ว่าจุดนี้เข้าไม่ถึง (Unchecked!)

<RustPlayground>

```rust
use std::hint;

fn main() {
 let x: Option<i32> = Some(42);
 
 // Unsafe! ใช้เมื่อมั่นใจ 100%
 let value = match x {
 Some(v) => v,
 None => unsafe { hint::unreachable_unchecked() }
 };
 
 println!("Value: {}", value);
 
 // ถ้า None เกิดขึ้นจริง = Undefined Behavior!
}
```

</RustPlayground>

---

## assert_unchecked

Assertion ที่ไม่ check ตอน runtime

<RustPlayground>

```rust
use std::hint;

fn main() {
 let x = 5;
 
 // Unsafe! บอก compiler ว่า condition เป็นจริงเสมอ
 unsafe {
 hint::assert_unchecked(x > 0); // ถ้าไม่จริง = UB
 }
 
 println!("x is positive: {}", x);
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Safety |
|----------|---------|--------|
| `black_box(v)` | ป้องกัน optimization | Safe |
| `spin_loop()` | Hint ว่า busy-wait | Safe |
| `unreachable_unchecked()` | เข้าไม่ถึงแน่นอน | Unsafe |
| `assert_unchecked(cond)` | Assertion ไม่ check | Unsafe |

---

[← Any](./any) | [Index →](./index)
