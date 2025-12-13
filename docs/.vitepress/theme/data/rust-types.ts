// Rust Types Dictionary - ข้อมูล types สำหรับ tooltip
export interface RustTypeInfo {
    name: string
    description: string
    link: string
    icon: string  // Lucide icon name (e.g., 'lucide:box', 'lucide:code')
    category: 'basics' | 'io' | 'traits' | 'smart-ptr' | 'specialized' | 'collections' | 'sync' | 'cell' | 'time' | 'path' | 'smart-pointers'
}

export const rustTypes: Record<string, RustTypeInfo> = {
    // ===== พื้นฐานที่ใช้บ่อย =====
    'Vec': {
        name: 'Vec',
        description: 'Dynamic Array - อาเรย์ที่ขยายขนาดได้',
        link: '/std/vec',
        icon: 'lucide:box',
        category: 'basics'
    },
    'String': {
        name: 'String',
        description: 'ข้อความที่เป็นเจ้าของ (owned) แก้ไขได้',
        link: '/std/string',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'Option': {
        name: 'Option',
        description: 'ค่าที่อาจมีหรือไม่มี (Some/None)',
        link: '/std/option',
        icon: 'lucide:gift',
        category: 'basics'
    },
    'Result': {
        name: 'Result',
        description: 'ผลลัพธ์ที่อาจสำเร็จหรือผิดพลาด (Ok/Err)',
        link: '/std/result',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'Some': {
        name: 'Some',
        description: 'Option ที่มีค่า',
        link: '/std/option',
        icon: 'lucide:gift',
        category: 'basics'
    },
    'None': {
        name: 'None',
        description: 'Option ที่ไม่มีค่า',
        link: '/std/option',
        icon: 'lucide:gift',
        category: 'basics'
    },
    'Ok': {
        name: 'Ok',
        description: 'Result ที่สำเร็จ',
        link: '/std/result',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'Err': {
        name: 'Err',
        description: 'Result ที่ผิดพลาด',
        link: '/std/result',
        icon: 'lucide:x-circle',
        category: 'basics'
    },

    'HashMap': {
        name: 'HashMap',
        description: 'Key-Value map แบบ hash',
        link: '/std/collections-ref',
        icon: 'lucide:map',
        category: 'basics'
    },
    'HashSet': {
        name: 'HashSet',
        description: 'Set ที่ไม่มีค่าซ้ำ',
        link: '/std/collections-ref',
        icon: 'lucide:target',
        category: 'basics'
    },
    'VecDeque': {
        name: 'VecDeque',
        description: 'Double-ended queue',
        link: '/std/collections-ref',
        icon: 'lucide:move-horizontal',
        category: 'basics'
    },
    'BTreeMap': {
        name: 'BTreeMap',
        description: 'Sorted key-value map',
        link: '/std/collections-ref',
        icon: 'lucide:tree-pine',
        category: 'basics'
    },

    // ===== ระบบและ I/O =====
    'File': {
        name: 'File',
        description: 'Handle สำหรับไฟล์',
        link: '/std/fs',
        icon: 'lucide:file',
        category: 'io'
    },
    'Path': {
        name: 'Path',
        description: 'เส้นทางไฟล์ (borrowed)',
        link: '/std/path',
        icon: 'lucide:folder-open',
        category: 'io'
    },
    'PathBuf': {
        name: 'PathBuf',
        description: 'เส้นทางไฟล์ (owned)',
        link: '/std/path',
        icon: 'lucide:folder-open',
        category: 'io'
    },

    'BufReader': {
        name: 'BufReader',
        description: 'อ่านแบบ buffered (เร็วกว่า)',
        link: '/std/io',
        icon: 'lucide:book-open',
        category: 'io'
    },
    'BufWriter': {
        name: 'BufWriter',
        description: 'เขียนแบบ buffered (เร็วกว่า)',
        link: '/std/io',
        icon: 'lucide:pencil',
        category: 'io'
    },
    'TcpListener': {
        name: 'TcpListener',
        description: 'TCP server socket',
        link: '/std/net',
        icon: 'lucide:globe',
        category: 'io'
    },
    'TcpStream': {
        name: 'TcpStream',
        description: 'TCP connection',
        link: '/std/net',
        icon: 'lucide:globe',
        category: 'io'
    },
    'UdpSocket': {
        name: 'UdpSocket',
        description: 'UDP socket',
        link: '/std/net',
        icon: 'lucide:globe',
        category: 'io'
    },
    'Duration': {
        name: 'Duration',
        description: 'ระยะเวลา',
        link: '/std/time',
        icon: 'lucide:timer',
        category: 'io'
    },
    'Instant': {
        name: 'Instant',
        description: 'จุดเวลาสำหรับวัด performance',
        link: '/std/time',
        icon: 'lucide:timer',
        category: 'io'
    },
    'SystemTime': {
        name: 'SystemTime',
        description: 'เวลาของระบบ',
        link: '/std/time',
        icon: 'lucide:clock',
        category: 'io'
    },
    'Thread': {
        name: 'Thread',
        description: 'Handle สำหรับ thread',
        link: '/std/thread',
        icon: 'lucide:git-branch',
        category: 'io'
    },
    'JoinHandle': {
        name: 'JoinHandle',
        description: 'Handle สำหรับรอ thread จบ',
        link: '/std/thread',
        icon: 'lucide:git-branch',
        category: 'io'
    },
    'Command': {
        name: 'Command',
        description: 'สร้าง process ใหม่',
        link: '/std/process',
        icon: 'lucide:zap',
        category: 'io'
    },
    'Child': {
        name: 'Child',
        description: 'Child process ที่กำลังทำงาน',
        link: '/std/process',
        icon: 'lucide:zap',
        category: 'io'
    },

    // ===== Sync =====
    'Mutex': {
        name: 'Mutex',
        description: 'Mutual exclusion lock',
        link: '/std/sync',
        icon: 'lucide:lock',
        category: 'io'
    },
    'RwLock': {
        name: 'RwLock',
        description: 'Read-write lock',
        link: '/std/sync',
        icon: 'lucide:lock',
        category: 'io'
    },
    'Condvar': {
        name: 'Condvar',
        description: 'Condition variable',
        link: '/std/sync',
        icon: 'lucide:bell',
        category: 'io'
    },
    'Barrier': {
        name: 'Barrier',
        description: 'Synchronization barrier',
        link: '/std/sync',
        icon: 'lucide:construction',
        category: 'io'
    },
    'Once': {
        name: 'Once',
        description: 'One-time initialization',
        link: '/std/sync',
        icon: 'lucide:hash',
        category: 'io'
    },
    'Sender': {
        name: 'Sender',
        description: 'Channel sender',
        link: '/std/sync',
        icon: 'lucide:upload',
        category: 'io'
    },
    'Receiver': {
        name: 'Receiver',
        description: 'Channel receiver',
        link: '/std/sync',
        icon: 'lucide:download',
        category: 'io'
    },

    // ===== Cell =====
    'Cell': {
        name: 'Cell',
        description: 'Interior mutability (copy types)',
        link: '/std/cell',
        icon: 'lucide:refresh-cw',
        category: 'io'
    },
    'RefCell': {
        name: 'RefCell',
        description: 'Interior mutability (borrow checking)',
        link: '/std/cell',
        icon: 'lucide:refresh-cw',
        category: 'io'
    },
    'OnceCell': {
        name: 'OnceCell',
        description: 'เก็บค่าครั้งเดียว',
        link: '/std/cell',
        icon: 'lucide:hash',
        category: 'io'
    },

    // ===== Smart Pointers =====
    'Box': {
        name: 'Box',
        description: 'Heap allocation',
        link: '/std/box',
        icon: 'lucide:box',
        category: 'smart-ptr'
    },
    'Rc': {
        name: 'Rc',
        description: 'Reference counting (single-thread)',
        link: '/std/rc',
        icon: 'lucide:link',
        category: 'smart-ptr'
    },
    'Arc': {
        name: 'Arc',
        description: 'Atomic reference counting (multi-thread)',
        link: '/std/sync',
        icon: 'lucide:atom',
        category: 'smart-ptr'
    },
    'Weak': {
        name: 'Weak',
        description: 'Weak reference (ไม่เพิ่ม count)',
        link: '/std/rc',
        icon: 'lucide:link',
        category: 'smart-ptr'
    },
    'Pin': {
        name: 'Pin',
        description: 'Pinned memory (ไม่ให้ move)',
        link: '/std/pin',
        icon: 'lucide:pin',
        category: 'smart-ptr'
    },


    // ===== Traits =====
    // -- Core --
    'Clone': {
        name: 'Clone',
        description: 'สร้างสำเนา .clone()',
        link: '/traits/core',
        icon: 'lucide:clipboard',
        category: 'traits'
    },
    'Copy': {
        name: 'Copy',
        description: 'สำเนาอัตโนมัติ (bitwise copy)',
        link: '/traits/core',
        icon: 'lucide:clipboard',
        category: 'traits'
    },
    'Default': {
        name: 'Default',
        description: 'ค่าเริ่มต้น ::default()',
        link: '/traits/core',
        icon: 'lucide:home',
        category: 'traits'
    },
    'Drop': {
        name: 'Drop',
        description: 'Cleanup เมื่อจบ scope',
        link: '/traits/core',
        icon: 'lucide:trash-2',
        category: 'traits'
    },

    // -- Comparison --
    'PartialEq': {
        name: 'PartialEq',
        description: 'เปรียบเทียบความเท่ากัน (==)',
        link: '/traits/comparison',
        icon: 'lucide:scale',
        category: 'traits'
    },
    'Eq': {
        name: 'Eq',
        description: 'เปรียบเทียบความเท่ากันแบบสมบูรณ์',
        link: '/traits/comparison',
        icon: 'lucide:scale',
        category: 'traits'
    },
    'PartialOrd': {
        name: 'PartialOrd',
        description: 'เปรียบเทียบการเรียงลำดับ (<, >)',
        link: '/traits/comparison',
        icon: 'lucide:bar-chart-3',
        category: 'traits'
    },
    'Ord': {
        name: 'Ord',
        description: 'การเรียงลำดับแบบสมบูรณ์',
        link: '/traits/comparison',
        icon: 'lucide:bar-chart-3',
        category: 'traits'
    },
    'Hash': {
        name: 'Hash',
        description: 'สร้างค่า Hash สำหรับ HashMap',
        link: '/traits/comparison',
        icon: 'lucide:hash',
        category: 'traits'
    },

    // -- Conversion --
    'From': {
        name: 'From',
        description: 'แปลงจาก Type อื่น (ไม่ล้มเหลว)',
        link: '/traits/conversion',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'Into': {
        name: 'Into',
        description: 'แปลงไป Type อื่น (อัตโนมัติจาก From)',
        link: '/traits/conversion',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'TryFrom': {
        name: 'TryFrom',
        description: 'แปลงจาก Type อื่น (อาจล้มเหลว)',
        link: '/traits/conversion',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'TryInto': {
        name: 'TryInto',
        description: 'แปลงไป Type อื่น (อาจล้มเหลว)',
        link: '/traits/conversion',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'AsRef': {
        name: 'AsRef',
        description: 'แปลงเป็น Reference ราคาถูก',
        link: '/traits/conversion',
        icon: 'lucide:pointer',
        category: 'traits'
    },
    'Deref': {
        name: 'Deref',
        description: 'Dereference operator (*)',
        link: '/traits/conversion',
        icon: 'lucide:asterisk',
        category: 'traits'
    },
    'DerefMut': {
        name: 'DerefMut',
        description: 'Dereference operator (*) แบบแก้ไขได้',
        link: '/traits/conversion',
        icon: 'lucide:asterisk',
        category: 'traits'
    },
    'FromStr': {
        name: 'FromStr',
        description: 'แปลง String เป็น Type (parse)',
        link: '/traits/conversion',
        icon: 'lucide:type',
        category: 'traits'
    },
    'AsMut': {
        name: 'AsMut',
        description: 'แปลงเป็น Mutable Reference ราคาถูก',
        link: '/traits/conversion',
        icon: 'lucide:pointer',
        category: 'traits'
    },

    // -- Iterator --
    'Iterator': {
        name: 'Iterator',
        description: 'Trait สำหรับการวนลูป',
        link: '/traits/iterator',
        icon: 'lucide:repeat',
        category: 'traits'
    },
    'IntoIterator': {
        name: 'IntoIterator',
        description: 'แปลงเป็น Iterator (ใช้ใน for loop)',
        link: '/traits/iterator',
        icon: 'lucide:repeat',
        category: 'traits'
    },
    'FromIterator': {
        name: 'FromIterator',
        description: 'สร้าง Collection จาก Iterator',
        link: '/traits/iterator',
        icon: 'lucide:repeat',
        category: 'traits'
    },
    'DoubleEndedIterator': {
        name: 'DoubleEndedIterator',
        description: 'วนจากท้ายได้ (next_back)',
        link: '/traits/iterator-ext',
        icon: 'lucide:repeat',
        category: 'traits'
    },
    'ExactSizeIterator': {
        name: 'ExactSizeIterator',
        description: 'รู้ความยาวแน่นอน (len)',
        link: '/traits/iterator-ext',
        icon: 'lucide:ruler',
        category: 'traits'
    },
    'Extend': {
        name: 'Extend',
        description: 'เพิ่มข้อมูลต่อท้ายจาก Iterator',
        link: '/traits/iterator-ext',
        icon: 'lucide:plus',
        category: 'traits'
    },
    'FusedIterator': {
        name: 'FusedIterator',
        description: 'Iterator ที่รับประกัน None ตลอดหลังจบ',
        link: '/traits/iterator-ext',
        icon: 'lucide:lock',
        category: 'traits'
    },
    'ToString': {
        name: 'ToString',
        description: 'แปลงเป็น String (auto จาก Display)',
        link: '/traits/display',
        icon: 'lucide:file-text',
        category: 'traits'
    },
    'Hasher': {
        name: 'Hasher',
        description: 'สร้าง hash values',
        link: '/traits/comparison',
        icon: 'lucide:hash',
        category: 'traits'
    },
    'RangeBounds': {
        name: 'RangeBounds',
        description: 'Trait สำหรับ Range types (..)',
        link: '/traits/ops',
        icon: 'lucide:move-horizontal',
        category: 'traits'
    },

    // -- Display --
    'Debug': {
        name: 'Debug',
        description: 'Output สำหรับ dev ({:?})',
        link: '/traits/display',
        icon: 'lucide:search',
        category: 'traits'
    },
    'Display': {
        name: 'Display',
        description: 'Output สำหรับ user ({})',
        link: '/traits/display',
        icon: 'lucide:clipboard',
        category: 'traits'
    },

    // -- I/O --
    'Read': {
        name: 'Read',
        description: 'อ่านข้อมูล (bytes)',
        link: '/traits/io',
        icon: 'lucide:book-open',
        category: 'traits'
    },
    'Write': {
        name: 'Write',
        description: 'เขียนข้อมูล (bytes)',
        link: '/traits/io',
        icon: 'lucide:pencil',
        category: 'traits'
    },
    'Seek': {
        name: 'Seek',
        description: 'เลื่อน cursor ใน stream',
        link: '/traits/io',
        icon: 'lucide:map-pin',
        category: 'traits'
    },
    'BufRead': {
        name: 'BufRead',
        description: 'อ่านแบบมี Buffer (read_line)',
        link: '/traits/io',
        icon: 'lucide:library',
        category: 'traits'
    },

    // -- Concurrency --
    'Send': {
        name: 'Send',
        description: 'ส่งข้าม Thread ได้',
        link: '/traits/concurrency',
        icon: 'lucide:upload',
        category: 'traits'
    },
    'Sync': {
        name: 'Sync',
        description: 'แชร์ Reference ข้าม Thread ได้',
        link: '/traits/concurrency',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },

    // -- Operators --
    'Add': {
        name: 'Add',
        description: 'Addition (+)',
        link: '/traits/ops',
        icon: 'lucide:plus',
        category: 'traits'
    },
    'Sub': {
        name: 'Sub',
        description: 'Subtraction (-)',
        link: '/traits/ops',
        icon: 'lucide:minus',
        category: 'traits'
    },
    'Mul': {
        name: 'Mul',
        description: 'Multiplication (*)',
        link: '/traits/ops',
        icon: 'lucide:x',
        category: 'traits'
    },
    'Div': {
        name: 'Div',
        description: 'Division (/)',
        link: '/traits/ops',
        icon: 'lucide:divide',
        category: 'traits'
    },
    'Rem': {
        name: 'Rem',
        description: 'Remainder (%)',
        link: '/traits/ops',
        icon: 'lucide:hash',
        category: 'traits'
    },
    'Neg': {
        name: 'Neg',
        description: 'Unary Negation (-x)',
        link: '/traits/ops',
        icon: 'lucide:minus',
        category: 'traits'
    },
    'Not': {
        name: 'Not',
        description: 'Logical NOT (!x)',
        link: '/traits/ops',
        icon: 'lucide:alert-circle',
        category: 'traits'
    },
    'BitAnd': {
        name: 'BitAnd',
        description: 'Bitwise AND (&)',
        link: '/traits/ops',
        icon: 'lucide:settings',
        category: 'traits'
    },
    'BitOr': {
        name: 'BitOr',
        description: 'Bitwise OR (|)',
        link: '/traits/ops',
        icon: 'lucide:settings',
        category: 'traits'
    },
    'BitXor': {
        name: 'BitXor',
        description: 'Bitwise XOR (^)',
        link: '/traits/ops',
        icon: 'lucide:settings',
        category: 'traits'
    },
    'Shl': {
        name: 'Shl',
        description: 'Shift Left (<<)',
        link: '/traits/ops',
        icon: 'lucide:arrow-left',
        category: 'traits'
    },
    'Shr': {
        name: 'Shr',
        description: 'Shift Right (>>)',
        link: '/traits/ops',
        icon: 'lucide:arrow-right',
        category: 'traits'
    },
    'AddAssign': {
        name: 'AddAssign',
        description: 'Addition Assignment (+=)',
        link: '/traits/ops',
        icon: 'lucide:plus',
        category: 'traits'
    },
    'SubAssign': {
        name: 'SubAssign',
        description: 'Subtraction Assignment (-=)',
        link: '/traits/ops',
        icon: 'lucide:minus',
        category: 'traits'
    },
    'MulAssign': {
        name: 'MulAssign',
        description: 'Multiplication Assignment (*=)',
        link: '/traits/ops',
        icon: 'lucide:x',
        category: 'traits'
    },
    'DivAssign': {
        name: 'DivAssign',
        description: 'Division Assignment (/=)',
        link: '/traits/ops',
        icon: 'lucide:divide',
        category: 'traits'
    },
    'RemAssign': {
        name: 'RemAssign',
        description: 'Remainder Assignment (%=)',
        link: '/traits/ops',
        icon: 'lucide:hash',
        category: 'traits'
    },
    'BitAndAssign': {
        name: 'BitAndAssign',
        description: 'Bitwise AND Assignment (&=)',
        link: '/traits/ops',
        icon: 'lucide:settings',
        category: 'traits'
    },
    'BitOrAssign': {
        name: 'BitOrAssign',
        description: 'Bitwise OR Assignment (|=)',
        link: '/traits/ops',
        icon: 'lucide:settings',
        category: 'traits'
    },
    'BitXorAssign': {
        name: 'BitXorAssign',
        description: 'Bitwise XOR Assignment (^=)',
        link: '/traits/ops',
        icon: 'lucide:settings',
        category: 'traits'
    },
    'ShlAssign': {
        name: 'ShlAssign',
        description: 'Shift Left Assignment (<<=)',
        link: '/traits/ops',
        icon: 'lucide:arrow-left',
        category: 'traits'
    },
    'ShrAssign': {
        name: 'ShrAssign',
        description: 'Shift Right Assignment (>>=)',
        link: '/traits/ops',
        icon: 'lucide:arrow-right',
        category: 'traits'
    },
    'IntoFuture': {
        name: 'IntoFuture',
        description: 'แปลงเป็น Future (สำหรับ .await)',
        link: '/traits/future',
        icon: 'lucide:hourglass',
        category: 'traits'
    },
    'Index': {
        name: 'Index',
        description: 'Indexing (a[i])',
        link: '/traits/ops',
        icon: 'lucide:search',
        category: 'traits'
    },
    'IndexMut': {
        name: 'IndexMut',
        description: 'Mutable Indexing (a[i] = v)',
        link: '/traits/ops',
        icon: 'lucide:pencil',
        category: 'traits'
    },
    'Fn': {
        name: 'Fn',
        description: 'Closure (เรียกได้หลายครั้ง, ไม่แก้ค่า)',
        link: '/traits/ops',
        icon: 'lucide:box',
        category: 'traits'
    },
    'FnMut': {
        name: 'FnMut',
        description: 'Closure (เรียกได้หลายครั้ง, แก้ค่า)',
        link: '/traits/ops',
        icon: 'lucide:box',
        category: 'traits'
    },
    'FnOnce': {
        name: 'FnOnce',
        description: 'Closure (เรียกได้ครั้งเดียว)',
        link: '/traits/ops',
        icon: 'lucide:box',
        category: 'traits'
    },

    // -- Memory --
    'Borrow': {
        name: 'Borrow',
        description: 'ยืมข้อมูลในรูปแบบอื่น',
        link: '/traits/memory',
        icon: 'lucide:handshake',
        category: 'traits'
    },
    'BorrowMut': {
        name: 'BorrowMut',
        description: 'ยืมข้อมูลแบบแก้ไขได้',
        link: '/traits/memory',
        icon: 'lucide:handshake',
        category: 'traits'
    },
    'ToOwned': {
        name: 'ToOwned',
        description: 'สร้าง Owned data จาก Borrowed',
        link: '/traits/memory',
        icon: 'lucide:box',
        category: 'traits'
    },
    'Cow': {
        name: 'Cow',
        description: 'Clone-on-Write Smart Pointer',
        link: '/traits/memory',
        icon: 'lucide:beef',
        category: 'traits'
    },

    // -- Future --
    'Future': {
        name: 'Future',
        description: 'การทำงานแบบ Asynchronous',
        link: '/traits/future',
        icon: 'lucide:hourglass',
        category: 'traits'
    },
    'Poll': {
        name: 'Poll',
        description: 'สถานะของ Future (Ready/Pending)',
        link: '/traits/future',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },

    // -- Markers --
    'Sized': {
        name: 'Sized',
        description: 'ขนาดคงที่ที่รู้ตอน Compile',
        link: '/traits/markers',
        icon: 'lucide:ruler',
        category: 'traits'
    },
    'Unpin': {
        name: 'Unpin',
        description: 'ย้ายที่ใน Memory ได้',
        link: '/traits/markers',
        icon: 'lucide:pin',
        category: 'traits'
    },
    'PhantomData': {
        name: 'PhantomData',
        description: 'Zero-sized type สำหรับบอก Compiler',
        link: '/traits/markers',
        icon: 'lucide:ghost',
        category: 'traits'
    },

    // ===== Error Handling =====
    'Error': {
        name: 'Error',
        description: 'Standard error trait',
        link: '/traits/error',
        icon: 'lucide:x-circle',
        category: 'traits' // Changed from specialized to traits
    },

    // ===== FFI =====
    'CString': {
        name: 'CString',
        description: 'Owned null-terminated string สำหรับ C',
        link: '/std/ffi',
        icon: 'lucide:link',
        category: 'specialized'
    },
    'CStr': {
        name: 'CStr',
        description: 'Borrowed null-terminated string',
        link: '/std/ffi',
        icon: 'lucide:link',
        category: 'specialized'
    },
    'OsString': {
        name: 'OsString',
        description: 'Platform-native string (owned)',
        link: '/std/ffi',
        icon: 'lucide:terminal',
        category: 'specialized'
    },
    'OsStr': {
        name: 'OsStr',
        description: 'Platform-native string (borrowed)',
        link: '/std/ffi',
        icon: 'lucide:terminal',
        category: 'specialized'
    },

    // ===== Any =====
    'Any': {
        name: 'Any',
        description: 'Runtime type information',
        link: '/traits/any',
        icon: 'lucide:search',
        category: 'traits' // Changed to traits
    },
    'TypeId': {
        name: 'TypeId',
        description: 'Unique type identifier',
        link: '/traits/any',
        icon: 'lucide:tag',
        category: 'traits' // Changed to traits
    },

    // ===== Primitive Types =====
    'i8': {
        name: 'i8',
        description: 'Signed 8-bit integer (-128 ถึง 127)',
        link: '/primitives/integers',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'i16': {
        name: 'i16',
        description: 'Signed 16-bit integer',
        link: '/primitives/integers',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'i32': {
        name: 'i32',
        description: 'Signed 32-bit integer (default)',
        link: '/primitives/integers',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'i64': {
        name: 'i64',
        description: 'Signed 64-bit integer',
        link: '/primitives/integers',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'i128': {
        name: 'i128',
        description: 'Signed 128-bit integer',
        link: '/primitives/integers',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'isize': {
        name: 'isize',
        description: 'Pointer-sized signed integer',
        link: '/primitives/integers',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'u8': {
        name: 'u8',
        description: 'Unsigned 8-bit (0-255, byte)',
        link: '/primitives/unsigned',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'u16': {
        name: 'u16',
        description: 'Unsigned 16-bit integer',
        link: '/primitives/unsigned',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'u32': {
        name: 'u32',
        description: 'Unsigned 32-bit integer',
        link: '/primitives/unsigned',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'u64': {
        name: 'u64',
        description: 'Unsigned 64-bit integer',
        link: '/primitives/unsigned',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'u128': {
        name: 'u128',
        description: 'Unsigned 128-bit integer',
        link: '/primitives/unsigned',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'usize': {
        name: 'usize',
        description: 'Pointer-sized unsigned (for indexing)',
        link: '/primitives/unsigned',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'f32': {
        name: 'f32',
        description: '32-bit floating point',
        link: '/primitives/floats',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'f64': {
        name: 'f64',
        description: '64-bit floating point (default)',
        link: '/primitives/floats',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'bool': {
        name: 'bool',
        description: 'Boolean (true/false)',
        link: '/primitives/bool-unit',
        icon: 'lucide:check',
        category: 'basics'
    },
    'char': {
        name: 'char',
        description: 'Unicode scalar value (4 bytes)',
        link: '/primitives/char',
        icon: 'lucide:type',
        category: 'basics'
    },
    'str': {
        name: 'str',
        description: 'String slice (UTF-8)',
        link: '/primitives/str',
        icon: 'lucide:file-text',
        category: 'basics'
    },

    // ===== Macros =====
    'println': {
        name: 'println!',
        description: 'พิมพ์ข้อความ + ขึ้นบรรทัดใหม่',
        link: '/macros/output',
        icon: 'lucide:tv',
        category: 'basics'
    },
    'println!': {
        name: 'println!',
        description: 'พิมพ์ข้อความ + ขึ้นบรรทัดใหม่',
        link: '/macros/output',
        icon: 'lucide:tv',
        category: 'basics'
    },
    'print': {
        name: 'print!',
        description: 'พิมพ์ข้อความ (ไม่ขึ้นบรรทัดใหม่)',
        link: '/macros/output',
        icon: 'lucide:tv',
        category: 'basics'
    },
    'print!': {
        name: 'print!',
        description: 'พิมพ์ข้อความ (ไม่ขึ้นบรรทัดใหม่)',
        link: '/macros/output',
        icon: 'lucide:tv',
        category: 'basics'
    },
    'eprintln': {
        name: 'eprintln!',
        description: 'พิมพ์ error ไป stderr',
        link: '/macros/output',
        icon: 'lucide:tv',
        category: 'basics'
    },
    'eprintln!': {
        name: 'eprintln!',
        description: 'พิมพ์ error ไป stderr',
        link: '/macros/output',
        icon: 'lucide:tv',
        category: 'basics'
    },
    'eprint!': {
        name: 'eprint!',
        description: 'พิมพ์ error ไป stderr (ไม่ขึ้นบรรทัด)',
        link: '/macros/output',
        icon: 'lucide:tv',
        category: 'basics'
    },
    'format': {
        name: 'format!',
        description: 'สร้าง String จาก format',
        link: '/macros/formatting',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'format!': {
        name: 'format!',
        description: 'สร้าง String จาก format',
        link: '/macros/formatting',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'write': {
        name: 'write!',
        description: 'เขียนลง buffer',
        link: '/macros/formatting',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'write!': {
        name: 'write!',
        description: 'เขียนลง buffer',
        link: '/macros/formatting',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'writeln': {
        name: 'writeln!',
        description: 'เขียนลง buffer + newline',
        link: '/macros/formatting',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'writeln!': {
        name: 'writeln!',
        description: 'เขียนลง buffer + newline',
        link: '/macros/formatting',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'assert': {
        name: 'assert!',
        description: 'ตรวจสอบ condition',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'assert!': {
        name: 'assert!',
        description: 'ตรวจสอบ condition',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'assert_eq': {
        name: 'assert_eq!',
        description: 'ตรวจสอบว่าเท่ากัน',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'assert_eq!': {
        name: 'assert_eq!',
        description: 'ตรวจสอบว่าเท่ากัน',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'assert_ne': {
        name: 'assert_ne!',
        description: 'ตรวจสอบว่าไม่เท่ากัน',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'assert_ne!': {
        name: 'assert_ne!',
        description: 'ตรวจสอบว่าไม่เท่ากัน',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'debug_assert': {
        name: 'debug_assert!',
        description: 'assert เฉพาะ debug mode',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'debug_assert!': {
        name: 'debug_assert!',
        description: 'assert เฉพาะ debug mode',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'dbg': {
        name: 'dbg!',
        description: 'Debug พิมพ์ค่าพร้อม file:line',
        link: '/macros/debugging',
        icon: 'lucide:search',
        category: 'basics'
    },
    'dbg!': {
        name: 'dbg!',
        description: 'Debug พิมพ์ค่าพร้อม file:line',
        link: '/macros/debugging',
        icon: 'lucide:search',
        category: 'basics'
    },
    'todo': {
        name: 'todo!',
        description: 'ยังไม่ได้ implement',
        link: '/macros/debugging',
        icon: 'lucide:clipboard',
        category: 'basics'
    },
    'todo!': {
        name: 'todo!',
        description: 'ยังไม่ได้ implement',
        link: '/macros/debugging',
        icon: 'lucide:clipboard',
        category: 'basics'
    },
    'unimplemented': {
        name: 'unimplemented!',
        description: 'ไม่วางแผนจะ implement',
        link: '/macros/debugging',
        icon: 'lucide:construction',
        category: 'basics'
    },
    'unimplemented!': {
        name: 'unimplemented!',
        description: 'ไม่วางแผนจะ implement',
        link: '/macros/debugging',
        icon: 'lucide:construction',
        category: 'basics'
    },
    'unreachable': {
        name: 'unreachable!',
        description: 'ไม่ควรมาถึงจุดนี้',
        link: '/macros/debugging',
        icon: 'lucide:ban',
        category: 'basics'
    },
    'unreachable!': {
        name: 'unreachable!',
        description: 'ไม่ควรมาถึงจุดนี้',
        link: '/macros/debugging',
        icon: 'lucide:ban',
        category: 'basics'
    },
    'panic': {
        name: 'panic!',
        description: 'หยุดโปรแกรมทันที',
        link: '/macros/panic',
        icon: 'lucide:boom',
        category: 'basics'
    },
    'panic!': {
        name: 'panic!',
        description: 'หยุดโปรแกรมทันที',
        link: '/macros/panic',
        icon: 'lucide:boom',
        category: 'basics'
    },
    'vec': {
        name: 'vec!',
        description: 'สร้าง Vec',
        link: '/macros/data',
        icon: 'lucide:box',
        category: 'basics'
    },
    'vec!': {
        name: 'vec!',
        description: 'สร้าง Vec',
        link: '/macros/data',
        icon: 'lucide:box',
        category: 'basics'
    },
    'matches': {
        name: 'matches!',
        description: 'ตรวจสอบ pattern',
        link: '/macros/data',
        icon: 'lucide:target',
        category: 'basics'
    },
    'matches!': {
        name: 'matches!',
        description: 'ตรวจสอบ pattern',
        link: '/macros/data',
        icon: 'lucide:target',
        category: 'basics'
    },
    'cfg': {
        name: 'cfg!',
        description: 'ตรวจ compile configuration',
        link: '/macros/compile-time',
        icon: 'lucide:cog',
        category: 'basics'
    },
    'cfg!': {
        name: 'cfg!',
        description: 'ตรวจ compile configuration',
        link: '/macros/compile-time',
        icon: 'lucide:cog',
        category: 'basics'
    },
    'env': {
        name: 'env!',
        description: 'อ่าน environment variable',
        link: '/macros/compile-time',
        icon: 'lucide:globe-2',
        category: 'basics'
    },
    'env!': {
        name: 'env!',
        description: 'อ่าน environment variable',
        link: '/macros/compile-time',
        icon: 'lucide:globe-2',
        category: 'basics'
    },
    'include_str': {
        name: 'include_str!',
        description: 'รวมไฟล์เป็น &str',
        link: '/macros/compile-time',
        icon: 'lucide:file',
        category: 'basics'
    },
    'include_str!': {
        name: 'include_str!',
        description: 'รวมไฟล์เป็น &str',
        link: '/macros/compile-time',
        icon: 'lucide:file',
        category: 'basics'
    },
    'include_bytes': {
        name: 'include_bytes!',
        description: 'รวมไฟล์เป็น &[u8]',
        link: '/macros/compile-time',
        icon: 'lucide:file',
        category: 'basics'
    },
    'include_bytes!': {
        name: 'include_bytes!',
        description: 'รวมไฟล์เป็น &[u8]',
        link: '/macros/compile-time',
        icon: 'lucide:file',
        category: 'basics'
    },
    'concat': {
        name: 'concat!',
        description: 'รวม string literals',
        link: '/macros/compile-time',
        icon: 'lucide:link',
        category: 'basics'
    },
    'concat!': {
        name: 'concat!',
        description: 'รวม string literals',
        link: '/macros/compile-time',
        icon: 'lucide:link',
        category: 'basics'
    },
    'stringify': {
        name: 'stringify!',
        description: 'แปลง expression เป็น &str',
        link: '/macros/compile-time',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'stringify!': {
        name: 'stringify!',
        description: 'แปลง expression เป็น &str',
        link: '/macros/compile-time',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    // เพิ่ม macros อื่นๆ
    'file': {
        name: 'file!',
        description: 'ชื่อไฟล์ ณ จุดนั้น',
        link: '/macros/compile-time',
        icon: 'lucide:folder',
        category: 'basics'
    },
    'file!': {
        name: 'file!',
        description: 'ชื่อไฟล์ ณ จุดนั้น',
        link: '/macros/compile-time',
        icon: 'lucide:folder',
        category: 'basics'
    },
    'line': {
        name: 'line!',
        description: 'เลขบรรทัด ณ จุดนั้น',
        link: '/macros/compile-time',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'line!': {
        name: 'line!',
        description: 'เลขบรรทัด ณ จุดนั้น',
        link: '/macros/compile-time',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'column': {
        name: 'column!',
        description: 'เลข column ณ จุดนั้น',
        link: '/macros/compile-time',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'column!': {
        name: 'column!',
        description: 'เลข column ณ จุดนั้น',
        link: '/macros/compile-time',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'module_path': {
        name: 'module_path!',
        description: 'ชื่อ module ปัจจุบัน',
        link: '/macros/compile-time',
        icon: 'lucide:box',
        category: 'basics'
    },
    'module_path!': {
        name: 'module_path!',
        description: 'ชื่อ module ปัจจุบัน',
        link: '/macros/compile-time',
        icon: 'lucide:box',
        category: 'basics'
    },
    'format_args': {
        name: 'format_args!',
        description: 'สร้าง Arguments (zero-allocation)',
        link: '/macros/formatting',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'format_args!': {
        name: 'format_args!',
        description: 'สร้าง Arguments (zero-allocation)',
        link: '/macros/formatting',
        icon: 'lucide:file-text',
        category: 'basics'
    },
    'option_env': {
        name: 'option_env!',
        description: 'อ่าน env var เป็น Option',
        link: '/macros/compile-time',
        icon: 'lucide:globe-2',
        category: 'basics'
    },
    'option_env!': {
        name: 'option_env!',
        description: 'อ่าน env var เป็น Option',
        link: '/macros/compile-time',
        icon: 'lucide:globe-2',
        category: 'basics'
    },
    'thread_local': {
        name: 'thread_local!',
        description: 'สร้าง thread-local storage',
        link: '/macros/compile-time',
        icon: 'lucide:git-branch',
        category: 'basics'
    },
    'thread_local!': {
        name: 'thread_local!',
        description: 'สร้าง thread-local storage',
        link: '/macros/compile-time',
        icon: 'lucide:git-branch',
        category: 'basics'
    },
    'compile_error': {
        name: 'compile_error!',
        description: 'สร้าง compile error',
        link: '/macros/compile-time',
        icon: 'lucide:circle-x',
        category: 'basics'
    },
    'compile_error!': {
        name: 'compile_error!',
        description: 'สร้าง compile error',
        link: '/macros/compile-time',
        icon: 'lucide:circle-x',
        category: 'basics'
    },
    'include': {
        name: 'include!',
        description: 'รวม Rust code จากไฟล์',
        link: '/macros/compile-time',
        icon: 'lucide:file',
        category: 'basics'
    },
    'include!': {
        name: 'include!',
        description: 'รวม Rust code จากไฟล์',
        link: '/macros/compile-time',
        icon: 'lucide:file',
        category: 'basics'
    },
    'debug_assert_eq': {
        name: 'debug_assert_eq!',
        description: 'assert_eq เฉพาะ debug mode',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'debug_assert_eq!': {
        name: 'debug_assert_eq!',
        description: 'assert_eq เฉพาะ debug mode',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'debug_assert_ne': {
        name: 'debug_assert_ne!',
        description: 'assert_ne เฉพาะ debug mode',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'debug_assert_ne!': {
        name: 'debug_assert_ne!',
        description: 'assert_ne เฉพาะ debug mode',
        link: '/macros/assertions',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'eprint': {
        name: 'eprint!',
        description: 'พิมพ์ error ไป stderr (ไม่ขึ้นบรรทัด)',
        link: '/macros/output',
        icon: 'lucide:tv',
        category: 'basics'
    },
    'concat_bytes': {
        name: 'concat_bytes!',
        description: 'รวม byte slices (unstable)',
        link: '/macros/compile-time',
        icon: 'lucide:link',
        category: 'basics'
    },
    'concat_bytes!': {
        name: 'concat_bytes!',
        description: 'รวม byte slices (unstable)',
        link: '/macros/compile-time',
        icon: 'lucide:link',
        category: 'basics'
    },
    'macro_rules': {
        name: 'macro_rules!',
        description: 'ประกาศ declarative macro',
        link: '/macros/',
        icon: 'lucide:wand-2',
        category: 'basics'
    },
    'macro_rules!': {
        name: 'macro_rules!',
        description: 'ประกาศ declarative macro',
        link: '/macros/',
        icon: 'lucide:wand-2',
        category: 'basics'
    },

    // ===== Additional Structs =====
    'BTreeSet': {
        name: 'BTreeSet<T>',
        description: 'Sorted unique values',
        link: '/structs/collections',
        icon: 'lucide:target',
        category: 'collections'
    },
    'BinaryHeap': {
        name: 'BinaryHeap<T>',
        description: 'Priority queue',
        link: '/structs/collections',
        icon: 'lucide:bar-chart-3',
        category: 'collections'
    },
    'LinkedList': {
        name: 'LinkedList<T>',
        description: 'Doubly-linked list',
        link: '/structs/collections',
        icon: 'lucide:link',
        category: 'collections'
    },
    'LazyCell': {
        name: 'LazyCell<T>',
        description: 'Lazy initialization',
        link: '/structs/cell',
        icon: 'lucide:moon',
        category: 'cell'
    },
    'Stdin': {
        name: 'Stdin',
        description: 'Standard input',
        link: '/structs/io',
        icon: 'lucide:keyboard',
        category: 'io'
    },
    'Stdout': {
        name: 'Stdout',
        description: 'Standard output',
        link: '/structs/io',
        icon: 'lucide:tv',
        category: 'io'
    },
    'Stderr': {
        name: 'Stderr',
        description: 'Standard error',
        link: '/structs/io',
        icon: 'lucide:alert-triangle',
        category: 'io'
    },

    // ===== More Structs =====
    'Range': {
        name: 'Range<T>',
        description: 'ช่วง a..b',
        link: '/structs/range',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'RangeInclusive': {
        name: 'RangeInclusive<T>',
        description: 'ช่วง a..=b',
        link: '/structs/range',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'SyncSender': {
        name: 'SyncSender<T>',
        description: 'ส่งแบบ bounded channel',
        link: '/structs/channel',
        icon: 'lucide:mail',
        category: 'sync'
    },
    'ExitStatus': {
        name: 'ExitStatus',
        description: 'ผลลัพธ์ process',
        link: '/structs/process',
        icon: 'lucide:flag',
        category: 'io'
    },
    'Iter': {
        name: 'Iter<T>',
        description: 'Immutable iterator',
        link: '/structs/iterator',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'IterMut': {
        name: 'IterMut<T>',
        description: 'Mutable iterator',
        link: '/structs/iterator',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'IntoIter': {
        name: 'IntoIter<T>',
        description: 'Owning iterator',
        link: '/structs/iterator',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'IpAddr': {
        name: 'IpAddr',
        description: 'IP address',
        link: '/structs/net',
        icon: 'lucide:link',
        category: 'io'
    },
    'SocketAddr': {
        name: 'SocketAddr',
        description: 'Socket address (IP + port)',
        link: '/structs/net',
        icon: 'lucide:link',
        category: 'io'
    },
    'ThreadId': {
        name: 'ThreadId',
        description: 'Thread identifier',
        link: '/structs/thread',
        icon: 'lucide:git-branch',
        category: 'sync'
    },

    // ===== Missing Tooltips =====
    'UnsafeCell': {
        name: 'UnsafeCell<T>',
        description: 'Base for interior mutability',
        link: '/structs/cell',
        icon: 'lucide:alert-triangle',
        category: 'cell'
    },
    'Ipv4Addr': {
        name: 'Ipv4Addr',
        description: 'IPv4 address',
        link: '/structs/net',
        icon: 'lucide:globe',
        category: 'io'
    },
    'Ipv6Addr': {
        name: 'Ipv6Addr',
        description: 'IPv6 address',
        link: '/structs/net',
        icon: 'lucide:globe',
        category: 'io'
    },
    'RangeFrom': {
        name: 'RangeFrom<T>',
        description: 'ช่วง a..',
        link: '/structs/range',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'RangeTo': {
        name: 'RangeTo<T>',
        description: 'ช่วง ..b',
        link: '/structs/range',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'RangeFull': {
        name: 'RangeFull',
        description: 'ช่วงทั้งหมด ..',
        link: '/structs/range',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'ParseIntError': {
        name: 'ParseIntError',
        description: 'Error when parsing integer',
        link: '/structs/error',
        icon: 'lucide:alert-triangle',
        category: 'basics'
    },
    'Utf8Error': {
        name: 'Utf8Error',
        description: 'UTF-8 encoding error',
        link: '/structs/error',
        icon: 'lucide:alert-triangle',
        category: 'basics'
    },
    'Map': {
        name: 'Map<I, F>',
        description: 'Transform iterator adapter',
        link: '/structs/iterator',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'Filter': {
        name: 'Filter<I, P>',
        description: 'Filter iterator adapter',
        link: '/structs/iterator',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'Enumerate': {
        name: 'Enumerate<I>',
        description: 'Index + value iterator',
        link: '/structs/iterator',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'Zip': {
        name: 'Zip<A, B>',
        description: 'Combine two iterators',
        link: '/structs/iterator',
        icon: 'lucide:refresh-cw',
        category: 'traits'
    },
    'Output': {
        name: 'Output',
        description: 'Process output (stdout + stderr)',
        link: '/structs/process',
        icon: 'lucide:upload',
        category: 'io'
    },
    'Stdio': {
        name: 'Stdio',
        description: 'Process I/O configuration',
        link: '/structs/process',
        icon: 'lucide:cog',
        category: 'io'
    },

    // ===== FFI & Env =====
    'Args': {
        name: 'Args',
        description: 'Command line arguments iterator',
        link: '/structs/env',
        icon: 'lucide:globe-2',
        category: 'io'
    },
    'Vars': {
        name: 'Vars',
        description: 'Environment variables iterator',
        link: '/structs/env',
        icon: 'lucide:globe-2',
        category: 'io'
    },

    // ===== Fs =====
    'ReadDir': {
        name: 'ReadDir',
        description: 'Directory iterator',
        link: '/structs/fs',
        icon: 'lucide:folder-open',
        category: 'io'
    },
    'DirEntry': {
        name: 'DirEntry',
        description: 'Directory entry',
        link: '/structs/fs',
        icon: 'lucide:file',
        category: 'io'
    },
    'Metadata': {
        name: 'Metadata',
        description: 'File metadata',
        link: '/structs/fs',
        icon: 'lucide:clipboard',
        category: 'io'
    },
    'Permissions': {
        name: 'Permissions',
        description: 'File permissions',
        link: '/structs/fs',
        icon: 'lucide:lock-keyhole',
        category: 'io'
    },
    'FileType': {
        name: 'FileType',
        description: 'File/dir/symlink type',
        link: '/structs/fs',
        icon: 'lucide:folder',
        category: 'io'
    },

    // ===== Fmt =====
    'Formatter': {
        name: 'Formatter',
        description: 'Controls formatting output',
        link: '/structs/fmt',
        icon: 'lucide:file-text',
        category: 'traits'
    },
    'Arguments': {
        name: 'Arguments',
        description: 'Pre-compiled format string',
        link: '/structs/fmt',
        icon: 'lucide:file-text',
        category: 'traits'
    },

    // ===== Mem =====
    'ManuallyDrop': {
        name: 'ManuallyDrop<T>',
        description: 'ป้องกัน auto-drop',
        link: '/structs/mem',
        icon: 'lucide:brain',
        category: 'basics'
    },
    'MaybeUninit': {
        name: 'MaybeUninit<T>',
        description: 'Uninitialized memory',
        link: '/structs/mem',
        icon: 'lucide:brain',
        category: 'basics'
    },

    // ===== Num =====
    'NonZeroU8': {
        name: 'NonZeroU8',
        description: 'Non-zero u8',
        link: '/structs/num',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'NonZeroU32': {
        name: 'NonZeroU32',
        description: 'Non-zero u32',
        link: '/structs/num',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'NonZeroU64': {
        name: 'NonZeroU64',
        description: 'Non-zero u64',
        link: '/structs/num',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'NonZeroUsize': {
        name: 'NonZeroUsize',
        description: 'Non-zero usize',
        link: '/structs/num',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'Wrapping': {
        name: 'Wrapping<T>',
        description: 'Overflow wraps around',
        link: '/structs/num',
        icon: 'lucide:refresh-cw',
        category: 'basics'
    },
    'Saturating': {
        name: 'Saturating<T>',
        description: 'Clamp at min/max',
        link: '/structs/num',
        icon: 'lucide:bar-chart-3',
        category: 'basics'
    },

    // ===== Slice =====
    'Chunks': {
        name: 'Chunks<T>',
        description: 'Chunk iterator',
        link: '/structs/slice',
        icon: 'lucide:scissors',
        category: 'traits'
    },
    'ChunksExact': {
        name: 'ChunksExact<T>',
        description: 'Exact chunk iterator',
        link: '/structs/slice',
        icon: 'lucide:scissors',
        category: 'traits'
    },
    'Windows': {
        name: 'Windows<T>',
        description: 'Sliding window iterator',
        link: '/structs/slice',
        icon: 'lucide:panel-top',
        category: 'traits'
    },
    'Split': {
        name: 'Split<T, P>',
        description: 'Split iterator',
        link: '/structs/slice',
        icon: 'lucide:scissors',
        category: 'traits'
    },
    'Lines': {
        name: 'Lines',
        description: 'Line iterator',
        link: '/structs/slice',
        icon: 'lucide:file-text',
        category: 'traits'
    },
    'Chars': {
        name: 'Chars',
        description: 'Character iterator',
        link: '/structs/slice',
        icon: 'lucide:type',
        category: 'traits'
    },
    'Cursor': {
        name: 'Cursor<T>',
        description: 'Seekable in-memory buffer',
        link: '/std/io',
        icon: 'lucide:map-pin',
        category: 'io'
    },

    // ===== Enums =====
    'Ordering': {
        name: 'Ordering',
        description: 'Less, Equal, Greater - ผลเปรียบเทียบ',
        link: '/enums/cmp',
        icon: 'lucide:bar-chart-3',
        category: 'basics'
    },
    'Entry': {
        name: 'Entry',
        description: 'Occupied or Vacant - slot ใน map',
        link: '/enums/collections',
        icon: 'lucide:box',
        category: 'collections'
    },
    'ErrorKind': {
        name: 'ErrorKind',
        description: 'ประเภท I/O error',
        link: '/enums/io',
        icon: 'lucide:alert-triangle',
        category: 'io'
    },
    'SeekFrom': {
        name: 'SeekFrom',
        description: 'Start, End, Current - ตำแหน่ง seek',
        link: '/enums/io',
        icon: 'lucide:map-pin',
        category: 'io'
    },
    'ControlFlow': {
        name: 'ControlFlow',
        description: 'Break or Continue - ควบคุม loop',
        link: '/enums/cmp',
        icon: 'lucide:git-merge',
        category: 'basics'
    },
    'Bound': {
        name: 'Bound',
        description: 'Included, Excluded, Unbounded',
        link: '/enums/cmp',
        icon: 'lucide:triangle-right',
        category: 'basics'
    },
    'Shutdown': {
        name: 'Shutdown',
        description: 'Read, Write, Both - ปิด connection',
        link: '/enums/net',
        icon: 'lucide:plug',
        category: 'io'
    },
    'TryRecvError': {
        name: 'TryRecvError',
        description: 'Empty or Disconnected',
        link: '/enums/channel',
        icon: 'lucide:mail',
        category: 'sync'
    },
    'TrySendError': {
        name: 'TrySendError',
        description: 'Full or Disconnected',
        link: '/enums/channel',
        icon: 'lucide:upload',
        category: 'sync'
    },
    'RecvTimeoutError': {
        name: 'RecvTimeoutError',
        description: 'Timeout or Disconnected',
        link: '/enums/channel',
        icon: 'lucide:timer',
        category: 'sync'
    },
    'Infallible': {
        name: 'Infallible',
        description: 'Error type ที่ไม่มีทาง fail',
        link: '/enums/convert',
        icon: 'lucide:check-circle',
        category: 'basics'
    },
    'Component': {
        name: 'Component',
        description: 'ส่วนประกอบของ path',
        link: '/enums/path-enum',
        icon: 'lucide:folder',
        category: 'io'
    },
    'VarError': {
        name: 'VarError',
        description: 'NotPresent or NotUnicode',
        link: '/enums/env-enum',
        icon: 'lucide:globe-2',
        category: 'io'
    },
    'AtomicOrdering': {
        name: 'Ordering (atomic)',
        description: 'Memory ordering สำหรับ atomics',
        link: '/enums/atomic',
        icon: 'lucide:atom',
        category: 'sync'
    },
    'FpCategory': {
        name: 'FpCategory',
        description: 'Normal, Subnormal, Zero, Infinite, Nan',
        link: '/enums/num-enum',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'IntErrorKind': {
        name: 'IntErrorKind',
        description: 'Empty, InvalidDigit, Overflow',
        link: '/enums/num-enum',
        icon: 'lucide:alert-triangle',
        category: 'basics'
    },
    'Alignment': {
        name: 'Alignment',
        description: 'Left, Right, Center - text alignment',
        link: '/enums/fmt-enum',
        icon: 'lucide:file-text',
        category: 'traits'
    },

    // ===== Constants =====
    'PI': {
        name: 'PI',
        description: 'π (3.14159...)',
        link: '/constants/float',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'TAU': {
        name: 'TAU',
        description: 'τ = 2π',
        link: '/constants/float',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'INFINITY': {
        name: 'INFINITY',
        description: 'Positive infinity',
        link: '/constants/float',
        icon: 'lucide:infinity',
        category: 'basics'
    },
    'NAN': {
        name: 'NAN',
        description: 'Not a Number',
        link: '/constants/float',
        icon: 'lucide:help-circle',
        category: 'basics'
    },
    'ARCH': {
        name: 'ARCH',
        description: 'CPU architecture',
        link: '/constants/env',
        icon: 'lucide:monitor',
        category: 'io'
    },
    'SQRT_2': {
        name: 'SQRT_2',
        description: '√2 (1.41421...)',
        link: '/constants/math',
        icon: 'lucide:calculator',
        category: 'basics'
    },
    'LN_2': {
        name: 'LN_2',
        description: 'ln(2) (0.69314...)',
        link: '/constants/math',
        icon: 'lucide:calculator',
        category: 'basics'
    },
    'LN_10': {
        name: 'LN_10',
        description: 'ln(10) (2.30258...)',
        link: '/constants/math',
        icon: 'lucide:calculator',
        category: 'basics'
    },
    'EPSILON': {
        name: 'EPSILON',
        description: 'ค่าแตกต่างที่เล็กที่สุด',
        link: '/constants/float',
        icon: 'lucide:hash',
        category: 'basics'
    },
    'MAX': {
        name: 'MAX',
        description: 'ค่าสูงสุดของ type',
        link: '/constants/integer',
        icon: 'lucide:trending-up',
        category: 'basics'
    },
    'MIN': {
        name: 'MIN',
        description: 'ค่าต่ำสุดของ type',
        link: '/constants/integer',
        icon: 'lucide:trending-down',
        category: 'basics'
    },
    'MAIN_SEPARATOR': {
        name: 'MAIN_SEPARATOR',
        description: 'Path separator (/ หรือ \\)',
        link: '/constants/path',
        icon: 'lucide:folder',
        category: 'io'
    },
    'UNIX_EPOCH': {
        name: 'UNIX_EPOCH',
        description: 'Jan 1, 1970 00:00:00 UTC',
        link: '/constants/time',
        icon: 'lucide:clock',
        category: 'time'
    },

    // ===== Functions =====
    'size_of': {
        name: 'size_of',
        description: 'ขนาดของ type (bytes)',
        link: '/functions/mem',
        icon: 'lucide:ruler',
        category: 'specialized'
    },
    'swap': {
        name: 'swap',
        description: 'สลับค่า 2 ตัวแปร',
        link: '/functions/mem',
        icon: 'lucide:refresh-cw',
        category: 'specialized'
    },
    'take': {
        name: 'take',
        description: 'ดึงค่าออก แทนด้วย default',
        link: '/functions/mem',
        icon: 'lucide:upload',
        category: 'specialized'
    },
    'args': {
        name: 'args',
        description: 'Command line arguments',
        link: '/functions/env',
        icon: 'lucide:clipboard',
        category: 'io'
    },
    'spawn': {
        name: 'spawn',
        description: 'สร้าง thread ใหม่',
        link: '/functions/thread',
        icon: 'lucide:git-branch',
        category: 'io'
    },
    'ready': {
        name: 'ready',
        description: 'Future ที่พร้อมทันที',
        link: '/functions/future',
        icon: 'lucide:check-circle',
        category: 'specialized'
    },
    'pending': {
        name: 'pending',
        description: 'Future ที่ไม่ resolve',
        link: '/functions/future',
        icon: 'lucide:hourglass',
        category: 'specialized'
    },
    'stdin': {
        name: 'stdin',
        description: 'Standard Input',
        link: '/functions/io',
        icon: 'lucide:download',
        category: 'io'
    },
    'stdout': {
        name: 'stdout',
        description: 'Standard Output',
        link: '/functions/io',
        icon: 'lucide:upload',
        category: 'io'
    },
    'stderr': {
        name: 'stderr',
        description: 'Standard Error',
        link: '/functions/io',
        icon: 'lucide:alert-triangle',
        category: 'io'
    },
    'exit': {
        name: 'exit',
        description: 'ออกจาก Process',
        link: '/functions/process',
        icon: 'lucide:door-open',
        category: 'io'
    },
    'null': {
        name: 'null',
        description: 'Null Pointer',
        link: '/functions/ptr',
        icon: 'lucide:circle',
        category: 'specialized'
    },
    'once': {
        name: 'once',
        description: 'Iterator ที่ให้ 1 ค่า',
        link: '/functions/iter',
        icon: 'lucide:hash',
        category: 'specialized'
    },
    'repeat': {
        name: 'repeat',
        description: 'Iterator ที่ให้ค่าเดิมซ้ำๆ',
        link: '/functions/iter',
        icon: 'lucide:repeat',
        category: 'specialized'
    },
    'from_fn': {
        name: 'from_fn',
        description: 'สร้าง Iterator จาก closure',
        link: '/functions/iter',
        icon: 'lucide:settings',
        category: 'specialized'
    },
    'catch_unwind': {
        name: 'catch_unwind',
        description: 'จับ panic เป็น Result',
        link: '/functions/panic',
        icon: 'lucide:siren',
        category: 'specialized'
    },
    'type_name': {
        name: 'type_name',
        description: 'ดึงชื่อ Type',
        link: '/functions/any',
        icon: 'lucide:search',
        category: 'specialized'
    },
    'black_box': {
        name: 'black_box',
        description: 'ป้องกัน optimization',
        link: '/functions/hint',
        icon: 'lucide:box',
        category: 'specialized'
    },
    'from_utf8': {
        name: 'from_utf8',
        description: 'แปลง bytes เป็น &str',
        link: '/functions/str',
        icon: 'lucide:file-text',
        category: 'specialized'
    },
    'from_u32': {
        name: 'from_u32',
        description: 'u32 → char',
        link: '/functions/char',
        icon: 'lucide:type',
        category: 'specialized'
    },
    'from_digit': {
        name: 'from_digit',
        description: 'digit → char',
        link: '/functions/char',
        icon: 'lucide:hash',
        category: 'specialized'
    },
    // ===== Async Patterns =====
    'async': {
        name: 'async',
        description: 'Async function/block',
        link: '/patterns/async',
        icon: 'lucide:hourglass',
        category: 'specialized'
    },
    'await': {
        name: 'await',
        description: 'รอ Future เสร็จ',
        link: '/patterns/async',
        icon: 'lucide:hourglass',
        category: 'specialized'
    },
    'join': {
        name: 'join',
        description: 'รันหลาย futures พร้อมกัน',
        link: '/patterns/async',
        icon: 'lucide:link',
        category: 'specialized'
    },
    'select': {
        name: 'select',
        description: 'ใช้ future ที่เสร็จก่อน',
        link: '/patterns/async',
        icon: 'lucide:person-standing',
        category: 'specialized'
    },
    'timeout': {
        name: 'timeout',
        description: 'จำกัดเวลา future',
        link: '/patterns/async',
        icon: 'lucide:timer',
        category: 'specialized'
    },
    'tokio': {
        name: 'tokio',
        description: 'Async Runtime',
        link: '/patterns/async',
        icon: 'lucide:rocket',
        category: 'specialized'
    },
    // ===== Error Patterns =====
    'anyhow': {
        name: 'anyhow',
        description: 'Error handling crate',
        link: '/patterns/error-handling',
        icon: 'lucide:siren',
        category: 'specialized'
    },
    'thiserror': {
        name: 'thiserror',
        description: 'Custom Error derive',
        link: '/patterns/error-handling',
        icon: 'lucide:siren',
        category: 'specialized'
    },
    'bail': {
        name: 'bail',
        description: 'Return Error ทันที',
        link: '/patterns/error-handling',
        icon: 'lucide:circle-x',
        category: 'specialized'
    },
    'context': {
        name: 'context',
        description: 'เพิ่ม context ให้ Error',
        link: '/patterns/error-handling',
        icon: 'lucide:file-text',
        category: 'specialized'
    },
    // ===== Design Patterns =====
    'Builder': {
        name: 'Builder',
        description: 'สร้าง Object แบบ step-by-step',
        link: '/patterns/builder',
        icon: 'lucide:building',
        category: 'specialized'
    },
    'Newtype': {
        name: 'Newtype',
        description: 'Wrap type เพื่อ type safety',
        link: '/patterns/newtype',
        icon: 'lucide:tag',
        category: 'specialized'
    },
    'map': {
        name: 'map',
        description: 'แปลงทุกค่าใน Iterator',
        link: '/patterns/iterator',
        icon: 'lucide:refresh-cw',
        category: 'specialized'
    },
    'filter': {
        name: 'filter',
        description: 'เลือกบางค่าจาก Iterator',
        link: '/patterns/iterator',
        icon: 'lucide:search',
        category: 'specialized'
    },
    'fold': {
        name: 'fold',
        description: 'Reduce ด้วย initial value',
        link: '/patterns/iterator',
        icon: 'lucide:bar-chart-3',
        category: 'specialized'
    },
    'flatten': {
        name: 'flatten',
        description: 'ลด nesting level',
        link: '/patterns/iterator',
        icon: 'lucide:clipboard',
        category: 'specialized'
    },
    'collect': {
        name: 'collect',
        description: 'สร้าง Collection จาก Iterator',
        link: '/patterns/iterator',
        icon: 'lucide:box',
        category: 'specialized'
    },
    // ===== More Patterns =====
    'Typestate': {
        name: 'Typestate',
        description: 'Encode state ใน type system',
        link: '/patterns/typestate',
        icon: 'lucide:target',
        category: 'specialized'
    },
    'unsafe': {
        name: 'unsafe',
        description: 'Unsafe code block',
        link: '/patterns/unsafe',
        icon: 'lucide:alert-triangle',
        category: 'specialized'
    },
    'extern': {
        name: 'extern',
        description: 'External function interface',
        link: '/patterns/ffi',
        icon: 'lucide:link',
        category: 'specialized'
    },
    // ===== New Types =====
    'OnceLock': {
        name: 'OnceLock',
        description: 'Thread-safe one-time init',
        link: '/structs/lazy',
        icon: 'lucide:lock',
        category: 'specialized'
    },
    'LazyLock': {
        name: 'LazyLock',
        description: 'Thread-safe lazy init',
        link: '/structs/lazy',
        icon: 'lucide:lock',
        category: 'specialized'
    },
    'Backtrace': {
        name: 'Backtrace',
        description: 'Stack trace สำหรับ debugging',
        link: '/structs/backtrace',
        icon: 'lucide:search',
        category: 'specialized'
    },
    'Layout': {
        name: 'Layout',
        description: 'Memory layout (size, align)',
        link: '/structs/alloc',
        icon: 'lucide:brain',
        category: 'specialized'
    },
    'Waker': {
        name: 'Waker',
        description: 'Async task waker',
        link: '/structs/waker',
        icon: 'lucide:clock',
        category: 'specialized'
    },
}

// ฟังก์ชันสำหรับหา type info
export function getTypeInfo(typeName: string): RustTypeInfo | undefined {
    return rustTypes[typeName]
}

// รายการ types ทั้งหมดสำหรับ regex
export const allTypeNames = Object.keys(rustTypes)
