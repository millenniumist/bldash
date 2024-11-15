export function analyzeAvailability(lockerData) {
    const availabilityMetrics = {};
    
    lockerData.forEach(locker => {
      const lockerId = locker.id;
      const unavailablePeriods = [];
      let lastDisconnection = null;
      
      // Sort usages by date
      const sortedUsages = locker.parking_lot_usages.sort((a, b) => 
        new Date(a.created_date) - new Date(b.created_date)
      );
      
      sortedUsages.forEach(usage => {
        if (usage.usage_status === 'COMPLETED' && lastDisconnection) {
          unavailablePeriods.push({
            start: lastDisconnection,
            end: new Date(usage.created_date),
            duration: new Date(usage.created_date) - new Date(lastDisconnection)
          });
          lastDisconnection = null;
        } else if (usage.usage_status !== 'COMPLETED' && !lastDisconnection) {
          lastDisconnection = new Date(usage.created_date);
        }
      });
      
      availabilityMetrics[lockerId] = {
        totalUnavailablePeriods: unavailablePeriods.length,
        averageUnavailabilityDuration: unavailablePeriods.reduce((acc, period) => acc + period.duration, 0) / unavailablePeriods.length,
        unavailablePeriods
      };
    });
    
    return availabilityMetrics;
}
