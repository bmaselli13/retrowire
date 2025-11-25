# RetroWire Implementation Plan

## Phase 1: Critical MVP Features (Implementing Now)

### 1. Connection Validation System ✅
**Files to modify:**
- `src/App.tsx` - Add `isValidConnection` handler
- `src/store.ts` - Add validation utilities
- `src/types.ts` - Add connection validation types
- Add `react-hot-toast` for notifications

**Implementation:**
- Voltage compatibility checking
- Signal type validation (INPUT/OUTPUT matching)
- Toast notifications for warnings
- Prevent dangerous connections (with override option)

### 2. Wire Color Coding & Custom Edges ✅
**Files to create:**
- `src/CustomEdge.tsx` - Custom edge component with color support
- `src/EdgeContextMenu.tsx` - Right-click menu for edge styling

**Files to modify:**
- `src/App.tsx` - Register custom edge types
- `src/store.ts` - Add edge styling state
- `src/types.ts` - Add edge styling types

**Features:**
- Auto-color by voltage (Red=5V, Black=GND, Yellow=12V, Blue=3.3V, Green=Data)
- Right-click menu to change colors
- StepEdge for orthogonal routing
- Edge labels showing voltage/type

### 3. Toolbar & Actions ✅
**Files to create:**
- `src/Toolbar.tsx` - Top action bar component

**Features:**
- Export buttons (PNG, PDF)
- Save/Load project
- Clear canvas
- Undo/Redo (future)
- Settings toggle

### 4. Export System ✅
**Files to create:**
- `src/utils/export.ts` - Export utilities
- `src/components/BOMModal.tsx` - Bill of Materials viewer

**Dependencies to add:**
- `html-to-image` for PNG export
- `jspdf` for PDF export

**Features:**
- Export canvas to PNG
- Export canvas to PDF
- Generate Bill of Materials (component list + wire inventory)
- Print-friendly formatting

### 5. Persistence Layer ✅
**Files to modify:**
- `src/store.ts` - Add save/load methods
- `src/App.tsx` - Add auto-save on changes

**Features:**
- Save project to localStorage
- Load project on startup
- Auto-save every 30 seconds
- Project name support
- Multiple project management (future)

### 6. Enhanced Component Library ✅
**Files to modify:**
- `src/componentLibrary.ts` - Add 10+ new components

**New Components to Add:**
1. Arduino Uno
2. Zero Delay USB Encoder
3. Coin Mech
4. LCD Panel (7")
5. LED Strip (WS2812B)
6. Speakers (8Ω)
7. Marquee Light (12V)
8. ATX PSU
9. Buck Converter (12V→5V)
10. Buck Converter (12V→3.3V)

## Phase 2: UX Improvements (Next)

### 7. Improved Tooltips & Labels
- Fix port label CSS z-index issues
- Add persistent pin labels option
- Better hover states
- Voltage badges on wires

### 8. Canvas Enhancements
- Grid snap toggle
- Configurable grid size
- Better zoom controls
- Fit to content button

### 9. Keyboard Shortcuts
- Delete: Remove selected
- Ctrl+Z: Undo
- Ctrl+Y: Redo
- Ctrl+S: Save
- Ctrl+E: Export

## Technical Implementation Details

### Connection Validation Logic
```typescript
interface ValidationResult {
  valid: boolean;
  warning?: string;
  error?: string;
}

const validateConnection = (
  sourcePort: Port,
  targetPort: Port
): ValidationResult => {
  // Check signal direction
  if (sourcePort.type.includes('OUT') && targetPort.type.includes('OUT')) {
    return { valid: false, error: 'Cannot connect two outputs' };
  }
  
  // Check voltage compatibility
  if (sourcePort.voltage && targetPort.voltage) {
    const sourceV = parseVoltage(sourcePort.voltage);
    const targetV = parseVoltage(targetPort.voltage);
    
    if (sourceV > targetV * 1.2) {
      return { 
        valid: true, 
        warning: `Voltage mismatch: ${sourcePort.voltage} → ${targetPort.voltage}` 
      };
    }
  }
  
  return { valid: true };
};
```

### Wire Color Mapping
```typescript
const VOLTAGE_COLORS = {
  '3.3V': '#3b82f6', // Blue
  '5V': '#ef4444',   // Red
  '12V': '#eab308',  // Yellow
  '24V': '#f97316',  // Orange
  'GND': '#1f2937',  // Black/Dark Gray
  'AC_MAINS': '#dc2626' // Dark Red
};

const SIGNAL_COLORS = {
  'DIGITAL_IN': '#10b981',  // Green
  'DIGITAL_OUT': '#10b981', // Green
  'ANALOG': '#8b5cf6',      // Purple
  'PWM': '#ec4899',         // Pink
  'HDMI': '#06b6d4',        // Cyan
  'AUDIO': '#f59e0b'        // Amber
};
```

### Export Implementation
```typescript
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const exportToPNG = async (reactFlowRef: HTMLElement) => {
  const dataUrl = await toPng(reactFlowRef, {
    backgroundColor: '#030712',
    quality: 1.0
  });
  
  const link = document.createElement('a');
  link.download = `retrowire-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
};

const exportToPDF = async (reactFlowRef: HTMLElement) => {
  const dataUrl = await toPng(reactFlowRef, {
    backgroundColor: '#ffffff',
    quality: 1.0
  });
  
  const pdf = new jsPDF('landscape', 'px', [1920, 1080]);
  pdf.addImage(dataUrl, 'PNG', 0, 0, 1920, 1080);
  pdf.save(`retrowire-${Date.now()}.pdf`);
};
```

## Success Criteria Checklist

- [ ] User can connect components and see voltage warnings
- [ ] Wires are color-coded by voltage automatically
- [ ] User can right-click to change wire colors
- [ ] User can export to PNG
- [ ] User can export to PDF
- [ ] User can see Bill of Materials
- [ ] Project saves to localStorage automatically
- [ ] Project loads on browser refresh
- [ ] 15+ components available in library
- [ ] Tooltips show correctly on port hover
- [ ] User can delete components with Delete key

## Estimated Timeline

- Phase 1 (Critical MVP): 2-3 hours
  - Connection validation: 30 min
  - Wire styling: 45 min
  - Toolbar: 30 min
  - Export system: 45 min
  - Persistence: 30 min
  - Component library expansion: 1 hour

- Phase 2 (UX Polish): 1-2 hours
  - Tooltip improvements: 30 min
  - Canvas enhancements: 30 min
  - Keyboard shortcuts: 30 min

Total: 4-5 hours to production-ready MVP
