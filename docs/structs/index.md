# Structs - โครงสร้างข้อมูล

Rust มี **structs** ที่หลากหลายใน std library! 

---

## Structs คืออะไร?

Structs คือโครงสร้างข้อมูลที่รวมหลายค่าเข้าด้วยกัน:
- **Custom types** สร้างชนิดข้อมูลใหม่
- **Encapsulation** รวม data กับ methods
- **Zero-cost abstractions** ไม่มี overhead

::: best-practice
**ใช้ Structs เพื่อสร้าง Type-safety**
การสร้าง Struct ใหม่ (Newtype Pattern) ช่วยป้องกันความสับสนในการส่งค่าผิด เช่น `struct UserId(u32)` ดีกว่าใช้ `u32` เฉยๆ
:::

::: recommendation
เลือก Struct ให้เหมาะกับงาน ช่วยลด Memory overhead และเพิ่มความเร็วได้มหาศาล!
:::

::: best-practice
**Builder Pattern สำหรับ Struct ที่ซับซ้อน**
ถ้า Struct มี field เยอะๆ หรือมีค่า default หลายตัว อย่าให้ user สร้างเอง
ให้ใช้ **Builder Pattern** (เช่น `std::process::Command`, `reqwest::ClientBuilder`)
ช่วยให้ code อ่านง่ายและจัดการ config ได้ดีกว่า!
:::

::: tip
**derive คือเพื่อนรัก**
อย่าลืม `#[derive(Debug, Clone, PartialEq)]` ให้ structs ส่วนใหญ่ของคุณ!
มันช่วยชีวิตตอน debug และ testing ได้มาก
:::

---

## หมวด Structs สำคัญ

### Collections
| Struct | คำอธิบาย |
|--------|---------|
| `String` | ข้อความที่เป็นเจ้าของ |
| `Vec<T>` | Dynamic array |
| `HashMap<K, V>` | Key-value map |
| `HashSet<T>` | Unique values |
| `VecDeque<T>` | Double-ended queue |
| `BTreeMap<K, V>` | Sorted map |
| `BTreeSet<T>` | Sorted set |
| `BinaryHeap<T>` | Priority queue |
| `LinkedList<T>` | Linked list |

 **[ดูเพิ่มเติม](./collections)**

---

### Smart Pointers
| Struct | คำอธิบาย |
|--------|---------|
| `Box<T>` | Heap allocation |
| `Rc<T>` | Reference counting |
| `Arc<T>` | Atomic reference counting |
| `Weak<T>` | Weak reference |
| `Cow<T>` | Clone-on-write |

 **[ดูเพิ่มเติม](./smart-pointers)**

---

### Cell Types
| Struct | คำอธิบาย |
|--------|---------|
| `Cell<T>` | Interior mutability (Copy) |
| `RefCell<T>` | Interior mutability (runtime borrow) |
| `OnceCell<T>` | Initialize once |
| `LazyCell<T>` | Lazy initialization |
| `UnsafeCell<T>` | Base for interior mutability |

 **[ดูเพิ่มเติม](./cell)**

---

### I/O
| Struct | คำอธิบาย |
|--------|---------|
| `File` | File handle |
| `BufReader<R>` | Buffered reader |
| `BufWriter<W>` | Buffered writer |
| `Stdin` | Standard input |
| `Stdout` | Standard output |
| `Stderr` | Standard error |

 **[ดูเพิ่มเติม](./io)**

---

### Path
| Struct | คำอธิบาย |
|--------|---------|
| `Path` | Path reference |
| `PathBuf` | Owned path |
| `OsStr` | OS string reference |
| `OsString` | Owned OS string |

 **[ดูเพิ่มเติม](./path)**

---

### Time
| Struct | คำอธิบาย |
|--------|---------|
| `Duration` | Time span |
| `Instant` | Monotonic time |
| `SystemTime` | System clock |

 **[ดูเพิ่มเติม](./time)**

---

### Synchronization
| Struct | คำอธิบาย |
|--------|---------|
| `Mutex` | Mutual exclusion |
| `RwLock` | Read-write lock |
| `Condvar` | Condition variable |
| `Barrier` | Thread barrier |
| `Once` | One-time initialization |

 **[ดูเพิ่มเติม](./sync)**

---

