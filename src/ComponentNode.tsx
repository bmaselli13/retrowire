import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ComponentDefinition, Port } from './types';

interface ComponentNodeData {
  component: ComponentDefinition;
}

function ComponentNode({ data }: NodeProps) {
  const component = (data as unknown as ComponentNodeData).component;

  return (
    <div 
      className="relative bg-gray-800 rounded-lg border-2 border-gray-600 shadow-xl"
      style={{ 
        width: `${component.width}px`, 
        height: `${component.height}px` 
      }}
    >
      {/* Component Image */}
      <img 
        src={component.imageUrl} 
        alt={component.name}
        className="w-full h-full rounded-lg"
        draggable={false}
      />
      
      {/* Component Name Label */}
      <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-300 font-medium px-2 truncate">
        {component.name}
      </div>
      
      {/* Dynamic Handles based on ports */}
      {component.ports.map((port: Port) => {
        // Determine position based on x,y coordinates
        let position: Position = Position.Right;
        
        if (port.x < 30) {
          position = Position.Left;
        } else if (port.x > 70) {
          position = Position.Right;
        } else if (port.y < 30) {
          position = Position.Top;
        } else if (port.y > 70) {
          position = Position.Bottom;
        }
        
        // Determine handle color based on voltage
        let handleColor = 'bg-blue-500 border-blue-300';
        if (port.voltage === 'GND') {
          handleColor = 'bg-gray-900 border-gray-700'; // Black for ground
        } else if (port.voltage === '5V') {
          handleColor = 'bg-red-500 border-red-300'; // Red for 5V
        } else if (port.voltage === '12V') {
          handleColor = 'bg-yellow-500 border-yellow-300'; // Yellow for 12V
        } else if (port.voltage === '3.3V') {
          handleColor = 'bg-blue-500 border-blue-300'; // Blue for 3.3V
        } else if (port.type === 'POWER') {
          handleColor = 'bg-red-500 border-red-300'; // Red for power
        }
        
        return (
          <Handle
            key={port.id}
            type="source"
            position={position}
            id={port.id}
            className={`w-4 h-4 ${handleColor} hover:scale-110 transition-transform shadow-lg`}
            style={{
              left: `${port.x}%`,
              top: `${port.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            {/* Always-visible Pin Label with better positioning */}
            <div 
              className="absolute z-50 bg-gray-900/95 text-white text-[10px] px-1.5 py-0.5 rounded border border-gray-600 pointer-events-none whitespace-nowrap font-mono shadow-xl"
              style={{
                left: position === Position.Right ? '14px' : position === Position.Left ? 'auto' : '50%',
                right: position === Position.Left ? '14px' : 'auto',
                top: position === Position.Bottom ? '14px' : position === Position.Top ? 'auto' : '50%',
                bottom: position === Position.Top ? '14px' : 'auto',
                transform: 
                  position === Position.Left || position === Position.Right 
                    ? 'translateY(-50%)' 
                    : 'translateX(-50%)',
              }}
            >
              <div className="font-semibold">{port.label}</div>
              {port.voltage && (
                <div className={`text-[9px] ${port.voltage === 'GND' ? 'text-gray-400' : port.voltage === '5V' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {port.voltage}
                </div>
              )}
            </div>
          </Handle>
        );
      })}
      
      {/* Add target handles (for connections to this node) */}
      {component.ports.map((port: Port) => {
        let position: Position = Position.Right;
        
        if (port.x < 30) {
          position = Position.Left;
        } else if (port.x > 70) {
          position = Position.Right;
        } else if (port.y < 30) {
          position = Position.Top;
        } else if (port.y > 70) {
          position = Position.Bottom;
        }
        
        return (
          <Handle
            key={`target-${port.id}`}
            type="target"
            position={position}
            id={port.id}
            className="w-3 h-3 bg-blue-500 border-2 border-blue-300 hover:bg-blue-400 transition-colors"
            style={{
              left: `${port.x}%`,
              top: `${port.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
}

export default memo(ComponentNode);
