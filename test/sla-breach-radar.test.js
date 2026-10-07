const test = require('node:test');
const assert = require('node:assert');
const { SLABreachRadar } = require('../src/index.js');

test('SLABreachRadar: detects imminent and breached tasks', () => {
  const radar = new SLABreachRadar({ warningThresholdMinutes: 30 });
  const now = new Date('2026-10-07T12:00:00Z');

  const task1 = { id: 't1', title: 'Fulfill VIP Order', targetDeadline: '2026-10-07T11:50:00Z', clientTier: 'VIP' };
  const res1 = radar.evaluateTask(task1, now);
  assert.strictEqual(res1.status, 'BREACHED');
  assert.strictEqual(res1.requiresManagerEscalation, true);

  const task2 = { id: 't2', title: 'Standard Ticket', targetDeadline: '2026-10-07T12:20:00Z', clientTier: 'Standard' };
  const res2 = radar.evaluateTask(task2, now);
  assert.strictEqual(res2.status, 'BREACH_IMMINENT');
  assert.strictEqual(res2.minutesRemaining, 20);
});
