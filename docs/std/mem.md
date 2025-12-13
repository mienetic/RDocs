# Memory - จัดการหน่วยความจำ

**std::mem** มีฟังก์ชันสำหรับจัดการหน่วยความจำระดับต่ำ! 

---

## mem มีอะไร?

- **size_of** - ขนาดของ type
- **swap** - สลับค่า
- **replace** - แทนที่ค่า
- **take** - ดึงค่าออก ใส่ default
- **drop** - ทำลายค่าก่อนเวลา
- **forget** - ไม่ drop (ระวัง leak!)

---

## 1. size_of และ align_of

<RustPlayground>

```rust
use std::mem;

fn main() {
 // size_of - ขนาดเป็น bytes
 println!("=== size_of ===");
 println!("u8: {} bytes", mem::size_of::<u8>());
 println!("u32: {} bytes", mem::size_of::<u32>());
 println!("u64: {} bytes", mem::size_of::<u64>());
 println!("bool: {} bytes", mem::size_of::<bool>());
 println!("char: {} bytes", mem::size_of::<char>());
 
 // size_of_val - ขนาดของค่า
 let arr = [1, 2, 3, 4, 5];
 println!("arr: {} bytes", mem::size_of_val(&arr));
 
 // align_of - alignment requirement
 println!("\n=== align_of ===");
 println!("u8 align: {}", mem::align_of::<u8>());
 println!("u32 align: {}", mem::align_of::<u32>());
 println!("u64 align: {}", mem::align_of::<u64>());
 
 // struct size และ padding
 #[repr(C)]
 struct Example {
 a: u8, // 1 byte
 b: u32, // 4 bytes
 c: u8, // 1 byte
 }
 println!("\nExample struct: {} bytes (มี padding)", mem::size_of::<Example>());
}
```

</RustPlayground>

---

## 2. swap และ replace

<RustPlayground>

```rust
use std::mem;

fn main() {
 // swap - สลับค่าระหว่าง 2 ตัวแปร
 let mut a = 1;
 let mut b = 2;
 
 println!("Before swap: a={}, b={}", a, b);
 mem::swap(&mut a, &mut b);
 println!("After swap: a={}, b={}", a, b);
 
 // swap กับ complex types
 let mut s1 = String::from("hello");
 let mut s2 = String::from("world");
 
 mem::swap(&mut s1, &mut s2);
 println!("s1: {}, s2: {}", s1, s2);
 
 // replace - แทนที่ค่า ได้ค่าเก่ากลับมา
 let mut x = 5;
 let old = mem::replace(&mut x, 10);
 println!("\nreplace: old={}, new={}", old, x);
 
 // ใช้งานจริง: ดึง ownership ออกจาก struct
 struct Container {
 data: String,
 }
 
 let mut container = Container { data: "important".to_string() };
 let extracted = mem::replace(&mut container.data, String::new());
 println!("extracted: {}", extracted);
}
```

</RustPlayground>

---

## 3. take

<RustPlayground>

```rust
use std::mem;

fn main() {
 // take - ดึงค่าออก ใส่ default กลับ
 let mut s = String::from("hello");
 let taken = mem::take(&mut s);
 
 println!("taken: '{}'", taken);
 println!("s after take: '{}'", s); // empty string
 
 // take กับ Option
 let mut opt = Some(42);
 let value = opt.take(); // Option มี take method ในตัว
 println!("taken from Option: {:?}, opt: {:?}", value, opt);
 
 // take กับ Vec
 let mut vec = vec![1, 2, 3];
 let old_vec = mem::take(&mut vec);
 
 println!("old_vec: {:?}", old_vec);
 println!("vec after take: {:?}", vec);
}
```

</RustPlayground>

---

## 4. drop

<RustPlayground>

```rust
use std::mem;

struct Resource {
 name: String,
}

impl Drop for Resource {
 fn drop(&mut self) {
 println!("Dropping: {}", self.name);
 }
}

fn main() {
 let r1 = Resource { name: "first".to_string() };
 let r2 = Resource { name: "second".to_string() };
 
 println!("Created resources");
 
 // drop ก่อนเวลา
 mem::drop(r1); // หรือใช้ drop(r1) โดยตรง
 
 println!("After explicit drop");
 
 // r2 จะ drop ตอนจบ scope
 println!("End of main");
}
```

</RustPlayground>

---

## 5. forget (ระวัง!)

