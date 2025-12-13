# Marker Traits

`Sized`, `Unpin`, `Send`, `Sync` เป็น Traits พิเศษที่บอกคุณสมบัติของ Types! 

---

## Sized

`Sized` บอกว่า Type นี้มีขนาดแน่นอนที่รู้ตอน Compile time (จำเป็นสำหรับการสร้างตัวแปร, Argument, Return value)

<RustPlayground>

```rust
// T: Sized โดยอัตโนมัติ (implicit)
fn accept_sized<T>(t: T) {
 println!("Got sized type");
}

// ต้องการ Unsized types? ใช้ ?Sized
// (ต้องใช้ผ่าน reference เพราะไม่รู้ขนาด)
fn accept_maybe_unsized<T: ?Sized>(t: &T) {
 println!("Got maybe unsized");
}

fn main() {
 let x = 5;
 let s = "hello"; // str is unsized
 
 accept_sized(x);
 // accept_sized(*s); // Error: str is not Sized
 
 accept_maybe_unsized(&x);
 accept_maybe_unsized(s); // &str works
}
```

</RustPlayground>

---

## Unpin

`Unpin` บอกว่า Type นี้สามารถ "ย้ายที่" ใน Memory ได้อย่างปลอดภัย แม้จะอยู่ใน `Pin`

* Types ส่วนใหญ่ใน Rust เป็น `Unpin` อัตโนมัติ (เช่น `u8`, `String`, Struct ทั่วไป)
* **ยกเว้น:** `Self-referential structs` หรือ Futures ที่ถูกสร้างจาก `async` block ที่อาจมีการอ้างอิงตัวเอง

<RustPlayground>

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

#[derive(Debug)]
struct Movable {
 data: i32,
}

#[derive(Debug)]
struct Immovable {
 data: i32,
 _marker: PhantomPinned, // ทำให้ struct นี้ !Unpin
}

fn main() {
 let m = Movable { data: 10 };
 let i = Immovable { data: 20, _marker: PhantomPinned };
 
 println!("Movable: Is Unpin? {}", is_unpin::<Movable>());
 println!("Immovable: Is Unpin? {}", is_unpin::<Immovable>());
}

fn is_unpin<T: Unpin>() -> bool {
 true
}
// ถ้าเรียก is_unpin::<Immovable>() จะ Compile error
```

</RustPlayground>

---

## PhantomData

ไม่ใช่ Trait แต่เป็น Struct ที่ใช้ร่วมกับ Marker Traits เพื่อ "หลอก" Compiler ว่าเราถือ Type นั้นอยู่ (เช่นเพื่อให้ struct กลายเป็น `!Send` หรือมี lifetime)

<RustPlayground>

```rust
use std::marker::PhantomData;

struct Wrapper<T> {
 // เราไม่ได้เก็บ T จริงๆ แต่ต้องการให้ Compiler คิดว่าเก็บ
 // เพื่อ check variance/ownership
 _marker: PhantomData<T>,
}

fn main() {
 let w = Wrapper::<i32> { _marker: PhantomData };
 println!("Size of Wrapper: {}", std::mem::size_of_val(&w)); // 0 bytes
}
```

</RustPlayground>

---

## Quick Reference

### Marker Traits
| Trait | คำอธิบาย | หมายเหตุ |
|-------|---------|---------|
| `Sized` | มีขนาดคงที่ | Auto-implemented. ใช้ `?Sized` เพื่อ opt-out |
| `Unpin` | ย้ายที่ใน mem ได้ | Auto-implemented. `!Unpin` สำหรับ Pinning |
| `Send` | ส่งข้าม thread | ดู [Concurrency](./concurrency) |
| `Sync` | แชร์ข้าม thread | ดู [Concurrency](./concurrency) |
| `Copy` | Copy bitwise | ดู [Core](./core) |

---

[← Iterator Ext](./iterator-ext) | [Standard Library](../std/index)
