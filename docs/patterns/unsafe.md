# Unsafe Patterns

Pattern สำหรับใช้ Unsafe Rust อย่างถูกต้อง! 

---

## เมื่อไหร่ต้องใช้ Unsafe?

1. Dereference raw pointers
2. Call unsafe functions
3. Access/modify mutable static variables
4. Implement unsafe traits
5. Access union fields

---

## Raw Pointers

<RustPlayground>

```rust
fn main() {
 let mut x = 10;
 
 // สร้าง raw pointers (safe!)
 let r1 = &x as *const i32; // immutable
 let r2 = &mut x as *mut i32; // mutable
 
 // Dereference (unsafe!)
 unsafe {
 println!("r1: {}", *r1);
 *r2 = 20;
 println!("r2: {}", *r2);
 }
}
```

</RustPlayground>

---

## Unsafe Functions

<RustPlayground>

```rust
// Unsafe function
unsafe fn dangerous() {
 println!("This is dangerous!");
}

// Safe wrapper
fn safe_wrapper() {
 // ตรวจสอบ preconditions ก่อน
 // ...
 
 unsafe {
 dangerous();
 }
}

fn main() {
 // ต้องเรียกใน unsafe block
 unsafe {
 dangerous();
 }
 
 // หรือใช้ safe wrapper
 safe_wrapper();
}
```

</RustPlayground>

---

## Safe Abstraction Pattern

<RustPlayground>

```rust
use std::slice;

// Unsafe inside, safe outside
fn split_at_mut(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
 let len = slice.len();
 let ptr = slice.as_mut_ptr();
 
 assert!(mid <= len); // Safety check!
 
 unsafe {
 (
 slice::from_raw_parts_mut(ptr, mid),
 slice::from_raw_parts_mut(ptr.add(mid), len - mid),
 )
 }
}

fn main() {
 let mut arr = [1, 2, 3, 4, 5];
 let (left, right) = split_at_mut(&mut arr, 2);
 
 println!("Left: {:?}", left);
 println!("Right: {:?}", right);
}
```

</RustPlayground>

---

## Mutable Static

<RustPlayground>

```rust
static mut COUNTER: u32 = 0;

fn add_to_counter(inc: u32) {
 unsafe {
 COUNTER += inc;
 }
}

fn main() {
 add_to_counter(1);
 add_to_counter(2);
 add_to_counter(3);
 
 unsafe {
 println!("Counter: {}", COUNTER);
 }
}
```

</RustPlayground>

---

## Unsafe Traits

<RustPlayground>

```rust
// Unsafe trait - ต้อง implement อย่างถูกต้อง
unsafe trait Zeroable {
 fn zero() -> Self;
}

unsafe impl Zeroable for i32 {
 fn zero() -> Self { 0 }
}

unsafe impl Zeroable for u8 {
 fn zero() -> Self { 0 }
}

fn make_zero<T: Zeroable>() -> T {
 T::zero()
}

fn main() {
 let x: i32 = make_zero();
 let y: u8 = make_zero();
 
 println!("x = {}, y = {}", x, y);
}
```

</RustPlayground>

---

## Safety Checklist

| Check | คำอธิบาย |
|-------|---------|
| Pointers valid | ชี้ไปที่ valid memory |
| Aligned | Memory aligned ถูกต้อง |
| No aliasing | ไม่มี mutable aliasing |
| Initialized | Memory initialized แล้ว |
| Bounds checked | ไม่เกิน bounds |
| Lifetime valid | ไม่ใช้หลัง free |

---

## Golden Rules

1. **Minimize unsafe** - ใช้ให้น้อยที่สุด
2. **Encapsulate** - Wrap ใน safe abstraction
3. **Document** - เขียน safety comments
4. **Test thoroughly** - ใช้ Miri, AddressSanitizer

---

[← Testing](/patterns/testing) | [FFI →](/patterns/ffi)
