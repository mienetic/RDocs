# str - String Slice

`str` คือ string slice แบบ primitive! 

---

## str คืออะไร?

`str` คือ sequence ของ UTF-8 bytes:
- **Unsized type** - ใช้ผ่าน reference `&str` เท่านั้น
- **borrowed** - ไม่เป็นเจ้าของข้อมูล
- **immutable** - แก้ไขไม่ได้

:::tip `&str` vs `String`
- `&str` = borrowed, immutable, ไม่ allocate (primitive)
- `String` = owned, mutable, heap allocated (std library)
:::

---

## 1. การประกาศ

<RustPlayground>

```rust
fn main() {
 // String literal เป็น &'static str
 let hello: &str = "Hello, World!";
 let thai: &str = "สวัสดี";
 let emoji: &str = "";
 
 println!("{}", hello);
 println!("{}", thai);
 println!("{}", emoji);
 
 // Raw string (ไม่ parse escapes)
 let raw = r"C:\Users\name";
 let raw_multi = r#"Say "Hello" to Rust"#;
 println!("{}", raw);
 println!("{}", raw_multi);
}
```

</RustPlayground>

---

## 2. Length vs Chars

<RustPlayground>

```rust
fn main() {
 let ascii = "Hello";
 let thai = "สวัสดี";
 let emoji = "";
 
 // len() return bytes ไม่ใช่ chars!
 println!("'{}' -> {} bytes, {} chars", 
 ascii, ascii.len(), ascii.chars().count());
 println!("'{}' -> {} bytes, {} chars", 
 thai, thai.len(), thai.chars().count());
 println!("'{}' -> {} bytes, {} chars", 
 emoji, emoji.len(), emoji.chars().count());
 
 // UTF-8 ใช้หลาย bytes
 // ASCII = 1 byte
 // Thai = 3 bytes per char
 // Emoji = 4 bytes per char
}
```

</RustPlayground>

---

## 3. Accessing Characters

<RustPlayground>

```rust
fn main() {
 let s = "Hello";
 
 // ไม่สามารถ index ด้วย s[0] ได้!
 // เพราะ UTF-8 มีความยาวไม่แน่นอน
 
 // ใช้ chars()
 let first = s.chars().next().unwrap();
 println!("first char: {}", first);
 
 // nth char
 let third = s.chars().nth(2).unwrap();
 println!("third char: {}", third);
 
 // ใช้ bytes() สำหรับ raw bytes
 for b in s.bytes() {
 print!("{} ", b);
 }
 println!();
}
```

</RustPlayground>

---

## 4. Slicing

<RustPlayground>

```rust
fn main() {
 let s = "Hello, World!";
 
 // Slice ด้วย byte index
 let hello = &s[0..5];
 let world = &s[7..12];
 println!("hello: {}", hello);
 println!("world: {}", world);
 
 // ต้องระวัง UTF-8!
 let thai = "สวัสดี";
 // &thai[0..1] จะ panic! (ไม่อยู่บน char boundary)
 
 // Safe slice
 let first_thai = &thai[0..3]; // ตัวอักษรไทย = 3 bytes
 println!("first thai char: {}", first_thai);
}
```

</RustPlayground>

:::warning UTF-8 Boundary
Slice ต้องอยู่บน UTF-8 code point boundary ไม่งั้นจะ panic!
:::

---

## 5. Searching

<RustPlayground>

```rust
fn main() {
 let s = "Hello, World! Hello again!";
 
 // contains
 println!("contains 'World': {}", s.contains("World"));
 
 // starts_with / ends_with
 println!("starts_with 'Hello': {}", s.starts_with("Hello"));
 println!("ends_with '!': {}", s.ends_with("!"));
 
 // find (returns byte index)
 if let Some(pos) = s.find("World") {
 println!("'World' at byte {}", pos);
 }
 
 // rfind (from end)
 if let Some(pos) = s.rfind("Hello") {
 println!("last 'Hello' at byte {}", pos);
 }
 
 // matches
 let count = s.matches("Hello").count();
 println!("'Hello' appears {} times", count);
}
```

