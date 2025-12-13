# Channel Enums

`TryRecvError`, `TrySendError`, `RecvTimeoutError` สำหรับ mpsc channels! 

---

## TryRecvError - Error เมื่อ try_recv

<RustPlayground>

```rust
use std::sync::mpsc::{self, TryRecvError};
use std::thread;
use std::time::Duration;

fn main() {
 let (tx, rx) = mpsc::channel();
 
 // TryRecvError variants
 match rx.try_recv() {
 Ok(msg) => println!("Got: {}", msg),
 Err(TryRecvError::Empty) => {
 println!("Channel is empty (no message yet)");
 }
 Err(TryRecvError::Disconnected) => {
 println!("Sender has been dropped");
 }
 }
 
 // ส่งข้อความ
 tx.send("Hello").unwrap();
 
 match rx.try_recv() {
 Ok(msg) => println!("Got: {}", msg),
 Err(e) => println!("Error: {:?}", e),
 }
 
 // Drop sender
 drop(tx);
 
 match rx.try_recv() {
 Ok(msg) => println!("Got: {}", msg),
 Err(TryRecvError::Empty) => println!("Empty"),
 Err(TryRecvError::Disconnected) => println!("Disconnected!"),
 }
}
```

</RustPlayground>

---

## RecvTimeoutError

<RustPlayground>

```rust
use std::sync::mpsc::{self, RecvTimeoutError};
use std::time::Duration;
use std::thread;

fn main() {
 let (tx, rx) = mpsc::channel::<i32>();
 
 // RecvTimeoutError variants
 let result = rx.recv_timeout(Duration::from_millis(100));
 
 match result {
 Ok(msg) => println!("Got: {}", msg),
 Err(RecvTimeoutError::Timeout) => {
 println!("Timed out after 100ms");
 }
 Err(RecvTimeoutError::Disconnected) => {
 println!("Sender disconnected");
 }
 }
 
 // Test disconnected
 drop(tx);
 
 match rx.recv_timeout(Duration::from_millis(100)) {
 Ok(_) => println!("Got message"),
 Err(RecvTimeoutError::Timeout) => println!("Timeout"),
 Err(RecvTimeoutError::Disconnected) => println!("Disconnected!"),
 }
}
```

</RustPlayground>

---

## TrySendError - Error เมื่อ try_send

<RustPlayground>

```rust
use std::sync::mpsc::{self, TrySendError};

fn main() {
 // sync_channel มี bounded buffer
 let (tx, rx) = mpsc::sync_channel::<i32>(1);
 
 // ส่งครั้งแรก - สำเร็จ
 match tx.try_send(1) {
 Ok(()) => println!("Sent 1"),
 Err(e) => println!("Error: {:?}", e),
 }
 
 // ส่งครั้งที่สอง - buffer เต็ม!
 match tx.try_send(2) {
 Ok(()) => println!("Sent 2"),
 Err(TrySendError::Full(msg)) => {
 println!("Buffer full! Message {} not sent", msg);
 }
 Err(TrySendError::Disconnected(msg)) => {
 println!("Disconnected! Message {} lost", msg);
 }
 }
 
 // รับ 1 ตัว
 println!("Received: {}", rx.recv().unwrap());
 
 // ตอนนี้ส่งได้
 tx.try_send(2).unwrap();
 println!("Sent 2 successfully");
 
 // Drop receiver
 drop(rx);
 
 match tx.try_send(3) {
 Ok(()) => println!("Sent"),
 Err(TrySendError::Full(_)) => println!("Full"),
 Err(TrySendError::Disconnected(msg)) => {
 println!("Disconnected! Lost: {}", msg);
 }
 }
}
```

</RustPlayground>

---

## Quick Reference

### TryRecvError
| Variant | คำอธิบาย |
|---------|---------|
| `Empty` | ไม่มีข้อความใน channel |
| `Disconnected` | Sender ถูก drop แล้ว |

### RecvTimeoutError
| Variant | คำอธิบาย |
|---------|---------|
| `Timeout` | หมดเวลาที่กำหนด |
| `Disconnected` | Sender ถูก drop แล้ว |

### TrySendError
| Variant | คำอธิบาย |
|---------|---------|
| `Full(T)` | Buffer เต็ม (sync_channel) |
| `Disconnected(T)` | Receiver ถูก drop แล้ว |

### เมื่อไหร่ใช้อะไร
| Method | Error Type | Blocking |
|--------|-----------|----------|
| `recv()` | ไม่มี (panic) | Block |
| `try_recv()` | `TryRecvError` | ไม่ block |
| `recv_timeout(d)` | `RecvTimeoutError` | Block ถึง d |
| `send()` | ไม่มี (panic) | Block (sync) |
| `try_send()` | `TrySendError` | ไม่ block |

---

[← Async](./async) | [Index →](./index)
