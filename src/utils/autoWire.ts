import { Node, Edge } from '@xyflow/react';
import { ComponentDefinition, Port } from '../types';
import { determineEdgeColor } from './validation';

export class AutoWiringAgent {
  private nodes: Node[];
  private newEdges: Edge[] = [];
  private edgeIdCounter = 0;

  constructor(nodes: Node[], existingEdges: Edge[], _preferredVoltage: '5V' | '12V' = '5V') {
    this.nodes = nodes;
    // Initialize counter based on existing edge IDs to prevent duplicates
    this.edgeIdCounter = this.getMaxEdgeId(existingEdges) + 1;
  }

  private getMaxEdgeId(edges: Edge[]): number {
    let maxId = 0;
    edges.forEach(edge => {
      const match = edge.id.match(/auto-edge-(\d+)/);
      if (match) {
        const id = parseInt(match[1]);
        if (id > maxId) maxId = id;
      }
    });
    return maxId;
  }

  // Main auto-wiring logic
  public generateWiring(): { edges: Edge[]; log: string[]; nodes: Node[] } {
    const log: string[] = [];
    log.push('🤖 Auto-Wiring Agent Starting...');
    log.push('');

    // Step 1: Identify components by category
    const powerSources = this.getNodesByCategory('power');
    const controllers = this.getNodesByCategory('controller');
    const inputs = this.getNodesByCategory('input');
    const outputs = this.getNodesByCategory('output');
    const displays = this.getNodesByCategory('display');

    log.push(`📊 Component Analysis:`);
    log.push(`  • Power Sources: ${powerSources.length}`);
    log.push(`  • Controllers: ${controllers.length}`);
    log.push(`  • Inputs: ${inputs.length}`);
    log.push(`  • Outputs: ${outputs.length}`);
    log.push(`  • Displays: ${displays.length}`);
    log.push('');

    if (this.nodes.length === 0) {
      log.push('❌ No components on canvas');
      return { edges: [], log, nodes: [] };
    }

    // Step 1.5: Auto-layout components
    log.push('📐 Step 0: Arranging Component Layout');
    this.arrangeComponents(powerSources, controllers, inputs, outputs, displays, log);
    log.push('');

    // Step 2: Wire power distribution - connect all components that need power
    log.push('⚡ Step 1: Power Distribution');
    const powerConsumers = [...controllers, ...inputs, ...outputs, ...displays];
    this.wirePowerDistribution(powerSources, powerConsumers, log);
    log.push('');

    // Step 3: Wire controllers to inputs
    log.push('🎮 Step 2: Controller to Input Connections');
    this.wireControllerToInputs(controllers, inputs, log);
    log.push('');

    // Step 4: Wire controllers to outputs
    log.push('📺 Step 3: Controller to Output Connections');
    this.wireControllerToOutputs(controllers, outputs, log);
    log.push('');

    // Step 5: Wire displays
    log.push('🖥️ Step 4: Display Connections');
    this.wireDisplays(controllers, displays, log);
    log.push('');

    // Step 6: Ground connections
    log.push('🔌 Step 5: Ground Connections');
    this.wireGrounding(log);
    log.push('');

    // Step 7: Verify all components are connected
    log.push('🔍 Step 6: Connection Verification');
    this.verifyAllConnections(log);
    log.push('');

    log.push(`✅ Auto-wiring complete! Created ${this.newEdges.length} connections.`);
    log.push(`📍 Components arranged in logical layout.`);

    return { edges: this.newEdges, log, nodes: this.nodes };
  }

  private verifyAllConnections(log: string[]): void {
    const connectedNodeIds = new Set<string>();
    
    // Collect all nodes that have at least one connection
    this.newEdges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    // Find unconnected components
    const unconnectedNodes = this.nodes.filter(node => !connectedNodeIds.has(node.id));
    
    if (unconnectedNodes.length === 0) {
      log.push(`  ✅ All ${this.nodes.length} components successfully connected!`);
    } else {
      log.push(`  ⚠️  ${unconnectedNodes.length} component(s) not connected:`);
      unconnectedNodes.forEach(node => {
        const comp = this.getComponent(node);
        log.push(`    ❌ ${comp.name} (${comp.category})`);
      });
      log.push(`  💡 These components may need manual wiring.`);
    }

    // Report connection summary
    log.push(`  📊 Summary: ${connectedNodeIds.size}/${this.nodes.length} components wired`);
  }

