# Borrow - ยืมข้อมูล

**std::borrow** มี traits สำหรับจัดการการยืมข้อมูลอย่างยืดหยุ่น! 

---

## borrow มีอะไร?

| Type/Trait | ใช้ทำอะไร |
|------------|---------|
| `Borrow<T>` | ยืมเป็น &T |
| `BorrowMut<T>` | ยืมเป็น &mut T |
| `ToOwned` | สร้าง owned copy |
| `Cow<T>` | Clone on Write |

---

## 1. Borrow Trait

<RustPlayground>

```rust
use std::borrow::Borrow;
use std::collections::HashMap;

fn main() {
 let mut map: HashMap<String, i32> = HashMap::new();
 map.insert("hello".to_string(), 1);
 map.insert("world".to_string(), 2);
 
 // HashMap.get รับ Borrow<K>
 // ดังนั้นใช้ &str ค้นหา String key ได้!
 let key: &str = "hello";
 println!("get with &str: {:?}", map.get(key));
 
 // หรือใช้ String ก็ได้
 let key2 = String::from("world");
 println!("get with String: {:?}", map.get(&key2));
 
 // เปรียบเทียบ: ถ้าไม่มี Borrow
 // map.get(&"hello".to_string()) // ต้อง allocate String ใหม่!
}
```

</RustPlayground>

---

## 2. Implement Borrow

<RustPlayground>

```rust
use std::borrow::Borrow;
use std::hash::{Hash, Hasher};

#[derive(Debug, Eq)]
struct CaseInsensitiveString(String);

// Hash ต้องตรงกับ Borrow
impl Hash for CaseInsensitiveString {
 fn hash<H: Hasher>(&self, state: &mut H) {
 self.0.to_lowercase().hash(state);
 }
}

impl PartialEq for CaseInsensitiveString {
 fn eq(&self, other: &Self) -> bool {
 self.0.to_lowercase() == other.0.to_lowercase()
 }
}

// Borrow<str> ให้ค้นหาด้วย &str ได้
impl Borrow<str> for CaseInsensitiveString {
 fn borrow(&self) -> &str {
 &self.0
 }
}

fn main() {
 use std::collections::HashSet;
 
 let mut set: HashSet<CaseInsensitiveString> = HashSet::new();
 set.insert(CaseInsensitiveString("Hello".to_string()));
 
 // ค้นหาด้วย &str
 // หมายเหตุ: case-insensitive hashing ต้องระวังเรื่อง consistency
 println!("Contains 'Hello': {}", set.contains("Hello"));
}
```

</RustPlayground>

---

## 3. ToOwned Trait

<RustPlayground>

```rust
use std::borrow::ToOwned;

fn main() {
 // ToOwned แปลง borrowed -> owned
 
 // &str -> String
 let s: &str = "hello";
 let owned: String = s.to_owned();
 println!("owned String: {}", owned);
 
 // &[T] -> Vec<T>
 let slice: &[i32] = &[1, 2, 3];
 let vec: Vec<i32> = slice.to_owned();
 println!("owned Vec: {:?}", vec);
 
 // &Path -> PathBuf
 use std::path::Path;
 let path: &Path = Path::new("/home/user");
 let owned_path = path.to_owned();
 println!("owned Path: {:?}", owned_path);
 
 // เปรียบเทียบ: clone vs to_owned
 let s2 = "world";
 let a = s2.to_owned(); // &str -> String (ToOwned)
 // let b = s2.clone(); // &str -> &str (Clone)
 println!("a: {}", a);
}
```

</RustPlayground>

---

## 4. Cow - Clone on Write

<RustPlayground>

```rust
use std::borrow::Cow;

fn main() {
 // Cow = ยืมได้ ถ้าต้องแก้ค่อย clone
 
 // Borrowed - ไม่ clone
 let borrowed: Cow<str> = Cow::Borrowed("hello");
 println!("borrowed: {}", borrowed);
 
 // Owned - clone แล้ว
 let owned: Cow<str> = Cow::Owned(String::from("world"));
 println!("owned: {}", owned);
 
 // ใช้งานจริง: แก้ไขเมื่อจำเป็น
 fn maybe_uppercase(s: &str) -> Cow<str> {
 if s.chars().any(|c| c.is_lowercase()) {
 // ต้องแก้ไข -> clone
 Cow::Owned(s.to_uppercase())
 } else {
 // ไม่ต้องแก้ -> ยืม
 Cow::Borrowed(s)
 }
 }
 
 let s1 = "HELLO";
 let s2 = "hello";
 
 println!("'{}' -> {} (borrowed: {})", s1, maybe_uppercase(s1), 
 matches!(maybe_uppercase(s1), Cow::Borrowed(_)));
 println!("'{}' -> {} (borrowed: {})", s2, maybe_uppercase(s2),
 matches!(maybe_uppercase(s2), Cow::Borrowed(_)));
}
```

