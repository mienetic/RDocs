# Embedded Rust

เขียน Rust สำหรับ Microcontrollers! 🔌

:::tip Rust สำหรับ Embedded = Memory Safety ที่ hardware level!
ไม่มี garbage collector, ไม่มี runtime - เหมาะสำหรับ resource-constrained devices!
:::

---

## 1. no_std

### 1.1 What is no_std?

```rust
// ไม่ใช้ std library (ไม่มี heap, threading, I/O)
#![no_std]
#![no_main]

use core::panic::PanicInfo;

// ต้องกำหนด panic handler เอง
#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}

// Entry point
#[no_mangle]
pub extern "C" fn _start() -> ! {
    loop {}
}
```

### 1.2 std vs core vs alloc

| Crate | Requires | Provides |
|-------|----------|----------|
| `core` | Nothing | Primitives, Option, Result |
| `alloc` | Allocator | Vec, String, Box |
| `std` | OS | File I/O, Threading, Networking |

---

## 2. Setup

### 2.1 Install Target

```bash
# ARM Cortex-M0 (thumbv6m)
rustup target add thumbv6m-none-eabi

# ARM Cortex-M3 (thumbv7m)
rustup target add thumbv7m-none-eabi

# ARM Cortex-M4/M7 (thumbv7em)
rustup target add thumbv7em-none-eabi
rustup target add thumbv7em-none-eabihf  # with hardware float
```

### 2.2 Project Structure

```
my-embedded-project/
├── .cargo/
│   └── config.toml
├── src/
│   └── main.rs
├── memory.x          # Memory layout
└── Cargo.toml
```

### 2.3 Cargo.toml

```toml
[package]
name = "my-embedded"
version = "0.1.0"
edition = "2024"

[dependencies]
cortex-m = "0.7"
cortex-m-rt = "0.7"
panic-halt = "0.2"

# HAL for specific chip
stm32f4xx-hal = { version = "0.18", features = ["stm32f411"] }

[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
```

### 2.4 .cargo/config.toml

```toml
[target.thumbv7em-none-eabihf]
runner = "probe-run --chip STM32F411CEUx"
rustflags = ["-C", "link-arg=-Tlink.x"]

[build]
target = "thumbv7em-none-eabihf"
```

---

## 3. Blinky (LED Example)

```rust
#![no_std]
#![no_main]

use panic_halt as _;
use cortex_m_rt::entry;
use stm32f4xx_hal::{pac, prelude::*};

#[entry]
fn main() -> ! {
    // Get peripherals
    let dp = pac::Peripherals::take().unwrap();
    let cp = cortex_m::Peripherals::take().unwrap();
    
    // Configure clocks
    let rcc = dp.RCC.constrain();
    let clocks = rcc.cfgr.sysclk(48.MHz()).freeze();
    
    // Configure GPIO
    let gpioc = dp.GPIOC.split();
    let mut led = gpioc.pc13.into_push_pull_output();
    
    // Delay provider
    let mut delay = cp.SYST.delay(&clocks);
    
    // Blink forever
    loop {
        led.set_high();
        delay.delay_ms(500u32);
        led.set_low();
        delay.delay_ms(500u32);
    }
}
```

---

## 4. Peripherals

### 4.1 GPIO

```rust
// Output
let mut led = gpioc.pc13.into_push_pull_output();
led.set_high();
led.set_low();
led.toggle();

// Input
let button = gpioa.pa0.into_pull_up_input();
if button.is_high() {
    // Button pressed
}

// Input with interrupt
let mut button = gpioa.pa0.into_pull_up_input();
button.make_interrupt_source(&mut syscfg);
button.enable_interrupt(&mut exti);
button.trigger_on_edge(&mut exti, Edge::Falling);
```

### 4.2 UART

```rust
use stm32f4xx_hal::serial::{Config, Serial};

let tx = gpioa.pa2.into_alternate();
let rx = gpioa.pa3.into_alternate();

let mut serial = Serial::new(
    dp.USART2,
    (tx, rx),
    Config::default().baudrate(115_200.bps()),
    &clocks,
);

// Write
use core::fmt::Write;
writeln!(serial, "Hello, World!").unwrap();

// Read
let byte = nb::block!(serial.read()).unwrap();
```

### 4.3 I2C

```rust
use stm32f4xx_hal::i2c::I2c;

let scl = gpiob.pb6.into_alternate_open_drain();
let sda = gpiob.pb7.into_alternate_open_drain();

let mut i2c = I2c::new(dp.I2C1, (scl, sda), 400.kHz(), &clocks);

// Write to device
let address = 0x68;
i2c.write(address, &[0x00, 0x01]).unwrap();

// Read from device
let mut buffer = [0u8; 2];
i2c.read(address, &mut buffer).unwrap();
```

