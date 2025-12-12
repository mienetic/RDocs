# rustdoc - Documentation

สร้าง Documentation สวยๆ ด้วย rustdoc! 📚

:::tip rustdoc เป็น built-in!
Rust มี documentation generator ในตัว - สร้าง docs สวยๆ จาก comments อัตโนมัติ!
:::

---

## 1. สร้าง Documentation

### 1.1 คำสั่งพื้นฐาน

```bash
# สร้าง documentation
cargo doc

# สร้างและเปิดใน browser
cargo doc --open

# รวม dependencies ด้วย
cargo doc --document-private-items

# สร้างเฉพาะ crate นี้ (ไม่รวม dependencies)
cargo doc --no-deps
```

### 1.2 Output Location

```
target/doc/
├── your_crate/
│   ├── index.html
│   ├── struct.YourStruct.html
│   ├── fn.your_function.html
│   └── ...
└── ...
```

---

## 2. เขียน Doc Comments

### 2.1 Module Documentation

```rust
//! # My Awesome Crate
//! 
//! `my_crate` provides utilities for doing amazing things.
//! 
//! ## Features
//! 
//! - **Fast**: Optimized for performance
//! - **Safe**: No unsafe code
//! - **Easy**: Simple API
//! 
//! ## Quick Start
//! 
//! ```rust
//! use my_crate::greet;
//! 
//! greet("World");
//! ```

/// Greets someone by name.
pub fn greet(name: &str) {
    println!("Hello, {}!", name);
}
```

### 2.2 Function Documentation

```rust
/// Calculates the factorial of a number.
/// 
/// # Arguments
/// 
/// * `n` - A non-negative integer
/// 
/// # Returns
/// 
/// The factorial of `n`
/// 
/// # Panics
/// 
/// Panics if `n` is negative (not possible with u32)
/// 
/// # Examples
/// 
/// ```
/// use my_crate::factorial;
/// 
/// assert_eq!(factorial(5), 120);
/// assert_eq!(factorial(0), 1);
/// ```
pub fn factorial(n: u32) -> u64 {
    (1..=n as u64).product()
}
```

### 2.3 Struct Documentation

```rust
/// Represents a 2D point in space.
/// 
/// # Examples
/// 
/// ```
/// use my_crate::Point;
/// 
/// let p = Point::new(3.0, 4.0);
/// assert_eq!(p.distance_from_origin(), 5.0);
/// ```
#[derive(Debug, Clone, Copy)]
pub struct Point {
    /// X coordinate
    pub x: f64,
    /// Y coordinate
    pub y: f64,
}

impl Point {
    /// Creates a new point.
    pub fn new(x: f64, y: f64) -> Self {
        Point { x, y }
    }
    
    /// Calculates distance from origin.
    pub fn distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}
```

---

## 3. Doc Tests

### 3.1 ตัวอย่างที่รัน test ได้

```rust
/// Adds two numbers together.
/// 
/// # Examples
/// 
/// ```
/// let result = my_crate::add(2, 3);
/// assert_eq!(result, 5);
/// ```
/// 
/// ```
/// // Negative numbers work too
/// let result = my_crate::add(-1, 1);
/// assert_eq!(result, 0);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

### 3.2 รัน Doc Tests

```bash
# Run only doc tests
cargo test --doc

# Run all tests including docs
cargo test
```

### 3.3 Hidden Lines

```rust
/// # Examples
/// 
/// ```
/// # // Lines starting with # are hidden but still run
/// # fn main() -> Result<(), Box<dyn std::error::Error>> {
/// let x = "42".parse::<i32>()?;
/// assert_eq!(x, 42);
/// # Ok(())
/// # }
/// ```
pub fn example() {}
```

### 3.4 No-Run Examples

```rust
/// # Examples
/// 
/// ```no_run
/// // This example won't be executed
/// std::fs::remove_file("important.txt")?;
/// ```
/// 
/// ```ignore
/// // This won't even be compiled
/// some_platform_specific_code();
/// ```
/// 
/// ```compile_fail
/// // This should fail to compile
/// let x: i32 = "not a number";
/// ```
pub fn dangerous_example() {}
```

---

## 4. Cross-References

### 4.1 Link to Other Items

```rust
/// See also [`other_function`] and [`MyStruct`].
/// 
/// For more details, check [`MyStruct::method`].
pub fn my_function() {}

/// Referenced by [`my_function`].
pub fn other_function() {}

/// Used by [`my_function`].
pub struct MyStruct;

impl MyStruct {
    /// Method referenced by [`my_function`].
    pub fn method(&self) {}
}
```

### 4.2 External Links

```rust
/// For more information, see the [Rust Book](https://doc.rust-lang.org/book/).
/// 
/// Also check the [std::vec::Vec] documentation.
pub fn with_links() {}
```

---

## 5. Advanced Features

### 5.1 Badges and Shields

```rust
//! [![Crates.io](https://img.shields.io/crates/v/my_crate)](https://crates.io/crates/my_crate)
//! [![Documentation](https://docs.rs/my_crate/badge.svg)](https://docs.rs/my_crate)
//! 
//! # My Crate
//! 
//! Description here...
```

### 5.2 Feature Flags

```rust
/// This function requires the `advanced` feature.
/// 
/// # Examples
/// 
/// ```
/// #[cfg(feature = "advanced")]
/// use my_crate::advanced_function;
/// ```
#[cfg(feature = "advanced")]
pub fn advanced_function() {}
```

### 5.3 Conditional Documentation

```rust
#[cfg_attr(feature = "advanced", doc = "Advanced features enabled!")]
#[cfg_attr(not(feature = "advanced"), doc = "Enable `advanced` feature for more.")]
pub fn conditional_docs() {}
```

---

## 6. docs.rs Integration

### 6.1 Cargo.toml Configuration

```toml
[package.metadata.docs.rs]
all-features = true
rustdoc-args = ["--cfg", "docsrs"]

[features]
default = []
advanced = []
experimental = []
```

### 6.2 Feature-Gated Docs

```rust
#[cfg_attr(docsrs, doc(cfg(feature = "advanced")))]
#[cfg(feature = "advanced")]
pub fn advanced_only() {}
```

---

## 7. Organization Tips

### 7.1 Re-exports

```rust
//! # My Crate
//! 
//! ## Modules
//! 
//! - [`utils`] - Utility functions
//! - [`models`] - Data models

pub mod utils;
pub mod models;

// Re-export common items
pub use models::User;
pub use utils::helper;
```

### 7.2 Hide Implementation Details

```rust
/// Public API
pub fn public_api() {
    internal_helper();
}

/// Not shown in public docs
#[doc(hidden)]
pub fn internal_helper() {}
```

---

## 8. สรุป

| Command | Description |
|---------|-------------|
| `cargo doc` | Generate docs |
| `cargo doc --open` | Generate and open |
| `cargo test --doc` | Run doc tests |

| Annotation | Purpose |
|------------|---------|
| `///` | Document next item |
| `//!` | Document containing item |
| `` ``` `` | Code example (tested) |
| `` ```no_run `` | Example (not executed) |
| `` ```ignore `` | Example (not compiled) |
| `[`item`]` | Link to item |
| `#[doc(hidden)]` | Hide from docs |

---

[บทถัดไป: Testing](/intermediate/testing)
