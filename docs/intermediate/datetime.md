# Date & Time

จัดการวันที่และเวลาด้วย chrono! 

:::tip chrono คือ crate ยอดนิยม
std ไม่มี datetime ที่ feature-rich แต่ `chrono` มีทุกอย่างที่ต้องการ!
:::

---

## 1. Setup

```toml
[dependencies]
chrono = "0.4"
```

---

## 2. Getting Current Time

<RustPlayground>

```rust
// Note: chrono ต้องติดตั้งในโปรเจกต์จริง
// ใน Playground ใช้ได้บางส่วน

fn main() {
 use std::time::SystemTime;
 
 // ใช้ std::time (built-in)
 let now = SystemTime::now();
 println!("SystemTime: {:?}", now);
 
 // Duration since UNIX epoch
 let duration = now
 .duration_since(SystemTime::UNIX_EPOCH)
 .unwrap();
 println!("Seconds since epoch: {}", duration.as_secs());
}
```

</RustPlayground>

### 2.1 chrono - Current Time

```rust
use chrono::{Local, Utc};

fn main() {
 // UTC time
 let utc_now = Utc::now();
 println!("UTC: {}", utc_now);
 
 // Local time
 let local_now = Local::now();
 println!("Local: {}", local_now);
}
```

---

## 3. Creating Dates

```rust
use chrono::{NaiveDate, NaiveTime, NaiveDateTime, TimeZone, Utc};

fn main() {
 // Date only
 let date = NaiveDate::from_ymd_opt(2024, 12, 25).unwrap();
 println!("Date: {}", date);
 
 // Time only
 let time = NaiveTime::from_hms_opt(14, 30, 0).unwrap();
 println!("Time: {}", time);
 
 // DateTime (naive - no timezone)
 let naive_dt = NaiveDateTime::new(date, time);
 println!("NaiveDateTime: {}", naive_dt);
 
 // DateTime with timezone
 let utc_dt = Utc.with_ymd_and_hms(2024, 12, 25, 14, 30, 0).unwrap();
 println!("UTC DateTime: {}", utc_dt);
}
```

---

## 4. Parsing Dates

```rust
use chrono::{NaiveDate, NaiveDateTime, DateTime, Utc};

fn main() {
 // Parse date
 let date = NaiveDate::parse_from_str("2024-12-25", "%Y-%m-%d").unwrap();
 println!("Parsed date: {}", date);
 
 // Parse datetime
 let dt = NaiveDateTime::parse_from_str(
 "2024-12-25 14:30:00",
 "%Y-%m-%d %H:%M:%S"
 ).unwrap();
 println!("Parsed datetime: {}", dt);
 
 // Parse ISO 8601
 let iso_dt: DateTime<Utc> = "2024-12-25T14:30:00Z".parse().unwrap();
 println!("ISO datetime: {}", iso_dt);
}
```

---

## 5. Formatting Dates

```rust
use chrono::{Local, Utc};

fn main() {
 let now = Local::now();
 
 // Built-in formats
 println!("RFC 2822: {}", now.to_rfc2822());
 println!("RFC 3339: {}", now.to_rfc3339());
 
 // Custom format
 println!("Custom: {}", now.format("%Y-%m-%d %H:%M:%S"));
 println!("Thai: {}", now.format("%d/%m/%Y %H:%M น."));
 
 // More formats
 println!("Date only: {}", now.format("%Y-%m-%d"));
 println!("Time only: {}", now.format("%H:%M:%S"));
 println!("With weekday: {}", now.format("%A, %B %d, %Y"));
}
```

### 5.1 Format Specifiers

| Specifier | Description | Example |
|-----------|-------------|---------|
| `%Y` | Year | 2024 |
| `%m` | Month (01-12) | 12 |
| `%d` | Day (01-31) | 25 |
| `%H` | Hour (00-23) | 14 |
| `%M` | Minute (00-59) | 30 |
| `%S` | Second (00-59) | 00 |
| `%A` | Weekday name | Wednesday |
| `%B` | Month name | December |
| `%Z` | Timezone | UTC |

---

## 6. Date Arithmetic

