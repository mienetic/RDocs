# Macros

Macros ช่วยให้เขียน code ที่ generate code!

## Macros คืออะไร?

Macros คือ code ที่รันตอน compile เพื่อสร้าง code อื่น (metaprogramming)

### เปรียบเทียบ Macro vs Function

| | Function | Macro |
|---|----------|-------|
| รันเมื่อ | Runtime | Compile-time |
| Arguments | ต้องรู้ type | Pattern matching |
| จำนวน args | คงที่ | ไม่จำกัด |
| Return | Value | Code |
| Debug | ง่าย | ยากกว่า |

## Declarative Macros (macro_rules!)

### Basic Macro

<RustPlayground>

```rust
// macro ง่ายที่สุด
macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
}

macro_rules! greet {
    ($name:expr) => {
        println!("Hello, {}!", $name);
    };
}

fn main() {
    say_hello!();
    greet!("Rust");
    greet!("Ferris");
}
```

</RustPlayground>

### Pattern Matching

<RustPlayground>

```rust
// macro กับหลาย patterns
macro_rules! calculate {
    // Pattern 1: ไม่มี arguments
    () => {
        0
    };
    // Pattern 2: ตัวเลขตัวเดียว
    ($x:expr) => {
        $x
    };
    // Pattern 3: สองตัว กับ operator
    ($x:expr, $op:tt, $y:expr) => {
        $x $op $y
    };
}

fn main() {
    println!("Empty: {}", calculate!());
    println!("Single: {}", calculate!(42));
    println!("Add: {}", calculate!(10, +, 20));
    println!("Mul: {}", calculate!(5, *, 6));
}
```

</RustPlayground>

### Repetition

<RustPlayground>

```rust
// macro ที่รับ arguments ไม่จำกัดจำนวน
macro_rules! vec_of_strings {
    // $($x:expr),* = 0 หรือมากกว่า expressions คั่นด้วย ,
    ($($x:expr),*) => {
        vec![$(String::from($x)),*]
    };
}

macro_rules! create_functions {
    // สร้างหลาย functions
    ($($name:ident),*) => {
        $(
            fn $name() {
                println!("Function: {:?}", stringify!($name));
            }
        )*
    };
}

// สร้าง functions: foo, bar, baz
create_functions!(foo, bar, baz);

fn main() {
    let names = vec_of_strings!["Alice", "Bob", "Charlie"];
    println!("{:?}", names);
    
    foo();
    bar();
    baz();
}
```

</RustPlayground>

### Designators (Capture Types)

| Designator | จับอะไร | ตัวอย่าง |
|------------|--------|---------|
| `$x:expr` | Expression | `1 + 2`, `"hello"` |
| `$x:ident` | Identifier | `foo`, `my_var` |
| `$x:ty` | Type | `i32`, `String` |
| `$x:tt` | Token tree | `+`, `if`, `{}` |
| `$x:literal` | Literal | `42`, `"text"` |
| `$x:path` | Path | `std::io::Result` |
| `$x:stmt` | Statement | `let x = 5;` |
| `$x:block` | Block | `{ ... }` |
| `$x:pat` | Pattern | `Some(x)`, `_` |
| `$x:item` | Item | `fn foo() {}` |

<RustPlayground>

```rust
// ใช้ designators ต่างๆ
macro_rules! make_function {
    ($name:ident, $return_type:ty, $body:block) => {
        fn $name() -> $return_type $body
    };
}

make_function!(get_number, i32, { 42 });
make_function!(get_text, &'static str, { "hello" });

fn main() {
    println!("Number: {}", get_number());
    println!("Text: {}", get_text());
}
```

</RustPlayground>

## Procedural Macros

Procedural macros ทรงพลังกว่า declarative macros

### 3 ประเภท

1. **Derive macros** - `#[derive(MyTrait)]`
2. **Attribute macros** - `#[my_attribute]`
3. **Function-like macros** - `my_macro!(...)`

