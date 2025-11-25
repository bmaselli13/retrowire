# **Product Requirements Document: RetroWire**

**Version:** 1.0 **Status:** Draft **Target Audience:** Makers, Arcade Builders (1/6 & 1/4 scale), Retro Modders.

## **1\. Product Vision**

A browser-based visual wiring tool that allows makers to drag-and-drop realistic representations of electronic components onto a canvas and "wire" them together. The system provides real-time validation (preventing voltage mismatches) and generates a clean, printable wiring diagram for assembly.

## **2\. Key User Stories**

* **As a Maker,** I want to select a "Raspberry Pi 4" and an "Arcade Button" from a library so I don't have to draw them.  
* **As a Builder,** I want to draw a wire from the button's "NO" (Normally Open) terminal to a specific GPIO pin.  
* **As a Novice,** I want the system to warn me if I try to connect a 12V Marquee Light directly to a 5V header.  
* **As a Planner,** I want to export a PDF of my wiring diagram to tape inside my arcade cabinet for future repairs.

## **3\. Core Features (MVP)**

### **A. The Workbench (Canvas)**

* Infinite panning/zooming canvas.  
* Grid snap for neat wiring.  
* "Orthogonal" routing (wires connect at 90-degree angles like professional schematics).

### **B. Component Library (The "Parts Bin")**

Must include specific "Maker" categories:

* **Controllers:** Raspberry Pi, Arduino, Pandora's Box, encoder boards (Zero Delay USB).  
* **Input:** Arcade Buttons (Sanwa/Happ), Joysticks, Coin Mechs.  
* **Output:** LCD Panels, CRT Driver Boards, Speakers, LEDs.  
* **Power:** ATX PSU, 12V Bricks, Buck Converters.

### **C. The Wiring Logic**

* **Color Coding:** Users can change wire colors (Red=5V, Black=GND, Yellow=12V, Green=Data) to match real wire spools.  
* **Pin Labels:** Hovering over a connection point shows the label (e.g., "GPIO 17" or "GND").

### **D. Export**

* Export to PNG/PDF.  
* Generate a "Bill of Materials" (BOM) based on placed components.

## **4\. Future Features (Post-MVP)**

* **Community Library:** Users upload their own component JSON definitions.  
* **Auto-Route:** Click two points, and the app routes the wire neatly around obstacles.