### 4.4 SPI

```rust
use stm32f4xx_hal::spi::{Spi, Mode, Phase, Polarity};

let sck = gpioa.pa5.into_alternate();
let miso = gpioa.pa6.into_alternate();
let mosi = gpioa.pa7.into_alternate();

let mode = Mode {
    polarity: Polarity::IdleLow,
    phase: Phase::CaptureOnFirstTransition,
};

let mut spi = Spi::new(
    dp.SPI1,
    (sck, miso, mosi),
    mode,
    1.MHz(),
    &clocks,
);

// Transfer
let mut buffer = [0x00, 0x01, 0x02];
spi.transfer(&mut buffer).unwrap();
```

---

## 5. Interrupts

```rust
use cortex_m::interrupt;
use stm32f4xx_hal::interrupt as stm32_interrupt;

static mut COUNTER: u32 = 0;

#[stm32_interrupt]
fn EXTI0() {
    unsafe {
        COUNTER += 1;
    }
    
    // Clear interrupt flag
    // ...
}

fn main() -> ! {
    // Enable interrupt
    unsafe {
        cortex_m::peripheral::NVIC::unmask(stm32_interrupt::EXTI0);
    }
    
    loop {
        // Read counter safely
        let count = interrupt::free(|_cs| unsafe { COUNTER });
        // ...
    }
}
```

---

## 6. Memory Layout

### 6.1 memory.x

```ld
/* memory.x */
MEMORY
{
    FLASH : ORIGIN = 0x08000000, LENGTH = 512K
    RAM : ORIGIN = 0x20000000, LENGTH = 128K
}
```

### 6.2 Static Variables

```rust
// ใน .data section (initialized RAM)
static mut BUFFER: [u8; 256] = [0; 256];

// ใน .bss section (zero-initialized RAM)
static mut COUNTER: u32 = 0;

// ใน .rodata section (ROM)
static MESSAGE: &str = "Hello";
```

---

## 7. Real-Time OS (RTIC)

### 7.1 Setup

```toml
[dependencies]
rtic = "2.0"
```

### 7.2 Example

```rust
#![no_std]
#![no_main]

use panic_halt as _;
use rtic::app;

#[app(device = stm32f4xx_hal::pac, peripherals = true)]
mod app {
    use stm32f4xx_hal::gpio::{Output, PC13, PushPull};
    
    #[shared]
    struct Shared {
        counter: u32,
    }
    
    #[local]
    struct Local {
        led: PC13<Output<PushPull>>,
    }
    
    #[init]
    fn init(ctx: init::Context) -> (Shared, Local) {
        let dp = ctx.device;
        let gpioc = dp.GPIOC.split();
        let led = gpioc.pc13.into_push_pull_output();
        
        (
            Shared { counter: 0 },
            Local { led },
        )
    }
    
    #[task(binds = EXTI0, shared = [counter], local = [led])]
    fn button_pressed(mut ctx: button_pressed::Context) {
        ctx.shared.counter.lock(|c| *c += 1);
        ctx.local.led.toggle();
    }
}
```

---

## 8. Debugging

### 8.1 probe-rs

```bash
cargo install probe-rs --features cli

# Flash and run
cargo run --release

# Debug
cargo embed
```

### 8.2 Logging (defmt)

```toml
[dependencies]
defmt = "0.3"
defmt-rtt = "0.4"
```

```rust
use defmt::info;
use defmt_rtt as _;

info!("Counter: {}", counter);
```

---

## 9. Ecosystem

| Crate | Purpose |
|-------|---------|
| `cortex-m` | Core ARM support |
| `cortex-m-rt` | Runtime |
| `embedded-hal` | Hardware abstraction |
| `stm32f4xx-hal` | STM32F4 HAL |
| `nrf52-hal` | Nordic nRF52 HAL |
| `esp-hal` | ESP32 HAL |
| `rtic` | Real-time framework |
| `embassy` | Async embedded |
| `defmt` | Logging |

---

## 10. สรุป

| Concept | Description |
|---------|-------------|
| `#![no_std]` | No standard library |
| `#![no_main]` | No main function |
| `#[entry]` | Entry point |
| `#[interrupt]` | Interrupt handler |
| HAL | Hardware Abstraction Layer |
| PAC | Peripheral Access Crate |

---

[บทถัดไป: Performance](/advanced/performance)
