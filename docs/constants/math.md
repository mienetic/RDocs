# Math Constants

Mathematical constants เพิ่มเติมสำหรับ f32 และ f64! 

---

## Basic Math Constants

<RustPlayground>

```rust
use std::f64::consts;

fn main() {
 println!("=== Basic Constants ===");
 println!("E = {:.15}", consts::E); // e (Euler's number)
 println!("PI = {:.15}", consts::PI); // π
 println!("TAU = {:.15}", consts::TAU); // τ = 2π
 println!("PHI = {:.15}", 1.618033988749895); // φ (golden ratio)
 
 println!("\n=== Square Roots ===");
 println!("SQRT_2 = {:.15}", consts::SQRT_2); // √2
 println!("SQRT_3 = {:.15}", 1.7320508075688772); // √3
 println!("FRAC_1_SQRT_2 = {:.15}", consts::FRAC_1_SQRT_2); // 1/√2
 
 println!("\n=== Logarithms ===");
 println!("LN_2 = {:.15}", consts::LN_2); // ln(2)
 println!("LN_10 = {:.15}", consts::LN_10); // ln(10)
 println!("LOG2_E = {:.15}", consts::LOG2_E); // log₂(e)
 println!("LOG10_E = {:.15}", consts::LOG10_E); // log₁₀(e)
 println!("LOG2_10 = {:.15}", consts::LOG2_10); // log₂(10)
 println!("LOG10_2 = {:.15}", consts::LOG10_2); // log₁₀(2)
}
```

</RustPlayground>

---

## PI Fractions

<RustPlayground>

```rust
use std::f64::consts;

fn main() {
 println!("=== PI Fractions ===");
 println!("FRAC_PI_2 = {:.10} (π/2 = 90°)", consts::FRAC_PI_2);
 println!("FRAC_PI_3 = {:.10} (π/3 = 60°)", consts::FRAC_PI_3);
 println!("FRAC_PI_4 = {:.10} (π/4 = 45°)", consts::FRAC_PI_4);
 println!("FRAC_PI_6 = {:.10} (π/6 = 30°)", consts::FRAC_PI_6);
 println!("FRAC_PI_8 = {:.10} (π/8 = 22.5°)", consts::FRAC_PI_8);
 
 println!("\n=== 1/PI Fractions ===");
 println!("FRAC_1_PI = {:.10} (1/π)", consts::FRAC_1_PI);
 println!("FRAC_2_PI = {:.10} (2/π)", consts::FRAC_2_PI);
 
 println!("\n=== Using for angles ===");
 let degrees = 45.0;
 let radians = degrees * consts::FRAC_PI_4 / 45.0 * 2.0;
 println!("{}° = {} radians", degrees, radians);
 
 // sin, cos ของมุมพิเศษ
 println!("\nsin(π/4) = {:.10}", consts::FRAC_PI_4.sin());
 println!("cos(π/4) = {:.10}", consts::FRAC_PI_4.cos());
}
```

</RustPlayground>

---

## Using Math Constants

<RustPlayground>

```rust
use std::f64::consts;

fn main() {
 // คำนวณพื้นที่วงกลม
 let radius = 5.0;
 let area = consts::PI * radius * radius;
 let circumference = consts::TAU * radius; // TAU = 2*PI
 println!("Circle (r={})", radius);
 println!(" Area = {:.4}", area);
 println!(" Circumference = {:.4}", circumference);
 
 // Exponential decay
 let half_life = 5.0;
 let decay_constant = consts::LN_2 / half_life;
 println!("\nHalf-life = {}", half_life);
 println!("Decay constant = {:.6}", decay_constant);
 
 // Normal distribution
 let x = 0.0;
 let sigma = 1.0;
 let normal = (1.0 / (sigma * consts::TAU.sqrt())) 
 * (-0.5 * (x / sigma).powi(2)).exp();
 println!("\nNormal(0, 1) at x=0: {:.6}", normal);
 
 // Golden ratio
 let phi = (1.0 + 5.0_f64.sqrt()) / 2.0;
 println!("\nGolden ratio φ = {:.10}", phi);
}
```

</RustPlayground>

---

## Quick Reference

### Basic Constants
| Constant | ค่า | คำอธิบาย |
|----------|-----|---------|
| `E` | 2.71828... | Euler's number |
| `PI` | 3.14159... | π |
| `TAU` | 6.28318... | τ = 2π |
| `PHI` | 1.61803... | Golden ratio (nightly) |

### Square Roots
| Constant | ค่า | คำอธิบาย |
|----------|-----|---------|
| `SQRT_2` | 1.41421... | √2 |
| `SQRT_3` | 1.73205... | √3 (nightly) |
| `FRAC_1_SQRT_2` | 0.70710... | 1/√2 |
| `FRAC_1_SQRT_3` | 0.57735... | 1/√3 (nightly) |

### Logarithms
| Constant | ค่า | คำอธิบาย |
|----------|-----|---------|
| `LN_2` | 0.69314... | ln(2) |
| `LN_10` | 2.30258... | ln(10) |
| `LOG2_E` | 1.44269... | log₂(e) |
| `LOG10_E` | 0.43429... | log₁₀(e) |
| `LOG2_10` | 3.32192... | log₂(10) |
| `LOG10_2` | 0.30102... | log₁₀(2) |

### PI Fractions
| Constant | ค่า | องศา |
|----------|-----|------|
| `FRAC_PI_2` | 1.57079... | 90° |
| `FRAC_PI_3` | 1.04719... | 60° |
| `FRAC_PI_4` | 0.78539... | 45° |
| `FRAC_PI_6` | 0.52359... | 30° |
| `FRAC_PI_8` | 0.39269... | 22.5° |

---

[← Float](./float) | [Index →](./index)