### Derive Macro Example

```rust
// ต้องสร้าง crate แยก: my_derive

// my_derive/src/lib.rs
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;
    
    let gen = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello from {}!", stringify!(#name));
            }
        }
    };
    
    gen.into()
}
```

```rust
// ใช้งาน
use my_derive::HelloMacro;

trait HelloMacro {
    fn hello_macro();
}

#[derive(HelloMacro)]
struct Pancakes;

fn main() {
    Pancakes::hello_macro();
    // Output: Hello from Pancakes!
}
```

### Attribute Macro

```rust
// สร้าง attribute macro
#[proc_macro_attribute]
pub fn route(attr: TokenStream, item: TokenStream) -> TokenStream {
    // attr = "GET", "/hello"
    // item = fn handler() { ... }
    // ...
}

// ใช้งาน
#[route(GET, "/hello")]
fn handler() {
    // handle request
}
```

### Function-like Macro

```rust
// สร้าง function-like macro
#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream {
    // parse SQL at compile time
    // ...
}

// ใช้งาน
let query = sql!(SELECT * FROM users WHERE id = 1);
```

## Common Macros ใน Std Library

<RustPlayground>

```rust
fn main() {
    // println! - print กับ format
    println!("Hello, {}!", "world");
    
    // vec! - สร้าง Vec
    let v = vec![1, 2, 3];
    println!("vec: {:?}", v);
    
    // format! - สร้าง String
    let s = format!("{} + {} = {}", 1, 2, 3);
    println!("{}", s);
    
    // panic! - crash พร้อม message
    // panic!("Something went wrong!");
    
    // assert! - ตรวจสอบ condition
    assert!(1 + 1 == 2);
    
    // dbg! - debug print
    let x = dbg!(3 * 3);  // prints: [src/main.rs:X] 3 * 3 = 9
    println!("x = {}", x);
    
    // todo! - placeholder ที่ยังไม่ implement
    // todo!("Implement this later");
    
    // unimplemented! - code ที่ไม่ควรถูกเรียก
    // unimplemented!();
}
```

</RustPlayground>

## Custom Debug Macro

<RustPlayground>

```rust
macro_rules! debug_print {
    ($val:expr) => {
        println!("[DEBUG] {} = {:?}", stringify!($val), $val);
    };
    // หลายค่า
    ($($val:expr),+ $(,)?) => {
        $(
            debug_print!($val);
        )+
    };
}

fn main() {
    let x = 42;
    let name = "Rust";
    let numbers = vec![1, 2, 3];
    
    debug_print!(x);
    debug_print!(name, numbers);
    debug_print!(x + 10, name.len());
}
```

</RustPlayground>

## Macro Export

```rust
// ทำให้ macro ใช้ได้จาก crate อื่น
#[macro_export]
macro_rules! public_macro {
    () => {
        println!("I'm exported!");
    };
}

// ใช้จาก crate อื่น
// use my_crate::public_macro;
```

## When to Use Macros?

### Use Macros When:
- ต้องการ variable number of arguments
- ต้องการ compile-time code generation
- ต้องการ DSL (Domain Specific Language)
- ลด boilerplate code

### Don't Use Macros When:
- Function สามารถทำได้
- Code ยากอ่านเกินไป
- Debug ยาก

## Macro Debugging

```bash
# ดู expanded macro
cargo expand

# หรือใช้ println! กับ stringify!
macro_rules! debug_macro {
    ($x:expr) => {
        println!("Code: {}", stringify!($x));
        $x
    };
}
```

## สรุป

| Macro Type | Syntax | ใช้เมื่อ |
|------------|--------|---------|
| Declarative | `macro_rules!` | Pattern matching |
| Derive | `#[derive(...)]` | Trait implementation |
| Attribute | `#[attr]` | Modify items |
| Function-like | `name!(...)` | Complex generation |

---

[บทถัดไป: Rust 2024 Edition](./rust-2024)
