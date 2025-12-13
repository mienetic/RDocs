# Panic Macro - หยุดโปรแกรม

`panic!` สำหรับหยุดโปรแกรมเมื่อเกิดข้อผิดพลาดร้ายแรง! 

---

## panic! พื้นฐาน

<RustPlayground>

```rust
fn main() {
 println!("Before panic");
 
 // panic หยุดโปรแกรมทันที
 panic!("Something went wrong!");
 
 // บรรทัดนี้ไม่ถูกรัน
 println!("After panic");
}
```

</RustPlayground>

---

## panic! พร้อม message

<RustPlayground>

```rust
fn main() {
 let x = 5;
 let max = 10;
 
 if x > max {
 panic!("Value {} exceeds maximum {}", x, max);
 }
 
 println!("x = {} is valid", x);
 
 // ลองเปลี่ยน x = 15 แล้วดู
}
```

</RustPlayground>

---

## เมื่อไหร่ใช้ panic!

<RustPlayground>

```rust
fn divide(a: i32, b: i32) -> i32 {
 if b == 0 {
 // ใช้ panic เมื่อ recover ไม่ได้
 panic!("Division by zero!");
 }
 a / b
}

fn get_element(arr: &[i32], index: usize) -> i32 {
 // หรือใช้ index ที่เกินขอบเขต (auto panic)
 arr[index]
}

fn main() {
 println!("10 / 2 = {}", divide(10, 2));
 
 let arr = [1, 2, 3];
 println!("arr[1] = {}", get_element(&arr, 1));
 
 // เหล่านี้จะ panic:
 // divide(10, 0);
 // get_element(&arr, 10);
}
```

</RustPlayground>

---

## panic vs Result

<RustPlayground>

```rust
// ใช้ panic สำหรับ expected errors
fn bad_parse(s: &str) -> i32 {
 s.parse().expect("parse failed") // panic ถ้า parse ไม่ได้
}

// ใช้ Result สำหรับ recoverable errors
fn good_parse(s: &str) -> Result<i32, std::num::ParseIntError> {
 s.parse()
}

fn main() {
 // Result ให้เลือก handle ได้
 match good_parse("42") {
 Ok(n) => println!("parsed: {}", n),
 Err(e) => println!("error: {}", e),
 }
 
 match good_parse("not a number") {
 Ok(n) => println!("parsed: {}", n),
 Err(e) => println!("error: {}", e),
 }
}
```

</RustPlayground>

:::tip เมื่อไหร่ Panic vs Result
| Situation | ใช้ |
|-----------|-----|
| Bug ใน code | `panic!` |
| Invalid state | `panic!` |
| User input ผิด | `Result` |
| File not found | `Result` |
| Network error | `Result` |
:::

---

## Catching Panic

<RustPlayground>

```rust
use std::panic;

fn main() {
 // catch_unwind จับ panic ได้
 let result = panic::catch_unwind(|| {
 println!("about to panic...");
 panic!("boom!");
 });
 
 match result {
 Ok(_) => println!("no panic"),
 Err(_) => println!("caught a panic!"),
 }
 
 println!("program continues...");
}
```

</RustPlayground>

---

## Panic Hooks

<RustPlayground>

```rust
use std::panic;

fn main() {
 // Custom panic handler
 panic::set_hook(Box::new(|info| {
 eprintln!("Custom panic handler!");
 if let Some(msg) = info.payload().downcast_ref::<&str>() {
 eprintln!("Message: {}", msg);
 }
 if let Some(location) = info.location() {
 eprintln!("Location: {}:{}", location.file(), location.line());
 }
 }));
 
 panic!("test panic");
}
```

</RustPlayground>

---

## Quick Reference

### Panic Macros
| Macro | ใช้เมื่อ |
|-------|---------|
| `panic!()` | หยุดทันที |
| `panic!("msg")` | หยุดพร้อม message |
| `assert!` | ถ้า false → panic |
| `unreachable!` | ไม่ควรมาถึง |
| `unimplemented!` | ยังไม่ implement |

### เมื่อไหร่ใช้ Panic
| ใช้ Panic | ไม่ใช้ Panic |
|-------------|----------------|
| Logic bug | User input error |
| Invariant violation | File not found |
| Impossible state | Network failure |
| Testing | Recoverable error |

---

[← Debugging](./debugging) | [Data →](./data)
