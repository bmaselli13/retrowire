# Power Switches vs Signal Switches - Critical Differences

## The Confusion: Why Can't a Tactile Button Control Power?

You might see the message: **"ℹ️ Tactile Push Button doesn't require power connection"**

This is CORRECT and here's why:

## Understanding Switch Types

### ❌ Tactile Push Button = SIGNAL Switch (NOT for Power)

**What it is:**
- A small 4-pin button for breadboards/PCBs
- Category: `input` (signal device)
- Designed for LOW CURRENT (milliamps)
- Connects to GPIO pins on microcontrollers

**Pin Configuration:**
```
   Pin 1 ---- Pin 2
      |          |
   Pin 3 ---- Pin 4
   
   - Pins 1&2 internally connected
   - Pins 3&4 internally connected
   - When pressed: (1,2) connects to (3,4)
```

**What it does:**
- Sends a digital signal to Arduino/Raspberry Pi
- Used for: button input, menu selection, triggering functions
- Typical current: 5-50 mA (milliamps)

**Wiring:**
```
Pin 1 (or 3) → Arduino GND
Pin 2 (or 4) → Arduino GPIO pin (e.g., D2)
Arduino reads: HIGH (unpressed) or LOW (pressed)
```

**Why it CAN'T control power:**
- ⚠️ Maximum current: ~50mA
- ⚠️ Your power needs: 5A (5000mA) for Roku + display + etc.
- ⚠️ Result: Button would MELT and cause a fire! 🔥

**The tactile button itself doesn't need 5V power - it just needs to be connected to GPIO and ground to send signals.**

---

### ✅ Rocker Power Switch = POWER Switch (For Controlling Power)

**What it is:**
- A physical rocker switch rated for HIGH CURRENT
- Category: `power` (power distribution device)
- Designed for HIGH CURRENT (amps)
- Sits between power supply and your devices

**Pin Configuration:**
```
Simple 2-pin:
   IN ----[switch]---- OUT
   
   When OFF: IN and OUT are disconnected (open circuit)
   When ON:  IN and OUT are connected (closed circuit)
```

**What it does:**
- Physically breaks/connects the power line
- Used for: main power on/off, safety cutoff
- Typical current: 5-15 Amps

**Wiring:**
```
Power Supply 5V OUT → Rocker Switch IN
Rocker Switch OUT → Roku 5V, LCD 5V, etc. (all devices)
Ground wires BYPASS the switch (connect directly)
```

**Why it CAN control power:**
- ✅ Rated for 10A or more
- ✅ Can handle full circuit current (5A)
- ✅ Heavy-duty contacts won't overheat
- ✅ Designed specifically for this purpose

---

## Direct Comparison

| Feature | Tactile Button | Rocker Power Switch |
|---------|---------------|---------------------|
| **Purpose** | Send signals to microcontroller | Switch power on/off |
| **Current Rating** | 50mA | 5-15A |
| **Voltage** | Usually 5V or 3.3V signals | Can handle 5V, 12V, 120V, etc. |
| **Connection** | Between GPIO and GND | Between power source and devices |
| **Category** | input (signal) | power (distribution) |
| **Can control power?** | ❌ NO - will burn up! | ✅ YES - designed for it |

---

## Your Roku Setup - Correct Wiring

### ❌ WRONG Way (Using Tactile Button):
```
5V PSU → Tactile Button → Roku + LCD
              ↓
           💥 FIRE HAZARD!
```
**Problem:** Button rated for 50mA, circuit draws 5000mA = OVERHEATING

### ✅ CORRECT Way (Using Rocker Switch):
```
5V PSU → Rocker Switch IN
         Rocker Switch OUT → Roku 5V
                           → LCD 5V
                           → (other devices)
                           
All GND → Common Ground (bypasses switch)
```
**Success:** Switch rated for 10A, circuit draws 5A = SAFE

---

## What About Controlling Power with a Small Button?

**Q:** "But I want a small button to turn on my project!"

**A:** You need a **relay**! Here's how:

### Solution: Button + Relay + Power

```
Power Circuit (High Current):
  5V PSU → Relay → Roku/LCD
  
Control Circuit (Low Current):
  Arduino GPIO → Tactile Button → GND
  Arduino GPIO → Relay Control Pin
  
When you press button:
  1. Arduino detects button press
  2. Arduino activates relay
  3. Relay switches main power on/off
```

**This gives you:**
- ✅ Small tactile button for user interaction
- ✅ Safe high-current switching via relay
- ✅ Microcontroller control (can add delays, LED indicators, etc.)

---

## About HDMI and Display Connections

You may see HDMI ports on:
- Roku Express 4K+
- LCD displays
- HDMI cables
- Audio extractors

**Why they're shown but not auto-wired:**

HDMI is a video/audio signal, NOT an electrical power/control signal. The auto-wiring system:
- ✅ Wires power (5V, 12V, GND)
- ✅ Wires signals (GPIO, PWM for LEDs/buttons)
- ❌ Does NOT wire HDMI (manual connection required)

**Manual HDMI wiring is simple:**
```
Roku HDMI OUT → HDMI Cable → LCD HDMI IN
```

**HDMI devices still need power:**
- Roku needs: 5V + GND (auto-wired by system)
- LCD needs: 5V + GND (auto-wired by system)
- HDMI cable needs: Nothing (it's just a cable)

---

## Summary

### For Power Control:
- Use **Rocker Power Switch** (category: power)
- Handles high current safely
- Simple on/off operation

### For Signal Input:
- Use **Tactile Button** (category: input)
- Connects to microcontroller GPIO
- For menus, functions, triggering actions

### For Advanced Control:
- Use **Button + Arduino + Relay**
- Button sends signal to Arduino
- Arduino controls relay
- Relay switches main power

### For Video:
- Connect HDMI manually
- Auto-wiring handles power only
- Simple plug-and-play cables

---

## RetroWire Component Guide

**Want to control main power?** → Add "Rocker Power Switch (SPST)"

**Want to send signals to Arduino?** → Add "Tactile Push Button"

**Want arcade-style buttons?** → Add "Arcade Button" (also signals, not power)

**Want to wire a Roku display?** → 
1. Add "5V Power Supply"
2. Add "Rocker Power Switch" 
3. Add "Roku Express 4K+"
4. Add "LCD Display"
5. Auto-wire power connections
6. Manually plug HDMI cable

This keeps your wiring safe, organized, and functional!
