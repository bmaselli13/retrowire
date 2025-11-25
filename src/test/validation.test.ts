import { describe, it, expect } from 'vitest';
import { validateConnection } from '../utils/validation';
import type { Port } from '../types';

describe('validateConnection', () => {
  describe('power connections', () => {
    it('should allow 5V power to 5V input', () => {
      const source: Port = {
        id: 'vout',
        type: 'POWER',
        label: '5V',
        voltage: '5V',
        x: 100,
        y: 50,
      };
      const target: Port = {
        id: 'vin',
        type: 'POWER',
        label: 'VIN',
        voltage: '5V',
        x: 0,
        y: 50,
      };
      
      const result = validateConnection(source, target);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should warn on 12V power to 5V input', () => {
      const source: Port = {
        id: 'vout',
        type: 'POWER',
        label: '12V',
        voltage: '12V',
        x: 100,
        y: 50,
      };
      const target: Port = {
        id: 'vin',
        type: 'POWER',
        label: 'VIN',
        voltage: '5V',
        x: 0,
        y: 50,
      };
      
      const result = validateConnection(source, target);
      expect(result.valid).toBe(true);
      expect(result.warning).toContain('Voltage mismatch');
    });

    it('should allow GND to GND connection', () => {
      const source: Port = {
        id: 'gnd1',
        type: 'POWER',
        label: 'GND',
        voltage: 'GND',
        x: 100,
        y: 50,
      };
      const target: Port = {
        id: 'gnd2',
        type: 'POWER',
        label: 'GND',
        voltage: 'GND',
        x: 0,
        y: 50,
      };
      
      const result = validateConnection(source, target);
      expect(result.valid).toBe(true);
    });
  });

  describe('signal connections', () => {
    it('should allow digital out to digital in connection', () => {
      const source: Port = {
        id: 'out1',
        type: 'DIGITAL_OUT',
        label: 'OUT1',
        x: 100,
        y: 50,
      };
      const target: Port = {
        id: 'in1',
        type: 'DIGITAL_IN',
        label: 'IN1',
        x: 0,
        y: 50,
      };
      
      const result = validateConnection(source, target);
      expect(result.valid).toBe(true);
    });

    it('should prevent two outputs connecting', () => {
      const source: Port = {
        id: 'out1',
        type: 'DIGITAL_OUT',
        label: 'OUT1',
        x: 100,
        y: 50,
      };
      const target: Port = {
        id: 'out2',
        type: 'DIGITAL_OUT',
        label: 'OUT2',
        x: 0,
        y: 50,
      };
      
      const result = validateConnection(source, target);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Cannot connect two outputs');
    });

    it('should prevent two inputs connecting', () => {
      const source: Port = {
        id: 'in1',
        type: 'DIGITAL_IN',
        label: 'IN1',
        x: 100,
        y: 50,
      };
      const target: Port = {
        id: 'in2',
        type: 'DIGITAL_IN',
        label: 'IN2',
        x: 0,
        y: 50,
      };
      
      const result = validateConnection(source, target);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Cannot connect two inputs');
    });
  });
});
