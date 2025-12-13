# reference - การอ้างอิง

`&T` และ `&mut T` คือ references! 

---

## reference คืออะไร?

Reference คือ "ตัวชี้" ที่ปลอดภัย:
- **Borrow** - ยืมข้อมูลไม่เป็นเจ้าของ
- **Checked by compiler** - borrow checker ตรวจ
- **No null** - ไม่มี null reference

| Type | คำอธิบาย |
|------|---------|
| `&T` | Shared reference (immutable) |
| `&mut T` | Mutable reference |

---

## 1. Shared Reference (&T)

<RustPlayground>

```rust
fn main() {
 let x = 42;
 
 // สร้าง reference
 let r: &i32 = &x;
 
 // อ่านค่าผ่าน reference
 println!("x = {}", x);
 println!("r = {}", r); // auto-deref
 println!("*r = {}", *r); // explicit deref
 
 // หลาย references ได้
 let r1 = &x;
 let r2 = &x;
 let r3 = &x;
 println!("r1={}, r2={}, r3={}", r1, r2, r3);
}
```

</RustPlayground>

---

## 2. Mutable Reference (&mut T)

<RustPlayground>

```rust
fn main() {
 let mut x = 42;
 
 // Mutable reference
 let r: &mut i32 = &mut x;
 
 // แก้ไขค่าผ่าน reference
 *r = 100;
 println!("x = {}", x); // 100
 
 // แก้ไขอีกครั้ง
 *r += 50;
 println!("x = {}", x); // 150
}
```

</RustPlayground>

---

## 3. Borrow Rules

<RustPlayground>

```rust
fn main() {
 let mut x = 42;
 
 // Rule 1: หลาย &T ได้
 let r1 = &x;
 let r2 = &x;
 println!("r1={}, r2={}", r1, r2);
 
 // Rule 2: &mut T ต้องเดียว
 let r3 = &mut x;
 *r3 = 100;
 // let r4 = &mut x; // Error! มี r3 อยู่แล้ว
 println!("r3 = {}", r3);
 
 // Rule 3: &T และ &mut T อยู่พร้อมกันไม่ได้
 let r5 = &x;
 // let r6 = &mut x; // Error! มี r5 อยู่
 println!("r5 = {}", r5);
}
```

</RustPlayground>

:::tip Borrow Rules
1. **หลาย `&T`** ได้พร้อมกัน
2. **เดียว `&mut T`** เท่านั้น
3. **`&T` และ `&mut T`** พร้อมกันไม่ได้
:::

---

## 4. Passing to Functions

<RustPlayground>

```rust
// รับ shared reference (อ่านอย่างเดียว)
fn print_value(r: &i32) {
 println!("value = {}", r);
}

// รับ mutable reference (แก้ไขได้)
fn double_value(r: &mut i32) {
 *r *= 2;
}

fn main() {
 let mut x = 42;
 
 print_value(&x);
 println!("before: {}", x);
 
 double_value(&mut x);
 println!("after: {}", x);
}
```

</RustPlayground>

---

## 5. Reference to Reference

<RustPlayground>

```rust
fn main() {
 let x = 42;
 let r1: &i32 = &x;
 let r2: &&i32 = &r1;
 let r3: &&&i32 = &r2;
 
 // Auto-deref ทำให้เข้าถึงค่าได้
 println!("x = {}", x);
 println!("*r1 = {}", *r1);
 println!("**r2 = {}", **r2);
 println!("***r3 = {}", ***r3);
 
 // แต่ปกติ auto-deref ทำให้
 println!("r3 = {}", r3); // ก็ได้ผลเหมือนกัน
}
```

</RustPlayground>

---

## 6. Reborrowing

<RustPlayground>

```rust
fn takes_ref(r: &i32) {
 println!("got: {}", r);
}

fn takes_mut_ref(r: &mut i32) {
 *r += 1;
}

fn main() {
 let mut x = 42;
 let r = &mut x;
 
 // Reborrow &mut -> &
 takes_ref(&*r); // หรือ
 takes_ref(r); // auto-reborrow
 
 // Reborrow &mut -> &mut (ชั่วคราว)
 takes_mut_ref(&mut *r); // หรือ
 takes_mut_ref(r); // auto-reborrow
 
 println!("final: {}", x);
}
```

</RustPlayground>

---

## 7. Dangling References (Prevented!)

<RustPlayground>

```rust
// Rust ป้องกัน dangling reference!

// fn dangling() -> &i32 {
// let x = 42;
// &x // Error! x จะถูก drop
// }

// วิธีที่ถูกต้อง: return value
fn no_dangle() -> i32 {
 let x = 42;
 x // ย้าย ownership ออกไป
}

fn main() {
 let value = no_dangle();
 println!("value = {}", value);
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย |
|------|---------|
| `&T` | Shared reference |
| `&mut T` | Mutable reference |
| `&'a T` | Reference with lifetime |

### Operators
| Operator | คำอธิบาย |
|----------|---------|
| `&x` | สร้าง reference |
| `&mut x` | สร้าง mutable ref |
| `*r` | Dereference |

### Borrow Rules
| Rule | คำอธิบาย |
|------|---------|
| Many `&T` | หลายอันพร้อมกันได้ |
| One `&mut T` | ได้แค่อันเดียว |
| No mixing | `&T` กับ `&mut T` พร้อมกันไม่ได้ |

---

[← tuple](./tuple) | [pointer →](./pointer)
