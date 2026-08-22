const { query } = require('../config/database');

async function createStop(stopData) {
  const sql = `
    INSERT INTO trip_stops (trip_id, city_id, start_date, end_date, stop_order, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    stopData.tripId,
    stopData.cityId,
    stopData.startDate,
    stopData.endDate,
    stopData.stopOrder || 1,
    stopData.notes || null
  ];
  const result = await query(sql, params);
  return findById(result.insertId);
}

async function findById(id) {
  const sql = `
    SELECT ts.*, c.name AS city_name, c.country AS city_country, c.image_url AS city_image
    FROM trip_stops ts
    JOIN cities c ON ts.city_id = c.id
    WHERE ts.id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

async function findByTripId(tripId) {
  const sql = `
    SELECT ts.*, c.name AS city_name, c.country AS city_country, c.image_url AS city_image, c.cost_index
    FROM trip_stops ts
    JOIN cities c ON ts.city_id = c.id
    WHERE ts.trip_id = ?
    ORDER BY ts.stop_order ASC, ts.start_date ASC
  `;
  return query(sql, [tripId]);
}

async function updateStop(id, updateData) {
  const fields = [];
  const params = [];

  if (updateData.startDate !== undefined) {
    fields.push('start_date = ?');
    params.push(updateData.startDate);
  }
  if (updateData.endDate !== undefined) {
    fields.push('end_date = ?');
    params.push(updateData.endDate);
  }
  if (updateData.stopOrder !== undefined) {
    fields.push('stop_order = ?');
    params.push(updateData.stopOrder);
  }
  if (updateData.notes !== undefined) {
    fields.push('notes = ?');
    params.push(updateData.notes);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  const sql = `UPDATE trip_stops SET ${fields.join(', ')} WHERE id = ?`;
  await query(sql, params);
  return findById(id);
}

async function updateStopOrderBatch(stopOrders) {
  // stopOrders is an array of { id, order }
  for (const item of stopOrders) {
    await query('UPDATE trip_stops SET stop_order = ? WHERE id = ?', [item.order, item.id]);
  }
}

async function deleteStop(id) {
  const sql = `DELETE FROM trip_stops WHERE id = ?`;
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

async function addScheduledActivity(activityData) {
  const sql = `
    INSERT INTO trip_activities (trip_stop_id, activity_id, scheduled_date, scheduled_time, activity_order, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    activityData.tripStopId,
    activityData.activityId,
    activityData.scheduledDate,
    activityData.scheduledTime,
    activityData.activityOrder || 1,
    activityData.notes || null
  ];
  const result = await query(sql, params);
  return findScheduledActivityById(result.insertId);
}

async function findScheduledActivityById(id) {
  const sql = `
    SELECT ta.*, a.name AS activity_name, a.description AS activity_description, 
           a.category, a.duration_minutes, a.estimated_cost, a.image_url, a.rating
    FROM trip_activities ta
    JOIN activities a ON ta.activity_id = a.id
    WHERE ta.id = ? LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

async function findScheduledActivitiesByStopId(stopId) {
  const sql = `
    SELECT ta.*, a.name AS activity_name, a.description AS activity_description, 
           a.category, a.duration_minutes, a.estimated_cost, a.image_url, a.rating
    FROM trip_activities ta
    JOIN activities a ON ta.activity_id = a.id
    WHERE ta.trip_stop_id = ?
    ORDER BY ta.scheduled_date ASC, ta.scheduled_time ASC, ta.activity_order ASC
  `;
  return query(sql, [stopId]);
}

async function updateScheduledActivity(id, updateData) {
  const fields = [];
  const params = [];

  if (updateData.scheduledDate !== undefined) {
    fields.push('scheduled_date = ?');
    params.push(updateData.scheduledDate);
  }
  if (updateData.scheduledTime !== undefined) {
    fields.push('scheduled_time = ?');
    params.push(updateData.scheduledTime);
  }
  if (updateData.activityOrder !== undefined) {
    fields.push('activity_order = ?');
    params.push(updateData.activityOrder);
  }
  if (updateData.notes !== undefined) {
    fields.push('notes = ?');
    params.push(updateData.notes);
  }

  if (fields.length === 0) return findScheduledActivityById(id);

  params.push(id);
  const sql = `UPDATE trip_activities SET ${fields.join(', ')} WHERE id = ?`;
  await query(sql, params);
  return findScheduledActivityById(id);
}

async function deleteScheduledActivity(id) {
  const sql = `DELETE FROM trip_activities WHERE id = ?`;
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createStop,
  findById,
  findByTripId,
  updateStop,
  updateStopOrderBatch,
  deleteStop,
  addScheduledActivity,
  findScheduledActivityById,
  findScheduledActivitiesByStopId,
  updateScheduledActivity,
  deleteScheduledActivity
};
