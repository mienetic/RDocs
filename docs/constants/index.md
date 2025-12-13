# Rust Constants

Constants คือค่าคงที่ที่กำหนดไว้ใน standard library ใช้งานได้ทันทีโดยไม่ต้องคำนวณ!

::: best-practice
**const vs static**
*   **const**: เป็นค่าคงที่แบบ *inlined* (ทุกที่ที่เรียกจะถูกแทนที่ด้วยค่านี้). ใช้เป็นค่า Default.
*   **static**: เป็นค่าคงที่ที่มี *memory address* เดียวตลอดโปรแกรม. ใช้เมื่อต้องการแชร์ reference หรือ global state (คู่กับ `Mutex`).
:::

::: tip
**Associated Constants**
คุณสามารถประกาศ `const` ใน `impl` block ได้ด้วย!
`impl MyStruct { const MAX_SIZE: u32 = 100; }`
เรียกใช้ด้วย `MyStruct::MAX_SIZE` (Namespace ชัดเจน)
:::

---

## Constants คืออะไร?

Rust std มี constants หลายประเภท:
- **Numeric constants**: PI, E, MAX, MIN
- **Platform constants**: ARCH, OS
- **Special values**: INFINITY, NAN

---

## หมวดหมู่ Constants

### Float Constants
| Constant | คำอธิบาย |
|----------|---------|
| `f32::consts::PI` | π (3.14159...) |
| `f32::consts::E` | e (2.71828...) |
| `f32::consts::TAU` | τ (2π) |
| `f32::INFINITY` | Positive infinity |
| `f32::NAN` | Not a Number |

 **[ดูเพิ่มเติม](./float)**

---

### Integer Constants
| Constant | คำอธิบาย |
|----------|---------|
| `i32::MAX` | ค่าสูงสุดของ i32 |
| `i32::MIN` | ค่าต่ำสุดของ i32 |
| `usize::MAX` | ค่าสูงสุดของ usize |

 **[ดูเพิ่มเติม](./integer)**

---

### Char Constants
| Constant | คำอธิบาย |
|----------|---------|
| `char::MAX` | Unicode สูงสุด |
| `char::REPLACEMENT_CHARACTER` | ตัวแทน invalid UTF-8 |

 **[ดูเพิ่มเติม](./char)**

---

### Env Constants
| Constant | คำอธิบาย |
|----------|---------|
| `std::env::consts::OS` | Operating system |
| `std::env::consts::ARCH` | CPU architecture |
| `std::env::consts::FAMILY` | OS family |

 **[ดูเพิ่มเติม](./env)**

---

### Math Constants
| Constant | คำอธิบาย |
|----------|---------|
| `SQRT_2` | √2 |
| `LN_2`, `LN_10` | Natural log |
| `FRAC_PI_2`, `FRAC_PI_4` | PI fractions |

 **[ดูเพิ่มเติม](./math)**

---

### Path Constants
| Constant | คำอธิบาย |
|----------|---------|
| `MAIN_SEPARATOR` | Path separator (`/` หรือ `\`) |

 **[ดูเพิ่มเติม](./path)**

---

### Time Constants
| Constant | คำอธิบาย |
|----------|---------|
| `UNIX_EPOCH` | Jan 1, 1970 00:00:00 UTC |

 **[ดูเพิ่มเติม](./time)**

---

## Quick Reference

| Constant | ค่า | Type |
|----------|-----|------|
| `f64::consts::PI` | 3.14159... | f64 |
| `f64::consts::E` | 2.71828... | f64 |
| `i32::MAX` | 2,147,483,647 | i32 |
| `i32::MIN` | -2,147,483,648 | i32 |
| `u8::MAX` | 255 | u8 |
| `usize::MAX` | platform-dependent | usize |

---

[← กลับหน้าหลัก](/)
