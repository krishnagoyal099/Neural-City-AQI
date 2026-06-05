import { getDominantPollutant, pollutantHealthScore, projectedRank, estimateHealthCost } from '../aqi-calculator';
import type { PollutantData } from '../types';

describe('AQI Calculator Mathematical Tests', () => {
  const samplePollutants: PollutantData = {
    pm25: 125, // 125 / 250 = 0.5
    pm10: 430, // 430 / 430 = 1.0 (Dominant)
    no2: 140, // 140 / 280 = 0.5
    so2: 0,
    co: 0,
    o3: 0,
    nh3: 0,
  };

  describe('getDominantPollutant()', () => {
    it('should correctly identify the mathematically highest sub-index ratio', () => {
      expect(getDominantPollutant(samplePollutants)).toBe('pm10');
    });

    it('should return the first pollutant if all are zero', () => {
      const zeros = { pm25: 0, pm10: 0, no2: 0, so2: 0, co: 0, o3: 0, nh3: 0 };
      expect(getDominantPollutant(zeros)).toBe('pm25');
    });
  });

  describe('pollutantHealthScore()', () => {
    it('should mathematically convert a max pollutant to a score of 0', () => {
      expect(pollutantHealthScore('pm10', 430)).toBe(0);
    });

    it('should mathematically convert a zero pollutant to a score of 100', () => {
      expect(pollutantHealthScore('pm25', 0)).toBe(100);
    });

    it('should calculate 50 for a half-max pollutant', () => {
      expect(pollutantHealthScore('no2', 140)).toBe(50);
    });

    it('should not return negative scores (cap at 0)', () => {
      expect(pollutantHealthScore('pm10', 999)).toBe(0);
    });
  });

  describe('projectedRank()', () => {
    const allAQIs = [
      { cityId: 'A', aqiValue: 50 },
      { cityId: 'B', aqiValue: 150 },
      { cityId: 'C', aqiValue: 200 },
      { cityId: 'D', aqiValue: 300 },
    ];

    it('should calculate the mathematically correct new rank after improvement', () => {
      // Current 300. Improve by 50% = 150.
      // Array: [50, 150, 200, 300]. New value 150 ties with B, rank 2.
      expect(projectedRank(300, 50, allAQIs)).toBe(2);
    });
  });

  describe('estimateHealthCost()', () => {
    it('should calculate cost accurately based on mathematical formula', () => {
      // (100 / 50) * 5 * 12 = 2 * 60 = 120
      expect(estimateHealthCost(100, 5)).toBe('₹120 Cr/year');
    });
  });
});
