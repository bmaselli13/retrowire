# RetroWire Implementation Gap Analysis

**Completed by:** Senior Staff Engineer & Product Manager Review
**Date:** November 24, 2025

## Executive Summary

RetroWire has a solid foundation with React Flow, TypeScript, and component infrastructure. However, several critical features from the PRD and Technical Design Document are missing or incomplete.

## 🔴 Critical Gaps (Must Have for MVP)

### 1. Connection Validation System
**Status:** ❌ Not Implemented
**Priority:** P0 - Blocker for MVP

**Missing:**
- Voltage mismatch warnings (e.g., 12V → 3.3V)
- Signal type validation (DIGITAL_OUT → DIGITAL_IN only)
- Visual warnings/errors for invalid connections
- `isValidConnection` hook implementation

**Technical Implementation:**
```typescript
// Required in App.tsx
const isValidConnection = (connection: Connection) => {
  // Check source/target ports
  // Validate voltage compatibility
  // Validate signal type compatibility
  // Return boolean + show warning toast
};
```

### 2. Wire Color Coding & Styling
**Status:** ❌ Not Implemented
**Priority:** P0 - Core Feature

**Missing:**
- Default color by voltage (Red=5V, Black=GND, Yellow=12V, Green=Data)
- Right-click context menu to change wire colors
- Edge labels showing voltage/signal type
- StepEdge or SmoothStepEdge for orthogonal routing

**Expected User Flow:**
1. User connects two ports → wire appears with voltage-appropriate color
2. Right-click wire → "Change Color" → color picker
3. Wire automatically routes orthogonally around components

### 3. Export & Print System
**Status:** ❌ Not Implemented
**Priority:** P0 - Required for "tape inside cabinet" use case

**Missing:**
- PNG export (for digital sharing)
- PDF export (for printing)
- Bill of Materials (BOM) generation
- Print-friendly layout

**Technical Approach:**
- Use `toPng()` from React Flow utilities
- jsPDF for PDF generation
- Component count + wire inventory for BOM

### 4. Persistence Layer
**Status:** ❌ Not Implemented
**Priority:** P0 - Users need to save work

**Missing:**
- localStorage save/load
- Auto-save functionality
- Project naming
- Multiple project support

## 🟡 Important Gaps (Should Have for MVP)

### 5. Enhanced Component Library
**Status:** ⚠️ Partially Complete (4/15+ components)
**Priority:** P1

**Missing Components by Category:**

**Controllers:**
- ✅ Raspberry Pi 4
- ❌ Arduino Uno/Nano
- ❌ Pandora's Box
- ❌ Zero Delay USB Encoder

**Input:**
- ✅ Arcade Button
- ✅ Arcade Joystick
- ❌ Coin Mech
- ❌ Trackball
- ❌ Spinner

**Output:**
- ❌ LCD Panel (5", 7", etc.)
- ❌ CRT Driver Board
- ❌ Speakers (4Ω, 8Ω)
- ❌ LED Strip (WS2812B)
- ❌ Marquee Light (12V)

**Power:**
- ✅ 12V PSU
- ❌ ATX PSU
- ❌ Buck Converter (12V→5V)
- ❌ Buck Converter (12V→3.3V)

### 6. Canvas Enhancements
**Status:** ⚠️ Basic Implementation
**Priority:** P1

**Missing:**
- Explicit grid snap toggle
- Snap-to-grid size configuration
- Better zoom controls (fit to content, zoom to selection)
- Canvas ruler/measurements

### 7. Tooltip & Label Improvements
**Status:** ⚠️ CSS Issues
**Priority:** P1

**Issues:**
- Port labels don't show on hover reliably
- No persistent pin labels
- Missing voltage indicators on wires

### 8. Toolbar & Controls
**Status:** ❌ Not Implemented
**Priority:** P1

**Missing:**
- Top toolbar with common actions
- Delete selected (keyboard support)
- Undo/Redo
- Clear canvas
- Settings/preferences

## 🟢 Nice to Have (Post-MVP)

### 9. Advanced Features
**Status:** ❌ Future
**Priority:** P2

- Auto-routing around obstacles
- Component rotation
- Component templates/grouping
- Wire annotations/notes
- Multi-page diagrams
- Community component sharing

### 10. Quality of Life
**Status:** ❌ Future
**Priority:** P2

- Keyboard shortcuts guide
- Onboarding tutorial
- Dark/light theme toggle
- Accessibility improvements
- Mobile/tablet support

## Implementation Roadmap

### Phase 1: Critical Features (Week 1-2)
1. ✅ Connection validation system
2. ✅ Wire color coding & styling
3. ✅ Basic export (PNG)
4. ✅ localStorage persistence

### Phase 2: Component Library (Week 3)
5. ✅ Add 8-10 more components
6. ✅ Component categorization in sidebar
7. ✅ Search/filter components

### Phase 3: UX Polish (Week 4)
8. ✅ Toolbar implementation
9. ✅ Better tooltips
10. ✅ PDF export + BOM
11. ✅ Keyboard shortcuts

### Phase 4: Advanced (Future)
- Auto-routing
- Community features
- Templates

## Technical Debt Notes

1. **Port Label CSS:** Current implementation has z-index/opacity issues
2. **Node ID Generation:** Using simple counter, should use UUID
3. **Type Safety:** Some `as` type assertions in ComponentNode.tsx
4. **Edge Types:** Need to define custom edge types for better styling
5. **Error Handling:** No error boundaries or validation feedback

## Metrics for Success

- ✅ Can create a basic button→Pi4 wiring in < 2 minutes
- ❌ Voltage mismatch warning appears when needed
- ❌ Can export and print diagram
- ❌ Diagram persists after browser refresh
- ❌ BOM shows all components + wire counts

## Next Actions

1. Implement connection validation with toast notifications
2. Add wire color system with right-click menu
3. Build export functionality (PNG → PDF → BOM)
4. Add localStorage save/load
5. Expand component library to 15+ components
