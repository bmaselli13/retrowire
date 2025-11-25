# Switch Wiring Guide for RetroWire

This guide explains how to properly wire different types of switches in your RetroWire projects.

## Switch Types & Pin Configurations

### 1. 2-Pin Switches (Simple On/Off)

#### Arcade Button (2 pins)
```
Pins: NO (Normally Open), GND
Wiring: 
  - NO → Connect to GPIO input on controller
  - GND → Connect to ground rail
  
How it works:
  - When NOT pressed: Circuit is OPEN (no connection)
  - When pressed: Circuit CLOSES, connecting NO to GND
  - Controller reads LOW signal when pressed

Soldering:
  1. Solder red wire to NO terminal
  2. Solder black wire to GND terminal
  3. Connect red wire to GPIO pin
  4. Connect black wire to ground
```

#### 12mm Momentary Push Button (SPST - 2 pins)
```
Pins: IN, OUT
Wiring:
  - IN → Connect to signal source (e.g., GPIO pin)
  - OUT → Connect to destination (e.g., LED, relay)
  
How it works:
  - When NOT pressed: IN and OUT are disconnected
  - When pressed: IN connects to OUT (completes circuit)
  
Soldering:
  1. Solder wire to IN terminal
  2. Solder wire to OUT terminal
  3. Mount in panel with lock nut
```

#### Rocker Power Switch (SPST - 2 pins)
```
Pins: IN, OUT
Wiring:
  - IN → Connect to power supply positive terminal (5V or 12V)
  - OUT → Connect to all devices that need switched power
  
How it works:
  - When OFF (rocker down): Circuit is OPEN (no power flow)
  - When ON (rocker up): Circuit CLOSES (power flows IN → OUT)
  
Soldering:
  1. Solder RED wire from power supply to IN
  2. Solder RED wire(s) to devices on OUT
  3. All grounds (BLACK wires) bypass the switch
  
⚠️ IMPORTANT: Ground wires do NOT go through power switches!
```

---

### 2. 3-Pin Switches (Single Pole, Changeover)

#### Micro Switch (SPDT - 3 pins)
```
Pins: COM (Common), NO (Normally Open), NC (Normally Closed)

Wiring Option A - Momentary Contact:
  - COM → Connect to GPIO input
  - NO → Connect to ground
  - NC → Leave unconnected
  
Wiring Option B - Toggle Between Two Signals:
  - COM → Connect to GPIO input
  - NO → Connect to +5V (or signal A)
  - NC → Connect to GND (or signal B)

How it works:
  - Default state: COM connects to NC
  - When pressed: COM switches from NC to NO
  - When released: COM returns to NC

Soldering:
  1. Identify COM (usually center terminal)
  2. Solder wire to COM
  3. Solder wire to NO or NC based on your needs
  4. Use heat shrink on exposed connections
```

---

### 3. 4-Pin Switches (Dual Contact)

#### Tactile Push Button (4 pins)
```
Pins: Pin 1, Pin 2, Pin 3, Pin 4

Pin Layout (looking at bottom):
  Pin 1 ---- Pin 2
     |          |
  Pin 3 ---- Pin 4

Internal Connections:
  - Pins 1 & 2 are internally connected
  - Pins 3 & 4 are internally connected
  - When pressed: (1,2) connects to (3,4)

Wiring:
  - Pin 2 or Pin 4 → Connect to GPIO input
  - Pin 1 or Pin 3 → Connect to ground
  OR
  - Pin 1 → +5V (with pull-up)
  - Pin 3 → GPIO input
  - Pin 2 & 4 → Can be left unconnected

Soldering:
  1. Only need to solder TWO wires (diagonal pins work best)
  2. Option 1: Use Pin 1 + Pin 4
  3. Option 2: Use Pin 2 + Pin 3
  4. The other two pins can be left empty
  
⚠️ CAUTION: These are NOT for switching power! Use for signals only.
```

---

### 4. 6-Pin Switches (Dual Pole, Dual Throw)