</RustPlayground>

---

## 5. Cow Methods

<RustPlayground>

```rust
use std::borrow::Cow;

fn main() {
 let mut cow: Cow<str> = Cow::Borrowed("hello");
 
 // is_borrowed / is_owned
 println!("is_borrowed: {}", matches!(cow, Cow::Borrowed(_)));
 
 // to_mut - แปลงเป็น &mut (clone ถ้า borrowed)
 cow.to_mut().push_str(" world");
 println!("after to_mut: {}", cow);
 println!("is_owned now: {}", matches!(cow, Cow::Owned(_)));
 
 // into_owned - แปลงเป็น owned value
 let cow2: Cow<str> = Cow::Borrowed("test");
 let owned: String = cow2.into_owned();
 println!("into_owned: {}", owned);
 
 // Cow กับ Vec
 let mut cow_vec: Cow<[i32]> = Cow::Borrowed(&[1, 2, 3]);
 println!("cow_vec: {:?}", cow_vec);
 
 cow_vec.to_mut().push(4);
 println!("after push: {:?}", cow_vec);
}
```

</RustPlayground>

---

## 6. Cow ในฟังก์ชัน

<RustPlayground>

```rust
use std::borrow::Cow;

// ฟังก์ชันที่อาจ return borrowed หรือ owned
fn process_text(s: &str) -> Cow<str> {
 if s.contains("bad") {
 // ต้องแก้ไข -> return owned
 Cow::Owned(s.replace("bad", "good"))
 } else {
 // ไม่ต้องแก้ -> return borrowed
 Cow::Borrowed(s)
 }
}

fn escape_html(s: &str) -> Cow<str> {
 if s.contains('<') || s.contains('>') || s.contains('&') {
 let escaped = s
 .replace('&', "&amp;")
 .replace('<', "&lt;")
 .replace('>', "&gt;");
 Cow::Owned(escaped)
 } else {
 Cow::Borrowed(s)
 }
}

fn main() {
 println!("process 'good text': {}", process_text("good text"));
 println!("process 'bad word': {}", process_text("bad word"));
 
 println!("\nescape 'hello': {}", escape_html("hello"));
 println!("escape '<script>': {}", escape_html("<script>"));
}
```

</RustPlayground>

---

## 7. Cow กับ Path

<RustPlayground>

```rust
use std::borrow::Cow;
use std::path::{Path, PathBuf};

fn normalize_path(path: &Path) -> Cow<Path> {
 // ถ้ามี .. หรือ . ต้อง canonicalize
 let has_dots = path.components().any(|c| {
 matches!(c, std::path::Component::ParentDir | std::path::Component::CurDir)
 });
 
 if has_dots {
 // ต้องสร้าง path ใหม่
 let mut result = PathBuf::new();
 for component in path.components() {
 match component {
 std::path::Component::ParentDir => { result.pop(); }
 std::path::Component::CurDir => {}
 c => result.push(c),
 }
 }
 Cow::Owned(result)
 } else {
 Cow::Borrowed(path)
 }
}

fn main() {
 let p1 = Path::new("/home/user/docs");
 let p2 = Path::new("/home/user/../user/docs");
 
 println!("'{}' -> {}", p1.display(), normalize_path(p1).display());
 println!("'{}' -> {}", p2.display(), normalize_path(p2).display());
}
```

</RustPlayground>

---

## Quick Reference

### Traits
| Trait | From | To | Method |
|-------|------|-----|--------|
| `Borrow<T>` | `Self` | `&T` | `borrow()` |
| `BorrowMut<T>` | `Self` | `&mut T` | `borrow_mut()` |
| `ToOwned` | `&Self` | `Owned` | `to_owned()` |

### Cow Methods
| Method | คำอธิบาย |
|--------|---------|
| `Cow::Borrowed(x)` | สร้างจาก reference |
| `Cow::Owned(x)` | สร้างจาก owned |
| `to_mut()` | ได้ &mut (clone if needed) |
| `into_owned()` | ได้ owned value |

### Common Pairs
| Borrowed | Owned |
|----------|-------|
| `&str` | `String` |
| `&[T]` | `Vec<T>` |
| `&Path` | `PathBuf` |
| `&OsStr` | `OsString` |

### เมื่อไหร่ใช้ Cow
| สถานการณ์ | ใช้ |
|-----------|-----|
| ส่วนใหญ่ไม่แก้ไข | `Cow` (ประหยัด memory) |
| แก้ไขเกือบทุกครั้ง | `String`/`Vec` โดยตรง |
| อ่านอย่างเดียว | `&str`/`&[T]` |

---

[← Default](./default) | [Memory →](./mem)
