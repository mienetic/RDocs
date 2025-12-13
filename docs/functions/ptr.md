# Pointer Functions (std::ptr)

Functions สำหรับ Raw Pointers! 

---

## null / null_mut

สร้าง Null Pointer

<RustPlayground>

```rust
use std::ptr;

fn main() {
 // Null pointer (immutable)
 let null_ptr: *const i32 = ptr::null();
 println!("null: {:?}", null_ptr);
 println!("Is null? {}", null_ptr.is_null());
 
 // Null pointer (mutable)
 let null_mut_ptr: *mut i32 = ptr::null_mut();
 println!("null_mut: {:?}", null_mut_ptr);
 println!("Is null? {}", null_mut_ptr.is_null());
}
```

</RustPlayground>

---

## addr_of / addr_of_mut

ดึง Address โดยไม่สร้าง Reference

<RustPlayground>

```rust
use std::ptr;

fn main() {
 let x = 42;
 let mut y = 100;
 
 // ดึง address
 let ptr_x = ptr::addr_of!(x);
 let ptr_y = ptr::addr_of_mut!(y);
 
 println!("Address of x: {:?}", ptr_x);
 println!("Address of y: {:?}", ptr_y);
 
 // อ่านค่าผ่าน pointer (unsafe)
 unsafe {
 println!("Value at ptr_x: {}", *ptr_x);
 *ptr_y = 200;
 println!("New y: {}", y);
 }
}
```

</RustPlayground>

---

## read / write

อ่าน/เขียนค่าผ่าน Pointer

<RustPlayground>

```rust
use std::ptr;

fn main() {
 let mut x = 42;
 let ptr = &mut x as *mut i32;
 
 unsafe {
 // อ่านค่า
 let value = ptr::read(ptr);
 println!("Read: {}", value);
 
 // เขียนค่า
 ptr::write(ptr, 100);
 println!("After write: {}", x);
 }
}
```

</RustPlayground>

---

## copy / copy_nonoverlapping

คัดลอก Memory

<RustPlayground>

```rust
use std::ptr;

fn main() {
 let src = [1, 2, 3, 4, 5];
 let mut dst = [0; 5];
 
 unsafe {
 // copy_nonoverlapping เร็วกว่า copy
 // แต่ต้องมั่นใจว่า src และ dst ไม่ overlap
 ptr::copy_nonoverlapping(
 src.as_ptr(),
 dst.as_mut_ptr(),
 5
 );
 }
 
 println!("src: {:?}", src);
 println!("dst: {:?}", dst);
}
```

</RustPlayground>

---

## Quick Reference

| Function | คำอธิบาย | Safety |
|----------|---------|--------|
| `null::<T>()` | Null pointer | Safe |
| `null_mut::<T>()` | Null mut pointer | Safe |
| `addr_of!(x)` | ดึง address | Safe |
| `addr_of_mut!(x)` | ดึง mut address | Safe |
| `read(ptr)` | อ่านค่า | Unsafe |
| `write(ptr, val)` | เขียนค่า | Unsafe |
| `copy(src, dst, n)` | คัดลอก (overlap OK) | Unsafe |
| `copy_nonoverlapping` | คัดลอก (no overlap) | Unsafe |

---

[← Process](./process) | [Index →](./index)
