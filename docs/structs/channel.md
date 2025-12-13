# Channel Structs - การส่งข้อมูลระหว่าง Threads

`Sender`, `Receiver`, `SyncSender` สำหรับ message passing! 

---

## mpsc คืออะไร?

**mpsc** = Multiple Producer, Single Consumer
- หลาย thread ส่งข้อมูลได้ (Sender clone ได้)
- มี thread เดียวรับ (Receiver clone ไม่ได้)

---

## สร้าง Channel อย่างง่าย

<RustPlayground>

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
 // สร้าง channel - ได้ (sender, receiver)
 let (tx, rx) = mpsc::channel();
 
 // ส่งจาก thread ใหม่
 thread::spawn(move || {
 let messages = vec!["สวัสดี", "จาก", "thread", "อื่น"];
 for msg in messages {
 tx.send(msg).unwrap();
 println!("ส่ง: {}", msg);
 }
 });
 
 // รับใน main thread
 println!("\n== รอรับข้อความ ==");
 for received in rx {
 println!("รับ: {}", received);
 }
}
```

</RustPlayground>

---

## Multiple Senders - หลาย Thread ส่ง

<RustPlayground>

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
 let (tx, rx) = mpsc::channel();
 
 // สร้างหลาย senders ด้วย clone()
 for id in 0..3 {
 let tx_clone = tx.clone();
 thread::spawn(move || {
 for i in 0..2 {
 let msg = format!("Thread {} ส่ง #{}", id, i);
 tx_clone.send(msg).unwrap();
 thread::sleep(Duration::from_millis(50));
 }
 });
 }
 
 // สำคัญ! drop original sender
 drop(tx);
 
 // รับทั้งหมด
 for msg in rx {
 println!("{}", msg);
 }
 
 println!("เสร็จสิ้น!");
}
```

</RustPlayground>

---

## sync_channel - Bounded Channel

<RustPlayground>

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
 // bounded channel - buffer = 2
 // ถ้า buffer เต็ม จะ block จนกว่าจะมีที่ว่าง
 let (tx, rx) = mpsc::sync_channel(2);
 
 thread::spawn(move || {
 for i in 1..=5 {
 println!("กำลังส่ง {}...", i);
 tx.send(i).unwrap();
 println!("ส่ง {} แล้ว!", i);
 }
 });
 
 // รอนานๆ ก่อนรับ - sender จะถูก block
 thread::sleep(Duration::from_millis(200));
 
 for msg in rx {
 println!("รับ: {}", msg);
 thread::sleep(Duration::from_millis(100));
 }
}
```

</RustPlayground>

---

## Non-blocking Operations

<RustPlayground>

```rust
use std::sync::mpsc;
use std::time::Duration;

fn main() {
 let (tx, rx) = mpsc::channel();
 
 // try_recv - ไม่ block
 match rx.try_recv() {
 Ok(msg) => println!("ได้: {}", msg),
 Err(_) => println!("ยังไม่มีข้อความ!"),
 }
 
 // ส่งข้อมูล
 tx.send("Hello!").unwrap();
 tx.send("World!").unwrap();
 
 // recv_timeout - block + timeout
 match rx.recv_timeout(Duration::from_millis(100)) {
 Ok(msg) => println!("ได้: {}", msg),
 Err(_) => println!("Timeout!"),
 }
 
 // try_recv อีกครั้ง
 while let Ok(msg) = rx.try_recv() {
 println!("ได้อีก: {}", msg);
 }
}
```

</RustPlayground>

---

## Quick Reference

### Types
| Type | คำอธิบาย | Clone |
|------|---------|-------|
| `Sender<T>` | ส่งข้อมูล | |
| `Receiver<T>` | รับข้อมูล | |
| `SyncSender<T>` | ส่งแบบ bounded | |

### Functions
| Function | คำอธิบาย |
|----------|---------|
| `channel()` | สร้าง unbounded channel |
| `sync_channel(n)` | สร้าง bounded channel (buffer n) |

### Sender Methods
| Method | คำอธิบาย |
|--------|---------|
| `send(v)` | ส่งข้อมูล (block ถ้า bounded เต็ม) |
| `clone()` | สร้าง sender ใหม่ |

### Receiver Methods
| Method | Block? | คำอธิบาย |
|--------|--------|---------|
| `recv()` | | รอจนได้ข้อมูล |
| `try_recv()` | | ไม่รอ return ทันที |
| `recv_timeout(d)` | | รอไม่เกิน d |
| `iter()` | | วนรับจนปิด |

---

[← Range](./range) | [Error →](./error)