#### DPDT Switch (6 pins)
```
Pins: COM1, NO1, NC1, COM2, NO2, NC2

Pin Layout:
  COM1 -- NO1
    |
   NC1

  COM2 -- NO2
    |
   NC2

This is essentially TWO separate SPDT switches in one!

Use Case A - Control Two Separate Circuits:
  Circuit 1:
    - COM1 → Signal source 1
    - NO1 → Destination 1A
    - NC1 → Destination 1B
  
  Circuit 2:
    - COM2 → Signal source 2
    - NO2 → Destination 2A
    - NC2 → Destination 2B

Use Case B - Reverse Polarity (Motor Control):
  - COM1 → Motor wire 1
  - COM2 → Motor wire 2
  - NO1 & NC2 → Positive power
  - NC1 & NO2 → Negative/Ground
  
  Toggle switch to reverse motor direction!

Soldering:
  1. Plan your circuit diagram first
  2. Label all 6 wires before soldering
  3. Use different colored wires for each circuit
  4. Test continuity with multimeter before powering
```

---

## General Soldering Tips for Switches

### Tools Needed:
- Soldering iron (25-40W)
- 60/40 rosin-core solder
- Wire strippers
- Heat shrink tubing
- Helping hands/third hand tool
- Multimeter for testing

### Process:
1. **Prepare the wire**
   - Strip 3-5mm of insulation
   - Twist strands together
   - Pre-tin the wire (apply small amount of solder)

2. **Prepare the terminal**
   - Clean terminal with isopropyl alcohol
   - Heat terminal for 2-3 seconds
   - Apply small amount of solder to terminal

3. **Make the connection**
   - Place pre-tinned wire on terminal
   - Heat both wire and terminal together
   - Add a bit more solder if needed (should flow smoothly)
   - Remove iron and hold wire still for 2-3 seconds
   - Connection should be shiny, not dull

4. **Insulate**
   - Slide heat shrink over connection
   - Heat with heat gun or lighter (carefully)
   - Ensure no exposed metal

### Testing:
- Use multimeter in continuity mode
- Test each connection before installation
- For switches: Test both pressed and unpressed states
- Verify correct pins are connecting/disconnecting

---

## Color Coding Standards

Follow these color conventions for clarity:

**Power Wiring:**
- **RED** = Positive voltage (5V, 12V, etc.)
- **BLACK** = Ground (GND, 0V)
- **YELLOW** = Switched positive (after switch)

**Signal Wiring:**
- **BLUE** = Digital input signals
- **GREEN** = Digital output signals
- **WHITE** = Common/COM connections
- **ORANGE** = PWM signals

**Special:**
- **BROWN** = Normally Closed (NC)
- **PURPLE** = Normally Open (NO)

---

## Common Mistakes to Avoid

❌ **Mistake 1**: Running ground through power switches
✅ **Correct**: Only positive power goes through switch, ground is direct

❌ **Mistake 2**: Using tactile buttons for power switching
✅ **Correct**: Tactile buttons are for signals only, use rocker switch for power

❌ **Mistake 3**: Not testing continuity before connecting to power
✅ **Correct**: Always test with multimeter first

❌ **Mistake 4**: Over-heating components during soldering
✅ **Correct**: Quick 2-3 second contact, let cool between attempts

❌ **Mistake 5**: Using too much solder (creates blobs/bridges)
✅ **Correct**: Just enough solder to make shiny connection

---

## Switch Selection Guide

**Choose your switch based on usage:**

| Use Case | Recommended Switch |
|----------|-------------------|
| Main power on/off | Rocker Power Switch (2-pin SPST) |
| Button press detection | Arcade Button or 12mm Momentary |
| Mode selection (A or B) | Micro Switch (3-pin SPDT) |
| Complex circuits | DPDT Switch (6-pin) |
| Temporary GPIO testing | Tactile Button (breadboard friendly) |

---

## Example: Wiring an Arcade Cabinet

### Power Circuit:
```
Wall Power → 5V PSU → Rocker Switch IN
                       Rocker Switch OUT → Split to:
                                           - Roku 5V
                                           - Arduino 5V  
                                           - LCD 5V
All GND pins → Common ground rail (bypassing switch)
```

### Button Circuit:
```
Arcade Button 1 NO → Arduino Pin 2
Arcade Button 1 GND → Ground rail

Arcade Button 2 NO → Arduino Pin 3
Arcade Button 2 GND → Ground rail

(etc. for all buttons)
```

This keeps power and signals completely separate and organized!

---

## Need Help?

- Check component datasheet for your specific switch model
- Use multimeter to verify pin connections
- Test on breadboard before soldering permanently
- Double-check voltage ratings (don't exceed component specs)
