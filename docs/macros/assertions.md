# Assertion Macros - ตรวจสอบ

`assert!`, `assert_eq!`, `assert_ne!` สำหรับตรวจสอบ conditions! 

---

## assert! - ตรวจสอบ boolean

<RustPlayground>

```rust
fn main() {
 let x = 10;
 
 // ถ้า condition เป็น false จะ panic!
 assert!(x > 0);
 assert!(x > 5, "x must be greater than 5");
 
 println!("All assertions passed!");
 
 // ลองเปลี่ยน x = 3 แล้วรันใหม่
}
```

</RustPlayground>

---

## assert_eq! - ตรวจสอบเท่ากัน

<RustPlayground>

```rust
fn main() {
 let a = 2 + 2;
 let b = 4;
 
 // ตรวจว่า a == b
 assert_eq!(a, b);
 
 // พร้อม custom message
 assert_eq!(a, b, "Math is broken! {} != {}", a, b);
 
 // ใช้กับ strings
 let s1 = "hello";
 let s2 = "hello";
 assert_eq!(s1, s2);
 
 println!("All equal!");
}
```

</RustPlayground>

---

## assert_ne! - ตรวจสอบไม่เท่ากัน

<RustPlayground>

```rust
fn main() {
 let x = 5;
 let y = 10;
 
 // ตรวจว่า x != y
 assert_ne!(x, y);
 assert_ne!(x, y, "x and y should be different!");
 
 // ใช้กับ strings
 let name = "Alice";
 assert_ne!(name, "Bob");
 
 println!("All different!");
}
```

</RustPlayground>

---

## debug_assert! - เฉพาะ debug mode

<RustPlayground>

```rust
fn main() {
 let value = 42;
 
 // debug_assert! ถูกลบออกใน release mode
 // (เมื่อ compile ด้วย --release)
 debug_assert!(value > 0);
 debug_assert_eq!(value, 42);
 debug_assert_ne!(value, 0);
 
 println!("value = {}", value);
 
 // ใน release mode:
 // - debug_assert!* จะไม่ถูก run
 // - ประหยัด performance
}
```

</RustPlayground>

:::tip debug vs release
- `assert!` → ทำงานเสมอ (แม้ release)
- `debug_assert!` → ทำงานเฉพาะ debug mode

ใช้ `debug_assert!` สำหรับ checks ที่ expensive
:::

---

## ใช้ใน Tests

<RustPlayground>

```rust
fn add(a: i32, b: i32) -> i32 {
 a + b
}

fn divide(a: i32, b: i32) -> Option<i32> {
 if b == 0 { None } else { Some(a / b) }
}

fn main() {
 // ทดสอบ function
 assert_eq!(add(2, 3), 5);
 assert_eq!(add(-1, 1), 0);
 assert_ne!(add(1, 1), 3);
 
 // ทดสอบ Option
 assert_eq!(divide(10, 2), Some(5));
 assert_eq!(divide(10, 0), None);
 
 println!("All tests passed!");
}
```

</RustPlayground>

---

## Custom Error Messages

<RustPlayground>

```rust
fn main() {
 let user_age = 17;
 let min_age = 18;
 
 // Message แบบละเอียด
 assert!(
 user_age >= min_age,
 "User age {} is below minimum age {}",
 user_age,
 min_age
 );
}
```

</RustPlayground>

---

## Quick Reference

### Macros
| Macro | ตรวจสอบ | เมื่อไหร่ใช้ |
|-------|--------|------------|
| `assert!` | condition เป็น true | ทั่วไป |
| `assert_eq!` | a == b | เปรียบเทียบค่า |
| `assert_ne!` | a != b | ค่าต้องต่าง |
| `debug_assert!` | true (debug only) | Performance |
| `debug_assert_eq!` | a == b (debug only) | Performance |
| `debug_assert_ne!` | a != b (debug only) | Performance |

### เมื่อไหร่ใช้อะไร
| Case | ใช้ |
|------|-----|
| ต้องถูกเสมอ | `assert!` |
| ตรวจ return value | `assert_eq!` |
| ช้า แต่ต้องตรวจ | `debug_assert!` |
| Unit tests | `assert_eq!`, `assert_ne!` |

---

[← Formatting](./formatting) | [Debugging →](./debugging)
