# Primitive Types - ชนิดข้อมูลพื้นฐาน

Rust มี **primitive types** ที่เป็นพื้นฐานของทุกโปรแกรม! 

---
::: pitfall
**Integer Overflow**
ใน Debug mode: Rust จะ **panic** ถ้าเกิด overflow
ใน Release mode: Rust จะทำ **wrapping** (255 + 1 = 0)
ถ้าต้องการพฤติกรรมที่ชัดเจน ให้ใช้ method เช่น `wrapping_add`, `saturating_add`, หรือ `checked_add`
:::

## Primitive Types คืออะไร?
Primitive types คือชนิดข้อมูลพื้นฐานที่ built-in มากับภาษา ไม่ต้อง import:

| หมวด | Types |
|------|-------|
| **Integers** | i8, i16, i32, i64, i128, isize |
| **Unsigned** | u8, u16, u32, u64, u128, usize |
| **Floats** | f32, f64 |
| **Text** | char, str |
| **Boolean** | bool |
| **Unit** | () |
| **Compound** | array, slice, tuple |
| **Pointers** | reference, pointer, fn, never |

---

## หน้าเอกสาร

### ตัวเลข

<div class="grid-cards">

- **[Integers](./integers)** - ตัวเลขจำนวนเต็มที่มีเครื่องหมาย (i8 → i128)
- **[Unsigned](./unsigned)** - ตัวเลขจำนวนเต็มไม่ติดลบ (u8 → u128)
- **[Floats](./floats)** - ตัวเลขทศนิยม (f32, f64)

</div>

### ข้อความ

<div class="grid-cards">

- **[char](./char)** - ตัวอักษรเดียว (Unicode scalar)
- **[str](./str)** - String slice (ข้อความ borrowed)

</div>

### พื้นฐาน

<div class="grid-cards">

- **[bool & unit](./bool-unit)** - Boolean และ unit type

</div>

### Compound Types

<div class="grid-cards">

- **[array](./array)** - อาเรย์ขนาดคงที่ `[T; N]`
- **[slice](./slice)** - View เข้าไปในอาเรย์ `[T]`
- **[tuple](./tuple)** - กลุ่มค่าหลายชนิด `(T, U, ...)`

</div>

### Pointers & References

<div class="grid-cards">

- **[reference](./reference)** - References `&T`, `&mut T`
- **[pointer](./pointer)** - Raw pointers `*const T`, `*mut T`
- **[fn & never](./fn-never)** - Function pointers และ never type

</div>

---

## Quick Reference

| Type | ขนาด | ตัวอย่าง |
|------|------|---------|
| `i32` | 4 bytes | `let x: i32 = 42;` |
| `u64` | 8 bytes | `let y: u64 = 100;` |
| `f64` | 8 bytes | `let pi: f64 = 3.14;` |
| `bool` | 1 byte | `let flag = true;` |
| `char` | 4 bytes | `let c = 'ก';` |
| `()` | 0 bytes | `let unit = ();` |
| `[i32; 3]` | 12 bytes | `let arr = [1, 2, 3];` |
| `&str` | 16 bytes | `let s = "hello";` |

---

[← กลับหน้าหลัก](/)
