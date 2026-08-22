const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/database');

describe('GlobeTrotter Backend API Test Suite (Screens 4, 5, 6 & 7)', () => {
  let userToken;
  let adminToken;
  let createdTripId;
  let createdStopId;
  let scheduledActivityId;
  let createdExpenseId;
  let publicSlug;

  afterAll(async () => {
    await pool.end();
  });

  describe('1. Health Check & Public Discovery', () => {
    it('GET /api/v1/health should return 200 OK and DB connected', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.database).toEqual('connected');
    });

    it('GET /api/v1/cities should return paginated list of destinations', async () => {
      const res = await request(app).get('/api/v1/cities?search=Goa');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
      expect(res.body.data.items.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/activities should filter activity catalog', async () => {
      const res = await request(app).get('/api/v1/activities?cityId=1&category=Adventure');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
    });
  });

  describe('2. Authentication System', () => {
    it('POST /api/v1/auth/login should authenticate demo user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'Password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      userToken = res.body.data.token;
    });

    it('POST /api/v1/auth/login should authenticate admin user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@globetrotter.com',
          password: 'Admin123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      adminToken = res.body.data.token;
    });
  });

  describe('3. Screen 4 – Create Trip (with initial city transaction)', () => {
    it('POST /api/v1/trips with cityId should create trip and initial stop transactionally', async () => {
      const res = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Himalayan Manali Escape',
          description: 'Snow peaks and river rafting',
          startDate: '2026-11-01',
          endDate: '2026-11-07',
          cityId: 16, // Manali
          budgetLimit: 25000
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.trip.id).toBeDefined();
      expect(res.body.data.trip.stop_count).toBeGreaterThanOrEqual(1);
      expect(res.body.data.trip.status).toEqual('upcoming');
      createdTripId = res.body.data.trip.id;
    });
  });

  describe('4. Screen 5 – Build Itinerary & Validation', () => {
    it('POST /api/v1/trips/:tripId/stops should add a multi-city stop within trip date bounds', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/stops`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          cityId: 6, // Delhi
          startDate: '2026-11-01',
          endDate: '2026-11-03',
          notes: 'Sightseeing in Old Delhi'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.stop.id).toBeDefined();
      createdStopId = res.body.data.stop.id;
    });

    it('POST /api/v1/trips/:tripId/stops should reject stop dates outside trip bounds', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/stops`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          cityId: 2,
          startDate: '2026-12-01', // Outside trip end_date 2026-11-07
          endDate: '2026-12-05'
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body.error.code).toEqual('INVALID_STOP_DATES');
    });

    it('POST /api/v1/stops/:stopId/activities should schedule an activity matching city and date bounds', async () => {
      const res = await request(app)
        .post(`/api/v1/stops/${createdStopId}/activities`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          activityId: 17, // Old Delhi Food Tour (City: Delhi)
          scheduledDate: '2026-11-02',
          scheduledTime: '11:00',
          notes: 'Rickshaw food walk'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.scheduledActivity.id).toBeDefined();
      scheduledActivityId = res.body.data.scheduledActivity.id;
    });

    it('POST /api/v1/stops/:stopId/activities should reject activity belonging to a different city', async () => {
      const res = await request(app)
        .post(`/api/v1/stops/${createdStopId}/activities`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          activityId: 1, // Scuba Diving in Goa (Stop city is Delhi)
          scheduledDate: '2026-11-02',
          scheduledTime: '10:00'
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body.error.code).toEqual('CITY_MISMATCH');
    });

    it('GET /api/v1/stops/:stopId/activities should retrieve scheduled activities for a stop', async () => {
      const res = await request(app)
        .get(`/api/v1/stops/${createdStopId}/activities`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.activities).toBeDefined();
      expect(res.body.data.activities.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/trips/:tripId/itinerary should return full itinerary grouped with stops and activities', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${createdTripId}/itinerary`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.stops).toBeDefined();
    });
  });

  describe('5. Screen 6 – User Trip Listing & Filtering', () => {
    it('GET /api/v1/trips should list user trips with computed status and durations', async () => {
      const res = await request(app)
        .get('/api/v1/trips')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.trips).toBeDefined();
      expect(res.body.data.trips.length).toBeGreaterThan(0);
      expect(res.body.data.trips[0].status).toBeDefined();
      expect(res.body.data.trips[0].duration).toBeDefined();
    });

    it('GET /api/v1/trips?status=upcoming should filter upcoming trips', async () => {
      const res = await request(app)
        .get('/api/v1/trips?status=upcoming')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.trips).toBeDefined();
    });
  });

  describe('6. Screen 7 – User Profile & Copy Previous Trip', () => {
    it('GET /api/v1/profile should return user details without exposing password_hash', async () => {
      const res = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.email).toEqual('user@example.com');
      expect(res.body.data.password_hash).toBeUndefined();
    });

    it('GET /api/v1/profile/trips should return preplannedTrips and previousTrips', async () => {
      const res = await request(app)
        .get('/api/v1/profile/trips')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.preplannedTrips).toBeDefined();
      expect(res.body.data.previousTrips).toBeDefined();
    });

    it('GET /api/v1/profile/stats should return travel metrics', async () => {
      const res = await request(app)
        .get('/api/v1/profile/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.totalTrips).toBeDefined();
    });

    it('POST /api/v1/trips/:tripId/copy should duplicate user trip for similar planning', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/copy`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.trip.name).toContain('Copy of');
    });
  });
});
