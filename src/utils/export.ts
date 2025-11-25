import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Node, Edge } from '@xyflow/react';
import { ComponentDefinition, Port } from '../types';

export interface BOMItem {
  name: string;
  category: string;
  quantity: number;
  ports: number;
}

export const generateBOM = (nodes: Node[], edges: Edge[]): BOMItem[] => {
  const componentCounts = new Map<string, { component: ComponentDefinition; count: number }>();
  
  nodes.forEach(node => {
    const component = node.data.component as ComponentDefinition;
    const existing = componentCounts.get(component.id);
    
    if (existing) {
      existing.count++;
    } else {
      componentCounts.set(component.id, { component, count: 1 });
    }
  });
  
  const bom: BOMItem[] = Array.from(componentCounts.values()).map(({ component, count }) => ({
    name: component.name,
    category: component.category,
    quantity: count,
    ports: component.ports.length,
  }));
  
  // Add wire count
  if (edges.length > 0) {
    bom.push({
      name: 'Wires/Connections',
      category: 'wiring',
      quantity: edges.length,
      ports: 0,
    });
  }
  
  return bom.sort((a, b) => a.category.localeCompare(b.category));
};

export const generateConnectionGuide = (nodes: Node[], edges: Edge[]): string => {
  let guide = '╔════════════════════════════════════════════════════════════════╗\n';
  guide += '║         RETROWIRE - STEP-BY-STEP CONNECTION GUIDE            ║\n';
  guide += '║              SRE-Style Wiring Runbook                         ║\n';
  guide += '╚════════════════════════════════════════════════════════════════╝\n\n';
  
  // Document Information
  guide += '📋 DOCUMENT INFORMATION\n';
  guide += '─────────────────────────────────────────────────────────────────\n';
  guide += `Generated: ${new Date().toLocaleString()}\n`;
  guide += `Total Components: ${nodes.length}\n`;
  guide += `Total Connections: ${edges.length}\n`;
  guide += `Estimated Time: ${Math.ceil(edges.length * 2)} minutes\n\n`;
  
  // Safety Notice
  guide += '⚠️  SAFETY NOTICE\n';
  guide += '─────────────────────────────────────────────────────────────────\n';
  guide += '• Disconnect all power sources before wiring\n';
  guide += '• Verify voltage compatibility before connecting\n';
  guide += '• Double-check polarity on all connections\n';
  guide += '• Use appropriate wire gauge for current requirements\n';
  guide += '• Test connections before final assembly\n\n';
  
  // Pre-requisites
  guide += '📦 PRE-REQUISITES\n';
  guide += '─────────────────────────────────────────────────────────────────\n';
  guide += 'Required Components:\n';
  nodes.forEach((node, index) => {
    const component = node.data.component as ComponentDefinition;
    guide += `  ${index + 1}. ${component.name} (${component.category})\n`;
  });
  guide += '\nRequired Tools:\n';
  guide += '  • Wire strippers\n';
  guide += '  • Screwdriver set\n';
  guide += '  • Multimeter (for testing)\n';
  guide += '  • Wire crimpers (if using crimp connectors)\n';
  guide += `  • Approximately ${edges.length} wires (various colors recommended)\n\n`;
  
  // Connection Steps
  guide += '🔌 CONNECTION STEPS\n';
  guide += '─────────────────────────────────────────────────────────────────\n\n';
  
  if (edges.length === 0) {
    guide += 'No connections defined yet. Add components and create connections\n';
    guide += 'in RetroWire to generate wiring instructions.\n\n';
  } else {
    edges.forEach((edge, index) => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;
      
      const sourceComponent = sourceNode.data.component as ComponentDefinition;
      const targetComponent = targetNode.data.component as ComponentDefinition;
      
      const sourcePort = sourceComponent.ports.find((p: Port) => p.id === edge.sourceHandle);
      const targetPort = targetComponent.ports.find((p: Port) => p.id === edge.targetHandle);
      
      const wireColor = (edge.data as any)?.color || '#6b7280';
      const voltage = sourcePort?.voltage || 'N/A';
      const signalType = sourcePort?.type || 'N/A';
      
      guide += `STEP ${index + 1}: Connect ${sourceComponent.name} to ${targetComponent.name}\n`;
      guide += '┌────────────────────────────────────────────────────────────┐\n';
      guide += `│ SOURCE: ${sourceComponent.name}\n`;
      guide += `│   Port: ${sourcePort?.label || edge.sourceHandle}\n`;
      guide += `│\n`;
      guide += `│ TARGET: ${targetComponent.name}\n`;
      guide += `│   Port: ${targetPort?.label || edge.targetHandle}\n`;
      guide += `│\n`;
      guide += `│ WIRE SPECIFICATIONS:\n`;
      guide += `│   Color: ${wireColor === '#ef4444' ? 'Red (5V)' : wireColor === '#eab308' ? 'Yellow (12V)' : wireColor === '#1f2937' ? 'Black (GND)' : wireColor === '#10b981' ? 'Green (Signal)' : 'Standard'}\n`;
      guide += `│   Voltage: ${voltage}\n`;
      guide += `│   Signal Type: ${signalType}\n`;
      guide += '└────────────────────────────────────────────────────────────┘\n';
      guide += '\n';
      guide += 'PROCEDURE:\n';
      guide += `  1. Locate the "${sourcePort?.label || edge.sourceHandle}" port on ${sourceComponent.name}\n`;
      guide += `  2. Locate the "${targetPort?.label || edge.targetHandle}" port on ${targetComponent.name}\n`;
      guide += '  3. Strip approximately 5-7mm of insulation from each wire end\n';
      guide += `  4. Connect one end to ${sourceComponent.name} - ${sourcePort?.label}\n`;
      guide += `  5. Route the wire neatly to avoid interference\n`;
      guide += `  6. Connect the other end to ${targetComponent.name} - ${targetPort?.label}\n`;
      guide += '  7. Secure the connection (screw terminal, crimp, or solder)\n';
      guide += '  8. ✓ Verify connection is firm and secure\n';
      
      // Add voltage warnings if applicable
      if (voltage && voltage !== 'GND' && voltage !== 'N/A') {
        guide += `\n  ⚠️  WARNING: This is a ${voltage} connection - verify compatibility!\n`;
      }
      
      guide += '\n';
    });
  }
  
  // Post-Connection Checklist
  guide += '✅ POST-CONNECTION CHECKLIST\n';
  guide += '─────────────────────────────────────────────────────────────────\n';
  guide += '□ All connections are secure and tight\n';
  guide += '□ No exposed wire strands that could cause shorts\n';
  guide += '□ Wires are routed cleanly and avoid pinch points\n';
  guide += '□ All polarity is correct (+ to +, - to -)\n';
  guide += '□ Double-checked voltage ratings on all connections\n';
  guide += '□ Used multimeter to test continuity (if applicable)\n';
  guide += '□ No wires are crossed or touching unintended contacts\n';
  guide += '□ Cable management is neat and organized\n\n';
  
  // Testing Procedure
  guide += '🧪 TESTING PROCEDURE\n';
  guide += '─────────────────────────────────────────────────────────────────\n';
  guide += '1. VISUAL INSPECTION\n';
  guide += '   • Inspect all connections for proper seating\n';
  guide += '   • Check for any loose strands or exposed wire\n';
  guide += '   • Verify wire routing is clean and organized\n\n';
  guide += '2. CONTINUITY TEST (if applicable)\n';
  guide += '   • Use multimeter in continuity mode\n';
  guide += '   • Test each connection for proper conductivity\n';
  guide += '   • Verify no shorts between adjacent pins\n\n';
  guide += '3. POWER-ON TEST\n';
  guide += '   • Connect power source\n';
  guide += '   • Verify correct voltage at key points\n';
  guide += '   • Test each input/output function\n';
  guide += '   • Monitor for any unusual heat or smell\n\n';
  
  // Troubleshooting
  guide += '🔧 TROUBLESHOOTING\n';
  guide += '─────────────────────────────────────────────────────────────────\n';
  guide += 'IF CONNECTION FAILS:\n';
  guide += '  1. Disconnect power immediately\n';
  guide += '  2. Check wire is fully seated in both terminals\n';
  guide += '  3. Verify correct ports are connected\n';
  guide += '  4. Check for damaged wire or terminals\n';
  guide += '  5. Test continuity with multimeter\n\n';
  guide += 'IF COMPONENT DOESN\'T WORK:\n';
  guide += '  1. Verify power is reaching the component\n';
  guide += '  2. Check voltage matches component requirements\n';
  guide += '  3. Verify ground connection is solid\n';
  guide += '  4. Test component independently if possible\n\n';
  
  // Footer
  guide += '─────────────────────────────────────────────────────────────────\n';
  guide += '📝 NOTES:\n';
  guide += '• Keep this guide for future reference and maintenance\n';
  guide += '• Document any deviations from these instructions\n';
  guide += '• Take photos of completed wiring for documentation\n';
  guide += '• Label wires if possible for easier troubleshooting\n\n';
  guide += '─────────────────────────────────────────────────────────────────\n';
  guide += 'Generated by RetroWire - Visual Electronics Wiring Tool\n';
  guide += 'https://github.com/retrowire\n';
  guide += '─────────────────────────────────────────────────────────────────\n';
  
  return guide;
};

