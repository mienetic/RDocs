# NonZero Types (std::num)

Types สำหรับตัวเลขที่ไม่เป็นศูนย์! 

---

## NonZero

Wrapper สำหรับตัวเลขที่ไม่เป็นศูนย์เสมอ

<RustPlayground>

```rust
use std::num::NonZeroU32;

fn main() {
 // สร้าง NonZero
 let n = NonZeroU32::new(42);
 println!("Result: {:?}", n); // Some(42)
 
 // ค่าศูนย์ให้ None
 let zero = NonZeroU32::new(0);
 println!("Zero: {:?}", zero); // None
 
 // Unwrap (ถ้ามั่นใจว่าไม่ใช่ 0)
 if let Some(value) = NonZeroU32::new(10) {
 println!("Value: {}", value);
 println!("As u32: {}", value.get());
 }
}
```

</RustPlayground>

---

## Memory Optimization

<RustPlayground>

```rust
use std::num::NonZeroU8;
use std::mem::size_of;

fn main() {
 // NonZero ช่วย optimize Option size
 println!("Size of u8: {}", size_of::<u8>());
 println!("Size of Option<u8>: {}", size_of::<Option<u8>>());
 
 println!("Size of NonZeroU8: {}", size_of::<NonZeroU8>());
 println!("Size of Option<NonZeroU8>: {}", size_of::<Option<NonZeroU8>>());
 
 // Option<NonZeroU8> มีขนาดเท่า NonZeroU8!
 // เพราะใช้ 0 แทน None (niche optimization)
}
```

</RustPlayground>

---

## NonZero Types ทั้งหมด

<RustPlayground>

```rust
use std::num::*;

fn main() {
 // Unsigned
 let _: Option<NonZeroU8> = NonZeroU8::new(1);
 let _: Option<NonZeroU16> = NonZeroU16::new(1);
 let _: Option<NonZeroU32> = NonZeroU32::new(1);
 let _: Option<NonZeroU64> = NonZeroU64::new(1);
 let _: Option<NonZeroU128> = NonZeroU128::new(1);
 let _: Option<NonZeroUsize> = NonZeroUsize::new(1);
 
 // Signed
 let _: Option<NonZeroI8> = NonZeroI8::new(-1);
 let _: Option<NonZeroI32> = NonZeroI32::new(-5);
 
 println!("All NonZero types available!");
}
```

</RustPlayground>

---

## Use Cases

<RustPlayground>

```rust
use std::num::NonZeroUsize;

// Division without zero check
fn safe_divide(n: u32, d: NonZeroUsize) -> u32 {
 // ไม่ต้อง check d != 0 เพราะ guarantee แล้ว
 n / d.get() as u32
}

// Array index (must be at least 1)
fn get_nth<T>(slice: &[T], n: NonZeroUsize) -> Option<&T> {
 slice.get(n.get() - 1)
}

fn main() {
 let divisor = NonZeroUsize::new(5).unwrap();
 println!("100 / 5 = {}", safe_divide(100, divisor));
 
 let arr = [10, 20, 30, 40, 50];
 let index = NonZeroUsize::new(3).unwrap();
 println!("3rd element: {:?}", get_nth(&arr, index));
}
```

</RustPlayground>

---

## Arithmetic

<RustPlayground>

```rust
use std::num::NonZeroU32;

fn main() {
 let a = NonZeroU32::new(10).unwrap();
 let b = NonZeroU32::new(3).unwrap();
 
 // checked operations ที่ return NonZero
 let added = a.checked_add(5);
 println!("10 + 5 = {:?}", added);
 
 let multiplied = a.checked_mul(b);
 println!("10 * 3 = {:?}", multiplied);
 
 // saturating (ไม่ overflow)
 let saturated = a.saturating_add(u32::MAX);
 println!("Saturated: {}", saturated);
}
```

</RustPlayground>

---

## Quick Reference

| Type | Range |
|------|-------|
| `NonZeroU8` | 1..=255 |
| `NonZeroU16` | 1..=65535 |
| `NonZeroU32` | 1..=4294967295 |
| `NonZeroI8` | -128..=-1, 1..=127 |
| `NonZeroI32` | ไม่รวม 0 |

---

## Methods

| Method | คำอธิบาย |
|--------|---------|
| `new(n)` | สร้าง (return Option) |
| `get()` | ดึงค่า primitive |
| `checked_add(n)` | บวก (return Option) |
| `checked_mul(n)` | คูณ (return Option) |
| `saturating_add(n)` | บวกแบบ saturating |

---

[← Num](/structs/num) | [Index →](/structs/)
