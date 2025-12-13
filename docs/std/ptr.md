# Pointers - พอยน์เตอร์

**std::ptr** สำหรับจัดการ raw pointers! 

---

## ptr คืออะไร?

Raw pointers ใน Rust:
- `*const T` - pointer อ่านอย่างเดียว
- `*mut T` - pointer แก้ไขได้

:::warning Unsafe
การใช้ raw pointers ต้องอยู่ใน `unsafe` block!
:::

---

## 1. สร้าง Pointers

<RustPlayground>

```rust
fn main() {
 let x = 42;
 let mut y = 100;
 
 // สร้าง raw pointers (ไม่ต้อง unsafe)
 let ptr_x: *const i32 = &x;
 let ptr_y: *mut i32 = &mut y;
 
 println!("ptr_x: {:p}", ptr_x);
 println!("ptr_y: {:p}", ptr_y);
 
 // อ่านค่า (ต้อง unsafe!)
 unsafe {
 println!("*ptr_x = {}", *ptr_x);
 println!("*ptr_y = {}", *ptr_y);
 }
 
 // แก้ไขค่าผ่าน *mut
 unsafe {
 *ptr_y = 200;
 }
 println!("y after modification: {}", y);
 
 // null pointers
 let null_ptr: *const i32 = std::ptr::null();
 let null_mut_ptr: *mut i32 = std::ptr::null_mut();
 
 println!("null_ptr is null: {}", null_ptr.is_null());
}
```

</RustPlayground>

---

## 2. ตรวจสอบ Pointers

<RustPlayground>

```rust
use std::ptr;

fn main() {
 let x = 42;
 let ptr: *const i32 = &x;
 let null: *const i32 = ptr::null();
 
 // is_null
 println!("ptr is_null: {}", ptr.is_null());
 println!("null is_null: {}", null.is_null());
 
 // as_ref (ต้อง unsafe) - แปลงเป็น Option<&T>
 unsafe {
 match ptr.as_ref() {
 Some(r) => println!("ptr as_ref: Some({})", r),
 None => println!("ptr as_ref: None"),
 }
 
 match null.as_ref() {
 Some(r) => println!("null as_ref: Some({})", r),
 None => println!("null as_ref: None"),
 }
 }
 
 // eq ด้วย ptr::eq
 let a = &x;
 let b = &x;
 println!("a == b (ptr): {}", ptr::eq(a, b));
}
```

</RustPlayground>

---

## 3. Pointer Arithmetic

<RustPlayground>

```rust
fn main() {
 let arr = [10, 20, 30, 40, 50];
 let ptr = arr.as_ptr(); // *const i32
 
 println!("Array: {:?}", arr);
 println!("ptr: {:p}", ptr);
 
 unsafe {
 // offset - เลื่อน pointer
 println!("*ptr.offset(0) = {}", *ptr.offset(0)); // 10
 println!("*ptr.offset(2) = {}", *ptr.offset(2)); // 30
 
 // add - เหมือน offset แต่ใช้ usize
 println!("*ptr.add(3) = {}", *ptr.add(3)); // 40
 
 // sub - ถอยกลับ
 let end_ptr = ptr.add(4); // ชี้ไปที่ index 4
 println!("*end_ptr.sub(1) = {}", *end_ptr.sub(1)); // 50
 
 // wrapping_add - ไม่ panic ถ้า overflow
 let wrapped = ptr.wrapping_add(2);
 println!("*wrapped = {}", *wrapped);
 }
}
```

</RustPlayground>

---

## 4. read และ write

<RustPlayground>

```rust
use std::ptr;

fn main() {
 let mut data = [1, 2, 3, 4, 5];
 let ptr = data.as_mut_ptr();
 
 unsafe {
 // read - อ่านค่า
 let first = ptr::read(ptr);
 println!("read: {}", first);
 
 // write - เขียนค่า
 ptr::write(ptr.add(0), 100);
 println!("after write: {:?}", data);
 
 // read_volatile / write_volatile - ไม่ optimize
 let val = ptr::read_volatile(ptr.add(1));
 println!("read_volatile: {}", val);
 
 // copy - copy bytes
 let src = [10, 20, 30];
 let mut dst = [0, 0, 0];
 ptr::copy(src.as_ptr(), dst.as_mut_ptr(), 3);
 println!("copied: {:?}", dst);
 
 // copy_nonoverlapping - src และ dst ไม่ซ้อนกัน
 let mut dst2 = [0, 0];
 ptr::copy_nonoverlapping(src.as_ptr(), dst2.as_mut_ptr(), 2);
 println!("copy_nonoverlapping: {:?}", dst2);
 }
}
```

</RustPlayground>

---

## 5. swap และ replace

<RustPlayground>

