# Convert Enums

`Infallible` สำหรับ conversions ที่ไม่มีทาง fail! 

---

## Infallible คืออะไร?

`Infallible` เป็น enum ที่ไม่มี variants เลย! ใช้เป็น error type สำหรับ operations ที่ไม่มีทาง fail

<RustPlayground>

```rust
use std::convert::Infallible;

// Infallible ไม่มี variants
// enum Infallible {}

// ใช้กับ TryFrom ที่ไม่มีทาง fail
fn string_from_str(s: &str) -> Result<String, Infallible> {
 Ok(s.to_string())
}

fn main() {
 let result = string_from_str("hello");
 
 // เนื่องจากไม่มีทาง Err ได้
 // unwrap ปลอดภัย 100%
 let s = result.unwrap();
 println!("result: {}", s);
 
 // หรือใช้ match
 match string_from_str("world") {
 Ok(s) => println!("got: {}", s),
 Err(never) => match never {}, // unreachable!
 }
}
```

</RustPlayground>

---

## Infallible กับ TryFrom/TryInto

<RustPlayground>

```rust
use std::convert::{TryFrom, Infallible};

struct Wrapper(i32);

// From ที่ไม่มีทาง fail
impl TryFrom<i32> for Wrapper {
 type Error = Infallible;
 
 fn try_from(value: i32) -> Result<Self, Self::Error> {
 Ok(Wrapper(value))
 }
}

fn main() {
 // TryFrom ด้วย Infallible = เหมือน From
 let w = Wrapper::try_from(42).unwrap();
 println!("wrapped: {}", w.0);
 
 // สำหรับ types ที่ implement From<T>
 // TryFrom จะ auto-implement ด้วย Error = Infallible
 let s: Result<String, Infallible> = String::try_from("hello");
 println!("string: {:?}", s);
}
```

</RustPlayground>

---

## Quick Reference

### Infallible
- ไม่มี variants (uninhabited type)
- ใช้เป็น error type สำหรับ operations ที่ไม่มีทาง fail
- เหมือน `!` (never type) แต่ stable

### Use Cases
| กรณี | คำอธิบาย |
|------|---------|
| `TryFrom<T>` | เมื่อ conversion ไม่มีทาง fail |
| `FromStr` | เมื่อ parsing ไม่มีทาง fail |
| Generic bounds | เมื่อต้องการ Result แต่ไม่มี error |

---

[← Channel](./channel) | [Path →](./path-enum)
