// Type definitions based on Technical Design Document

export type Voltage = '3.3V' | '5V' | '12V' | '24V' | 'GND' | 'AC_MAINS';
export type SignalType = 'DIGITAL_IN' | 'DIGITAL_OUT' | 'ANALOG' | 'PWM' | 'POWER' | 'HDMI' | 'AUDIO';

export interface Port {
  id: string;
  label: string; // e.g., "GPIO 4" or "VCC"
  type: SignalType;
  voltage?: Voltage;
  x: number; // Relative % position on the node visual
  y: number; // Relative % position on the node visual
}

export interface ComponentDefinition {
  id: string;
  name: string; // e.g., "Sanwa OBSF-30 Button"
  category: 'controller' | 'input' | 'power' | 'display' | 'output';
  imageUrl: string; // SVG or PNG representation
  width: number;
  height: number;
  ports: Port[];
}

// Edge styling types
export interface EdgeStyle {
  color?: string;
  strokeWidth?: number;
  animated?: boolean;
}

// Connection validation types
export interface ValidationResult {
  valid: boolean;
  warning?: string;
  error?: string;
}

// Voltage to color mapping
export const VOLTAGE_COLORS: Record<Voltage, string> = {
  '3.3V': '#3b82f6',   // Blue
  '5V': '#ef4444',     // Red
  '12V': '#eab308',    // Yellow
  '24V': '#f97316',    // Orange
  'GND': '#1f2937',    // Dark Gray
  'AC_MAINS': '#dc2626' // Dark Red
};

export const SIGNAL_COLORS: Record<SignalType, string> = {
  'DIGITAL_IN': '#10b981',  // Green
  'DIGITAL_OUT': '#10b981', // Green
  'ANALOG': '#8b5cf6',      // Purple
  'PWM': '#ec4899',         // Pink
  'POWER': '#6b7280',       // Gray
  'HDMI': '#06b6d4',        // Cyan
  'AUDIO': '#f59e0b'        // Amber
};
