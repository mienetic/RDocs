# pointer - Raw Pointers

`*const T` และ `*mut T` คือ raw pointers! 

---

## Raw Pointers คืออะไร?

Raw pointers คือ pointers แบบ C:
- **ไม่มี borrow checking**
- **อาจเป็น null**
- **ต้องใช้ใน `unsafe`**

| Type | คำอธิบาย |
|------|---------|
| `*const T` | Immutable raw pointer |
| `*mut T` | Mutable raw pointer |

:::warning unsafe!
Raw pointers ต้องใช้ใน `unsafe` block!
:::

---

## 1. Creating Raw Pointers

<RustPlayground>

```rust
fn main() {
 let x = 42;
 let mut y = 100;
 
 // สร้างจาก reference (safe)
 let p1: *const i32 = &x;
 let p2: *mut i32 = &mut y;
 
 println!("p1 = {:?}", p1);
 println!("p2 = {:?}", p2);
 
 // สร้างจาก address (อันตราย!)
 let addr = 0x12345usize;
 let p3 = addr as *const i32;
 println!("p3 = {:?}", p3);
 // อย่า deref p3 - address ไม่ valid!
}
```

</RustPlayground>

---

## 2. Dereferencing (unsafe!)

<RustPlayground>

```rust
fn main() {
 let x = 42;
 let mut y = 100;
 
 let p1: *const i32 = &x;
 let p2: *mut i32 = &mut y;
 
 // Dereference ต้อง unsafe
 unsafe {
 println!("*p1 = {}", *p1);
 
 // Mutable pointer สามารถเขียนได้
 *p2 = 200;
 println!("*p2 = {}", *p2);
 }
 
 println!("y = {}", y); // 200
}
```

</RustPlayground>

---

## 3. Null Pointers

<RustPlayground>

```rust
fn main() {
 // Null pointer
 let null_ptr: *const i32 = std::ptr::null();
 let null_mut: *mut i32 = std::ptr::null_mut();
 
 println!("null_ptr = {:?}", null_ptr);
 println!("null_mut = {:?}", null_mut);
 
 // Check for null
 if null_ptr.is_null() {
 println!("pointer is null!");
 }
 
 // อย่า deref null!
 // unsafe { println!("{}", *null_ptr); } // UB!
}
```

</RustPlayground>

---

## 4. Pointer Arithmetic

<RustPlayground>

```rust
fn main() {
 let arr = [10, 20, 30, 40, 50];
 let ptr = arr.as_ptr();
 
 println!("arr = {:?}", arr);
 
 unsafe {
 // offset
 println!("ptr[0] = {}", *ptr);
 println!("ptr[1] = {}", *ptr.add(1));
 println!("ptr[2] = {}", *ptr.add(2));
 
 // negative offset
 let p = ptr.add(4); // ชี้ที่ตัวสุดท้าย
 println!("ptr[4] = {}", *p);
 println!("ptr[3] = {}", *p.sub(1));
 }
}
```

</RustPlayground>

---

## 5. Casting Pointers

<RustPlayground>

```rust
fn main() {
 let x: i32 = 0x12345678;
 let ptr = &x as *const i32;
 
 // Cast to different type
 let byte_ptr = ptr as *const u8;
 
 unsafe {
 // Read individual bytes
 println!("as i32: 0x{:08X}", *ptr);
 println!("bytes:");
 for i in 0..4 {
 println!(" byte {}: 0x{:02X}", i, *byte_ptr.add(i));
 }
 }
 
 // Cast to usize (address)
 let addr = ptr as usize;
 println!("address: 0x{:X}", addr);
}
```

</RustPlayground>

---

## 6. pointer Methods

<RustPlayground>

```rust
fn main() {
 let arr = [1, 2, 3, 4, 5];
 let ptr = arr.as_ptr();
 
 // is_null()
 println!("is_null: {}", ptr.is_null());
 
 // offset_from (must be same allocation)
 let ptr2 = unsafe { ptr.add(3) };
 let diff = unsafe { ptr2.offset_from(ptr) };
 println!("offset_from: {}", diff); // 3
 
 // align
 println!("is_aligned: {}", ptr.is_aligned());
}
```

</RustPlayground>

---

## 7. เมื่อไหร่ใช้ Raw Pointers

<RustPlayground>

```rust
// 1. FFI - เรียก C functions
extern "C" {
 fn strlen(s: *const std::ffi::c_char) -> usize;
}

// 2. Performance-critical code
fn sum_array(ptr: *const i32, len: usize) -> i32 {
 let mut sum = 0;
 unsafe {
 for i in 0..len {
 sum += *ptr.add(i);
 }
 }
 sum
}

fn main() {
 let arr = [1, 2, 3, 4, 5];
 let total = sum_array(arr.as_ptr(), arr.len());
 println!("sum = {}", total);
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย |
|------|---------|
| `*const T` | Immutable pointer |
| `*mut T` | Mutable pointer |

### Creation
| Method | คำอธิบาย |
|--------|---------|
| `&x as *const T` | จาก reference |
| `&mut x as *mut T` | จาก mut ref |
| `ptr::null()` | Null pointer |
| `arr.as_ptr()` | จาก slice |

### Operations (unsafe)
| Method | คำอธิบาย |
|--------|---------|
| `*ptr` | Dereference |
| `ptr.add(n)` | Offset |
| `ptr.sub(n)` | Negative offset |
| `ptr.offset_from(other)` | Distance |

### Safety
| Method | Safe? |
|--------|-------|
| `is_null()` | |
| `*ptr` | unsafe |
| `ptr.add(n)` | unsafe |
| `ptr.read()` | unsafe |
| `ptr.write(v)` | unsafe |

---

[← reference](./reference) | [fn & never →](./fn-never)
