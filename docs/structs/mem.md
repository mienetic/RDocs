# Mem Structs - Memory Management

`ManuallyDrop`, `MaybeUninit` สำหรับ low-level memory control! 

---

## ManuallyDrop คืออะไร?

`ManuallyDrop<T>` ห่อ value เพื่อป้องกันไม่ให้ Rust เรียก drop อัตโนมัติ

<RustPlayground>

```rust
use std::mem::ManuallyDrop;

fn main() {
 let s = String::from("Hello");
 
 // ห่อด้วย ManuallyDrop
 let mut manual = ManuallyDrop::new(s);
 
 // ยังใช้งานได้ปกติ
 println!("value: {}", *manual);
 
 // Drop ด้วยตัวเอง (unsafe)
 unsafe {
 ManuallyDrop::drop(&mut manual);
 }
 
 // หลัง drop แล้วห้ามใช้อีก!
}
```

</RustPlayground>

---

## ManuallyDrop Use Cases

<RustPlayground>

```rust
use std::mem::ManuallyDrop;

fn main() {
 // Use case: ย้าย ownership ออกจาก ManuallyDrop
 let s = ManuallyDrop::new(String::from("transfer me"));
 
 // take ownership
 let taken = ManuallyDrop::into_inner(s);
 println!("taken: {}", taken);
 
 // Use case: สร้าง union ที่มี Drop types
 union MyUnion {
 s: ManuallyDrop<String>,
 i: i32,
 }
 
 let u = MyUnion {
 s: ManuallyDrop::new("hello".to_string())
 };
 
 // ต้อง drop ด้วยตัวเอง!
 unsafe {
 println!("union string: {}", &*u.s);
 }
}
```

</RustPlayground>

---

## MaybeUninit - Uninitialized Memory

<RustPlayground>

```rust
use std::mem::MaybeUninit;

fn main() {
 // สร้าง uninitialized memory
 let mut x: MaybeUninit<i32> = MaybeUninit::uninit();
 
 // เขียนค่า
 x.write(42);
 
 // อ่านค่า (unsafe - ต้อง initialized แล้ว)
 let value = unsafe { x.assume_init() };
 println!("value: {}", value);
 
 // สร้างแบบ zeroed
 let zero: i32 = unsafe { MaybeUninit::zeroed().assume_init() };
 println!("zero: {}", zero);
}
```

</RustPlayground>

---

## MaybeUninit Array

<RustPlayground>

```rust
use std::mem::MaybeUninit;

fn main() {
 // สร้าง array ที่ไม่ initialized
 let mut arr: [MaybeUninit<i32>; 5] = unsafe {
 MaybeUninit::uninit().assume_init()
 };
 
 // เติมค่า
 for (i, elem) in arr.iter_mut().enumerate() {
 elem.write(i as i32 * 10);
 }
 
 // แปลงเป็น initialized array
 let arr: [i32; 5] = unsafe {
 std::mem::transmute(arr)
 };
 
 println!("arr: {:?}", arr);
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย |
|------|---------|
| `ManuallyDrop&lt;T&gt;` | ป้องกัน auto-drop |
| `MaybeUninit&lt;T&gt;` | Uninitialized memory |

### ManuallyDrop Methods
| Method | คำอธิบาย |
|--------|---------|
| `new(v)` | ห่อ value |
| `into_inner(s)` | ย้าย ownership ออก |
| `drop(&mut s)` | Drop ด้วยตัวเอง (unsafe) |
| `take(&mut s)` | Take value (unsafe) |

### MaybeUninit Methods
| Method | คำอธิบาย |
|--------|---------|
| `uninit()` | สร้าง uninitialized |
| `zeroed()` | สร้างเป็น zero |
| `new(v)` | สร้างแบบ initialized |
| `write(v)` | เขียนค่า |
| `assume_init()` | อ่านค่า (unsafe) |
| `assume_init_ref()` | ได้ &T (unsafe) |

---

[← Marker](./marker) | [Num →](./num)
