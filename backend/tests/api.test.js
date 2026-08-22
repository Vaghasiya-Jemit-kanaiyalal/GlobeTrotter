const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/database');

describe('GlobeTrotter Backend API Test Suite (Screens 4, 5, 6, 7, 8, 9, 10, 11 & 12)', () => {
  let userToken;
  let adminToken;
  let createdTripId;
  let createdStopId;
  let scheduledActivityId;
  let createdExpenseId;
  let createdPostId;
  let publicShareToken;

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

  describe('3. Screen 8 – Activity & City Search', () => {
    it('GET /api/v1/cities should search cities with filters & pagination', async () => {
      const res = await request(app).get('/api/v1/cities?search=Goa&sort=popularity&page=1&limit=5');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cities).toBeDefined();
      expect(res.body.data.pagination).toBeDefined();
    });

    it('GET /api/v1/cities?groupBy=country should return grouped cities', async () => {
      const res = await request(app).get('/api/v1/cities?groupBy=country');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.groups).toBeDefined();
    });

    it('GET /api/v1/cities?groupBy=invalid should return 400 Bad Request', async () => {
      const res = await request(app).get('/api/v1/cities?groupBy=invalid');
      expect(res.statusCode).toEqual(400);
    });

    it('GET /api/v1/cities/popular should return popular cities from real trip data', async () => {
      const res = await request(app).get('/api/v1/cities/popular');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.cities).toBeDefined();
    });

    it('GET /api/v1/cities/:cityId should return city details with activities count', async () => {
      const res = await request(app).get('/api/v1/cities/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.city.name).toEqual('Goa');
      expect(res.body.data.activitiesCount).toBeDefined();
    });

    it('GET /api/v1/cities/:cityId/activities should return activities for selected city', async () => {
      const res = await request(app).get('/api/v1/cities/1/activities');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.activities.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/activities should search activities with category & price filters', async () => {
      const res = await request(app).get('/api/v1/activities?search=scuba&category=Adventure&minCost=500&sort=rating');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.activities).toBeDefined();
      expect(res.body.data.pagination).toBeDefined();
    });

    it('GET /api/v1/activities?groupBy=category should return grouped activities', async () => {
      const res = await request(app).get('/api/v1/activities?groupBy=category');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.groups).toBeDefined();
    });

    it('GET /api/v1/activities/popular should return popular activities from selection count', async () => {
      const res = await request(app).get('/api/v1/activities/popular');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.activities).toBeDefined();
    });

    it('GET /api/v1/activities/:activityId should return activity details with city object', async () => {
      const res = await request(app).get('/api/v1/activities/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.activity.city).toBeDefined();
      expect(res.body.data.activity.name).toContain('Scuba Diving');
    });

    it('GET /api/v1/activities/:activityId/related should return related activities', async () => {
      const res = await request(app).get('/api/v1/activities/1/related');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.activities).toBeDefined();
    });

    it('GET /api/v1/search?q=goa&type=all should return global search results', async () => {
      const res = await request(app).get('/api/v1/search?q=goa&type=all');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.cities).toBeDefined();
      expect(res.body.data.activities).toBeDefined();
    });

    it('GET /api/v1/search?type=invalid should return 400 Bad Request', async () => {
      const res = await request(app).get('/api/v1/search?q=goa&type=invalid');
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('4. Screen 4 & Screen 5 – Create Trip, Stops & Activities', () => {
    it('POST /api/v1/trips with cityId should create trip and initial stop transactionally', async () => {
      const res = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Himalayan Manali Escape',
          description: 'Snow peaks and river rafting',
          startDate: '2026-11-01',
          endDate: '2026-11-07',
          cityId: 16,
          budgetLimit: 25000
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.trip.id).toBeDefined();
      expect(res.body.data.trip.status).toEqual('upcoming');
      createdTripId = res.body.data.trip.id;
    });

    it('POST /api/v1/trips/:tripId/stops should add a multi-city stop within trip date bounds', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/stops`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          cityId: 6,
          startDate: '2026-11-01',
          endDate: '2026-11-03',
          notes: 'Sightseeing in Old Delhi'
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
          activityId: 17,
          scheduledDate: '2026-11-02',
          scheduledTime: '11:00',
          notes: 'Rickshaw food walk'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.scheduledActivity.id).toBeDefined();
      scheduledActivityId = res.body.data.scheduledActivity.id;
    });
  });

  describe('5. Screen 9 – Itinerary View & Budget Management', () => {
    it('GET /api/v1/trips/:tripId/itinerary should return full itinerary tree', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${createdTripId}/itinerary`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.stops).toBeDefined();
    });

    it('POST /api/v1/trips/:tripId/budget should set trip-level budget', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/budget`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          totalBudget: 30000,
          currency: 'INR'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.budget.totalBudget).toEqual(30000);
    });

    it('POST /api/v1/trips/:tripId/expenses should record an expense and return remaining budget', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${createdTripId}/expenses`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Delhi Rickshaw Walk',
          category: 'Food',
          amount: 1000,
          currency: 'INR',
          expenseDate: '2026-11-02',
          tripStopId: createdStopId,
          tripActivityId: scheduledActivityId
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.expense.id).toBeDefined();
      expect(res.body.data.budgetExceeded).toBe(false);
      createdExpenseId = res.body.data.expense.id;
    });

    it('GET /api/v1/trips/:tripId/budget should calculate remaining budget dynamically', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${createdTripId}/budget`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.budget.totalBudget).toEqual(30000);
      expect(res.body.data.budget.remaining).toBeLessThan(30000);
    });
  });

  describe('6. Screen 10 – Community Module', () => {
    it('POST /api/v1/community/posts should publish a public trip post', async () => {
      const res = await request(app)
        .post('/api/v1/community/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          tripId: createdTripId,
          title: 'My Incredible Manali Snow Trek',
          description: 'Experiencing snow peaks in Manali and street food in Delhi',
          postType: 'trip',
          visibility: 'public'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.post.id).toBeDefined();
      createdPostId = res.body.data.post.id;
      publicShareToken = res.body.data.post.publicShareToken;
    });

    it('GET /api/v1/community/posts should fetch public community feed', async () => {
      const res = await request(app).get('/api/v1/community/posts?search=Manali');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.posts.length).toBeGreaterThan(0);
    });
  });

  describe('7. Screen 11 – Calendar View', () => {
    it('GET /api/v1/calendar should return trip and activity events for requested month/year', async () => {
      const res = await request(app)
        .get('/api/v1/calendar?month=11&year=2026')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.events).toBeDefined();
    });
  });

  describe('8. Screen 12 – Admin Panel & Authorization Guard', () => {
    it('GET /api/v1/admin/dashboard should reject non-admin user with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.error.code).toEqual('ADMIN_ACCESS_REQUIRED');
    });

    it('GET /api/v1/admin/dashboard should allow admin user', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.users).toBeDefined();
    });
  });
});
