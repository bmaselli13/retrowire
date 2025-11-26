import { Node } from '@xyflow/react';
import { Port, ValidationResult, ComponentDefinition } from '../types';

// Helper to parse voltage values
const parseVoltage = (voltage: string): number => {
  if (voltage === 'GND') return 0;
  if (voltage === 'AC_MAINS') return 120; // Treat AC mains as high voltage
  return parseFloat(voltage.replace('V', ''));
};

// Get port from node
export const getPortFromNode = (
  nodes: Node[],
  nodeId: string,
  portId: string
): Port | null => {
  const node = nodes.find(n => n.id === nodeId);
  if (!node || !node.data) return null;
  
  const component = node.data.component as ComponentDefinition;
  return component.ports.find(p => p.id === portId) || null;
};

// Validate connection between two ports
export const validateConnection = (
  sourcePort: Port,
  targetPort: Port
): ValidationResult => {
  // Rule 1: Cannot connect two outputs
  if (sourcePort.type.includes('OUT') && targetPort.type.includes('OUT')) {
    return { 
      valid: false, 
      error: 'Cannot connect two outputs together' 
    };
  }
  
  // Rule 2: Cannot connect two inputs (unless one is POWER)
  if (sourcePort.type.includes('IN') && 
      targetPort.type.includes('IN') &&
      sourcePort.type !== 'POWER' && 
      targetPort.type !== 'POWER') {
    return { 
      valid: false, 
      error: 'Cannot connect two inputs together' 
    };
  }
  
  // Rule 3: Check voltage compatibility
  if (sourcePort.voltage && targetPort.voltage) {
    const sourceV = parseVoltage(sourcePort.voltage);
    const targetV = parseVoltage(targetPort.voltage);
    
    // Allow GND to GND
    if (sourcePort.voltage === 'GND' && targetPort.voltage === 'GND') {
      return { valid: true };
    }
    
    // Allow GND to anything
    if (sourcePort.voltage === 'GND' || targetPort.voltage === 'GND') {
      return { valid: true };
    }
    
    // Warn if voltage is significantly higher (more than 20% above target)
    if (sourceV > targetV * 1.2) {
      return { 
        valid: true, 
        warning: `⚠️ Voltage mismatch: ${sourcePort.voltage} → ${targetPort.voltage}. This may damage components!` 
      };
    }
    
    // Warn if voltage is going backwards (e.g., 3.3V to 5V power source)
    if (sourceV < targetV && targetPort.type === 'POWER') {
      return { 
        valid: true, 
        warning: `⚠️ Connecting ${sourcePort.voltage} to ${targetPort.voltage} power rail` 
      };
    }
  }
  
  return { valid: true };
};

// Get default wire color based on port voltage or signal type
export const getDefaultWireColor = (port: Port): string => {
  // Prioritize voltage-based coloring for clear visual distinction
  if (port.voltage) {
    switch (port.voltage) {
      case 'GND': return '#1f2937';  // Dark Gray (visible on dark backgrounds, represents ground)
      case '3.3V': return '#60a5fa'; // Bright Blue
      case '5V': return '#ff0000';   // BRIGHT RED for 5V power (maximum visibility)
      case '9V': return '#fb923c';   // Orange (for 9V batteries)
      case '12V': return '#fbbf24';  // Bright Yellow
      case '24V': return '#f97316';  // Bright Orange
      case 'AC_MAINS': return '#dc2626'; // Dark Red
    }
  }
  
  // For POWER type without specific voltage, use bright red
  if (port.type === 'POWER') {
    if (port.voltage === 'GND') return '#1f2937'; // Dark gray for ground (visible)
    return '#ff0000'; // Bright red for power
  }
  
  // Fall back to signal type coloring
  switch (port.type) {
    case 'DIGITAL_IN':
    case 'DIGITAL_OUT':
      return '#10b981'; // Green
    case 'ANALOG':
      return '#a78bfa'; // Bright Purple
    case 'PWM':
      return '#f472b6'; // Bright Pink
    case 'HDMI':
      return '#22d3ee'; // Bright Cyan
    case 'AUDIO':
      return '#fbbf24'; // Bright Amber
    default:
      return '#9ca3af'; // Light Gray
  }
};

// Determine edge color from source port
export const determineEdgeColor = (
  nodes: Node[],
  sourceNodeId: string,
  sourcePortId: string
): string => {
  const port = getPortFromNode(nodes, sourceNodeId, sourcePortId);
  if (!port) return '#6b7280'; // Default gray
  
  return getDefaultWireColor(port);
};