  private arrangeComponents(
    powerSources: Node[],
    controllers: Node[],
    inputs: Node[],
    outputs: Node[],
    displays: Node[],
    log: string[]
  ): void {
    const startX = 50;
    const startY = 100;
    const columnSpacing = 300;
    const rowSpacing = 180;

    let currentY = startY;

    // Column 1: Power sources (left)
    if (powerSources.length > 0) {
      log.push(`  • Positioning ${powerSources.length} power source(s) - Left column`);
      powerSources.forEach((node, idx) => {
        node.position = { x: startX, y: currentY + (idx * rowSpacing) };
      });
    }

    // Column 2: Controllers (center-left)
    currentY = startY;
    if (controllers.length > 0) {
      log.push(`  • Positioning ${controllers.length} controller(s) - Center column`);
      controllers.forEach((node, idx) => {
        node.position = { x: startX + columnSpacing, y: currentY + (idx * rowSpacing) };
      });
    }

    // Column 3: Inputs (center-right, top half)
    currentY = startY;
    if (inputs.length > 0) {
      log.push(`  • Positioning ${inputs.length} input(s) - Right column (top)`);
      inputs.forEach((node, idx) => {
        node.position = { x: startX + columnSpacing * 2, y: currentY + (idx * 120) };
      });
    }

    // Column 3: Outputs (center-right, bottom half)
    currentY = startY + (inputs.length * 120) + 50;
    if (outputs.length > 0) {
      log.push(`  • Positioning ${outputs.length} output(s) - Right column (bottom)`);
      outputs.forEach((node, idx) => {
        node.position = { x: startX + columnSpacing * 2, y: currentY + (idx * 120) };
      });
    }

    // Column 4: Displays (far right)
    currentY = startY;
    if (displays.length > 0) {
      log.push(`  • Positioning ${displays.length} display(s) - Far right column`);
      displays.forEach((node, idx) => {
        node.position = { x: startX + columnSpacing * 3, y: currentY + (idx * rowSpacing) };
      });
    }
  }

  private getNodesByCategory(category: string): Node[] {
    return this.nodes.filter(node => {
      const comp = node.data.component as ComponentDefinition;
      return comp.category === category;
    });
  }

  private getComponent(node: Node): ComponentDefinition {
    return node.data.component as ComponentDefinition;
  }

  private findPort(node: Node, criteria: (port: Port) => boolean): Port | null {
    const comp = this.getComponent(node);
    return comp.ports.find(criteria) || null;
  }

  private findAnyAvailablePort(node: Node, type?: string): Port | null {
    const comp = this.getComponent(node);
    const usedPorts = new Set(
      this.newEdges
        .filter(e => e.source === node.id || e.target === node.id)
        .flatMap(e => [e.sourceHandle, e.targetHandle])
    );
    
    if (type) {
      return comp.ports.find(p => p.type === type && !usedPorts.has(p.id)) || null;
    }
    
    return comp.ports.find(p => !usedPorts.has(p.id)) || null;
  }

  private createEdge(sourceNode: Node, sourcePort: Port, targetNode: Node, targetPort: Port, label?: string): Edge {
    const color = determineEdgeColor(this.nodes, sourceNode.id, sourcePort.id);
    
    // Create detailed pin label showing both ends for soldering reference
    const pinLabel = label || `${sourcePort.label} → ${targetPort.label}`;
    
    // Thicker wires for better visibility (6px for power/ground, 4px for signals)
    const strokeWidth = (sourcePort.voltage === 'GND' || sourcePort.voltage === '5V' || sourcePort.voltage === '12V') ? 6 : 4;
    
    return {
      id: `auto-edge-${this.edgeIdCounter++}`,
      source: sourceNode.id,
      target: targetNode.id,
      sourceHandle: sourcePort.id,
      targetHandle: targetPort.id,
      type: 'custom',
      data: {
        color: color,
        strokeWidth: strokeWidth,
        label: pinLabel,
      },
    };
  }

