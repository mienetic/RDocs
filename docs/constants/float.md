# Float Constants

`f32` และ `f64` constants สำหรับ mathematical และ special values! 

---

## Mathematical Constants

<RustPlayground>

```rust
use std::f64::consts;

fn main() {
 println!("=== Mathematical Constants (f64) ===");
 println!("PI = {:.15}", consts::PI); // π
 println!("TAU = {:.15}", consts::TAU); // τ = 2π
 println!("E = {:.15}", consts::E); // e
 println!("SQRT_2 = {:.15}", consts::SQRT_2); // √2
 println!("LN_2 = {:.15}", consts::LN_2); // ln(2)
 println!("LN_10 = {:.15}", consts::LN_10); // ln(10)
 
 println!("\n=== PI fractions ===");
 println!("FRAC_PI_2 = {:.10}", consts::FRAC_PI_2); // π/2
 println!("FRAC_PI_3 = {:.10}", consts::FRAC_PI_3); // π/3
 println!("FRAC_PI_4 = {:.10}", consts::FRAC_PI_4); // π/4
 println!("FRAC_PI_6 = {:.10}", consts::FRAC_PI_6); // π/6
 
 // คำนวณพื้นที่วงกลม
 let radius = 5.0;
 let area = consts::PI * radius * radius;
 println!("\nCircle area (r=5): {:.2}", area);
}
```

</RustPlayground>

---

## Float Limits

<RustPlayground>

```rust
fn main() {
 println!("=== f32 Limits ===");
 println!("MAX = {:e}", f32::MAX);
 println!("MIN = {:e}", f32::MIN);
 println!("MIN_POSITIVE = {:e}", f32::MIN_POSITIVE);
 println!("EPSILON = {:e}", f32::EPSILON);
 
 println!("\n=== f64 Limits ===");
 println!("MAX = {:e}", f64::MAX);
 println!("MIN = {:e}", f64::MIN);
 println!("MIN_POSITIVE = {:e}", f64::MIN_POSITIVE);
 println!("EPSILON = {:e}", f64::EPSILON);
 
 println!("\n=== Precision ===");
 println!("f32 DIGITS = {}", f32::DIGITS);
 println!("f64 DIGITS = {}", f64::DIGITS);
}
```

</RustPlayground>

---

## Special Values

<RustPlayground>

```rust
fn main() {
 println!("=== Special Values ===");
 
 // Infinity
 let inf = f64::INFINITY;
 let neg_inf = f64::NEG_INFINITY;
 println!("INFINITY = {}", inf);
 println!("NEG_INFINITY = {}", neg_inf);
 println!("1.0/0.0 = {}", 1.0f64 / 0.0);
 
 // NaN
 let nan = f64::NAN;
 println!("\nNAN = {}", nan);
 println!("NaN == NaN: {}", nan == nan); // false!
 println!("is_nan: {}", nan.is_nan());
 
 // Checking
 println!("\n=== Checking ===");
 let values = [1.0, inf, neg_inf, nan, 0.0];
 for v in values {
 println!("{:10} -> finite:{}, infinite:{}, nan:{}", 
 v, v.is_finite(), v.is_infinite(), v.is_nan());
 }
}
```

</RustPlayground>

---

## Quick Reference

### Mathematical Constants
| Constant | ค่า | คำอธิบาย |
|----------|-----|---------|
| `PI` | 3.14159... | π |
| `TAU` | 6.28318... | τ = 2π |
| `E` | 2.71828... | Euler's number |
| `SQRT_2` | 1.41421... | √2 |
| `LN_2` | 0.69314... | ln(2) |
| `LN_10` | 2.30258... | ln(10) |
| `LOG2_E` | 1.44269... | log₂(e) |
| `LOG10_E` | 0.43429... | log₁₀(e) |

### Float Limits
| Constant | คำอธิบาย |
|----------|---------|
| `MAX` | ค่าสูงสุด |
| `MIN` | ค่าต่ำสุด (negative) |
| `MIN_POSITIVE` | ค่าบวกที่เล็กที่สุด |
| `EPSILON` | ค่าแตกต่างที่เล็กที่สุด |

### Special Values
| Constant | คำอธิบาย |
|----------|---------|
| `INFINITY` | Positive infinity |
| `NEG_INFINITY` | Negative infinity |
| `NAN` | Not a Number |

---

[← Index](./index) | [Integer →](./integer)
