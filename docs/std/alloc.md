# Alloc - จัดการหน่วยความจำ

**std::alloc** สำหรับ memory allocation ระดับต่ำ! 

---

## alloc คืออะไร?

`std::alloc` ให้ control หน่วยความจำโดยตรง:
- จอง memory เอง
- Custom allocators
- Low-level optimizations

:::warning Advanced Topic!
ปกติใช้ `Box`, `Vec`, `String` ซึ่งจัดการ memory ให้อัตโนมัติ!
std::alloc ใช้เฉพาะกรณีพิเศษเท่านั้น
:::

---

## 1. Layout - กำหนดขนาดและ Alignment

<RustPlayground>

```rust
use std::alloc::Layout;

fn main() {
 // Layout สำหรับ type
 let i32_layout = Layout::new::<i32>();
 println!("i32: size={} bytes, align={}", 
 i32_layout.size(), 
 i32_layout.align());
 
 // Layout สำหรับ array
 let arr_layout = Layout::array::<i32>(10).unwrap();
 println!("[i32; 10]: size={} bytes, align={}", 
 arr_layout.size(), 
 arr_layout.align());
 
 // Layout กำหนดเอง
 let custom = Layout::from_size_align(100, 8).unwrap();
 println!("Custom: size={}, align={}", 
 custom.size(), 
 custom.align());
 
 // Layout รวมหลาย types (สำหรับ struct)
 let (combined, offset) = i32_layout
 .extend(Layout::new::<i64>())
 .unwrap();
 println!("i32 + i64: size={}, offset ของ i64={}", 
 combined.size(), offset);
 
 // ปัดขนาดให้ตรง alignment
 let padded = i32_layout.pad_to_align();
 println!("i32 padded: size={}", padded.size());
}
```

</RustPlayground>

---

## 2. alloc และ dealloc

<RustPlayground>

```rust
use std::alloc::{alloc, dealloc, Layout};

fn main() {
 let layout = Layout::new::<i32>();
 
 unsafe {
 // จอง memory
 let ptr = alloc(layout) as *mut i32;
 
 if ptr.is_null() {
 panic!("จอง memory ไม่สำเร็จ!");
 }
 
 // เขียนค่า
 *ptr = 42;
 println!("ค่าที่จอง: {}", *ptr);
 
 // ต้อง free เมื่อใช้เสร็จ!
 dealloc(ptr as *mut u8, layout);
 println!("คืน memory เรียบร้อย");
 }
}
```

</RustPlayground>

---

## 3. alloc_zeroed และ realloc

<RustPlayground>

```rust
use std::alloc::{alloc_zeroed, realloc, dealloc, Layout};

fn main() {
 unsafe {
 // จอง memory ที่เป็น 0 ทั้งหมด
 let layout = Layout::array::<i32>(5).unwrap();
 let ptr = alloc_zeroed(layout) as *mut i32;
 
 // ค่าเป็น 0 ทั้งหมด
 let slice = std::slice::from_raw_parts(ptr, 5);
 println!("zeroed: {:?}", slice); // [0, 0, 0, 0, 0]
 
 // ขยายขนาด (realloc)
 let new_layout = Layout::array::<i32>(10).unwrap();
 let new_ptr = realloc(ptr as *mut u8, layout, new_layout.size()) as *mut i32;
 
 if !new_ptr.is_null() {
 // 5 ตัวแรกคงเดิม ที่เหลือไม่ initialized
 let slice = std::slice::from_raw_parts(new_ptr, 5);
 println!("realloc (5 ตัวแรก): {:?}", slice);
 
 dealloc(new_ptr as *mut u8, new_layout);
 }
 }
}
```

</RustPlayground>

---

## 4. System Allocator

<RustPlayground>

```rust
use std::alloc::{GlobalAlloc, Layout, System};

fn main() {
 // System คือ default allocator
 let layout = Layout::new::<[i32; 10]>();
 
 println!("Layout for [i32; 10]:");
 println!(" size: {} bytes", layout.size());
 println!(" align: {} bytes", layout.align());
 
 unsafe {
 // จองผ่าน System allocator
 let ptr = System.alloc(layout);
 
 if !ptr.is_null() {
 println!("จองสำเร็จที่: {:p}", ptr);
 
 // คืน memory
 System.dealloc(ptr, layout);
 println!("คืน memory แล้ว");
 }
 }
}
```