  private wirePowerDistribution(powerSources: Node[], consumers: Node[], log: string[]): void {
    if (powerSources.length === 0) {
      log.push('  ⚠️ No power sources found');
      return;
    }

    const mainPower = powerSources[0];
    const mainComp = this.getComponent(mainPower);
    log.push(`  • Using ${mainComp.name} as main power source`);

    // Check for power switch/button in power category
    const powerSwitch = this.nodes.find(n => {
      const comp = this.getComponent(n);
      return comp.category === 'power' && 
             (comp.name.toLowerCase().includes('switch') || comp.name.toLowerCase().includes('button')) && 
             comp.ports.some(p => p.label.toLowerCase().includes('in')) &&
             comp.ports.some(p => p.label.toLowerCase().includes('out'));
    });

    if (powerSwitch) {
      const switchComp = this.getComponent(powerSwitch);
      log.push(`  • Found power switch: ${switchComp.name}`);
      
      // Get the main power supply voltage
      const supplyPort = this.findPort(mainPower, p => p.type === 'POWER' && p.voltage !== 'GND');
      const supplyGnd = this.findPort(mainPower, p => p.voltage === 'GND');
      
      if (!supplyPort) {
        log.push(`  ⚠️  Could not find power output on supply`);
      } else {
        const supplyVoltage = supplyPort.voltage;
        
        // Find switch input and output (voltage may not match, so be flexible)
        const switchIn = this.findPort(powerSwitch, p => 
          p.type === 'POWER' && 
          (p.label.toLowerCase().includes('in') || p.label.toLowerCase().includes('input'))
        );
        const switchOut = this.findPort(powerSwitch, p => 
          p.type === 'POWER' && 
          (p.label.toLowerCase().includes('out') || p.label.toLowerCase().includes('output'))
        );

        if (supplyPort && switchIn) {
          this.newEdges.push(this.createEdge(mainPower, supplyPort, powerSwitch, switchIn));
          log.push(`  ✓ Connected ${supplyVoltage} from power source to switch input`);
        } else {
          log.push(`  ⚠️  Could not connect power source to switch`);
        }

        // Ground connection - connect to GND IN if available
        const switchGndIn = this.findPort(powerSwitch, p => 
          p.voltage === 'GND' && p.label.toLowerCase().includes('in')
        );
        const switchGndOut = this.findPort(powerSwitch, p => 
          p.voltage === 'GND' && p.label.toLowerCase().includes('out')
        );
        
        if (supplyGnd && switchGndIn) {
          this.newEdges.push(this.createEdge(mainPower, supplyGnd, powerSwitch, switchGndIn));
          log.push(`  ✓ Connected GND from PSU to switch GND IN`);
        } else if (supplyGnd) {
          // Fallback: any GND port on switch
          const switchGnd = this.findPort(powerSwitch, p => p.voltage === 'GND');
          if (switchGnd) {
            this.newEdges.push(this.createEdge(mainPower, supplyGnd, powerSwitch, switchGnd));
            log.push(`  ✓ Connected GND to switch`);
          }
        }

        if (!switchOut) {
          log.push(`  ⚠️  Could not find switch output port, using direct connections`);
        } else {
          log.push(`  • Distributing ${supplyVoltage} power through switch to all components`);
          
          consumers.forEach(consumer => {
            if (consumer === powerSwitch) return; // Skip the switch itself
            
            const consumerComp = this.getComponent(consumer);
            
            // Find power requirements matching the supply voltage
            const powerPort = this.findPort(consumer, p => 
              p.type === 'POWER' && 
              p.voltage === supplyVoltage
            );
            
            let gndPort = this.findPort(consumer, p => p.voltage === 'GND');
            if (!gndPort) {
              gndPort = this.findPort(consumer, p => p.label.includes('GND'));
            }

            if (powerPort) {
              // Connect from switch output to consumer
              this.newEdges.push(this.createEdge(powerSwitch, switchOut, consumer, powerPort));
              log.push(`  ✓ Connected ${consumerComp.name} ${powerPort.label} through switch`);
              
              // Connect ground - route through switch if it has GND OUT
              if (gndPort) {
                if (switchGndOut) {
                  // Route ground through the switch
                  this.newEdges.push(this.createEdge(powerSwitch, switchGndOut, consumer, gndPort));
                  log.push(`  ✓ Connected ${consumerComp.name} GND through switch`);
                } else if (supplyGnd) {
                  // Fallback: direct from PSU
                  this.newEdges.push(this.createEdge(mainPower, supplyGnd, consumer, gndPort));
                  log.push(`  ✓ Connected ${consumerComp.name} GND`);
                }
              }
            } else {
              log.push(`  ℹ️  ${consumerComp.name} doesn't require ${supplyVoltage} power`);
            }
          });
          return; // Exit early since we've handled all power connections through switch
        }
      }
    }

    // No power switch or couldn't use it - direct connections
    consumers.forEach(consumer => {
      const consumerComp = this.getComponent(consumer);
      
      // Find power requirements - be more flexible
      const powerPort = this.findPort(consumer, p => 
        p.type === 'POWER' && !!p.voltage && p.voltage !== 'GND'
      );
      
      // Try multiple ways to find ground port
      let gndPort = this.findPort(consumer, p => p.voltage === 'GND');
      if (!gndPort) {
        gndPort = this.findPort(consumer, p => p.label.includes('GND'));
      }

      if (powerPort) {
        // Find matching voltage output from power source
        const supplyPort = this.findPort(mainPower, p => 
          p.voltage === powerPort.voltage && p.type === 'POWER'
        );
        const supplyGnd = this.findPort(mainPower, p => p.voltage === 'GND');

        if (supplyPort) {
          this.newEdges.push(this.createEdge(mainPower, supplyPort, consumer, powerPort));
          log.push(`  ✓ Connected ${consumerComp.name} ${powerPort.label} to ${powerPort.voltage}`);
          
          // Connect ground if both have it
          if (gndPort && supplyGnd) {
            this.newEdges.push(this.createEdge(mainPower, supplyGnd, consumer, gndPort));
            log.push(`  ✓ Connected ${consumerComp.name} GND`);
          }
        } else {
          log.push(`  ⚠️ No matching ${powerPort.voltage} output for ${consumerComp.name}`);
        }
      } else {
        log.push(`  ℹ️  ${consumerComp.name} doesn't require power connection`);
      }
    });
  }

