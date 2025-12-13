# fn & never - Function Pointers & Never Type

Function pointers และ never type! 

---

## fn - Function Pointer

`fn(T) -> U` คือ pointer ไปยัง function:

<RustPlayground>

```rust
fn add(a: i32, b: i32) -> i32 {
 a + b
}

fn multiply(a: i32, b: i32) -> i32 {
 a * b
}

fn main() {
 // Function pointer type
 let op: fn(i32, i32) -> i32 = add;
 println!("op(2, 3) = {}", op(2, 3)); // 5
 
 // เปลี่ยน function ได้
 let op: fn(i32, i32) -> i32 = multiply;
 println!("op(2, 3) = {}", op(2, 3)); // 6
 
 // ขนาด = 1 pointer
 println!("size_of fn = {} bytes", std::mem::size_of::<fn()>());
}
```

</RustPlayground>

---

## fn vs Fn Traits

<RustPlayground>

```rust
fn regular_fn(x: i32) -> i32 {
 x * 2
}

fn main() {
 // fn = pointer to function (no closure)
 let f1: fn(i32) -> i32 = regular_fn;
 
 // Closures ที่ไม่ capture ก็เป็น fn ได้
 let f2: fn(i32) -> i32 = |x| x * 3;
 
 println!("f1(10) = {}", f1(10)); // 20
 println!("f2(10) = {}", f2(10)); // 30
 
 // Closure ที่ capture ต้องใช้ Fn traits
 let multiplier = 5;
 // let f3: fn(i32) -> i32 = |x| x * multiplier; // Error!
 
 // ใช้ impl Fn แทน
 fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
 f(x)
 }
 
 let result = apply(|x| x * multiplier, 10);
 println!("with closure: {}", result); // 50
}
```

</RustPlayground>

---

## Higher-Order Functions

<RustPlayground>

```rust
// Function ที่รับ function เป็น argument
fn apply_twice(f: fn(i32) -> i32, x: i32) -> i32 {
 f(f(x))
}

// Function ที่ return function
fn make_adder(n: i32) -> fn(i32) -> i32 {
 // ต้องใช้ closure แทน
 // เพราะ fn ไม่สามารถ capture
 |x| x + 1 // แค่ตัวอย่างง่ายๆ
}

fn double(x: i32) -> i32 { x * 2 }
fn square(x: i32) -> i32 { x * x }

fn main() {
 println!("double twice: {}", apply_twice(double, 3)); // 12
 println!("square twice: {}", apply_twice(square, 2)); // 16
 
 // Array of function pointers
 let operations: [fn(i32) -> i32; 2] = [double, square];
 for op in operations {
 println!("op(5) = {}", op(5));
 }
}
```

</RustPlayground>

---

## ! - Never Type

`!` คือ type ที่ไม่มีค่า (never returns):

<RustPlayground>

```rust
#![allow(dead_code)]

// Function ที่ไม่ return
fn infinite_loop() -> ! {
 loop {
 // ไม่มีวันจบ
 }
}

fn exit_program() -> ! {
 std::process::exit(1);
}

fn main() {
 // panic! return !
 let x: i32 = match Some(42) {
 Some(n) => n,
 None => panic!("no value!"), // ! coerces to i32
 };
 println!("x = {}", x);
 
 // ! ใช้ใน match arms ได้
 let result: i32 = match "42".parse::<i32>() {
 Ok(n) => n,
 Err(_) => panic!("parse failed"), // ! coerces to i32
 };
 println!("result = {}", result);
}
```

</RustPlayground>

---

## Never Type Use Cases

<RustPlayground>

```rust
fn main() {
 // 1. loop ที่ไม่มี break
 // fn server() -> ! {
 // loop { handle_request(); }
 // }
 
 // 2. ใน match ที่ต้อง exhaustive
 let optional: Option<i32> = Some(42);
 let value = match optional {
 Some(v) => v,
 None => return, // return ก็เป็น !
 };
 println!("value = {}", value);
 
 // 3. continue และ break
 let result: i32 = loop {
 let x = 42;
 if x > 0 {
 break x; // break expr
 }
 continue; // continue เป็น !
 };
 println!("result = {}", result);
}
```

</RustPlayground>

---

## Quick Reference

### Function Pointer Types
| Type | คำอธิบาย |
|------|---------|
| `fn()` | No args, no return |
| `fn(T) -> U` | T -> U |
| `fn(T, U) -> V` | Multiple args |
| `unsafe fn()` | Unsafe function |
| `extern "C" fn()` | C ABI |

### fn vs Fn Traits
| Type | คำอธิบาย |
|------|---------|
| `fn(T) -> U` | Function pointer |
| `Fn(T) -> U` | Callable, borrows |
| `FnMut(T) -> U` | Callable, mut borrows |
| `FnOnce(T) -> U` | Callable, consumes |

### Never Type (!)
| Expression | Returns ! |
|------------|----------|
| `panic!()` | Always |
| `loop {}` | No break |
| `return` | Early return |
| `continue` | Loop continue |
| `std::process::exit()` | Exit program |

---

[← pointer](./pointer) | [กลับ Index →](./index)
