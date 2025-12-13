# Floats - ตัวเลขทศนิยม

Rust มี **floating-point numbers** สำหรับค่าทศนิยม! 

---

## Floats คืออะไร?

ตัวเลขทศนิยมตามมาตรฐาน IEEE 754:

| Type | ขนาด | Precision | ช่วงค่า |
|------|------|-----------|---------|
| `f32` | 4 bytes | ~7 digits | ±3.4 × 10^38 |
| `f64` | 8 bytes | ~15 digits | ±1.8 × 10^308 |

:::tip Default คือ f64
Rust ใช้ `f64` เป็น default เพราะแม่นยำกว่าและ CPU สมัยใหม่เร็วพอ
:::

---

## 1. การประกาศ

<RustPlayground>

```rust
fn main() {
 // Type inference -> f64
 let x = 3.14;
 
 // ระบุ type
 let pi_f32: f32 = 3.14159;
 let pi_f64: f64 = 3.14159265358979;
 
 // Suffix
 let a = 3.14f32;
 let b = 3.14f64;
 
 println!("x (f64 default) = {}", x);
 println!("pi_f32 = {}", pi_f32);
 println!("pi_f64 = {}", pi_f64);
 
 // Scientific notation
 let big = 1.2e10; // 1.2 × 10^10
 let small = 1.2e-5; // 0.000012
 println!("1.2e10 = {}", big);
 println!("1.2e-5 = {}", small);
}
```

</RustPlayground>

---

## 2. Arithmetic

<RustPlayground>

```rust
fn main() {
 let a: f64 = 10.0;
 let b: f64 = 3.0;
 
 println!("a = {}, b = {}", a, b);
 println!("a + b = {}", a + b);
 println!("a - b = {}", a - b);
 println!("a * b = {}", a * b);
 println!("a / b = {}", a / b); // 3.333...
 println!("a % b = {}", a % b); // 1.0 (remainder)
 
 // Negative
 let c = -a;
 println!("-a = {}", c);
}
```

</RustPlayground>

---

## 3. Special Values

<RustPlayground>

```rust
fn main() {
 // Infinity
 let inf: f64 = f64::INFINITY;
 let neg_inf: f64 = f64::NEG_INFINITY;
 println!("INFINITY = {}", inf);
 println!("NEG_INFINITY = {}", neg_inf);
 
 // Division by zero -> Infinity
 let x = 1.0 / 0.0;
 println!("1.0 / 0.0 = {}", x); // inf
 
 // NaN (Not a Number)
 let nan: f64 = f64::NAN;
 println!("NAN = {}", nan);
 
 // 0.0 / 0.0 -> NaN
 let y = 0.0 / 0.0;
 println!("0.0 / 0.0 = {}", y); // NaN
 
 // Checking special values
 println!("inf.is_infinite() = {}", inf.is_infinite());
 println!("nan.is_nan() = {}", nan.is_nan());
 println!("3.14.is_finite() = {}", 3.14f64.is_finite());
}
```

</RustPlayground>

---

## 4. Math Methods

<RustPlayground>

```rust
fn main() {
 let x: f64 = -3.7;
 
 // Rounding
 println!("floor(-3.7) = {}", x.floor()); // -4
 println!("ceil(-3.7) = {}", x.ceil()); // -3
 println!("round(-3.7) = {}", x.round()); // -4
 println!("trunc(-3.7) = {}", x.trunc()); // -3
 println!("fract(-3.7) = {}", x.fract()); // -0.7
 
 // Absolute value
 println!("abs(-3.7) = {}", x.abs()); // 3.7
 
 // Sign
 println!("signum(-3.7) = {}", x.signum()); // -1
}
```

</RustPlayground>

---

## 5. Advanced Math

<RustPlayground>

```rust
fn main() {
 let x: f64 = 2.0;
 
 // Power and roots
 println!("2^3 = {}", x.powi(3)); // 8.0 (integer power)
 println!("2^2.5 = {}", x.powf(2.5)); // 5.656...
 println!("sqrt(2) = {}", x.sqrt()); // 1.414...
 println!("cbrt(8) = {}", 8.0f64.cbrt()); // 2.0 (cube root)
 
 // Exponential and logarithm
 println!("e^2 = {}", x.exp()); // 7.389...
 println!("ln(2) = {}", x.ln()); // 0.693...
 println!("log10(100) = {}", 100.0f64.log10()); // 2.0
 println!("log2(8) = {}", 8.0f64.log2()); // 3.0
 
 // Trigonometry
 let angle = std::f64::consts::PI / 4.0; // 45°
 println!("sin(45°) = {}", angle.sin());
 println!("cos(45°) = {}", angle.cos());
 println!("tan(45°) = {}", angle.tan());
}
```

</RustPlayground>

---

## 6. Constants

<RustPlayground>

```rust
use std::f64::consts;

fn main() {
 println!("PI = {}", consts::PI); // 3.14159...
 println!("E = {}", consts::E); // 2.71828...
 println!("TAU = {}", consts::TAU); // 6.28318... (2π)
 println!("SQRT_2 = {}", consts::SQRT_2); // 1.41421...
 println!("LN_2 = {}", consts::LN_2); // 0.69314...
 println!("LN_10 = {}", consts::LN_10); // 2.30258...
 
 // Bounds
 println!("f64::MIN = {}", f64::MIN);
 println!("f64::MAX = {}", f64::MAX);
 println!("f64::EPSILON = {}", f64::EPSILON);
}
```

</RustPlayground>

---

## 7. Comparison (ระวัง!)

<RustPlayground>

```rust
fn main() {
 // อย่าเปรียบเทียบ float ด้วย ==
 let a = 0.1 + 0.2;
 let b = 0.3;
 println!("0.1 + 0.2 = {}", a);
 println!("0.1 + 0.2 == 0.3? {}", a == b); // false!
 
 // ใช้ epsilon comparison
 let epsilon = f64::EPSILON;
 let diff = (a - b).abs();
 println!("difference = {}", diff);
 println!("close enough? {}", diff < epsilon * 10.0);
 
 // NaN comparison
 let nan = f64::NAN;
 println!("NaN == NaN? {}", nan == nan); // false!
 println!("NaN.is_nan()? {}", nan.is_nan()); // true
}
```

</RustPlayground>

:::warning Float Comparison
อย่าใช้ `==` เปรียบเทียบ floats! ใช้ epsilon comparison หรือ crate เช่น `float-cmp`
:::

---

## Quick Reference

### Constants
| Constant | ค่า |
|----------|-----|
| `f64::PI` | 3.14159... |
| `f64::E` | 2.71828... |
| `f64::INFINITY` | ∞ |
| `f64::NEG_INFINITY` | -∞ |
| `f64::NAN` | Not a Number |
| `f64::EPSILON` | ~2.2 × 10^-16 |

### Rounding Methods
| Method | ผลลัพธ์ |
|--------|--------|
| `floor()` | ปัดลง |
| `ceil()` | ปัดขึ้น |
| `round()` | ปัดตามปกติ |
| `trunc()` | ตัดทศนิยม |

### Math Methods
| Method | คำอธิบาย |
|--------|---------|
| `sqrt()` | รากที่สอง |
| `powi(n)` | ยกกำลัง integer |
| `powf(f)` | ยกกำลัง float |
| `exp()` | e^x |
| `ln()` | log ฐาน e |
| `sin/cos/tan()` | ตรีโกณมิติ |

---

[← Unsigned](./unsigned) | [char →](./char)
