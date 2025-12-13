# Rust Traits  

Traits คือ interfaces ของ Rust - กำหนด behavior ที่ types ต้อง implement!

---

## Trait คืออะไร?
::: tip
**Marker Traits**
Traits บางตัวไม่มี method (เช่น `Send`, `Sync`, `Copy`, `Sized`) แต่มีความหมายสำคัญกับ Compiler
เรียกว่า "Marker Traits" ใช้บอกคุณสมบัติของ Type นั้นๆ
:::
- คล้าย interface ในภาษาอื่น
- ใช้ derive สำหรับ traits พื้นฐาน
- สร้าง polymorphism และ generics

---

## หมวดหมู่ Traits

### Core Traits
| Trait | คำอธิบาย |
|-------|---------|
| `Clone` | สร้างสำเนา (explicit) |
| `Copy` | สำเนาอัตโนมัติ |
| `Default` | ค่าเริ่มต้น |
| `Drop` | cleanup เมื่อถูก drop |

 **[ดูเพิ่มเติม](./core)**

---

### Comparison Traits
| Trait | คำอธิบาย |
|-------|---------|
| `Eq`, `PartialEq` | เปรียบเทียบเท่ากัน |
| `Ord`, `PartialOrd` | เปรียบเทียบลำดับ |
| `Hash` | สร้าง hash value |

 **[ดูเพิ่มเติม](./comparison)**

---

### Conversion Traits
| Trait | คำอธิบาย |
|-------|---------|
| `From`, `Into` | แปลง type |
| `TryFrom`, `TryInto` | แปลงที่อาจ fail |
| `AsRef`, `AsMut` | borrow เป็น type อื่น |
| `Deref`, `DerefMut` | dereference |

 **[ดูเพิ่มเติม](./conversion)**

---

### Iterator Traits
| Trait | คำอธิบาย |
|-------|---------|
| `Iterator` | วน loop items |
| `IntoIterator` | แปลงเป็น iterator |
| `FromIterator` | สร้างจาก iterator |

 **[ดูเพิ่มเติม](./iterator)**

---

### Display Traits
| Trait | คำอธิบาย |
|-------|---------|
| `Debug` | แสดงผลสำหรับ debug |
| `Display` | แสดงผลสำหรับ user |

 **[ดูเพิ่มเติม](./display)**

---

### I/O Traits
| Trait | คำอธิบาย |
|-------|---------|
| `Read` | อ่านข้อมูล |
| `Write` | เขียนข้อมูล |
| `Seek` | เลื่อนตำแหน่ง |
| `BufRead` | อ่านแบบ buffered |

 **[ดูเพิ่มเติม](./io)**

---

### Concurrency Traits
| Trait | คำอธิบาย |
|-------|---------|
| `Send` | ส่งข้าม threads ได้ |
| `Sync` | share ข้าม threads ได้ |

 **[ดูเพิ่มเติม](./concurrency)**

---

## Quick Reference

| Trait | Derivable | ตัวอย่าง |
|-------|-----------|---------|
| `Clone` | | `#[derive(Clone)]` |
| `Copy` | | `#[derive(Copy, Clone)]` |
| `Debug` | | `#[derive(Debug)]` |
| `Default` | | `#[derive(Default)]` |
| `PartialEq` | | `#[derive(PartialEq)]` |
| `Eq` | | `#[derive(Eq)]` |
| `PartialOrd` | | `#[derive(PartialOrd)]` |
| `Ord` | | `#[derive(Ord)]` |
| `Hash` | | `#[derive(Hash)]` |

---

[← กลับหน้าหลัก](/)
