# Regular Expressions

ใช้ Regex ใน Rust ด้วย regex crate! 🔍

:::tip regex crate = เร็วและปลอดภัย!
Rust regex เป็นหนึ่งใน regex engines ที่เร็วที่สุดใน industry!
:::

---

## 1. Setup

```toml
[dependencies]
regex = "1"
```

---

## 2. Basic Matching

<RustPlayground>

```rust
// Note: regex crate ต้องติดตั้งในโปรเจกต์จริง
// นี่คือตัวอย่าง concept

fn main() {
    // Manual pattern matching (built-in)
    let text = "Hello, World!";
    
    // Check if contains
    println!("Contains 'World': {}", text.contains("World"));
    
    // Starts with / Ends with
    println!("Starts with 'Hello': {}", text.starts_with("Hello"));
    println!("Ends with '!': {}", text.ends_with("!"));
}
```

</RustPlayground>

### 2.1 regex::Regex

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"\d+").unwrap();
    
    // Check if matches
    let text = "There are 42 apples";
    println!("Has number: {}", re.is_match(text));
    
    // Find first match
    if let Some(m) = re.find(text) {
        println!("Found: {} at {:?}", m.as_str(), m.range());
    }
}
```

---

## 3. Capturing Groups

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"(\d{4})-(\d{2})-(\d{2})").unwrap();
    let text = "Today is 2024-12-25";
    
    if let Some(caps) = re.captures(text) {
        println!("Full match: {}", &caps[0]);
        println!("Year: {}", &caps[1]);
        println!("Month: {}", &caps[2]);
        println!("Day: {}", &caps[3]);
    }
}
```

### 3.1 Named Captures

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})").unwrap();
    let text = "Date: 2024-12-25";
    
    if let Some(caps) = re.captures(text) {
        println!("Year: {}", &caps["year"]);
        println!("Month: {}", &caps["month"]);
        println!("Day: {}", &caps["day"]);
    }
}
```

---

## 4. Find All Matches

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"\b\w+@\w+\.\w+\b").unwrap();
    let text = "Contact: alice@example.com or bob@test.org";
    
    // Find all
    for m in re.find_iter(text) {
        println!("Email: {}", m.as_str());
    }
    
    // Captures iter
    let re = Regex::new(r"(?P<name>\w+)@(?P<domain>\w+\.\w+)").unwrap();
    for caps in re.captures_iter(text) {
        println!("{} at {}", &caps["name"], &caps["domain"]);
    }
}
```

---

## 5. Replace

```rust
use regex::Regex;

fn main() {
    // Replace first
    let re = Regex::new(r"\d+").unwrap();
    let result = re.replace("I have 3 apples", "many");
    println!("First: {}", result);
    
    // Replace all
    let result = re.replace_all("1 apple, 2 oranges, 3 bananas", "X");
    println!("All: {}", result);
    
    // Replace with captures
    let re = Regex::new(r"(\w+)@(\w+)\.(\w+)").unwrap();
    let result = re.replace_all(
        "alice@example.com",
        "$1 at $2 dot $3"
    );
    println!("Replaced: {}", result);
    
    // Replace with function
    let re = Regex::new(r"\d+").unwrap();
    let result = re.replace_all("1 + 2 = 3", |caps: &regex::Captures| {
        let n: i32 = caps[0].parse().unwrap();
        (n * 10).to_string()
    });
    println!("Multiplied: {}", result);
}
```

---

## 6. Split

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"[,;:\s]+").unwrap();
    let text = "apple,orange; banana:grape   mango";
    
    let parts: Vec<&str> = re.split(text).collect();
    println!("Parts: {:?}", parts);
}
```

---

## 7. Common Patterns

| Pattern | Matches |
|---------|---------|
| `\d` | Digit (0-9) |
| `\w` | Word char (a-z, A-Z, 0-9, _) |
| `\s` | Whitespace |
| `.` | Any char (except newline) |
| `^` | Start of string |
| `$` | End of string |
| `+` | One or more |
| `*` | Zero or more |
| `?` | Zero or one |
| `{n}` | Exactly n times |
| `{n,m}` | n to m times |
| `[abc]` | Character class |
| `[^abc]` | Negated class |
| `(...)` | Capture group |
| `(?:...)` | Non-capturing group |
| `a\|b` | Alternation |

---

## 8. Practical Examples

### 8.1 Email Validation

```rust
use regex::Regex;

fn is_valid_email(email: &str) -> bool {
    let re = Regex::new(
        r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    ).unwrap();
    re.is_match(email)
}

fn main() {
    println!("Valid: {}", is_valid_email("test@example.com"));
    println!("Valid: {}", is_valid_email("invalid-email"));
}
```

### 8.2 Phone Number Extraction

```rust
use regex::Regex;

fn extract_phones(text: &str) -> Vec<String> {
    let re = Regex::new(r"\d{3}[-.\s]?\d{3}[-.\s]?\d{4}").unwrap();
    re.find_iter(text)
        .map(|m| m.as_str().to_string())
        .collect()
}

fn main() {
    let text = "Call 123-456-7890 or 098.765.4321";
    let phones = extract_phones(text);
    println!("Found: {:?}", phones);
}
```

### 8.3 URL Parsing

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(
        r"(?P<protocol>https?)://(?P<host>[^/:]+)(?::(?P<port>\d+))?(?P<path>/[^\s]*)?"
    ).unwrap();
    
    let url = "https://example.com:8080/path/to/page";
    
    if let Some(caps) = re.captures(url) {
        println!("Protocol: {}", &caps["protocol"]);
        println!("Host: {}", &caps["host"]);
        if let Some(port) = caps.name("port") {
            println!("Port: {}", port.as_str());
        }
        if let Some(path) = caps.name("path") {
            println!("Path: {}", path.as_str());
        }
    }
}
```

---

## 9. Performance Tips

### 9.1 Compile Once

```rust
use regex::Regex;
use std::sync::LazyLock;

// Compile regex once at startup
static EMAIL_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap()
});

fn is_valid_email(email: &str) -> bool {
    EMAIL_RE.is_match(email)
}
```

### 9.2 RegexSet for Multiple Patterns

```rust
use regex::RegexSet;

fn main() {
    let set = RegexSet::new(&[
        r"\d+",      // numbers
        r"[a-z]+",   // lowercase
        r"[A-Z]+",   // uppercase
    ]).unwrap();
    
    let text = "Hello123";
    let matches: Vec<_> = set.matches(text).iter().collect();
    println!("Matching patterns: {:?}", matches);
    // [0, 1, 2] - all three patterns match
}
```

---

## 10. สรุป

| Method | Description |
|--------|-------------|
| `is_match()` | Check if matches |
| `find()` | Find first match |
| `find_iter()` | Find all matches |
| `captures()` | Get capture groups |
| `replace()` | Replace first |
| `replace_all()` | Replace all |
| `split()` | Split by pattern |

---

[บทถัดไป: Environment & Config](/intermediate/config)