```rust
use std::ptr;

fn main() {
 let mut a = 1;
 let mut b = 2;
 
 let ptr_a: *mut i32 = &mut a;
 let ptr_b: *mut i32 = &mut b;
 
 println!("Before: a={}, b={}", a, b);
 
 unsafe {
 // swap - สลับค่า
 ptr::swap(ptr_a, ptr_b);
 }
 
 println!("After swap: a={}, b={}", a, b);
 
 // swap_nonoverlapping - array elements
 let mut arr = [1, 2, 3, 4];
 let ptr1 = arr.as_mut_ptr();
 
 unsafe {
 ptr::swap_nonoverlapping(ptr1, ptr1.add(2), 2);
 }
 println!("After swap_nonoverlapping: {:?}", arr);
 
 // replace - แทนที่ ได้ค่าเก่า
 let mut x = 5;
 let ptr_x: *mut i32 = &mut x;
 
 unsafe {
 let old = ptr::replace(ptr_x, 10);
 println!("replace: old={}, new={}", old, x);
 }
}
```

</RustPlayground>

---

## 6. NonNull

<RustPlayground>

```rust
use std::ptr::NonNull;

fn main() {
 let mut x = 42;
 
 // NonNull - pointer ที่รับประกันว่าไม่ null
 let ptr: NonNull<i32> = NonNull::new(&mut x).unwrap();
 
 println!("NonNull ptr: {:p}", ptr.as_ptr());
 
 unsafe {
 // as_ref และ as_mut
 println!("value: {}", *ptr.as_ref());
 
 *ptr.as_mut() = 100;
 println!("after mutation: {}", x);
 }
 
 // NonNull::new return None ถ้า null
 let null: *mut i32 = std::ptr::null_mut();
 let result = NonNull::new(null);
 println!("NonNull::new(null): {:?}", result); // None
 
 // dangling - สร้าง non-null แต่ไม่ valid
 let dangling: NonNull<i32> = NonNull::dangling();
 println!("dangling: {:p}", dangling.as_ptr());
}
```

</RustPlayground>

---

## 7. slice_from_raw_parts

<RustPlayground>

```rust
use std::ptr;

fn main() {
 let arr = [1, 2, 3, 4, 5];
 let ptr = arr.as_ptr();
 
 // slice_from_raw_parts - สร้าง slice จาก pointer
 let slice_ptr: *const [i32] = ptr::slice_from_raw_parts(ptr, 3);
 
 unsafe {
 let slice: &[i32] = &*slice_ptr;
 println!("slice: {:?}", slice); // [1, 2, 3]
 }
 
 // mut version
 let mut arr2 = [10, 20, 30, 40, 50];
 let ptr2 = arr2.as_mut_ptr();
 
 let slice_mut_ptr: *mut [i32] = ptr::slice_from_raw_parts_mut(ptr2.add(1), 3);
 
 unsafe {
 let slice_mut: &mut [i32] = &mut *slice_mut_ptr;
 slice_mut[0] = 200;
 println!("arr2 after mutation: {:?}", arr2);
 }
}
```

</RustPlayground>

---

## Quick Reference

### สร้าง Pointers
| วิธี | คำอธิบาย |
|-----|---------|
| `&x as *const T` | reference -> *const |
| `&mut x as *mut T` | reference -> *mut |
| `ptr::null()` | null pointer |
| `ptr::null_mut()` | null mut pointer |
| `NonNull::new(ptr)` | `Option<NonNull>` |

### ตรวจสอบ
| Method | คำอธิบาย |
|--------|---------|
| `is_null()` | เป็น null ไหม |
| `as_ref()` | `Option<&T>` (unsafe) |
| `as_mut()` | `Option<&mut T>` (unsafe) |

### อ่าน/เขียน
| Function | คำอธิบาย |
|----------|---------|
| `read(ptr)` | อ่านค่า |
| `write(ptr, val)` | เขียนค่า |
| `read_volatile(ptr)` | อ่านไม่ optimize |
| `write_volatile(ptr, val)` | เขียนไม่ optimize |

### ย้าย/คัดลอก
| Function | คำอธิบาย |
|----------|---------|
| `copy(src, dst, n)` | copy n items |
| `copy_nonoverlapping` | copy (ไม่ซ้อน) |
| `swap(a, b)` | สลับค่า |
| `replace(ptr, val)` | แทนที่ |

### Arithmetic
| Method | คำอธิบาย |
|--------|---------|
| `offset(n)` | เลื่อน n items |
| `add(n)` | เลื่อนไปข้างหน้า |
| `sub(n)` | เลื่อนถอยหลัง |
| `wrapping_add(n)` | add ไม่ panic |

---

[← Memory](./mem) | [Error →](./error)