export const downloadConnectionGuide = (nodes: Node[], edges: Edge[], filename?: string): void => {
  const guide = generateConnectionGuide(nodes, edges);
  const blob = new Blob([guide], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = filename || `retrowire-guide-${Date.now()}.txt`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const exportToPNG = async (_elementId: string, nodes: Node[], edges: Edge[], filename?: string): Promise<void> => {
  const element = document.querySelector(`.react-flow`) as HTMLElement;
  if (!element) {
    throw new Error('Canvas element not found');
  }
  
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#030712',
      quality: 1.0,
      pixelRatio: 2, // Higher resolution
    });
    
    const link = document.createElement('a');
    const pngFilename = filename || `retrowire-${Date.now()}.png`;
    link.download = pngFilename;
    link.href = dataUrl;
    link.click();
    
    // Also download the connection guide
    const guideFilename = pngFilename.replace('.png', '-guide.txt');
    downloadConnectionGuide(nodes, edges, guideFilename);
    
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw new Error('Failed to export diagram as PNG');
  }
};

export const exportToPDF = async (_elementId: string, nodes: Node[], edges: Edge[], filename?: string): Promise<void> => {
  const element = document.querySelector(`.react-flow`) as HTMLElement;
  if (!element) {
    throw new Error('Canvas element not found');
  }
  
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 1.0,
      pixelRatio: 2,
    });
    
    // Create PDF in landscape mode
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1920, 1080]
    });
    
    pdf.addImage(dataUrl, 'PNG', 0, 0, 1920, 1080);
    const pdfFilename = filename || `retrowire-${Date.now()}.pdf`;
    pdf.save(pdfFilename);
    
    // Also download the connection guide
    const guideFilename = pdfFilename.replace('.pdf', '-guide.txt');
    downloadConnectionGuide(nodes, edges, guideFilename);
    
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw new Error('Failed to export diagram as PDF');
  }
};

export const exportBOMToText = (bom: BOMItem[]): string => {
  let text = 'RETROWIRE - BILL OF MATERIALS\n';
  text += '================================\n\n';
  
  const categories = ['controller', 'input', 'power', 'output', 'display', 'wiring'];
  
  categories.forEach(category => {
    const items = bom.filter(item => item.category === category);
    if (items.length === 0) return;
    
    text += `${category.toUpperCase()}\n`;
    text += '-'.repeat(40) + '\n';
    
    items.forEach(item => {
      text += `  ${item.quantity}x ${item.name}`;
      if (item.ports > 0) {
        text += ` (${item.ports} ports)`;
      }
      text += '\n';
    });
    
    text += '\n';
  });
  
  text += `Total Components: ${bom.filter(i => i.category !== 'wiring').length}\n`;
  text += `Total Wires: ${bom.find(i => i.category === 'wiring')?.quantity || 0}\n`;
  
  return text;
};

export const downloadBOMAsText = (bom: BOMItem[], filename?: string): void => {
  const text = exportBOMToText(bom);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = filename || `retrowire-bom-${Date.now()}.txt`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
};
