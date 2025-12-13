# Integers - ตัวเลขจำนวนเต็ม

Rust มี **signed integers** หลายขนาด! 

---

## Signed Integers คืออะไร?

ตัวเลขจำนวนเต็มที่มีเครื่องหมาย (+ หรือ -):
- ใช้ bit แรกเก็บเครื่องหมาย
- ช่วงค่า: `-2^(n-1)` ถึง `2^(n-1) - 1`

| Type | ขนาด | ช่วงค่า |
|------|------|---------|
| `i8` | 1 byte | -128 ถึง 127 |
| `i16` | 2 bytes | -32,768 ถึง 32,767 |
| `i32` | 4 bytes | ~-2.1 พันล้าน ถึง ~2.1 พันล้าน |
| `i64` | 8 bytes | ~-9.2 x 10^18 ถึง ~9.2 x 10^18 |
| `i128` | 16 bytes | ใหญ่มาก! |
| `isize` | platform | 32/64-bit ขึ้นกับ CPU |

---

## 1. การประกาศและ Type Inference

<RustPlayground>

```rust
fn main() {
 // Type inference - compiler เดาว่าเป็น i32
 let x = 42;
 
 // ระบุ type ชัดเจน
 let a: i8 = 100;
 let b: i16 = 1000;
 let c: i32 = 100_000; // _ ช่วยอ่านง่าย
 let d: i64 = 1_000_000_000;
 let e: i128 = 1_000_000_000_000_000;
 
 // isize ขึ้นกับ platform
 let index: isize = 10;
 
 println!("x = {} (i32 default)", x);
 println!("a = {} (i8)", a);
 println!("b = {} (i16)", b);
 println!("c = {} (i32)", c);
 println!("d = {} (i64)", d);
 println!("e = {} (i128)", e);
 println!("index = {} (isize)", index);
}
```

</RustPlayground>

---

## 2. Type Suffix

<RustPlayground>

```rust
fn main() {
 // ใช้ suffix ระบุ type
 let a = 42i8;
 let b = 42i16;
 let c = 42i32;
 let d = 42i64;
 let e = 42i128;
 let f = 42isize;
 
 println!("a: i8 = {}", a);
 println!("b: i16 = {}", b);
 println!("c: i32 = {}", c);
 println!("d: i64 = {}", d);
 println!("e: i128 = {}", e);
 println!("f: isize = {}", f);
}
```

</RustPlayground>

---

## 3. Number Bases

<RustPlayground>

```rust
fn main() {
 // ฐาน 10 (ปกติ)
 let decimal = 42;
 
 // ฐาน 16 (Hexadecimal)
 let hex = 0x2A; // = 42
 
 // ฐาน 8 (Octal)
 let octal = 0o52; // = 42
 
 // ฐาน 2 (Binary)
 let binary = 0b101010; // = 42
 
 println!("decimal: {}", decimal);
 println!("hex: {} (0x2A)", hex);
 println!("octal: {} (0o52)", octal);
 println!("binary: {} (0b101010)", binary);
 
 // ทั้งหมดเท่ากัน!
 assert_eq!(decimal, hex);
 assert_eq!(decimal, octal);
 assert_eq!(decimal, binary);
}
```

</RustPlayground>

---

## 4. Arithmetic Operations

<RustPlayground>

```rust
fn main() {
 let a: i32 = 10;
 let b: i32 = 3;
 
 println!("a = {}, b = {}", a, b);
 println!("a + b = {}", a + b); // 13
 println!("a - b = {}", a - b); // 7
 println!("a * b = {}", a * b); // 30
 println!("a / b = {}", a / b); // 3 (integer division!)
 println!("a % b = {}", a % b); // 1 (remainder)
 
 // Negative numbers
 let c: i32 = -10;
 println!("-10 / 3 = {}", c / b); // -3
 println!("-10 % 3 = {}", c % b); // -1
}
```

</RustPlayground>

---

## 5. Overflow Handling

<RustPlayground>

```rust
fn main() {
 let max: i8 = i8::MAX; // 127
 let min: i8 = i8::MIN; // -128
 
 println!("i8::MAX = {}", max);
 println!("i8::MIN = {}", min);
 
 // Checked operations - return Option
 let result = max.checked_add(1);
 println!("127.checked_add(1) = {:?}", result); // None
 
 // Wrapping operations - wrap around
 let wrapped = max.wrapping_add(1);
 println!("127.wrapping_add(1) = {}", wrapped); // -128
 
 // Saturating operations - clamp at max/min
 let saturated = max.saturating_add(1);
 println!("127.saturating_add(1) = {}", saturated); // 127
 
 // Overflowing - returns (result, did_overflow)
 let (val, overflow) = max.overflowing_add(1);
 println!("127.overflowing_add(1) = ({}, {})", val, overflow);
}
```

</RustPlayground>

---

## 6. Useful Methods

<RustPlayground>

```rust
fn main() {
 let x: i32 = -42;
 
 // Absolute value
 println!("abs(-42) = {}", x.abs()); // 42
 
 // Sign
 println!("signum(-42) = {}", x.signum()); // -1
 println!("signum(42) = {}", 42i32.signum()); // 1
 
 // Power
 println!("2^10 = {}", 2i32.pow(10)); // 1024
 
 // Counting bits
 let y: i32 = 0b1010_1100;
 println!("count_ones = {}", y.count_ones()); // 4
 println!("count_zeros = {}", y.count_zeros()); // 28
 println!("leading_zeros = {}", y.leading_zeros());
 
 // Min/Max
 println!("min(5, 10) = {}", 5i32.min(10)); // 5
 println!("max(5, 10) = {}", 5i32.max(10)); // 10
}
```

</RustPlayground>

---

## 7. Conversion

<RustPlayground>

```rust
fn main() {
 let small: i8 = 42;
 
 // Widening (safe) - ใช้ into()
 let big: i32 = small.into();
 println!("i8 -> i32: {}", big);
 
 // Narrowing (may fail) - ใช้ try_into()
 let large: i32 = 1000;
 let result: Result<i8, _> = large.try_into();
 println!("1000 (i32) -> i8: {:?}", result); // Err
 
 let fits: i32 = 50;
 let result: Result<i8, _> = fits.try_into();
 println!("50 (i32) -> i8: {:?}", result); // Ok(50)
 
 // Parse from string
 let num: i32 = "42".parse().unwrap();
 println!("parsed: {}", num);
}
```

</RustPlayground>

---

## Quick Reference

### Constants
| Constant | ค่า (i32) |
|----------|----------|
| `i32::MIN` | -2,147,483,648 |
| `i32::MAX` | 2,147,483,647 |
| `i32::BITS` | 32 |

### Methods
| Method | คำอธิบาย |
|--------|---------|
| `abs()` | ค่าสัมบูรณ์ |
| `signum()` | เครื่องหมาย (-1, 0, 1) |
| `pow(exp)` | ยกกำลัง |
| `min(other)` | ค่าน้อยสุด |
| `max(other)` | ค่ามากสุด |
| `to_string()` | เป็น String |

### Overflow Handling
| Method | Behavior |
|--------|----------|
| `checked_*` | Return Option |
| `wrapping_*` | Wrap around |
| `saturating_*` | Clamp at bounds |
| `overflowing_*` | Return (result, bool) |

---

[← Index](./index) | [Unsigned →](./unsigned)