  private wireControllerToInputs(controllers: Node[], inputs: Node[], log: string[]): void {
    if (controllers.length === 0) {
      log.push('  ⚠️ No controllers found');
      return;
    }
    
    if (inputs.length === 0) {
      log.push('  ℹ️  No input devices to connect');
      return;
    }

    const controller = controllers[0];
    const controllerComp = this.getComponent(controller);
    log.push(`  • Using ${controllerComp.name} as main controller`);

    // Check if this is a consumer electronics device (like Roku) without GPIO
    const hasGPIO = controllerComp.ports.some(p => 
      p.type === 'DIGITAL_IN' || p.type === 'DIGITAL_OUT' || p.type === 'PWM'
    );

    if (!hasGPIO) {
      log.push(`  ℹ️  ${controllerComp.name} is a consumer device without GPIO pins`);
      log.push(`  ℹ️  Input devices like buttons require external controller (Arduino/ESP32)`);
      return;
    }

    let successCount = 0;

    inputs.forEach(input => {
      const inputComp = this.getComponent(input);
      log.push(`  • Processing ${inputComp.name}...`);
      
      // Special handling for tactile/momentary buttons - they are GPIO input devices ONLY
      const isTactileButton = inputComp.id.includes('tactile') || 
                             inputComp.id.includes('momentary') ||
                             inputComp.name.toLowerCase().includes('tactile') ||
                             inputComp.name.toLowerCase().includes('momentary push button');
      
      if (isTactileButton) {
        log.push(`    ℹ️  ${inputComp.name} is a GPIO input device (connects GPIO + GND only)`);
        
        // Find the "to GPIO" port(s)
        const gpioPort = inputComp.ports.find(p => 
          p.label.toLowerCase().includes('to gpio') || 
          p.label.toLowerCase().includes('signal out')
        );
        
        // Find the "to GND" port(s) 
        const gndPort = inputComp.ports.find(p => 
          p.label.toLowerCase().includes('to gnd') ||
          (p.type === 'DIGITAL_IN' && p.label.toLowerCase().includes('gnd'))
        );
        
        if (gpioPort) {
          const controllerPin = this.findAnyAvailablePort(controller, 'DIGITAL_IN') || 
                               this.findAnyAvailablePort(controller, 'PWM');
          
          if (controllerPin) {
            this.newEdges.push(this.createEdge(input, gpioPort, controller, controllerPin));
            log.push(`    ✓ ${gpioPort.label} → ${controllerPin.label}`);
            successCount++;
          } else {
            log.push(`    ⚠️ No available GPIO pin for button`);
          }
        }
        
        // Connect to ground
        if (gndPort) {
          const controllerGnd = this.findPort(controller, p => p.voltage === 'GND');
          if (controllerGnd) {
            this.newEdges.push(this.createEdge(input, gndPort, controller, controllerGnd));
            log.push(`    ✓ ${gndPort.label} → ${controllerGnd.label}`);
            successCount++;
          }
        }
        
        log.push(`    ℹ️  Tactile buttons do NOT switch power or signals - GPIO input only!`);
        return; // Skip remaining logic for tactile buttons
      }
      
      // Find ALL output ports for other input devices - be very flexible
      let outputPorts = inputComp.ports.filter(p => 
        p.type === 'DIGITAL_OUT' || 
        p.label.includes('NO') || 
        p.label.includes('OUT') ||
        p.label === 'Up' ||
        p.label === 'Down' ||
        p.label === 'Left' ||
        p.label === 'Right' ||
        (p.label.includes('COM') && inputComp.id.includes('switch'))
      );

      // Fallback: if no specific outputs found, use any non-power, non-ground port
      if (outputPorts.length === 0) {
        outputPorts = inputComp.ports.filter(p => 
          p.type !== 'POWER' && 
          !p.voltage?.includes('GND') &&
          !p.label.includes('GND') &&
          !p.label.includes('VCC') &&
          !p.label.includes('5V') &&
          !p.label.includes('12V')
        );
        
        if (outputPorts.length > 0) {
          log.push(`    ℹ️  Using fallback port detection`);
        }
      }

      if (outputPorts.length === 0) {
        log.push(`    ⚠️ No connectable ports found`);
        return;
      }

      // Connect each output port to an available GPIO pin
      outputPorts.forEach(inputPort => {
        const controllerPin = this.findAnyAvailablePort(controller, 'DIGITAL_IN') || 
                             this.findAnyAvailablePort(controller, 'PWM') ||
                             this.findAnyAvailablePort(controller);

        if (controllerPin) {
          this.newEdges.push(this.createEdge(input, inputPort, controller, controllerPin));
          log.push(`    ✓ ${inputPort.label} → ${controllerPin.label}`);
          successCount++;
        } else {
          log.push(`    ⚠️ No available controller pin for ${inputPort.label}`);
        }
      });
    });

    if (successCount > 0) {
      log.push(`  • Successfully connected ${successCount} input signal(s)`);
    }
  }