</RustPlayground>

---

## 5. Custom Global Allocator

```rust
use std::alloc::{GlobalAlloc, Layout, System};

// สร้าง allocator ที่ track การใช้งาน
struct TrackingAllocator;

unsafe impl GlobalAlloc for TrackingAllocator {
 unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
 println!(" alloc {} bytes (align {})", layout.size(), layout.align());
 System.alloc(layout)
 }
 
 unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
 println!(" dealloc {} bytes", layout.size());
 System.dealloc(ptr, layout)
 }
 
 unsafe fn alloc_zeroed(&self, layout: Layout) -> *mut u8 {
 println!(" alloc_zeroed {} bytes", layout.size());
 System.alloc_zeroed(layout)
 }
 
 unsafe fn realloc(&self, ptr: *mut u8, layout: Layout, new_size: usize) -> *mut u8 {
 println!("realloc {} -> {} bytes", layout.size(), new_size);
 System.realloc(ptr, layout, new_size)
 }
}

// ตั้งเป็น global allocator
#[global_allocator]
static ALLOCATOR: TrackingAllocator = TrackingAllocator;

fn main() {
 let v = vec![1, 2, 3, 4, 5]; // จะเห็น alloc
 drop(v); // จะเห็น dealloc
}
```

---

## 6. handle_alloc_error

<RustPlayground>

```rust
use std::alloc::{alloc, Layout, handle_alloc_error};

fn safe_alloc<T>() -> *mut T {
 let layout = Layout::new::<T>();
 unsafe {
 let ptr = alloc(layout);
 if ptr.is_null() {
 // จะ abort หรือ panic ขึ้นกับ config
 handle_alloc_error(layout);
 }
 ptr as *mut T
 }
}

fn main() {
 let ptr = safe_alloc::<i32>();
 println!("จองสำเร็จที่: {:p}", ptr);
 
 // อย่าลืม dealloc!
 unsafe {
 std::alloc::dealloc(ptr as *mut u8, Layout::new::<i32>());
 }
}
```

</RustPlayground>

---

## 7. Allocator API (Nightly)

```rust
// ใน nightly Rust มี Allocator trait ใหม่
// ที่ให้ระบุ allocator per-container ได้

#![feature(allocator_api)]

use std::alloc::{Allocator, Global};

fn main() {
 // Vec ที่ใช้ Global allocator (default)
 let v: Vec<i32, Global> = Vec::new_in(Global);
 
 // ใช้ custom allocator per-container
 // let v2: Vec<i32, MyAllocator> = Vec::new_in(MyAllocator);
}
```

:::info Nightly Only
Allocator API ยังอยู่ใน nightly channel
:::

---

## Quick Reference

### Functions
| Function | คำอธิบาย |
|----------|---------|
| `alloc(layout)` | จอง memory |
| `dealloc(ptr, layout)` | คืน memory |
| `alloc_zeroed(layout)` | จอง memory = 0 |
| `realloc(ptr, layout, size)` | เปลี่ยนขนาด |
| `handle_alloc_error(layout)` | จัดการ OOM |

### Layout Methods
| Method | คำอธิบาย |
|--------|---------|
| `new::<T>()` | Layout สำหรับ type |
| `array::<T>(n)` | Layout สำหรับ array |
| `from_size_align(s, a)` | Layout custom |
| `size()` | ขนาด bytes |
| `align()` | alignment |
| `extend(layout)` | รวม layouts |
| `pad_to_align()` | pad ให้ตรง align |

### Traits
| Trait | คำอธิบาย |
|-------|---------|
| `GlobalAlloc` | interface สำหรับ global allocator |
| `Allocator` | per-container allocator (nightly) |

### เมื่อไหร่ใช้ alloc
| สถานการณ์ | แนะนำ |
|-----------|------|
| ปกติ | ใช้ `Box`, `Vec`, `String` |
| Custom containers | Allocator trait |
| no_std / embedded | อาจต้องใช้ manual |
| Performance tuning | jemalloc, mimalloc |
| FFI | อาจต้อง manual lifetime |

---

[← FFI](./ffi) | [กลับ Index →](./index)