### Networking
| Struct | คำอธิบาย |
|--------|---------|
| `TcpListener` | TCP server |
| `TcpStream` | TCP connection |
| `UdpSocket` | UDP socket |
| `IpAddr` | IP address |
| `SocketAddr` | Socket address |

 **[ดูเพิ่มเติม](./net)**

---

### Threading
| Struct | คำอธิบาย |
|--------|---------|
| `JoinHandle` | Thread handle |
| `Thread` | Thread info |
| `ThreadId` | Thread identifier |

 **[ดูเพิ่มเติม](./thread)**

---

### Range
| Struct | คำอธิบาย |
|--------|---------|
| `Range` | ช่วง a..b |
| `RangeInclusive` | ช่วง a..=b |
| `RangeFrom` | ช่วง a.. |
| `RangeTo` | ช่วง ..b |

 **[ดูเพิ่มเติม](./range)**

---

### Channel (mpsc)
| Struct | คำอธิบาย |
|--------|---------|
| `Sender` | ส่งข้อมูล |
| `Receiver` | รับข้อมูล |
| `SyncSender` | ส่งแบบ bounded |

 **[ดูเพิ่มเติม](./channel)**

---

### Error
| Struct | คำอธิบาย |
|--------|---------|
| `io::Error` | I/O errors |
| `ParseIntError` | Parse errors |
| `Utf8Error` | UTF-8 errors |

 **[ดูเพิ่มเติม](./error)**

---

### Iterator
| Struct | คำอธิบาย |
|--------|---------|
| `Iter` | Immutable iterator |
| `IterMut` | Mutable iterator |
| `IntoIter` | Owning iterator |
| `Map` | Transform adapter |
| `Filter` | Filter adapter |

 **[ดูเพิ่มเติม](./iterator)**

---

### Process
| Struct | คำอธิบาย |
|--------|---------|
| `Command` | สร้างคำสั่ง |
| `Child` | Running process |
| `ExitStatus` | ผลลัพธ์ process |

 **[ดูเพิ่มเติม](./process)**

---

### FFI (Foreign Function Interface)
| Struct | คำอธิบาย |
|--------|---------|
| `CString` | Owned C string |
| `CStr` | Borrowed C string |

 **[ดูเพิ่มเติม](./ffi)**

---

### Env
| Struct | คำอธิบาย |
|--------|---------|
| `Args` | Command line arguments |
| `Vars` | Environment variables |

 **[ดูเพิ่มเติม](./env)**

---

### File System
| Struct | คำอธิบาย |
|--------|---------|
| `ReadDir` | Directory iterator |
| `DirEntry` | Directory entry |
| `Metadata` | File metadata |
| `Permissions` | File permissions |

 **[ดูเพิ่มเติม](./fs)**

---

### Fmt
| Struct | คำอธิบาย |
|--------|---------|
| `Formatter` | Format controller |
| `Arguments` | Format arguments |

 **[ดูเพิ่มเติม](./fmt)**

---

### Marker
| Struct | คำอธิบาย |
|--------|---------|
| `PhantomData` | Zero-sized marker |
| `Pin` | Pinned pointer |

 **[ดูเพิ่มเติม](./marker)**

---

### Mem
| Struct | คำอธิบาย |
|--------|---------|
| `ManuallyDrop` | ป้องกัน auto-drop |
| `MaybeUninit` | Uninitialized memory |

 **[ดูเพิ่มเติม](./mem)**

---

### Num
| Struct | คำอธิบาย |
|--------|---------|
| `NonZeroU32` | Non-zero integer |
| `Wrapping` | Overflow wraps around |
| `Saturating` | Clamp at min/max |

 **[ดูเพิ่มเติม](./num)**

---

### Slice
| Struct | คำอธิบาย |
|--------|---------|
| `Chunks` | Chunk iterator |
| `Windows` | Sliding window |
| `Split` | Split iterator |

 **[ดูเพิ่มเติม](./slice)**

---

## Quick Reference

| Struct | ตัวอย่าง |
|--------|---------|
| `String` | `String::from("hello")` |
| `Vec` | `Vec::new()` หรือ `vec![]` |
| `HashMap` | `HashMap::new()` |
| `Box` | `Box::new(value)` |
| `Rc` | `Rc::new(value)` |
| `Arc` | `Arc::new(value)` |
| `Mutex` | `Mutex::new(value)` |
| `File` | `File::open("path")` |
| `Path` | `Path::new("path")` |
| `Duration` | `Duration::from_secs(5)` |

---

[← กลับหน้าหลัก](/)
