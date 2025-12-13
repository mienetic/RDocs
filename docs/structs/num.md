# Num Structs - Number Types

`NonZero*`, `Wrapping`, `Saturating` สำหรับ specialized numbers! 

---

## NonZero Types

`NonZeroU32`, `NonZeroI32` ฯลฯ รับประกันว่าไม่เป็น 0:
- ใช้เป็น optimization สำหรับ `Option<NonZeroU32>` (ไม่ใช้พื้นที่เพิ่ม)
- ป้องกัน division by zero

<RustPlayground>

```rust
use std::num::NonZeroU32;

fn main() {
 // สร้าง NonZeroU32
 let n = NonZeroU32::new(42);
 println!("n: {:?}", n); // Some(42)
 
 // ค่า 0 จะได้ None
 let zero = NonZeroU32::new(0);
 println!("zero: {:?}", zero); // None
 
 // ใช้ unwrap ถ้าแน่ใจว่าไม่เป็น 0
 if let Some(value) = NonZeroU32::new(100) {
 println!("value: {}", value);
 
 // Division by non-zero is safe!
 let result = 1000 / value.get();
 println!("1000 / {} = {}", value, result);
 }
}
```

</RustPlayground>

---

## Option Size Optimization

<RustPlayground>

```rust
use std::num::NonZeroU64;
use std::mem::size_of;

fn main() {
 // Option<u64> ใช้พื้นที่เพิ่ม
 println!("size of u64: {}", size_of::<u64>());
 println!("size of Option<u64>: {}", size_of::<Option<u64>>());
 
 // Option<NonZeroU64> ไม่ใช้พื้นที่เพิ่ม!
 println!("size of NonZeroU64: {}", size_of::<NonZeroU64>());
 println!("size of Option<NonZeroU64>: {}", size_of::<Option<NonZeroU64>>());
 
 // เพราะใช้ 0 เป็น None
}
```

</RustPlayground>

---

## Wrapping - Overflow Wraps Around

<RustPlayground>

```rust
use std::num::Wrapping;

fn main() {
 let max = Wrapping(u8::MAX); // 255
 let one = Wrapping(1u8);
 
 // Overflow wraps around
 let result = max + one;
 println!("255 + 1 = {} (wrapped)", result.0);
 
 // Underflow
 let zero = Wrapping(0u8);
 let result = zero - one;
 println!("0 - 1 = {} (wrapped)", result.0);
 
 // ใช้ใน game หรือ cyclic counters
 let mut counter = Wrapping(0u8);
 for _ in 0..260 {
 counter += Wrapping(1);
 }
 println!("counter after 260 increments: {}", counter.0);
}
```

</RustPlayground>

---

## Saturating - Clamp at Min/Max

<RustPlayground>

```rust
use std::num::Saturating;

fn main() {
 let max = Saturating(u8::MAX); // 255
 let one = Saturating(1u8);
 
 // Overflow saturates at MAX
 let result = max + one;
 println!("255 + 1 = {} (saturated)", result.0);
 
 // Underflow saturates at MIN
 let zero = Saturating(0u8);
 let result = zero - one;
 println!("0 - 1 = {} (saturated)", result.0);
 
 // ใช้สำหรับ audio, colors, etc.
 let mut volume = Saturating(200u8);
 volume += Saturating(100); // Won't overflow!
 println!("volume: {}", volume.0); // 255
}
```

</RustPlayground>

---

## Quick Reference

### NonZero Types
| Type | Range |
|------|-------|
| `NonZeroU8` | 1..=255 |
| `NonZeroU16` | 1..=65535 |
| `NonZeroU32` | 1..=4294967295 |
| `NonZeroU64` | 1..=max |
| `NonZeroUsize` | 1..=max |
| `NonZeroI8/I16/I32/I64/Isize` | ไม่รวม 0 |

### NonZero Methods
| Method | คำอธิบาย |
|--------|---------|
| `new(n)` | สร้าง (Option) |
| `new_unchecked(n)` | สร้าง (unsafe) |
| `get()` | ดึงค่า |

### Wrapping/Saturating
| Type | Overflow | Underflow |
|------|----------|-----------|
| `Wrapping&lt;T&gt;` | Wrap to MIN | Wrap to MAX |
| `Saturating&lt;T&gt;` | Clamp at MAX | Clamp at MIN |

---

[← Mem](./mem) | [Slice →](./slice)
