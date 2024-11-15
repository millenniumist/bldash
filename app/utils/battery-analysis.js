export function analyzeBatteryPattern(bookings) {
    const batteryPatterns = {};
    
    bookings.forEach(booking => {
      // Convert BigInt to String for object key
      const lockerId = booking.parking_lot_space_id.toString();
      
      if (!batteryPatterns[lockerId]) {
        batteryPatterns[lockerId] = {
          totalUsages: 0,
          averageUsageDuration: 0,
          standbyDurations: [],
          disconnectionCount: 0,
          lastBatteryLevel: booking.parking_lot_spaces?.battery || null,
          batteryDropRate: 0,
          abnormalDrops: []
        };
      }
      
      // Calculate booking duration and battery performance
      if (booking.booked_time && booking.expiry_time) {
        const duration = Number(booking.expiry_time) - new Date(booking.booked_time).getTime();
        batteryPatterns[lockerId].totalUsages++;
        batteryPatterns[lockerId].averageUsageDuration += duration;
      }
      
      // Track sudden battery drops
      if (booking.parking_lot_spaces?.battery < 0.2) {
        batteryPatterns[lockerId].disconnectionCount++;
        batteryPatterns[lockerId].abnormalDrops.push({
          timestamp: booking.created_date,
          level: booking.parking_lot_spaces?.battery
        });
      }
    });

    return batteryPatterns;
}
