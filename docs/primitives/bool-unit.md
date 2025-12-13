# bool & unit - พื้นฐานสุดๆ

Boolean และ Unit type! 

---

## bool - Boolean

`bool` มีแค่ 2 ค่า: `true` และ `false`

<RustPlayground>

```rust
fn main() {
 let yes: bool = true;
 let no: bool = false;
 
 println!("yes = {}", yes);
 println!("no = {}", no);
 
 // ขนาด 1 byte
 println!("size_of bool = {} byte", std::mem::size_of::<bool>());
 
 // Boolean operations
 println!("true && false = {}", true && false); // AND
 println!("true || false = {}", true || false); // OR
 println!("!true = {}", !true); // NOT
}
```

</RustPlayground>

---

## Comparison Operators

<RustPlayground>

```rust
fn main() {
 let a = 10;
 let b = 20;
 
 // Comparison return bool
 println!("{} == {} -> {}", a, b, a == b); // equal
 println!("{} != {} -> {}", a, b, a != b); // not equal
 println!("{} < {} -> {}", a, b, a < b); // less than
 println!("{} > {} -> {}", a, b, a > b); // greater than
 println!("{} <= {} -> {}", a, b, a <= b); // less or equal
 println!("{} >= {} -> {}", a, b, a >= b); // greater or equal
}
```

</RustPlayground>

---

## Short-circuit Evaluation

<RustPlayground>

```rust
fn check_a() -> bool {
 println!(" checking A...");
 true
}

fn check_b() -> bool {
 println!(" checking B...");
 false
}

fn main() {
 // AND: ถ้าตัวแรก false ไม่เช็คตัวที่สอง
 println!("false && check_b():");
 let _ = false && check_b(); // check_b ไม่ถูกเรียก!
 
 println!("check_a() && check_b():");
 let _ = check_a() && check_b(); // ทั้งคู่ถูกเรียก
 
 // OR: ถ้าตัวแรก true ไม่เช็คตัวที่สอง
 println!("true || check_b():");
 let _ = true || check_b(); // check_b ไม่ถูกเรียก!
}
```

</RustPlayground>

---

## bool Methods

<RustPlayground>

```rust
fn main() {
 let t = true;
 let f = false;
 
 // then_some - return Option
 let result = t.then_some("yes");
 println!("true.then_some(\"yes\") = {:?}", result); // Some("yes")
 
 let result = f.then_some("yes");
 println!("false.then_some(\"yes\") = {:?}", result); // None
 
 // then - lazy evaluation
 let result = t.then(|| "computed".to_string());
 println!("true.then(|| ...) = {:?}", result); // Some("computed")
}
```

</RustPlayground>

---

## () - Unit Type

`()` คือ type ที่ไม่มีค่า (empty tuple):

<RustPlayground>

```rust
fn main() {
 // Unit value
 let unit: () = ();
 println!("unit = {:?}", unit);
 
 // ขนาด 0 bytes!
 println!("size_of () = {} bytes", std::mem::size_of::<()>());
 
 // Functions ที่ไม่ return ค่า จริงๆ return ()
 fn do_nothing() {
 println!("doing nothing");
 }
 
 fn explicit_unit() -> () {
 println!("explicit unit return");
 }
 
 let _: () = do_nothing();
 let _: () = explicit_unit();
}
```

</RustPlayground>

---

## เมื่อไหร่ใช้ Unit

<RustPlayground>

```rust
fn main() {
 // 1. Result ที่ไม่มีค่า success
 fn save_file() -> Result<(), String> {
 // simulate success
 Ok(())
 }
 
 match save_file() {
 Ok(()) => println!("saved!"),
 Err(e) => println!("error: {}", e),
 }
 
 // 2. Empty struct (ZST)
 struct Marker;
 println!("Marker size = {} bytes", std::mem::size_of::<Marker>());
 
 // 3. Ignoring values
 let _ = 42; // explicitly ignore
}
```

</RustPlayground>

---

## Quick Reference

### bool
| Value | คำอธิบาย |
|-------|---------|
| `true` | จริง |
| `false` | เท็จ |

### Operators
| Operator | คำอธิบาย |
|----------|---------|
| `&&` | Logical AND |
| `\|\|` | Logical OR |
| `!` | Logical NOT |

### Comparison → bool
| Operator | คำอธิบาย |
|----------|---------|
| `==` | เท่ากัน |
| `!=` | ไม่เท่ากัน |
| `<` | น้อยกว่า |
| `>` | มากกว่า |
| `<=` | น้อยกว่าหรือเท่า |
| `>=` | มากกว่าหรือเท่า |

### Unit ()
| Property | ค่า |
|----------|-----|
| Value | `()` |
| Size | 0 bytes |
| Use case | No return value |

---

[← str](./str) | [array →](./array)
