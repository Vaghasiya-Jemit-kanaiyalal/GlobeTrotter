const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/database');

describe('GlobeTrotter Backend API Test Suite (Screens 4, 5, 6, 7, 9, 10, 11 & 12)', () => {
  let userToken;
  let adminToken;
  let createdTripId;
  let createdStopId;
  let scheduledActivityId;
  let createdExpenseId;
  let createdPostId;
  let createdCommentId;
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

  describe('3. Screen 4 & Screen 5 – Create Trip, Stops & Activities', () => {
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

  describe('4. Screen 9 – Itinerary View & Budget Management', () => {
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

    it('GET /api/v1/trips/:tripId/expenses/summary should calculate category expense breakdown', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${createdTripId}/expenses/summary`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.categories.Food).toEqual(1000);
    });

    it('DELETE /api/v1/expenses/:expenseId should delete an expense', async () => {
      const res = await request(app)
        .delete(`/api/v1/expenses/${createdExpenseId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
    });
  });

  describe('5. Screen 10 – Community Module', () => {
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
      expect(res.body.data.post.publicShareToken).toBeDefined();
      createdPostId = res.body.data.post.id;
      publicShareToken = res.body.data.post.publicShareToken;
    });

    it('GET /api/v1/community/posts should fetch public community feed', async () => {
      const res = await request(app).get('/api/v1/community/posts?search=Manali');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.posts.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/community/posts/:postId/like should toggle like', async () => {
      const res = await request(app)
        .post(`/api/v1/community/posts/${createdPostId}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.liked).toBe(true);
    });

    it('POST /api/v1/community/posts/:postId/comments should add a comment', async () => {
      const res = await request(app)
        .post(`/api/v1/community/posts/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Awesome Manali itinerary!'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.comment.id).toBeDefined();
      createdCommentId = res.body.data.comment.id;
    });

    it('GET /api/v1/community/trending should return trending posts, cities, and activities', async () => {
      const res = await request(app).get('/api/v1/community/trending');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.popularPosts).toBeDefined();
      expect(res.body.data.popularCities).toBeDefined();
    });

    it('GET /api/v1/community/shared/:token should fetch public trip without private info', async () => {
      const res = await request(app).get(`/api/v1/community/shared/${publicShareToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.postTitle).toEqual('My Incredible Manali Snow Trek');
    });
  });

  describe('6. Screen 11 – Calendar View', () => {
    it('GET /api/v1/calendar should return trip and activity events for requested month/year', async () => {
      const res = await request(app)
        .get('/api/v1/calendar?month=11&year=2026')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.events).toBeDefined();
      expect(res.body.data.events.length).toBeGreaterThan(0);
    });
  });

  describe('7. Screen 12 – Admin Panel & Authorization Guard', () => {
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
      expect(res.body.data.trips).toBeDefined();
    });

    it('GET /api/v1/admin/users should return user management list', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.items).toBeDefined();
    });

    it('GET /api/v1/admin/cities/popular should return calculated popular cities', async () => {
      const res = await request(app)
        .get('/api/v1/admin/cities/popular')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.cities).toBeDefined();
    });

    it('GET /api/v1/admin/analytics/overview should return platform analytics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics/overview')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.mostPopularCity).toBeDefined();
    });
  });
});
