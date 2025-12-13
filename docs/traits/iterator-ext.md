# Advanced Iterators

`DoubleEndedIterator`, `ExactSizeIterator`, `Extend` สำหรับการจัดการ Iteration ขั้นสูง! 

---

## DoubleEndedIterator

Iterator ที่วนได้ทั้งหน้าและหลัง (เช่น `rev()`)

<RustPlayground>

```rust
fn main() {
 let numbers = vec![1, 2, 3, 4, 5];
 
 // Iterator ปกติ
 let mut iter = numbers.iter();
 
 // next() จากข้างหน้า
 println!("Front: {:?}", iter.next()); // 1
 
 // next_back() จากข้างหลัง
 println!("Back: {:?}", iter.next_back()); // 5
 
 // วนที่เหลือแบบ reverse
 println!("Remaining reversed:");
 for val in iter.rev() {
 println!("{}", val); // 4, 3, 2
 }
}
```

</RustPlayground>

---

## ExactSizeIterator

Iterator ที่รู้ความยาวแน่นอน ทำให้จอง memory ได้พอดี

<RustPlayground>

```rust
fn main() {
 let data = vec![1, 2, 3];
 let iter = data.iter();
 
 // len() มีเฉพาะใน ExactSizeIterator
 println!("Length: {}", iter.len());
 
 // (lower, upper) bound
 println!("Size hint: {:?}", iter.size_hint());
}
```

</RustPlayground>

---

## Extend Trait

`Extend` ช่วยให้ collection สามารถรับ items จาก iterator มาต่อท้ายได้

<RustPlayground>

```rust
fn main() {
 let mut data = vec![1, 2];
 let more = vec![3, 4, 5];
 
 // Extend ด้วย vector อื่น
 data.extend(more);
 
 // Extend ด้วย range
 data.extend(6..8);
 
 println!("Data: {:?}", data);
}
```

</RustPlayground>

---

## Quick Reference

### Specialized Iterators
| Trait | Method | คำอธิบาย |
|-------|--------|---------|
| `DoubleEndedIterator` | `next_back()` | วนจากท้ายได้ |
| `ExactSizeIterator` | `len()` | รู้จำนวนที่แน่นอน |
| `FusedIterator` | - | รับประกันว่าจะ return None ตลอดหลังจบ |
| `Extend` | `extend()` | เพิ่มข้อมูลจาก iterator |

---

[← Any](./any) | [Index →](./index)
