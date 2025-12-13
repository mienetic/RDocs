# Integer Constants

Integer constants สำหรับ limits และ sizes! 

---

## Integer Limits

<RustPlayground>

```rust
fn main() {
 println!("=== Signed Integer Limits ===");
 println!("i8: MIN={:20}, MAX={:20}", i8::MIN, i8::MAX);
 println!("i16: MIN={:20}, MAX={:20}", i16::MIN, i16::MAX);
 println!("i32: MIN={:20}, MAX={:20}", i32::MIN, i32::MAX);
 println!("i64: MIN={:20}, MAX={:20}", i64::MIN, i64::MAX);
 println!("i128: MIN={}, MAX={}", i128::MIN, i128::MAX);
 
 println!("\n=== Unsigned Integer Limits ===");
 println!("u8: MIN={:20}, MAX={:20}", u8::MIN, u8::MAX);
 println!("u16: MIN={:20}, MAX={:20}", u16::MIN, u16::MAX);
 println!("u32: MIN={:20}, MAX={:20}", u32::MIN, u32::MAX);
 println!("u64: MIN={:20}, MAX={:20}", u64::MIN, u64::MAX);
 println!("u128: MIN={}, MAX={}", u128::MIN, u128::MAX);
 
 println!("\n=== Platform-dependent ===");
 println!("isize: MIN={}, MAX={}", isize::MIN, isize::MAX);
 println!("usize: MIN={}, MAX={}", usize::MIN, usize::MAX);
}
```

</RustPlayground>

---

## BITS Constant

<RustPlayground>

```rust
fn main() {
 println!("=== BITS (bit size) ===");
 println!("i8::BITS = {}", i8::BITS);
 println!("i16::BITS = {}", i16::BITS);
 println!("i32::BITS = {}", i32::BITS);
 println!("i64::BITS = {}", i64::BITS);
 println!("i128::BITS = {}", i128::BITS);
 
 println!("\nisize::BITS = {} (platform-dependent)", isize::BITS);
 println!("usize::BITS = {} (platform-dependent)", usize::BITS);
 
 // ใช้ BITS ในการคำนวณ
 let total_values_u8 = 2u32.pow(u8::BITS);
 println!("\nTotal possible u8 values: {}", total_values_u8);
}
```

</RustPlayground>

---

## Overflow Prevention

<RustPlayground>

```rust
fn main() {
 // ใช้ constants เพื่อป้องกัน overflow
 let a: i32 = 2_000_000_000;
 let b: i32 = 1_000_000_000;
 
 // ตรวจสอบก่อนบวก
 if a > i32::MAX - b {
 println!("จะ overflow!");
 } else {
 println!("Safe: {} + {} = {}", a, b, a + b);
 }
 
 // หรือใช้ checked_add
 match a.checked_add(b) {
 Some(result) => println!("Result: {}", result),
 None => println!("Overflow!"),
 }
 
 // saturating_add - clamp at MAX
 let result = i32::MAX.saturating_add(1);
 println!("\ni32::MAX.saturating_add(1) = {}", result);
 println!("(still i32::MAX)");
}
```

</RustPlayground>

---

## Quick Reference

### Signed Integers
| Type | MIN | MAX |
|------|-----|-----|
| `i8` | -128 | 127 |
| `i16` | -32,768 | 32,767 |
| `i32` | -2,147,483,648 | 2,147,483,647 |
| `i64` | -9.2×10¹⁸ | 9.2×10¹⁸ |
| `i128` | -1.7×10³⁸ | 1.7×10³⁸ |

### Unsigned Integers
| Type | MIN | MAX |
|------|-----|-----|
| `u8` | 0 | 255 |
| `u16` | 0 | 65,535 |
| `u32` | 0 | 4,294,967,295 |
| `u64` | 0 | 1.8×10¹⁹ |
| `u128` | 0 | 3.4×10³⁸ |

### Constants
| Constant | คำอธิบาย |
|----------|---------|
| `MIN` | ค่าน้อยสุด |
| `MAX` | ค่ามากสุด |
| `BITS` | จำนวน bits |

---

[← Float](./float) | [Char →](./char)
