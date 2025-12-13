# Alloc Types (std::alloc)

Types สำหรับ Memory Allocation! 

---

## Layout

กำหนดขนาดและ alignment ของ memory

<RustPlayground>

```rust
use std::alloc::Layout;

fn main() {
 // Layout สำหรับ types ต่างๆ
 let i32_layout = Layout::new::<i32>();
 println!("i32 - size: {}, align: {}", 
 i32_layout.size(), 
 i32_layout.align());
 
 let string_layout = Layout::new::<String>();
 println!("String - size: {}, align: {}", 
 string_layout.size(), 
 string_layout.align());
 
 // Layout สำหรับ array
 let arr_layout = Layout::array::<i32>(10).unwrap();
 println!("10 x i32 - size: {}, align: {}", 
 arr_layout.size(), 
 arr_layout.align());
 
 // Custom layout
 let custom = Layout::from_size_align(1024, 8).unwrap();
 println!("Custom - size: {}, align: {}", 
 custom.size(), 
 custom.align());
}
```

</RustPlayground>

---

## Manual Allocation (Unsafe)

<RustPlayground>

```rust
use std::alloc::{alloc, dealloc, Layout};

fn main() {
 unsafe {
 // จอง memory
 let layout = Layout::new::<i32>();
 let ptr = alloc(layout) as *mut i32;
 
 if ptr.is_null() {
 panic!("Allocation failed!");
 }
 
 // ใช้งาน
 *ptr = 42;
 println!("Value: {}", *ptr);
 
 // คืน memory
 dealloc(ptr as *mut u8, layout);
 }
}
```

</RustPlayground>

---

## Global Allocator

```rust
use std::alloc::{GlobalAlloc, Layout, System};

// กำหนด custom allocator
struct MyAllocator;

unsafe impl GlobalAlloc for MyAllocator {
 unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
 System.alloc(layout)
 }
 
 unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
 System.dealloc(ptr, layout)
 }
}

#[global_allocator]
static ALLOCATOR: MyAllocator = MyAllocator;
```

---

## Layout Methods

<RustPlayground>

```rust
use std::alloc::Layout;

fn main() {
 let layout = Layout::new::<String>();
 
 // Size and alignment
 println!("Size: {} bytes", layout.size());
 println!("Alignment: {} bytes", layout.align());
 
 // Pad to alignment
 let padded = layout.pad_to_align();
 println!("Padded size: {}", padded.size());
 
 // Extend (for composite types)
 let (extended, offset) = layout.extend(Layout::new::<i32>()).unwrap();
 println!("Extended - size: {}, offset: {}", extended.size(), offset);
 
 // Repeat (for arrays)
 let (repeated, stride) = layout.repeat(5).unwrap();
 println!("Repeated 5x - size: {}, stride: {}", repeated.size(), stride);
}
```

</RustPlayground>

---

## Quick Reference

| Method | คำอธิบาย |
|--------|---------|
| `Layout::new::<T>()` | Layout สำหรับ type |
| `Layout::array::<T>(n)` | Layout สำหรับ array |
| `Layout::from_size_align(s, a)` | Custom layout |
| `size()` | ขนาด bytes |
| `align()` | Alignment |
| `pad_to_align()` | Pad ให้ตรง alignment |
| `extend(other)` | รวม layouts |

---

## Warning

Allocation APIs ส่วนใหญ่เป็น **unsafe** และควรใช้ผ่าน safe abstractions เช่น:
- `Vec<T>` แทน manual array allocation
- `Box<T>` แทน manual heap allocation
- `Rc<T>` / `Arc<T>` สำหรับ shared ownership

---

[← Backtrace](/structs/backtrace) | [Index →](/structs/)
