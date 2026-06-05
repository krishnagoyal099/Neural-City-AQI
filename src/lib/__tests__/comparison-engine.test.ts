import { compareCities, generateVerdict } from '../comparison-engine';
import type { CityAQIData } from '../types';

describe('Comparison Engine Mathematical Tests', () => {
  const cityA: CityAQIData = {
    cityId: 'A1',
    cityName: 'Alpha City',
    state: 'State 1',
    latitude: 0,
    longitude: 0,
    aqiValue: 150,
    aqiCategory: 'Moderate',
    airHealthScore: 60,
    pollutants: { pm25: 150, pm10: 80, no2: 40, so2: 10, co: 5, o3: 30, nh3: 5 },
    monthlyTrend: [],
    peerCities: [],
    lastUpdated: '2026-01-01',
  };

  const cityB: CityAQIData = {
    cityId: 'B1',
    cityName: 'Beta City',
    state: 'State 2',
    latitude: 0,
    longitude: 0,
    aqiValue: 200,
    aqiCategory: 'Poor',
    airHealthScore: 40,
    pollutants: { pm25: 100, pm10: 200, no2: 50, so2: 15, co: 10, o3: 40, nh3: 10 },
    monthlyTrend: [],
    peerCities: [],
    lastUpdated: '2026-01-01',
  };

  describe('compareCities()', () => {
    it('should calculate the absolute AQI difference accurately', () => {
      const result = compareCities(cityA, cityB);
      expect(result.aqiDifference).toBe(50);
    });

    it('should accurately identify the mathematically cleaner city', () => {
      const result = compareCities(cityA, cityB);
      expect(result.cleanerCity).toBe('Alpha City');
    });

    it('should correctly determine the primary difference pollutant', () => {
      const result = compareCities(cityA, cityB);
      // PM25 diff: 50, PM10 diff: 120, NO2 diff: 10. Max is PM10.
      expect(result.primaryDifference).toBe('pm10');
    });

    it('should accurately calculate percent difference against the maximum AQI', () => {
      const result = compareCities(cityA, cityB);
      // diff = 50, max = 200 -> 50/200 = 0.25 -> 25%
      expect(result.percentDifference).toBe(25);
    });

    it('should avoid division-by-zero errors mathematically when both are 0', () => {
      const zeroCityA = { ...cityA, aqiValue: 0, pollutants: { pm25: 0, pm10: 0, no2: 0, so2: 0, co: 0, o3: 0, nh3: 0 } };
      const zeroCityB = { ...cityB, aqiValue: 0, pollutants: { pm25: 0, pm10: 0, no2: 0, so2: 0, co: 0, o3: 0, nh3: 0 } };
      const result = compareCities(zeroCityA, zeroCityB);
      
      expect(result.aqiDifference).toBe(0);
      expect(result.percentDifference).toBe(0);
      expect(result.cleanerCity).toBe('Alpha City'); // Arbitrary tie-break
    });
  });

  describe('generateVerdict()', () => {
    it('should return a similar quality verdict when difference is mathematically < 10', () => {
      const similarCity = { ...cityA, aqiValue: 155 };
      const result = compareCities(cityA, similarCity);
      const verdict = generateVerdict(result);
      
      expect(verdict).toMatch(/similar air quality/i);
      expect(verdict).toMatch(/5 AQI points/i);
    });

    it('should output the mathematically precise string format for standard differences', () => {
      const result = compareCities(cityA, cityB);
      const verdict = generateVerdict(result);
      
      // Expected: "Alpha City's air is 25% cleaner than Beta City's, primarily due to lower PM10 levels."
      expect(verdict).toMatch(/Alpha City's air is 25% cleaner than Beta City's/i);
      expect(verdict).toMatch(/primarily due to lower PM10 levels/i);
    });
  });
});
