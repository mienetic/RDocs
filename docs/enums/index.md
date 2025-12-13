# Rust Enums  

Enum (Enumeration) คือ type ที่กำหนดค่าได้หลายแบบ เป็นหนึ่งใน features ที่ทรงพลังที่สุดของ Rust!

---

## Enum คืออะไร?

Enum ต่างจากภาษาอื่นตรงที่:

::: best-practice
**Option vs Result**
*   ใช้ `Option<T>` เมื่อค่า "อาจจะไม่มี" (Nullable)
*   ใช้ `Result<T, E>` เมื่อการทำงาน "อาจจะล้มเหลว" (Error Handling)
อย่าใช้ `Result` เพื่อบอกว่าไม่มีค่า (ให้ใช้ `None` แทน)
:::

::: tip
**Empty Enum (Void Type)**
`enum Void {}` ไม่สามารถสร้าง instance ได้
มีประโยชน์สำหรับการบอกว่า "สิ่งนี้ไม่มีวันเกิดขึ้น" (เช่น `Result<T, Void>`)
:::

- แต่ละ variant สามารถมี data ต่างกันได้
- ใช้ร่วมกับ pattern matching ได้อย่างทรงพลัง
- Compiler ตรวจสอบว่า handle ทุก variant

---

## หมวดหมู่ Enums

### Core Enums
| Enum | คำอธิบาย |
|------|---------|
| `Option` | ค่าที่มีหรือไม่มี |
| `Result` | ผลลัพธ์ที่อาจสำเร็จหรือล้มเหลว |

 **[ดูเพิ่มเติม](./core)**

---

### Comparison & Control
| Enum | คำอธิบาย |
|------|---------|
| `Ordering` | ผลเปรียบเทียบ (Less, Equal, Greater) |
| `ControlFlow` | ควบคุม loop (Break, Continue) |
| `Bound` | ขอบเขต range |

 **[ดูเพิ่มเติม](./cmp)**

---

### Collections
| Enum | คำอธิบาย |
|------|---------|
| `Entry` | slot ใน HashMap/BTreeMap |

 **[ดูเพิ่มเติม](./collections)**

---

### I/O
| Enum | คำอธิบาย |
|------|---------|
| `ErrorKind` | ประเภท I/O error |
| `SeekFrom` | ตำแหน่ง seek |

 **[ดูเพิ่มเติม](./io)**

---

### Network
| Enum | คำอธิบาย |
|------|---------|
| `IpAddr` | IPv4 หรือ IPv6 |
| `SocketAddr` | IP + Port |
| `Shutdown` | ปิด connection |

 **[ดูเพิ่มเติม](./net)**

---

### Async
| Enum | คำอธิบาย |
|------|---------|
| `Poll` | สถานะ Future |

 **[ดูเพิ่มเติม](./async)**

---

### Channel
| Enum | คำอธิบาย |
|------|---------|
| `TryRecvError` | Error เมื่อรับไม่ได้ |
| `TrySendError` | Error เมื่อส่งไม่ได้ |
| `RecvTimeoutError` | Timeout เมื่อรับ |

 **[ดูเพิ่มเติม](./channel)**

---

### Convert
| Enum | คำอธิบาย |
|------|---------|
| `Infallible` | Error type ที่ไม่มีทาง fail |

 **[ดูเพิ่มเติม](./convert)**

---

### Path
| Enum | คำอธิบาย |
|------|---------|
| `Component` | ส่วนประกอบของ path |
| `Prefix` | Drive prefix (Windows) |

 **[ดูเพิ่มเติม](./path-enum)**

---

### Env
| Enum | คำอธิบาย |
|------|---------|
| `VarError` | Error เมื่ออ่าน env var |

 **[ดูเพิ่มเติม](./env-enum)**

---

### Atomic
| Enum | คำอธิบาย |
|------|---------|
| `Ordering` | Memory ordering สำหรับ atomics |

 **[ดูเพิ่มเติม](./atomic)**

---

### Num
| Enum | คำอธิบาย |
|------|---------|
| `FpCategory` | ประเภท floating point |
| `IntErrorKind` | Error เมื่อ parse int |

 **[ดูเพิ่มเติม](./num-enum)**

---

### Fmt
| Enum | คำอธิบาย |
|------|---------|
| `Alignment` | Left, Right, Center |

 **[ดูเพิ่มเติม](./fmt-enum)**

---

## Quick Reference

| Enum | Variants | ตัวอย่าง |
|------|----------|---------|
| `Option<T>` | `Some(T)`, `None` | `Some(42)` |
| `Result<T, E>` | `Ok(T)`, `Err(E)` | `Ok("success")` |
| `Ordering` | `Less`, `Equal`, `Greater` | `1.cmp(&2)` |
| `Poll<T>` | `Ready(T)`, `Pending` | async polling |

---

[← กลับหน้าหลัก](/)
