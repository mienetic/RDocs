# Rust Standard Library Reference

::: tip Read the Docs!
Standard Library ของ Rust มีเอกสารที่ดีมาก!
ลองเข้าไปอ่านที่ [std](https://doc.rust-lang.org/std/) เพื่อดูของเล่นทั้งหมดที่มีให้ใช้
:::tip เอกสารอ้างอิงอย่างเป็นทางการ
หน้านี้เป็นสรุปและตัวอย่างภาษาไทย สำหรับรายละเอียดเต็มดู [doc.rust-lang.org](https://doc.rust-lang.org/stable/std/)
:::

---

## พื้นฐานที่ใช้บ่อย

Types และ Collections ที่คุณจะใช้ทุกวัน ควรรู้ให้แม่น!

| Module | ใช้ทำอะไร | ตัวอย่าง |
|--------|----------|---------|
| [Vec](./vec) | เก็บข้อมูลแบบเรียงลำดับ ขยายได้ | `vec![1, 2, 3]` |
| [String](./string) | ข้อความที่แก้ไขได้ | `String::from("สวัสดี")` |
| [Option](./option) | ค่าที่อาจมีหรือไม่มี | `Some(42)` หรือ `None` |
| [Result](./result) | ผลลัพธ์ที่อาจสำเร็จหรือล้มเหลว | `Ok(data)` หรือ `Err(e)` |
| [Iterator](./iter) | วนซ้ำข้อมูลแบบ lazy | `.iter().map().filter()` |
| [Collections](./collections-ref) | HashMap, HashSet และอื่นๆ | `HashMap::new()` |
| [Formatting](./fmt) | จัดรูปแบบข้อความ | `format!("{}", x)` |
| [Clone & Copy](./clone-copy) | คัดลอกค่า | `.clone()` |

---

## Smart Pointers

| Module | ใช้ทำอะไร | ตัวอย่าง |
|--------|----------|---------|
| [Box](./box) | Heap allocation, trait objects | `Box::new(value)` |
| [Rc](./rc) | Reference counting (single-thread) | `Rc::clone(&rc)` |
| [Pin](./pin) | Pinned memory สำหรับ async | `Pin::new(&mut val)` |

---

## Async Programming

| Module | ใช้ทำอะไร | ตัวอย่าง |
|--------|----------|---------|
| [Future](./future) | Async/await programming | `async fn`, `.await` |

---

## ระบบและ I/O

จัดการไฟล์ เครือข่าย และระบบปฏิบัติการ

| Module | ใช้ทำอะไร | ตัวอย่าง |
|--------|----------|---------|
| [I/O](./io) | อ่าน-เขียนข้อมูลพื้นฐาน | `stdin().read_line()` |
| [File System](./fs) | จัดการไฟล์และโฟลเดอร์ | `fs::read_to_string()` |
| [Path](./path) | จัดการเส้นทางไฟล์ | `Path::new("/home")` |
| [Environment](./env) | ตัวแปรสภาพแวดล้อม | `env::var("HOME")` |
| [Process](./process) | รันโปรแกรมภายนอก | `Command::new("ls")` |
| [Networking](./net) | เครือข่าย TCP/UDP | `TcpListener::bind()` |
| [Time](./time) | วัดเวลาและ delay | `Instant::now()` |
| [Thread](./thread) | รัน code พร้อมกัน | `thread::spawn()` |
| [Sync](./sync) | แชร์ข้อมูลระหว่าง threads | `Arc::new(Mutex::new())` |
| [Cell](./cell) | แก้ไขค่าผ่าน shared reference | `RefCell::borrow_mut()` |

---

## Traits สำคัญ

Traits ที่กำหนดพฤติกรรมของ types

| Module | ใช้ทำอะไร | ตัวอย่าง |
|--------|----------|---------|
| [Operators](./ops) | overload operators เช่น `+`, `-` | `impl Add for Point` |
| [Convert](./convert) | แปลงระหว่าง types | `From`, `Into`, `TryFrom` |
| [Comparison](./cmp) | เปรียบเทียบค่า | `PartialEq`, `Ord` |
| [Hash](./hash) | คำนวณ hash สำหรับ HashMap | `#[derive(Hash)]` |
| [Default](./default) | ค่าเริ่มต้นของ type | `#[derive(Default)]` |
| [Borrow](./borrow) | ยืมค่าอย่างยืดหยุ่น | `Cow<str>` |
| [Memory](./mem) | ขนาดและจัดการ memory | `mem::size_of()` |
| [Pointers](./ptr) | raw pointers (unsafe) | `ptr::null()` |

---

## หัวข้อเฉพาะทาง

สำหรับกรณีพิเศษ - ไม่จำเป็นต้องรู้ทันที

| Module | ใช้ทำอะไร | ตัวอย่าง |
|--------|----------|---------|
| [Error](./error) | สร้าง custom error types | `impl Error for MyErr` |
| [Panic](./panic) | จัดการเมื่อโปรแกรมพัง | `catch_unwind()` |
| [Marker Traits](./marker) | ระบุคุณสมบัติของ type | `Send`, `Sync`, `Copy` |
| [Any](./any) | type erasure | `Box<dyn Any>` |
| [FFI](./ffi) | เชื่อมต่อกับภาษา C | `CString`, `c_char` |
| [Allocator](./alloc) | จัดการ memory ระดับต่ำ | `GlobalAlloc` |

---

## แต่ละหน้ามีอะไร?

- **คำอธิบายภาษาไทย** - เข้าใจง่าย ไม่ซับซ้อน
- **ตัวอย่างที่รันได้** - ลองเล่นใน Rust Playground
- **Comment ภาษาไทย** - ทุก line มีคำอธิบาย
- **Quick Reference** - ตารางสรุปสั้นกระชับ
- **Common Patterns** - วิธีใช้งานที่พบบ่อย

---

## เริ่มต้นจากไหนดี?

| ระดับ | แนะนำให้อ่าน |
|-------|-------------|
| มือใหม่ | `Vec` → `String` → `Option` → `Result` |
| เขียน Rust ได้บ้าง | `Iterator` → `Collections` → `Box` → `Rc` |
| อยากเข้าใจลึก | `Clone & Copy` → `Traits` ทั้งหมด |
| Async | `Future` → `Pin` |
| ต้องการเฉพาะทาง | เลือกตามงานที่ต้องทำ |

---

**รวม 37 หน้า** - ครอบคลุมทุกส่วนสำคัญของ Rust Standard Library! 