```rust
use chrono::{Duration, Local, Utc};

fn main() {
 let now = Utc::now();
 
 // Add/subtract duration
 let tomorrow = now + Duration::days(1);
 let yesterday = now - Duration::days(1);
 let in_one_week = now + Duration::weeks(1);
 let in_one_hour = now + Duration::hours(1);
 
 println!("Now: {}", now);
 println!("Tomorrow: {}", tomorrow);
 println!("Yesterday: {}", yesterday);
 println!("In one week: {}", in_one_week);
 println!("In one hour: {}", in_one_hour);
}
```

---

## 7. Date Comparison

```rust
use chrono::{NaiveDate, Duration};

fn main() {
 let date1 = NaiveDate::from_ymd_opt(2024, 12, 25).unwrap();
 let date2 = NaiveDate::from_ymd_opt(2024, 12, 31).unwrap();
 
 // Comparison
 println!("date1 < date2: {}", date1 < date2);
 println!("date1 == date2: {}", date1 == date2);
 
 // Difference
 let diff = date2 - date1;
 println!("Days between: {}", diff.num_days());
 
 // Check if in past/future
 let today = NaiveDate::from_ymd_opt(2024, 12, 20).unwrap();
 println!("date1 is future: {}", date1 > today);
}
```

---

## 8. Timezone Conversion

```rust
use chrono::{TimeZone, Utc, FixedOffset, Local};

fn main() {
 let utc_now = Utc::now();
 println!("UTC: {}", utc_now);
 
 // Convert to fixed offset (Bangkok = UTC+7)
 let bangkok_offset = FixedOffset::east_opt(7 * 3600).unwrap();
 let bangkok_time = utc_now.with_timezone(&bangkok_offset);
 println!("Bangkok: {}", bangkok_time);
 
 // Convert to local
 let local_time = utc_now.with_timezone(&Local);
 println!("Local: {}", local_time);
}
```

---

## 9. Date Components

```rust
use chrono::{Datelike, Timelike, Local, Weekday};

fn main() {
 let now = Local::now();
 
 // Date components
 println!("Year: {}", now.year());
 println!("Month: {}", now.month());
 println!("Day: {}", now.day());
 println!("Day of year: {}", now.ordinal());
 
 // Time components
 println!("Hour: {}", now.hour());
 println!("Minute: {}", now.minute());
 println!("Second: {}", now.second());
 println!("Nanosecond: {}", now.nanosecond());
 
 // Weekday
 println!("Weekday: {:?}", now.weekday());
 println!("Is weekend: {}", 
 matches!(now.weekday(), Weekday::Sat | Weekday::Sun));
}
```

---

## 10. Practical Examples

### 10.1 Age Calculator

```rust
use chrono::{NaiveDate, Local};

fn calculate_age(birth_date: NaiveDate) -> i32 {
 let today = Local::now().date_naive();
 let age = today.year() - birth_date.year();
 
 // Adjust if birthday hasn't occurred yet this year
 if (today.month(), today.day()) < (birth_date.month(), birth_date.day()) {
 age - 1
 } else {
 age
 }
}

fn main() {
 let birth = NaiveDate::from_ymd_opt(1990, 6, 15).unwrap();
 println!("Age: {} years", calculate_age(birth));
}
```

### 10.2 Business Days

```rust
use chrono::{NaiveDate, Duration, Weekday};

fn add_business_days(start: NaiveDate, days: i32) -> NaiveDate {
 let mut current = start;
 let mut remaining = days;
 
 while remaining > 0 {
 current = current + Duration::days(1);
 if !matches!(current.weekday(), Weekday::Sat | Weekday::Sun) {
 remaining -= 1;
 }
 }
 
 current
}

fn main() {
 let start = NaiveDate::from_ymd_opt(2024, 12, 20).unwrap();
 let deadline = add_business_days(start, 5);
 println!("Deadline: {}", deadline);
}
```

---

## 11. สรุป

| Type | Description |
|------|-------------|
| `NaiveDate` | Date only, no timezone |
| `NaiveTime` | Time only, no timezone |
| `NaiveDateTime` | Date + Time, no timezone |
| `DateTime<Utc>` | DateTime with UTC |
| `DateTime<Local>` | DateTime with local TZ |
| `Duration` | Time duration |

| Method | Description |
|--------|-------------|
| `now()` | Current time |
| `format()` | Format to string |
| `parse_from_str()` | Parse from string |
| `with_timezone()` | Convert timezone |

---

[บทถัดไป: Regular Expressions](/intermediate/regex)
