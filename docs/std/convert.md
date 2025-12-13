# Convert - แปลงชนิดข้อมูล

**std::convert** มี traits สำหรับแปลงระหว่าง types อย่างปลอดภัย! 

---

## convert มีอะไร?

| Trait | ใช้ทำอะไร | อาจ fail? |
|-------|---------|----------|
| `From` | แปลงจาก type อื่น | |
| `Into` | แปลงไป type อื่น | |
| `TryFrom` | แปลงจาก (อาจ fail) | |
| `TryInto` | แปลงไป (อาจ fail) | |
| `AsRef` | ยืมเป็น reference | |
| `AsMut` | ยืมเป็น mutable ref | |

:::tip From vs Into
implement `From` แล้วได้ `Into` ฟรี! นิยม implement `From` มากกว่า
:::

---

## 1. From และ Into

<RustPlayground>

```rust
#[derive(Debug)]
struct Celsius(f64);

#[derive(Debug)]
struct Fahrenheit(f64);

// Implement From: Celsius -> Fahrenheit
impl From<Celsius> for Fahrenheit {
 fn from(c: Celsius) -> Self {
 Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)
 }
}

// Implement From: Fahrenheit -> Celsius
impl From<Fahrenheit> for Celsius {
 fn from(f: Fahrenheit) -> Self {
 Celsius((f.0 - 32.0) * 5.0 / 9.0)
 }
}

fn main() {
 let c = Celsius(100.0);
 
 // From::from()
 let f: Fahrenheit = Fahrenheit::from(c);
 println!("100°C = {:?}", f);
 
 // .into() - ได้ฟรีจาก From
 let c2 = Celsius(0.0);
 let f2: Fahrenheit = c2.into();
 println!("0°C = {:?}", f2);
 
 // แปลงกลับ
 let f3 = Fahrenheit(32.0);
 let c3: Celsius = f3.into();
 println!("32°F = {:?}", c3);
}
```

</RustPlayground>

---

## 2. From สำหรับ Error Types

<RustPlayground>

```rust
use std::num::ParseIntError;
use std::fmt;

#[derive(Debug)]
enum MyError {
 ParseError(ParseIntError),
 InvalidValue(String),
}

impl fmt::Display for MyError {
 fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
 match self {
 MyError::ParseError(e) => write!(f, "Parse error: {}", e),
 MyError::InvalidValue(s) => write!(f, "Invalid: {}", s),
 }
 }
}

// From ทำให้ใช้ ? operator ได้
impl From<ParseIntError> for MyError {
 fn from(err: ParseIntError) -> Self {
 MyError::ParseError(err)
 }
}

fn parse_positive(s: &str) -> Result<i32, MyError> {
 let n: i32 = s.parse()?; // ? แปลง ParseIntError -> MyError อัตโนมัติ
 
 if n <= 0 {
 return Err(MyError::InvalidValue("ต้องมากกว่า 0".to_string()));
 }
 
 Ok(n)
}

fn main() {
 println!("{:?}", parse_positive("42"));
 println!("{:?}", parse_positive("abc"));
 println!("{:?}", parse_positive("-5"));
}
```

</RustPlayground>

---

## 3. TryFrom และ TryInto

<RustPlayground>

```rust
use std::convert::TryFrom;

#[derive(Debug)]
struct PositiveNumber(u32);

#[derive(Debug)]
struct ConversionError;

// TryFrom สำหรับการแปลงที่อาจ fail
impl TryFrom<i32> for PositiveNumber {
 type Error = ConversionError;
 
 fn try_from(value: i32) -> Result<Self, Self::Error> {
 if value > 0 {
 Ok(PositiveNumber(value as u32))
 } else {
 Err(ConversionError)
 }
 }
}

fn main() {
 // TryFrom::try_from()
 let pos = PositiveNumber::try_from(42);
 println!("42 -> {:?}", pos);
 
 let neg = PositiveNumber::try_from(-5);
 println!("-5 -> {:?}", neg);
 
 // .try_into() - ได้ฟรี
 let result: Result<PositiveNumber, _> = 100.try_into();
 println!("100 -> {:?}", result);
 
 // Built-in TryFrom สำหรับตัวเลข
 let small: Result<u8, _> = 300i32.try_into();
 println!("300 -> u8: {:?}", small); // Error! 300 เกิน u8
 
 let fits: Result<u8, _> = 200i32.try_into();
 println!("200 -> u8: {:?}", fits); // Ok(200)
}
```

</RustPlayground>

---

## 4. AsRef และ AsMut

<RustPlayground>

