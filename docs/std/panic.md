# Panic - โปรแกรมพัง

**std::panic** สำหรับจัดการเมื่อโปรแกรมเจอ error ร้ายแรงที่ไม่คาดคิด! 

---

## Panic คืออะไร?

Panic คือการหยุดโปรแกรมทันทีเมื่อเจอ error ที่:
- ไม่คาดว่าจะเกิด (bug ใน code)
- ไม่สามารถ recover ได้
- แสดงว่ามีอะไรผิดปกติร้ายแรง

:::warning Panic vs Error
- **panic!** = program พัง ใช้กับ bug
- **Result** = error handling ปกติ ใช้กับ errors ที่คาดไว้
:::

---

## 1. panic! Macro

<RustPlayground>

```rust
fn main() {
 // ไม่ uncomment - จะทำให้ crash!
 
 // panic! พื้นฐาน
 // panic!("เกิดข้อผิดพลาดร้ายแรง!");
 
 // panic! พร้อม format
 // let error_code = 42;
 // panic!("ล้มเหลวด้วย code: {}", error_code);
 
 // unwrap() จะ panic ถ้า None
 let x: Option<i32> = Some(5);
 println!("x = {}", x.unwrap()); // OK
 
 // expect() เหมือน unwrap แต่กำหนดข้อความได้
 let y: Result<i32, &str> = Ok(10);
 println!("y = {}", y.expect("ควรมีค่า")); // OK
 
 // index เกินจะ panic
 let arr = [1, 2, 3];
 // let z = arr[10]; // panic: index out of bounds!
 
 println!("โปรแกรมทำงานปกติ");
}
```

</RustPlayground>

---

## 2. catch_unwind - จับ Panic

<RustPlayground>

```rust
use std::panic;

fn might_panic(should_panic: bool) {
 if should_panic {
 panic!("โอ๊ะ! เกิดข้อผิดพลาด!");
 }
 println!("ทำงานปกติ");
}

fn main() {
 // catch_unwind จับ panic ได้
 println!("=== กรณีไม่ panic ===");
 let result1 = panic::catch_unwind(|| {
 might_panic(false); // ไม่ panic
 42
 });
 println!("ผลลัพธ์: {:?}", result1); // Ok(42)
 
 // กรณี panic
 println!("\n=== กรณี panic ===");
 let result2 = panic::catch_unwind(|| {
 might_panic(true); // panic!
 42
 });
 println!("ผลลัพธ์: {:?}", result2); // Err(Box<dyn Any>)
 
 // ตรวจสอบ panic message
 if let Err(err) = result2 {
 if let Some(s) = err.downcast_ref::<&str>() {
 println!("Panic message: {}", s);
 } else if let Some(s) = err.downcast_ref::<String>() {
 println!("Panic message: {}", s);
 }
 }
 
 println!("\nโปรแกรมยังทำงานต่อได้!");
}
```

</RustPlayground>

---

## 3. AssertUnwindSafe

<RustPlayground>

```rust
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::cell::RefCell;

fn main() {
 // บาง types ไม่ใช่ UnwindSafe (เช่น &mut, RefCell)
 // ต้องใช้ AssertUnwindSafe wrapper
 
 let mut counter = 0;
 
 // แบบนี้ไม่ได้:
 // catch_unwind(|| { counter += 1; }); // Error!
 
 // ต้องใช้ AssertUnwindSafe:
 let result = catch_unwind(AssertUnwindSafe(|| {
 counter += 1;
 println!("counter เพิ่มเป็น: {}", counter);
 }));
 
 println!("result: {:?}", result);
 println!("counter สุดท้าย: {}", counter);
 
 // กรณี RefCell
 let cell = RefCell::new(100);
 
 let result2 = catch_unwind(AssertUnwindSafe(|| {
 *cell.borrow_mut() += 50;
 }));
 
 println!("cell: {:?}", cell);
}
```

</RustPlayground>

---

## 4. set_hook - Custom Panic Handler

<RustPlayground>