</RustPlayground>

---

## 6. String Operations

<RustPlayground>

```rust
fn main() {
 let s = " Hello, World! ";
 
 // Trimming
 println!("trim: '{}'", s.trim());
 println!("trim_start: '{}'", s.trim_start());
 println!("trim_end: '{}'", s.trim_end());
 
 // Case conversion (return String)
 let lower = s.to_lowercase();
 let upper = s.to_uppercase();
 println!("lowercase: {}", lower);
 println!("uppercase: {}", upper);
 
 // Replace (return String)
 let s = "Hello, World!";
 let replaced = s.replace("World", "Rust");
 println!("replaced: {}", replaced);
}
```

</RustPlayground>

---

## 7. Splitting

<RustPlayground>

```rust
fn main() {
 let s = "apple,banana,cherry";
 
 // split
 for fruit in s.split(',') {
 println!(" {}", fruit);
 }
 
 // split_whitespace
 let words = "Hello World Rust";
 for word in words.split_whitespace() {
 println!(" {}", word);
 }
 
 // lines
 let multiline = "line1\nline2\nline3";
 for line in multiline.lines() {
 println!(" {}", line);
 }
 
 // splitn (limit splits)
 let path = "a/b/c/d";
 for part in path.splitn(3, '/') {
 println!(" {}", part); // a, b, c/d
 }
}
```

</RustPlayground>

---

## 8. Parsing

<RustPlayground>

```rust
fn main() {
 // Parse to number
 let num: i32 = "42".parse().unwrap();
 println!("parsed i32: {}", num);
 
 let float: f64 = "3.14".parse().unwrap();
 println!("parsed f64: {}", float);
 
 // Parse with error handling
 match "not_a_number".parse::<i32>() {
 Ok(n) => println!("got {}", n),
 Err(e) => println!("parse error: {}", e),
 }
 
 // is_empty
 let empty = "";
 let not_empty = "hello";
 println!("''.is_empty: {}", empty.is_empty());
 println!("'hello'.is_empty: {}", not_empty.is_empty());
}
```

</RustPlayground>

---

## 9. Conversion

<RustPlayground>

```rust
fn main() {
 let s: &str = "Hello";
 
 // &str -> String
 let owned: String = s.to_string();
 let owned2: String = String::from(s);
 let owned3: String = s.to_owned();
 
 // &str -> bytes
 let bytes: &[u8] = s.as_bytes();
 println!("bytes: {:?}", bytes);
 
 // bytes -> &str
 let bytes = [72, 101, 108, 108, 111];
 let s2 = std::str::from_utf8(&bytes).unwrap();
 println!("from bytes: {}", s2);
}
```

</RustPlayground>

---

## Quick Reference

### Length & Access
| Method | คำอธิบาย |
|--------|---------|
| `len()` | จำนวน bytes |
| `is_empty()` | ว่างไหม |
| `chars()` | Iterator ของ char |
| `bytes()` | Iterator ของ byte |
| `char_indices()` | (byte_index, char) |

### Searching
| Method | คำอธิบาย |
|--------|---------|
| `contains(pat)` | มี pattern ไหม |
| `starts_with(pat)` | ขึ้นต้นด้วย |
| `ends_with(pat)` | ลงท้ายด้วย |
| `find(pat)` | หาตำแหน่งแรก |
| `rfind(pat)` | หาจากท้าย |

### Operations
| Method | คำอธิบาย |
|--------|---------|
| `trim()` | ตัดช่องว่าง |
| `to_lowercase()` | ตัวเล็ก → String |
| `to_uppercase()` | ตัวใหญ่ → String |
| `replace(from, to)` | แทนที่ → String |
| `split(pat)` | แยกเป็น Iterator |

---

[← char](./char) | [bool & unit →](./bool-unit)
