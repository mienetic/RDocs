# Rust Standard Library Functions

รวม Functions สำคัญที่ใช้บ่อยใน Rust Standard Library!
::: tip
**Diverging Functions (`!`)**
Function ที่ไม่มีวัน Return (เช่น `loop`, `panic!`, `process::exit`) จะมี return type เป็น `!` (Never Type)
มันสามารถใช้แทนที่ type อะไรก็ได้ (เพราะมันไม่มีวันเกิดขึ้นจริง)
:::

---

## หมวดหมู่

### Memory Functions
- [mem::size_of](./mem#size_of) - ขนาดของ type
- [mem::swap](./mem#swap) - สลับค่า 2 ตัวแปร
- [mem::take](./mem#take) - ดึงค่าออกแทนที่ด้วย default
- [mem::replace](./mem#replace) - แทนที่ค่าและ return ค่าเดิม
- [mem::drop](./mem#drop) - Drop ค่าทันที

### File System Functions
- [fs::read](./fs#read) - อ่านไฟล์เป็น bytes
- [fs::read_to_string](./fs#read_to_string) - อ่านไฟล์เป็น String
- [fs::write](./fs#write) - เขียนไฟล์
- [fs::copy](./fs#copy) - คัดลอกไฟล์
- [fs::create_dir_all](./fs#create_dir_all) - สร้าง directories

### Environment Functions
- [env::args](./env#args) - Command line arguments
- [env::var](./env#var) - อ่าน environment variable
- [env::current_dir](./env#current_dir) - Current directory
- [env::temp_dir](./env#temp_dir) - Temporary directory

### Thread Functions
- [thread::spawn](./thread#spawn) - สร้าง thread ใหม่
- [thread::sleep](./thread#sleep) - หยุดพัก thread
- [thread::current](./thread#current) - Thread ปัจจุบัน
- [thread::park](./thread#park) - พัก thread

### Compare Functions
- [cmp::min](./cmp#min) - ค่าน้อยกว่า
- [cmp::max](./cmp#max) - ค่ามากกว่า
- [cmp::minmax](./cmp#minmax) - ทั้ง min และ max

### Convert Functions
- [convert::identity](../std/convert#identity) - Return input ไม่เปลี่ยน

### Future Functions
- [future::ready](./future#ready) - Future ที่พร้อมทันที
- [future::pending](./future#pending) - Future ที่ไม่ resolve
- [future::poll_fn](./future#poll_fn) - สร้าง Future จาก closure

### I/O Functions
- [io::stdin](./io#stdin) - Standard Input
- [io::stdout](./io#stdout) - Standard Output
- [io::stderr](./io#stderr) - Standard Error
- [io::copy](./io#copy) - คัดลอก bytes

### Process Functions
- [process::exit](./process#exit) - ออกจาก Process
- [process::abort](./process#abort) - ยกเลิก Process ทันที
- [process::id](./process#id) - Process ID

### Pointer Functions
- [ptr::null](./ptr#null) - Null Pointer
- [ptr::read](./ptr#read) - อ่านค่าผ่าน Pointer
- [ptr::write](./ptr#write) - เขียนค่าผ่าน Pointer

### Iterator Functions
- [iter::once](./iter#once) - Iterator 1 ค่า
- [iter::empty](./iter#empty) - Iterator ว่าง
- [iter::repeat](./iter#repeat) - ค่าเดิมซ้ำๆ
- [iter::from_fn](./iter#from_fn) - จาก closure

### Panic Functions
- [panic::catch_unwind](./panic#catch_unwind) - จับ panic
- [panic::set_hook](./panic#set_hook) - ตั้ง panic handler

### Any Functions
- [any::type_name](./any#type_name) - ชื่อ Type
- [any::type_name_of_val](./any#type_name_of_val) - ชื่อจากค่า

### Hint Functions
- [hint::black_box](./hint#black_box) - ป้องกัน optimization
- [hint::spin_loop](./hint#spin_loop) - Busy-wait hint

### String Functions
- [str::from_utf8](./str#from_utf8) - bytes → &str
- [str::from_utf8_unchecked](./str#from_utf8_unchecked) - unsafe แปลง

### Char Functions
- [char::from_u32](./char#from_u32) - u32 → char
- [char::from_digit](./char#from_digit) - digit → char

### Format Functions
- [fmt::format](./fmt#format) - สร้าง formatted String
- [fmt::write](./fmt#write) - เขียนลง buffer

---

## Quick Reference

| Module | Functions | คำอธิบาย |
|--------|-----------|---------|
| `std::mem` | size_of, swap, take, replace | Memory operations |
| `std::fs` | read, write, copy, remove_file | File system |
| `std::env` | args, var, current_dir | Environment |
| `std::thread` | spawn, sleep, current | Threading |
| `std::cmp` | min, max, minmax | Comparison |
| `std::future` | ready, pending, poll_fn | Async |
