# Num Enums

`FpCategory`, `IntErrorKind` สำหรับ numeric operations! 

---

## FpCategory - Floating Point Category

<RustPlayground>

```rust
use std::num::FpCategory;

fn main() {
 let values: [(f64, &str); 7] = [
 (0.0, "zero"),
 (-0.0, "negative zero"),
 (1.0, "normal"),
 (f64::INFINITY, "infinity"),
 (f64::NEG_INFINITY, "-infinity"),
 (f64::NAN, "NaN"),
 (1.0e-308, "subnormal"), // very small
 ];
 
 println!("=== FpCategory ===");
 for (val, name) in values {
 let cat = val.classify();
 println!("{:12} -> {:?}", name, cat);
 }
 
 // Pattern matching
 let x = 1.5f64;
 match x.classify() {
 FpCategory::Normal => println!("{} is normal", x),
 FpCategory::Subnormal => println!("{} is subnormal", x),
 FpCategory::Zero => println!("{} is zero", x),
 FpCategory::Infinite => println!("{} is infinite", x),
 FpCategory::Nan => println!("{} is NaN", x),
 }
}
```

</RustPlayground>

---

## IntErrorKind - Parse Int Error

<RustPlayground>

```rust
use std::num::IntErrorKind;

fn main() {
 let tests = [
 "", // Empty
 "abc", // InvalidDigit
 "99999999999999999999", // PosOverflow
 "-99999999999999999999", // NegOverflow
 "42", // Ok
 ];
 
 println!("=== IntErrorKind ===");
 for s in tests {
 let result: Result<i32, _> = s.parse();
 match result {
 Ok(n) => println!("{:25} -> Ok({})", format!("{:?}", s), n),
 Err(e) => {
 let kind = e.kind();
 println!("{:25} -> {:?}", format!("{:?}", s), kind);
 }
 }
 }
}
```

</RustPlayground>

---

## IntErrorKind Handling

<RustPlayground>

```rust
use std::num::IntErrorKind;

fn parse_with_message(s: &str) -> Result<i32, String> {
 s.parse::<i32>().map_err(|e| {
 match e.kind() {
 IntErrorKind::Empty => "ไม่มีข้อมูล".to_string(),
 IntErrorKind::InvalidDigit => format!("'{}' ไม่ใช่ตัวเลข", s),
 IntErrorKind::PosOverflow => "เลขมากเกินไป".to_string(),
 IntErrorKind::NegOverflow => "เลขน้อยเกินไป".to_string(),
 IntErrorKind::Zero => "ศูนย์ไม่อนุญาต".to_string(),
 _ => "error ไม่รู้จัก".to_string(),
 }
 })
}

fn main() {
 let inputs = ["42", "abc", "", "999999999999"];
 
 for s in inputs {
 match parse_with_message(s) {
 Ok(n) => println!("{} = {}", s, n),
 Err(msg) => println!("'{}': {}", s, msg),
 }
 }
}
```

</RustPlayground>

---

## Quick Reference

### FpCategory
| Variant | คำอธิบาย |
|---------|---------|
| `Normal` | ค่าปกติ |
| `Subnormal` | ค่าเล็กมาก (ใกล้ 0) |
| `Zero` | ศูนย์ (0.0 หรือ -0.0) |
| `Infinite` | infinity หรือ -infinity |
| `Nan` | Not a Number |

### IntErrorKind
| Variant | คำอธิบาย |
|---------|---------|
| `Empty` | string ว่าง |
| `InvalidDigit` | มีตัวอักษรที่ไม่ใช่เลข |
| `PosOverflow` | เกิน max ของ type |
| `NegOverflow` | น้อยกว่า min ของ type |
| `Zero` | ไม่อนุญาตศูนย์ (NonZero types) |

---

[← Atomic](./atomic) | [Fmt →](./fmt-enum)