```rust
// AsRef = ยืมเป็น reference แบบ cheap

fn print_bytes<T: AsRef<[u8]>>(data: T) {
 let bytes = data.as_ref();
 println!("bytes: {:?}", bytes);
}

fn main() {
 // String, &str, Vec<u8>, &[u8] ทั้งหมด implement AsRef<[u8]>
 print_bytes("hello");
 print_bytes(String::from("world"));
 print_bytes(vec![1, 2, 3]);
 print_bytes(&[4, 5, 6][..]);
 
 // AsRef<str> ก็มี
 fn print_str<T: AsRef<str>>(s: T) {
 println!("str: {}", s.as_ref());
 }
 
 print_str("literal");
 print_str(String::from("owned"));
 
 // AsRef<Path> สำหรับ paths
 use std::path::Path;
 fn show_path<P: AsRef<Path>>(p: P) {
 println!("path: {}", p.as_ref().display());
 }
 
 show_path("/home/user");
 show_path(String::from("/tmp"));
 show_path(Path::new("/etc"));
}
```

</RustPlayground>

---

## 5. Implement AsRef

<RustPlayground>

```rust
struct MyString {
 data: String,
}

// AsRef<str> - ยืมเป็น &str
impl AsRef<str> for MyString {
 fn as_ref(&self) -> &str {
 &self.data
 }
}

// AsRef<[u8]> - ยืมเป็น &[u8]
impl AsRef<[u8]> for MyString {
 fn as_ref(&self) -> &[u8] {
 self.data.as_bytes()
 }
}

fn main() {
 let my_str = MyString { 
 data: "hello".to_string() 
 };
 
 // ใช้เป็น &str
 let s: &str = my_str.as_ref();
 println!("as str: {}", s);
 
 // ใช้เป็น &[u8]
 let bytes: &[u8] = my_str.as_ref();
 println!("as bytes: {:?}", bytes);
}
```

</RustPlayground>

---

## 6. Generic Functions with From/Into

<RustPlayground>

```rust
#[derive(Debug)]
struct Message {
 content: String,
}

// รับอะไรก็ได้ที่แปลงเป็น String ได้
impl<T: Into<String>> From<T> for Message {
 fn from(content: T) -> Self {
 Message { content: content.into() }
 }
}

fn send_message<T: Into<Message>>(msg: T) {
 let message: Message = msg.into();
 println!("Sending: {:?}", message);
}

fn main() {
 // ส่ง &str
 send_message("Hello!");
 
 // ส่ง String
 send_message(String::from("World"));
 
 // ส่ง Message โดยตรง
 send_message(Message::from("Direct"));
}
```

</RustPlayground>

---

## 7. Identity และ ตัวอย่างอื่น

<RustPlayground>

```rust
fn main() {
 // Built-in From implementations
 
 // &str -> String
 let s: String = String::from("hello");
 
 // Vec<T> -> Box<[T]>
 let v = vec![1, 2, 3];
 let boxed: Box<[i32]> = v.into();
 println!("boxed: {:?}", boxed);
 
 // Option<T> -> Result<T, ()>
 let some = Some(42);
 let ok: Result<i32, ()> = some.ok_or(());
 println!("ok: {:?}", ok);
 
 // i32 -> i64 (infallible widening)
 let small: i32 = 42;
 let big: i64 = small.into();
 println!("widened: {}", big);
 
 // char -> u32
 let c: char = 'ก';
 let code: u32 = c.into();
 println!("'ก' = U+{:04X}", code);
}
```

</RustPlayground>

---

## Quick Reference

### Infallible (ไม่ fail)
| Trait | Method | ใช้เมื่อ |
|-------|--------|--------|
| `From<T>` | `from(T)` | สร้างจาก T |
| `Into<T>` | `into()` | แปลงเป็น T |
| `AsRef<T>` | `as_ref()` | ยืมเป็น &T |
| `AsMut<T>` | `as_mut()` | ยืมเป็น &mut T |

### Fallible (อาจ fail)
| Trait | Method | ใช้เมื่อ |
|-------|--------|--------|
| `TryFrom<T>` | `try_from(T)` | แปลงที่อาจ fail |
| `TryInto<T>` | `try_into()` | แปลงที่อาจ fail |

### ความสัมพันธ์
```
From<T> > Into<T> (ได้ฟรี)
TryFrom<T> > TryInto<T> (ได้ฟรี)
```

### Pattern ที่พบบ่อย
| Pattern | ตัวอย่าง |
|---------|---------|
| String conversion | `impl From<&str> for MyType` |
| Error conversion | `impl From<io::Error> for MyError` |
| Flexible parameters | `fn f<T: AsRef<str>>(s: T)` |
| Fallible conversion | `impl TryFrom<i32> for MyType` |

---

[← Operators](./ops) | [Comparison →](./cmp)
