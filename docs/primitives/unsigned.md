# Unsigned Integers - ตัวเลขไม่ติดลบ

Rust มี **unsigned integers** สำหรับค่าที่ไม่เป็นลบ! 

---

## Unsigned Integers คืออะไร?

ตัวเลขจำนวนเต็มที่ไม่มีเครื่องหมาย (0 ขึ้นไปเท่านั้น):
- ใช้ทุก bit เก็บค่า (ไม่เสีย bit สำหรับเครื่องหมาย)
- ช่วงค่า: `0` ถึง `2^n - 1`

| Type | ขนาด | ช่วงค่า |
|------|------|---------|
| `u8` | 1 byte | 0 ถึง 255 |
| `u16` | 2 bytes | 0 ถึง 65,535 |
| `u32` | 4 bytes | 0 ถึง ~4.3 พันล้าน |
| `u64` | 8 bytes | 0 ถึง ~18.4 x 10^18 |
| `u128` | 16 bytes | ใหญ่มาก! |
| `usize` | platform | ใช้กับ index |

---

## 1. การประกาศ

<RustPlayground>

```rust
fn main() {
 // ระบุ type
 let a: u8 = 255; // max u8
 let b: u16 = 65535; // max u16
 let c: u32 = 1_000_000;
 let d: u64 = 1_000_000_000_000;
 let e: u128 = 1_000_000_000_000_000_000;
 
 // usize ใช้กับ index
 let index: usize = 10;
 
 println!("u8: {}", a);
 println!("u16: {}", b);
 println!("u32: {}", c);
 println!("u64: {}", d);
 println!("u128: {}", e);
 println!("usize: {}", index);
}
```

</RustPlayground>

---

## 2. ใช้กับ Index

<RustPlayground>

```rust
fn main() {
 let arr = [10, 20, 30, 40, 50];
 
 // Index ต้องเป็น usize
 let i: usize = 2;
 println!("arr[{}] = {}", i, arr[i]);
 
 // len() return usize
 let len: usize = arr.len();
 println!("len = {}", len);
 
 // วนลูปด้วย index
 for i in 0..arr.len() {
 println!("arr[{}] = {}", i, arr[i]);
 }
}
```

</RustPlayground>

---

## 3. Byte Operations (u8)

<RustPlayground>

```rust
fn main() {
 // u8 ใช้แทน bytes
 let byte: u8 = 0xFF; // 255
 
 // ASCII
 let ascii_a: u8 = b'A'; // 65
 let ascii_z: u8 = b'z'; // 122
 println!("'A' = {}, 'z' = {}", ascii_a, ascii_z);
 
 // Byte string
 let bytes: &[u8] = b"Hello";
 println!("bytes: {:?}", bytes);
 
 // แปลง char เป็น ASCII
 let c = 'A';
 if c.is_ascii() {
 println!("'{}' as u8 = {}", c, c as u8);
 }
}
```

</RustPlayground>

---

## 4. Bitwise Operations

<RustPlayground>

```rust
fn main() {
 let a: u8 = 0b1010_1010; // 170
 let b: u8 = 0b1100_1100; // 204
 
 println!("a = {:08b} ({})", a, a);
 println!("b = {:08b} ({})", b, b);
 
 // Bitwise AND
 println!("a & b = {:08b}", a & b);
 
 // Bitwise OR
 println!("a | b = {:08b}", a | b);
 
 // Bitwise XOR
 println!("a ^ b = {:08b}", a ^ b);
 
 // Bitwise NOT
 println!("!a = {:08b}", !a);
 
 // Left shift
 println!("a << 2 = {:08b}", a << 2);
 
 // Right shift
 println!("a >> 2 = {:08b}", a >> 2);
}
```

</RustPlayground>

---

## 5. Useful Methods

<RustPlayground>

```rust
fn main() {
 let x: u32 = 42;
 
 // Power
 println!("2^10 = {}", 2u32.pow(10)); // 1024
 
 // Bit manipulation
 let y: u32 = 0b1010_1100;
 println!("count_ones = {}", y.count_ones()); // 4
 println!("leading_zeros = {}", y.leading_zeros());
 println!("trailing_zeros = {}", y.trailing_zeros());
 
 // Next power of 2
 let z: u32 = 100;
 println!("next_power_of_two(100) = {}", z.next_power_of_two()); // 128
 
 // Check power of 2
 println!("128.is_power_of_two() = {}", 128u32.is_power_of_two()); // true
 println!("100.is_power_of_two() = {}", 100u32.is_power_of_two()); // false
 
 // Rotate bits
 let r: u8 = 0b1010_0000;
 println!("rotate_left(2) = {:08b}", r.rotate_left(2));
 println!("rotate_right(2) = {:08b}", r.rotate_right(2));
}
```

</RustPlayground>

---

## 6. Conversion

<RustPlayground>

```rust
fn main() {
 // u8 -> larger types (always safe)
 let byte: u8 = 200;
 let bigger: u32 = byte.into();
 println!("u8 {} -> u32 {}", byte, bigger);
 
 // signed -> unsigned (be careful!)
 let signed: i32 = -1;
 let unsigned: u32 = signed as u32; // wraps!
 println!("i32 {} as u32 = {}", signed, unsigned);
 
 // Parse from string
 let num: u32 = "42".parse().unwrap();
 println!("parsed: {}", num);
 
 // Parse with radix
 let hex = u32::from_str_radix("FF", 16).unwrap();
 println!("0xFF = {}", hex); // 255
}
```

</RustPlayground>

---

## Quick Reference

### Constants
| Constant | ค่า (u32) |
|----------|----------|
| `u32::MIN` | 0 |
| `u32::MAX` | 4,294,967,295 |
| `u32::BITS` | 32 |

### เมื่อไหร่ใช้ Unsigned
| ใช้ unsigned | ใช้ signed |
|--------------|-----------|
| Index, length | ค่าที่อาจติดลบ |
| Byte sequences | Temperature |
| Bitwise ops | Offsets/deltas |
| Ages, counts | Differences |

### Bitwise Operators
| Operator | คำอธิบาย |
|----------|---------|
| `&` | AND |
| `\|` | OR |
| `^` | XOR |
| `!` | NOT |
| `<<` | Left shift |
| `>>` | Right shift |

---

[← Integers](./integers) | [Floats →](./floats)
