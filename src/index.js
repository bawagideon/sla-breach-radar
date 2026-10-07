// Operations SLA Breach Radar Engine
class SLABreachRadar {
  constructor(options = {}) {
    this.warningThresholdMinutes = options.warningThresholdMinutes || 60; // 1 hour left
  }

  evaluateTask(task, currentTime = new Date()) {
    const { id, title, targetDeadline, clientTier } = task;
    const deadline = new Date(targetDeadline);
    const diffMs = deadline - new Date(currentTime);
    const minutesRemaining = Math.round(diffMs / 60000);

    let status = 'ON_TRACK';
    let urgency = 'NORMAL';

    if (minutesRemaining <= 0) {
      status = 'BREACHED';
      urgency = 'CRITICAL';
    } else if (minutesRemaining <= this.warningThresholdMinutes) {
      status = 'BREACH_IMMINENT';
      urgency = 'HIGH';
    }

    return {
      taskId: id,
      title,
      clientTier,
      minutesRemaining,
      status,
      urgency,
      requiresManagerEscalation: status !== 'ON_TRACK'
    };
  }

  auditQueue(tasks, currentTime = new Date()) {
    const evaluated = tasks.map(t => this.evaluateTask(t, currentTime));
    const breached = evaluated.filter(t => t.status === 'BREACHED');
    const imminent = evaluated.filter(t => t.status === 'BREACH_IMMINENT');

    return {
      totalTasks: tasks.length,
      breachedCount: breached.length,
      imminentCount: imminent.length,
      healthyCount: evaluated.filter(t => t.status === 'ON_TRACK').length,
      tasks: evaluated.sort((a, b) => a.minutesRemaining - b.minutesRemaining)
    };
  }
}

module.exports = { SLABreachRadar };
