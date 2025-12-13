# Newtype Pattern

Pattern สำหรับ wrap types เพื่อ type safety! 

---

## ทำไมต้องใช้ Newtype?

- Type safety (ป้องกันสับสน string กับ string)
- Implement traits สำหรับ external types
- Custom behavior สำหรับ primitive types
- Zero-cost abstraction (ไม่มี runtime overhead)

---

## Basic Newtype

<RustPlayground>

```rust
// ป้องกันสับสนระหว่าง UserId กับ OrderId
struct UserId(u64);
struct OrderId(u64);

fn get_user(id: UserId) {
 println!("Getting user: {}", id.0);
}

fn get_order(id: OrderId) {
 println!("Getting order: {}", id.0);
}

fn main() {
 let user_id = UserId(42);
 let order_id = OrderId(100);
 
 get_user(user_id);
 get_order(order_id);
 
 // Compile error! ไม่สามารถใช้สลับกันได้
 // get_user(order_id); // Error!
}
```

</RustPlayground>

---

## Newtype with Validation

<RustPlayground>

```rust
struct Email(String);

impl Email {
 fn new(email: &str) -> Result<Self, &'static str> {
 if email.contains('@') && email.contains('.') {
 Ok(Email(email.to_string()))
 } else {
 Err("Invalid email format")
 }
 }
 
 fn as_str(&self) -> &str {
 &self.0
 }
}

fn send_email(to: &Email, message: &str) {
 println!("Sending to {}: {}", to.as_str(), message);
}

fn main() {
 match Email::new("user@example.com") {
 Ok(email) => send_email(&email, "Hello!"),
 Err(e) => println!("Error: {}", e),
 }
}
```

</RustPlayground>

---

## Implement Traits for External Types

<RustPlayground>

```rust
use std::fmt;

// ไม่สามารถ impl Display for Vec ได้ตรงๆ (orphan rule)
// แต่ทำได้ผ่าน Newtype!

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 write!(f, "[{}]", self.0.join(", "))
 }
}

fn main() {
 let items = Wrapper(vec!["a".into(), "b".into(), "c".into()]);
 println!("{}", items);
}
```

</RustPlayground>

---

## Deref Coercion

<RustPlayground>

```rust
use std::ops::Deref;

struct Username(String);

impl Deref for Username {
 type Target = str;
 
 fn deref(&self) -> &str {
 &self.0
 }
}

fn main() {
 let username = Username("alice".to_string());
 
 // สามารถใช้ &str methods ได้เลย!
 println!("Length: {}", username.len());
 println!("Uppercase: {}", username.to_uppercase());
}
```

</RustPlayground>

---

## Quick Reference

| Use Case | ตัวอย่าง |
|----------|---------|
| Type Safety | `UserId(u64)` vs `OrderId(u64)` |
| Validation | `Email`, `PhoneNumber` |
| External Traits | `impl Display for MyVec` |
| Unit Conversion | `Meters(f64)`, `Kilometers(f64)` |

---

[← Builder](/patterns/builder) | [Smart Pointers →](/patterns/smart-pointers)