```rust
use std::panic;

fn main() {
 // ตั้ง custom panic handler
 panic::set_hook(Box::new(|info| {
 println!(" Custom Panic Handler ");
 
 // ดูตำแหน่งที่เกิด panic
 if let Some(location) = info.location() {
 println!(" ไฟล์: {}", location.file());
 println!(" บรรทัด: {}", location.line());
 println!(" คอลัมน์: {}", location.column());
 }
 
 // ดู panic message
 if let Some(s) = info.payload().downcast_ref::<&str>() {
 println!(" ข้อความ: {}", s);
 } else if let Some(s) = info.payload().downcast_ref::<String>() {
 println!(" ข้อความ: {}", s);
 }
 }));
 
 // ทดสอบ
 let _ = panic::catch_unwind(|| {
 panic!("ทดสอบ custom handler");
 });
 
 // Reset กลับเป็น default
 let _ = panic::take_hook();
 
 println!("\nเสร็จสิ้น");
}
```

</RustPlayground>

---

## 5. PanicInfo

<RustPlayground>

```rust
use std::panic;

fn main() {
 panic::set_hook(Box::new(|panic_info| {
 println!("=== PanicInfo ===");
 
 // payload() - ค่าที่ panic
 let payload = panic_info.payload();
 print!("payload: ");
 if let Some(s) = payload.downcast_ref::<&str>() {
 println!("&str = \"{}\"", s);
 } else if let Some(s) = payload.downcast_ref::<String>() {
 println!("String = \"{}\"", s);
 } else {
 println!("(ชนิดอื่น)");
 }
 
 // location() - ตำแหน่งใน source code
 if let Some(loc) = panic_info.location() {
 println!("location: {}:{}:{}", 
 loc.file(), 
 loc.line(), 
 loc.column());
 }
 
 // can_unwind() - จับได้ไหม
 println!("can_unwind: {}", panic_info.can_unwind());
 }));
 
 let _ = panic::catch_unwind(|| {
 panic!("ข้อความทดสอบ");
 });
}
```

</RustPlayground>

---

## 6. resume_unwind - Panic ต่อ

<RustPlayground>

```rust
use std::panic;

fn main() {
 let result = panic::catch_unwind(|| {
 panic!("panic เดิม");
 });
 
 match result {
 Ok(_) => println!("ไม่มี panic"),
 Err(err) => {
 println!("จับ panic ได้!");
 
 // ดู error
 if let Some(s) = err.downcast_ref::<&str>() {
 println!("ข้อความ: {}", s);
 }
 
 // เลือก: panic ต่อหรือจัดการเอง
 println!("ตัดสินใจ: จะ handle เอง ไม่ panic ต่อ");
 
 // ถ้าต้องการ panic ต่อ:
 // panic::resume_unwind(err);
 }
 }
 
 println!("โปรแกรมทำงานต่อ!");
}
```

</RustPlayground>

---

## 7. Panic vs Abort

```rust
// ตั้งค่าใน Cargo.toml:
//
// [profile.release]
// panic = "unwind" # ค่าเริ่มต้น - จับ panic ได้
// panic = "abort" # หยุดทันที - binary เล็กกว่า

// ตรวจสอบที่ runtime
fn check_panic_mode() {
 #[cfg(panic = "unwind")]
 println!("Mode: unwind (จับ panic ได้)");
 
 #[cfg(panic = "abort")]
 println!("Mode: abort (หยุดทันที)");
}
```

---

## Quick Reference

### เมื่อไหร่ใช้ panic vs Result

| ใช้ `panic!` | ใช้ `Result` |
|--------------|-------------|
| Bug ใน code | Error ที่คาดไว้ |
| ค่าผิดปกติที่เป็นไปไม่ได้ | I/O operations |
| ใน tests | User input |
| Prototype/ตัวอย่าง | Network requests |
| ละเมิด invariant | File operations |

### Functions
| Function | คำอธิบาย |
|----------|---------|
| `panic!(msg)` | ทำให้ panic |
| `catch_unwind(f)` | จับ panic |
| `resume_unwind(e)` | panic ต่อ |
| `set_hook(f)` | ตั้ง handler |
| `take_hook()` | เอา handler คืน |

### PanicInfo
| Method | คำอธิบาย |
|--------|---------|
| `payload()` | ค่าที่ panic |
| `location()` | ตำแหน่งใน code |
| `can_unwind()` | จับได้ไหม |

### Markers
| Marker | คำอธิบาย |
|--------|---------|
| `UnwindSafe` | ปลอดภัยหลัง panic |
| `RefUnwindSafe` | reference ปลอดภัย |
| `AssertUnwindSafe` | wrapper เพื่อ opt-in |

---

[← Error](./error) | [Marker →](./marker)
