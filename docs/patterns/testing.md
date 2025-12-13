# Testing Patterns

Pattern สำหรับเขียน Tests ที่ดีใน Rust! 

---

## Basic Unit Tests

<RustPlayground>

```rust
fn add(a: i32, b: i32) -> i32 {
 a + b
}

fn divide(a: i32, b: i32) -> Result<i32, &'static str> {
 if b == 0 {
 Err("Division by zero")
 } else {
 Ok(a / b)
 }
}

#[cfg(test)]
mod tests {
 use super::*;
 
 #[test]
 fn test_add() {
 assert_eq!(add(2, 3), 5);
 }
 
 #[test]
 fn test_add_negative() {
 assert_eq!(add(-1, 1), 0);
 }
 
 #[test]
 fn test_divide() {
 assert_eq!(divide(10, 2), Ok(5));
 }
 
 #[test]
 fn test_divide_by_zero() {
 assert_eq!(divide(10, 0), Err("Division by zero"));
 }
}

fn main() {
 println!("Run tests with: cargo test");
}
```

</RustPlayground>

---

## Testing Panics

<RustPlayground>

```rust
fn get_element(v: &[i32], index: usize) -> i32 {
 v[index] // จะ panic ถ้า out of bounds
}

#[cfg(test)]
mod tests {
 use super::*;
 
 #[test]
 #[should_panic]
 fn test_out_of_bounds() {
 let v = vec![1, 2, 3];
 get_element(&v, 10); // should panic
 }
 
 #[test]
 #[should_panic(expected = "index out of bounds")]
 fn test_panic_message() {
 let v = vec![1, 2, 3];
 get_element(&v, 10);
 }
}

fn main() {
 println!("Run tests with: cargo test");
}
```

</RustPlayground>

---

## Test Organization

```rust
// src/lib.rs
pub fn process(data: &str) -> String {
 data.to_uppercase()
}

// Unit tests - same file
#[cfg(test)]
mod tests {
 use super::*;

 #[test]
 fn test_process() {
 assert_eq!(process("hello"), "HELLO");
 }
}

// Integration tests - tests/ directory
// tests/integration_test.rs
// use my_crate::process;
// 
// #[test]
// fn test_full_flow() {
// assert_eq!(process("world"), "WORLD");
// }
```

---

## Test Fixtures & Setup

<RustPlayground>

```rust
struct Database {
 data: Vec<String>,
}

impl Database {
 fn new() -> Self {
 Database { data: vec![] }
 }
 
 fn insert(&mut self, item: &str) {
 self.data.push(item.to_string());
 }
 
 fn get(&self, index: usize) -> Option<&String> {
 self.data.get(index)
 }
 
 fn len(&self) -> usize {
 self.data.len()
 }
}

#[cfg(test)]
mod tests {
 use super::*;
 
 // Fixture function
 fn setup() -> Database {
 let mut db = Database::new();
 db.insert("item1");
 db.insert("item2");
 db
 }
 
 #[test]
 fn test_get() {
 let db = setup();
 assert_eq!(db.get(0), Some(&"item1".to_string()));
 }
 
 #[test]
 fn test_len() {
 let db = setup();
 assert_eq!(db.len(), 2);
 }
}

fn main() {
 println!("Run tests with: cargo test");
}
```

</RustPlayground>

---

## Mocking with Traits

<RustPlayground>

```rust
trait HttpClient {
 fn get(&self, url: &str) -> Result<String, String>;
}

struct RealClient;
impl HttpClient for RealClient {
 fn get(&self, url: &str) -> Result<String, String> {
 // Real HTTP request
 Ok(format!("Response from {}", url))
 }
}

struct MockClient {
 response: String,
}
impl HttpClient for MockClient {
 fn get(&self, _url: &str) -> Result<String, String> {
 Ok(self.response.clone())
 }
}

fn fetch_data<C: HttpClient>(client: &C, url: &str) -> String {
 client.get(url).unwrap_or_else(|e| e)
}

#[cfg(test)]
mod tests {
 use super::*;
 
 #[test]
 fn test_fetch_with_mock() {
 let mock = MockClient {
 response: "Mock response".to_string(),
 };
 
 let result = fetch_data(&mock, "http://example.com");
 assert_eq!(result, "Mock response");
 }
}

fn main() {
 let client = RealClient;
 println!("{}", fetch_data(&client, "http://example.com"));
}
```

</RustPlayground>

---

## Property-Based Testing

```rust
// Cargo.toml: proptest = "1.0"

use proptest::prelude::*;

fn reverse<T: Clone>(input: &[T]) -> Vec<T> {
 input.iter().rev().cloned().collect()
}

proptest! {
 #[test]
 fn test_double_reverse(vec: Vec<i32>) {
 // Double reverse = original
 assert_eq!(reverse(&reverse(&vec)), vec);
 }
 
 #[test]
 fn test_reverse_length(vec: Vec<i32>) {
 // Length preserved
 assert_eq!(reverse(&vec).len(), vec.len());
 }
}
```

---

## Quick Reference

| Pattern | Use Case |
|---------|----------|
| `#[test]` | Basic unit test |
| `#[should_panic]` | Test panics |
| `#[ignore]` | Skip test |
| `assert!` | Boolean assertion |
| `assert_eq!` | Equality |
| `assert_ne!` | Inequality |
| Trait Mocking | Dependency injection |
| Proptest | Property-based testing |

---

## Commands

```bash
cargo test # Run all tests
cargo test test_name # Run specific test
cargo test -- --nocapture # Show println! output
cargo test -- --ignored # Run ignored tests
```

---

[← Trait Objects](/patterns/trait-objects) | [Patterns Index →](/patterns/)