<RustPlayground>

```rust
use std::mem;

fn main() {
 // forget - ไม่ drop (อาจ leak memory!)
 let s = String::from("leaked!");
 
 println!("Before forget: '{}'", s);
 
 // mem::forget(s); // s จะไม่ถูก drop - memory leak!
 // ไม่ควรใช้ยกเว้นจำเป็นจริงๆ
 
 // กรณีที่ใช้: FFI ส่ง ownership ให้ C code
 // C code จะจัดการ free เอง
 
 // ManuallyDrop - ทางเลือกที่ปลอดภัยกว่า
 use std::mem::ManuallyDrop;
 
 let mut manual = ManuallyDrop::new(String::from("manual"));
 println!("ManuallyDrop: {}", *manual);
 
 // drop เมื่อต้องการ
 unsafe { ManuallyDrop::drop(&mut manual); }
 println!("Manually dropped");
}
```

</RustPlayground>

---

## 6. zeroed และ MaybeUninit

<RustPlayground>

```rust
use std::mem::{self, MaybeUninit};

fn main() {
 // zeroed - สร้างค่าที่เป็น 0 ทั้งหมด (unsafe!)
 // ระวัง: ใช้ได้กับ types ที่ all-zeros valid เท่านั้น
 let zero_array: [u8; 4] = unsafe { mem::zeroed() };
 println!("zeroed array: {:?}", zero_array);
 
 // MaybeUninit - ปลอดภัยกว่า zeroed
 let mut array: [MaybeUninit<u32>; 5] = unsafe {
 MaybeUninit::uninit().assume_init()
 };
 
 // Initialize each element
 for (i, elem) in array.iter_mut().enumerate() {
 elem.write(i as u32 * 10);
 }
 
 // Safe to read now
 let array: [u32; 5] = unsafe {
 mem::transmute(array)
 };
 println!("initialized array: {:?}", array);
}
```

</RustPlayground>

---

## 7. transmute (อันตราย!)

<RustPlayground>

```rust
use std::mem;

fn main() {
 // transmute - reinterpret bits (unsafe และอันตรายมาก!)
 
 // ตัวอย่างที่ปลอดภัย: u32 <-> f32 (same size)
 let n: u32 = 0x40490FDB; // IEEE 754 representation of PI
 let f: f32 = unsafe { mem::transmute(n) };
 println!("transmute u32 to f32: {} (≈ π)", f);
 
 // กลับทาง
 let pi: f32 = 3.14159;
 let bits: u32 = unsafe { mem::transmute(pi) };
 println!("PI as bits: 0x{:X}", bits);
 
 // ทางเลือกที่ปลอดภัยกว่า:
 let pi2 = f32::from_bits(bits);
 println!("from_bits: {}", pi2);
 
 let bits2 = pi.to_bits();
 println!("to_bits: 0x{:X}", bits2);
}
```

</RustPlayground>

---

## Quick Reference

### Size และ Alignment
| Function | คำอธิบาย |
|----------|---------|
| `size_of::<T>()` | ขนาดของ T |
| `size_of_val(&x)` | ขนาดของ x |
| `align_of::<T>()` | alignment ของ T |

### ย้าย/สลับค่า
| Function | คำอธิบาย |
|----------|---------|
| `swap(&mut a, &mut b)` | สลับค่า |
| `replace(&mut x, v)` | แทนที่ ได้ค่าเก่า |
| `take(&mut x)` | ดึงค่า ใส่ default |

### Lifetime
| Function | คำอธิบาย |
|----------|---------|
| `drop(x)` | drop ก่อนเวลา |
| `forget(x)` | ไม่ drop (leak!) |
| `ManuallyDrop::new(x)` | ควบคุม drop เอง |

### Unsafe
| Function | คำอธิบาย |
|----------|---------|
| `zeroed()` | bytes = 0 ทั้งหมด |
| `transmute(x)` | reinterpret bits |
| `MaybeUninit` | uninitialized memory |

### เมื่อไหร่ใช้
| สถานการณ์ | ใช้ |
|-----------|-----|
| สลับค่า | `swap` |
| ดึงออกจาก struct | `replace`, `take` |
| ปิด resource เร็ว | `drop` |
| FFI | `forget`, `ManuallyDrop` |
| Low-level | `transmute` (ระวัง!) |

---

[← Borrow](./borrow) | [Pointers →](./ptr)
