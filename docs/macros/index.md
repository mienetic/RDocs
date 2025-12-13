# Macros - มาโครใน Rust

Rust มี **macros** ที่ทรงพลังสำหรับ metaprogramming! 

---

## Macros คืออะไร?

Macros คือ code ที่ generate code:
- **ดูเหมือน function** แต่จบด้วย `!`
- **ทำงานตอน compile** ไม่ใช่ runtime
::: warning
**อย่าใช้ Macros พร่ำเพรื่อ**
Macros ทำให้ Debug ยากและ Compilation ช้าลง
ให้ใช้ Function ปกติถ้าทำได้ และใช้ Macros เฉพาะเมื่อจำเป็นจริงๆ (เช่นต้องการรับ argument ไม่จำกัด หรือต้องการ meta-programming)
:::
- **สร้าง code อัตโนมัติ** จาก patterns

---

## รายการ Macros ทั้งหมด

### Output Macros
| Macro | คำอธิบาย |
|-------|---------|
| `println!` | พิมพ์ + ขึ้นบรรทัดใหม่ |
| `print!` | พิมพ์ไม่ขึ้นบรรทัด |
| `eprintln!` | พิมพ์ error ไป stderr |
| `eprint!` | พิมพ์ error ไม่ขึ้นบรรทัด |

 **[ดูเพิ่มเติม](./output)**

---

### Formatting Macros
| Macro | คำอธิบาย |
|-------|---------|
| `format!` | สร้าง String |
| `write!` | เขียนลง buffer |
| `writeln!` | เขียนลง buffer + newline |
| `format_args!` | Zero-allocation formatting |

 **[ดูเพิ่มเติม](./formatting)**

---

### Assertion Macros
| Macro | คำอธิบาย |
|-------|---------|
| `assert!` | ตรวจสอบ condition |
| `assert_eq!` | ตรวจสอบเท่ากัน |
| `assert_ne!` | ตรวจสอบไม่เท่ากัน |
| `debug_assert!` | assert เฉพาะ debug mode |
| `debug_assert_eq!` | assert_eq debug mode |
| `debug_assert_ne!` | assert_ne debug mode |

 **[ดูเพิ่มเติม](./assertions)**

---

### Debugging Macros
| Macro | คำอธิบาย |
|-------|---------|
| `dbg!` | Debug พิมพ์ค่า + file:line |
| `todo!` | ยังไม่ได้ implement |
| `unimplemented!` | ไม่วางแผนจะ implement |
| `unreachable!` | ไม่ควรมาถึงจุดนี้ |
| `panic!` | หยุดโปรแกรมทันที |

 **[ดูเพิ่มเติม](./debugging)** | **[panic!](./panic)**

---

### Data Macros
| Macro | คำอธิบาย |
|-------|---------|
| `vec!` | สร้าง Vec |
| `matches!` | ตรวจสอบ pattern |

 **[ดูเพิ่มเติม](./data)**

---

### Compile-time Macros
| Macro | คำอธิบาย |
|-------|---------|
| `cfg!` | ตรวจ compile config |
| `env!` | อ่าน env var (ต้องมี) |
| `option_env!` | อ่าน env var (Option) |
| `file!` | ชื่อไฟล์ปัจจุบัน |
| `line!` | เลขบรรทัดปัจจุบัน |
| `column!` | เลข column ปัจจุบัน |
| `module_path!` | ชื่อ module |
| `stringify!` | Expression เป็น &str |
| `concat!` | รวม string literals |
| `include!` | รวม Rust code |
| `include_str!` | รวมไฟล์เป็น &str |
| `include_bytes!` | รวมไฟล์เป็น &[u8] |
| `compile_error!` | สร้าง compile error |
| `thread_local!` | Thread-local storage |

 **[ดูเพิ่มเติม](./compile-time)**

---

## Quick Reference

| Macro | ตัวอย่าง |
|-------|---------|
| `println!` | `println!("x = {}", x);` |
| `format!` | `let s = format!("x = {}", x);` |
| `assert!` | `assert!(x > 0);` |
| `assert_eq!` | `assert_eq!(a, b);` |
| `dbg!` | `dbg!(x);` |
| `vec!` | `let v = vec![1, 2, 3];` |
| `matches!` | `matches!(x, Some(_))` |
| `panic!` | `panic!("error!");` |
| `cfg!` | `if cfg!(debug_assertions) {}` |
| `env!` | `env!("CARGO_PKG_NAME")` |
| `file!` | `println!("{}", file!());` |
| `line!` | `println!("{}", line!());` |

---

[← กลับหน้าหลัก](/)