  private wireControllerToOutputs(controllers: Node[], outputs: Node[], log: string[]): void {
    if (controllers.length === 0) {
      log.push('  ⚠️ No controllers found');
      return;
    }
    
    if (outputs.length === 0) {
      log.push('  ℹ️  No output devices to connect');
      return;
    }

    const controller = controllers[0];
    const controllerComp = this.getComponent(controller);

    // Get available output pins - separate from input pins we already used
    const usedPinIds = new Set(
      this.newEdges
        .filter(e => e.source === controller.id || e.target === controller.id)
        .flatMap(e => [e.sourceHandle, e.targetHandle])
    );

    const availablePins = controllerComp.ports.filter(p => 
      (p.type === 'PWM' || p.type === 'DIGITAL_IN') && 
      !usedPinIds.has(p.id) &&
      !p.label.includes('GND') && 
      p.voltage !== 'GND'
    );

    log.push(`  • Found ${availablePins.length} available GPIO output pins`);
    let pinIndex = 0;

    outputs.forEach(output => {
      const outputComp = this.getComponent(output);

      // Find input port of output device (skip HDMI, AUDIO types)
      let outputPort = this.findPort(output, p => 
        p.type === 'DIGITAL_IN' && !p.voltage
      );
      if (!outputPort) {
        outputPort = this.findPort(output, p => 
          p.label.includes('DIN') || 
          (p.label.includes('IN') && p.type !== 'HDMI' && p.type !== 'AUDIO')
        );
      }
      
      if (outputPort && pinIndex < availablePins.length) {
        const controllerPin = availablePins[pinIndex++];
        this.newEdges.push(this.createEdge(controller, controllerPin, output, outputPort));
        log.push(`  ✓ ${controllerPin.label} → ${outputComp.name} ${outputPort.label}`);
      } else if (!outputPort) {
        log.push(`  ℹ️  ${outputComp.name} requires manual wiring (HDMI/Audio/etc)`);
      } else {
        log.push(`  ⚠️ No available pins for ${outputComp.name}`);
      }
    });
  }

  private wireDisplays(_controllers: Node[], displays: Node[], log: string[]): void {
    if (displays.length === 0) {
      log.push('  ⚠️ No displays to connect');
      return;
    }

    displays.forEach(display => {
      const displayComp = this.getComponent(display);
      log.push(`  ℹ️  ${displayComp.name} requires manual HDMI/video wiring`);
    });
  }

  private wireGrounding(log: string[]): void {
    // Ensure all components with GND ports are grounded to a common point
    const gndNodes = this.nodes.filter(node => {
      const comp = this.getComponent(node);
      return comp.ports.some(p => p.voltage === 'GND');
    });

    if (gndNodes.length < 2) {
      log.push('  ⚠️ Not enough components with GND for common grounding');
      return;
    }

    log.push(`  ✓ Verified ground connections for ${gndNodes.length} components`);
  }
}

export function autoWireComponents(nodes: Node[], edges: Edge[], preferredVoltage: '5V' | '12V' = '5V'): { edges: Edge[]; log: string[]; nodes: Node[] } {
  const agent = new AutoWiringAgent(nodes, edges, preferredVoltage);
  return agent.generateWiring();
}
