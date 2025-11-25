# **Technical Design Document: RetroWire**

## **1\. Architecture Overview**

* **Frontend Framework:** React (Vite).  
* **Diagramming Engine:** React Flow (specifically `@xyflow/react`). This is the industry standard for node-based editors.  
* **Styling:** Tailwind CSS (for UI overlay) \+ Custom CSS (for canvas nodes).  
* **State Management:** Zustand (lightweight, plays very well with React Flow).  
* **Persistence:** `localStorage` (MVP) \-\> Firestore (V2).

## **2\. Component Data Model (The "Brain")**

To make this useful, components cannot just be images. They must have defined "Ports" with electrical properties.

### **Component Interface (TypeScript)**

type Voltage \= '3.3V' | '5V' | '12V' | '24V' | 'GND' | 'AC\_MAINS';  
type SignalType \= 'DIGITAL\_IN' | 'DIGITAL\_OUT' | 'ANALOG' | 'PWM' | 'POWER' | 'HDMI' | 'AUDIO';

interface Port {  
  id: string;  
  label: string; // e.g., "GPIO 4" or "VCC"  
  type: SignalType;  
  voltage?: Voltage;  
  x: number; // Relative % position on the node visual  
  y: number; // Relative % position on the node visual  
}

interface ComponentDefinition {  
  id: string;  
  name: string; // e.g., "Sanwa OBSF-30 Button"  
  category: 'controller' | 'input' | 'power' | 'display';  
  imageUrl: string; // SVG or PNG representation  
  width: number;  
  height: number;  
  ports: Port\[\];  
}

### **Example Component JSON: Raspberry Pi 4 (Simplified)**

{  
  "id": "rpi-4",  
  "name": "Raspberry Pi 4 Model B",  
  "category": "controller",  
  "width": 200,  
  "height": 140,  
  "imageUrl": "/assets/components/rpi4\_topdown.svg",  
  "ports": \[  
    { "id": "p1", "label": "3.3V", "type": "POWER", "voltage": "3.3V", "x": 90, "y": 5 },  
    { "id": "p2", "label": "5V", "type": "POWER", "voltage": "5V", "x": 90, "y": 10 },  
    { "id": "p6", "label": "GND", "type": "POWER", "voltage": "GND", "x": 90, "y": 25 },  
    { "id": "p12", "label": "GPIO 18 (PWM)", "type": "PWM", "voltage": "3.3V", "x": 90, "y": 50 }  
  \]  
}

## **3\. Implementation Strategy**

### **Step 1: The Custom Node**

We will not use default React Flow nodes. We will create a `HardwareNode.tsx`.

* It renders the `imageUrl` as the background.  
* It dynamically maps the `ports` array to React Flow `<Handle />` components.  
* This ensures that the "wires" physically snap to the correct pins on the image.

### **Step 2: Connection Validation**

React Flow provides an `isValidConnection` prop. We will implement logic here:

* **Rule 1:** Cannot connect Output to Output.  
* **Rule 2:** Voltage Check (Warning). If `source.voltage === '12V'` and `target.voltage === '3.3V'`, trigger a UI warning toast (but maybe allow it with a confirmation, as the user might be adding a resistor in between that we don't see).

### **Step 3: Wire Styling**

Use `SmoothStepEdge` or `StepEdge` from React Flow to mimic schematic aesthetics. Allow right-click on edge \-\> "Change Color" context menu.

