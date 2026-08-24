import { test, expect } from '@playwright/test';

import { CitiesApi } from '../../src/api/citiesApi';

test.describe('GET /api/cities', () => {
  test('should return a list of cities with expected schema', async ({ request }) => {
    const citiesApi = new CitiesApi(request);

    const response = await citiesApi.getAllRaw();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const cities = await citiesApi.getAll();

    expect(Array.isArray(cities)).toBe(true);
    expect(cities).toHaveLength(5);

    for (const city of cities) {
      expect(city).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          latitude: expect.any(Number),
          longitude: expect.any(Number),
        }),
      );
    }

    expect(cities).toContainEqual({
      id: 1,
      name: 'Київ',
      latitude: expect.any(Number),
      longitude: expect.any(Number),
    });
  });

  test('should return a city by id', async ({ request }) => {
    const citiesApi = new CitiesApi(request);

    const city = await citiesApi.getById(1);

    expect(city.name).toBe('Київ');
  });
});
