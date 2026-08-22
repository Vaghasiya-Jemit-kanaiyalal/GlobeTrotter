const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/database');

describe('GlobeTrotter Backend API Test Suite', () => {
  let userToken;
  let adminToken;
  let createdTripId;
  let createdStopId;
  let scheduledActivityId;
  let createdExpenseId;
  let publicSlug;

  afterAll(async () => {
    // Close MySQL connection pool after tests finish
    await pool.end();
  });

  describe('1. Health Check & Public Endpoints', () => {
    it('GET /api/v1/health should return 200 OK and DB connected', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.database).toEqual('connected');
    });

    it('GET /api/v1/cities should return paginated list of cities', async () => {
      const res = await request(app).get('/api/v1/cities?search=Goa');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
      expect(res.body.data.items.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/recommendations/destinations should return recommended cities', async () => {
      const res = await request(app).get('/api/v1/recommendations/destinations');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cities).toBeDefined();
    });

    it('GET /api/v1/activities should filter activities by city and category', async () => {
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

    it('POST /api/v1/auth/register should create a new user', async () => {
      const uniqueEmail = `test_${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          firstName: 'Alice',
          lastName: 'Walker',
          email: uniqueEmail,
          password: 'Password123',
          phone: '9876500000',
          city: 'Delhi',
          country: 'India'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('GET /api/v1/auth/me should return current user details with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.user.email).toEqual('user@example.com');
    });

    it('GET /api/v1/auth/me should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('3. Profile & Saved Destinations', () => {
    it('PUT /api/v1/profile should update user details', async () => {
      const res = await request(app)
        .put('/api/v1/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          firstName: 'DemoUpdated',
          additionalInfo: 'Updated travel preferences'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.user.first_name).toEqual('DemoUpdated');
    });

    it('POST /api/v1/saved-destinations should save a city to favorites', async () => {
      const res = await request(app)
        .post('/api/v1/saved-destinations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ cityId: 2 }); // Mumbai

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
    });

    it('GET /api/v1/saved-destinations should list saved cities', async () => {
      const res = await request(app)
        .get('/api/v1/saved-destinations')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.destinations).toBeDefined();
    });
  });

  describe('4. Trips & Multi-City Stops', () => {
    it('POST /api/v1/trips should create a new trip', async () => {
      const res = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Rajasthan Royal Tour',
          description: 'Exploring Jaipur and Udaipur',
          startDate: '2026-10-01',
          endDate: '2026-10-07',
          budgetLimit: 30000,
          isPublic: false
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.trip.id).toBeDefined();
      createdTripId = res.body.data.trip.id;
    });

    it('POST /api/v1/trips/:tripId/stops should add a city stop to trip', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/stops`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          cityId: 3, // Jaipur
          startDate: '2026-10-01',
          endDate: '2026-10-03',
          notes: 'Visit Amer fort'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.stop.id).toBeDefined();
      createdStopId = res.body.data.stop.id;
    });

    it('POST /api/v1/stops/:stopId/activities should schedule an activity', async () => {
      const res = await request(app)
        .post(`/api/v1/stops/${createdStopId}/activities`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          activityId: 10, // Amer Fort
          scheduledDate: '2026-10-02',
          scheduledTime: '10:00',
          notes: 'Morning tour'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.scheduledActivity.id).toBeDefined();
      scheduledActivityId = res.body.data.scheduledActivity.id;
    });

    it('GET /api/v1/trips/:tripId/itinerary should return day-wise grouped itinerary', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${createdTripId}/itinerary`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.days).toBeDefined();
    });

    it('GET /api/v1/trips/:tripId/calendar should return timeline events', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${createdTripId}/calendar`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.events).toBeDefined();
    });
  });

  describe('5. Expenses & Budget Calculation', () => {
    it('POST /api/v1/trips/:tripId/expenses should record an expense', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/expenses`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          category: 'transport',
          amount: 5000,
          description: 'Train to Jaipur',
          expenseDate: '2026-10-01'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.expense.id).toBeDefined();
      createdExpenseId = res.body.data.expense.id;
    });

    it('GET /api/v1/trips/:tripId/budget should calculate breakdown & daily averages', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${createdTripId}/budget`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.transport).toEqual(5000);
      expect(res.body.data.total).toEqual(5000);
      expect(res.body.data.averagePerDay).toBeDefined();
    });
  });

  describe('6. Public Sharing & Copy Trip', () => {
    it('POST /api/v1/trips/:tripId/share should generate public slug', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/share`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.publicSlug).toBeDefined();
      publicSlug = res.body.data.publicSlug;
    });

    it('GET /api/v1/public/trips/:slug should fetch public trip without authentication', async () => {
      const res = await request(app).get(`/api/v1/public/trips/${publicSlug}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.trip.name).toEqual('Rajasthan Royal Tour');
    });

    it('POST /api/v1/public/trips/:slug/copy should duplicate public itinerary into user account', async () => {
      const res = await request(app)
        .post(`/api/v1/public/trips/${publicSlug}/copy`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.trip.name).toContain('Copy of');
    });
  });

  describe('7. Dashboard & Admin Analytics', () => {
    it('GET /api/v1/dashboard should aggregate user metrics and trips', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.upcomingTrips).toBeDefined();
      expect(res.body.data.budgetHighlights).toBeDefined();
    });

    it('GET /api/v1/admin/dashboard should return analytics for admin role', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.totalUsers).toBeDefined();
      expect(res.body.data.totalTrips).toBeDefined();
    });

    it('GET /api/v1/admin/dashboard should deny regular user', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });
});
