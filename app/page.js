import prisma from '@/lib/prisma';
import { analyzeBatteryPattern } from "@/utils/battery-analysis";

async function getLockerAnalytics() {
  const getLockableSpaces = async () => {
    const spaces = await prisma.parking_lot_spaces.findMany({
      where: { type: 'LOCKABLE' },
      orderBy: { id: 'asc' }
    });
    console.log('Lockable spaces found:', spaces.length);
    return spaces;
  };

  const getBookingsForSpaces = async (spaceIds) => {
    const bookings = await prisma.parking_lot_bookings.findMany({
      where: {
        parking_lot_space_id: { in: spaceIds }
      },
      orderBy: { created_date: 'desc' }
    });
    console.log('Bookings found:', bookings.length);
    return bookings;
  };

  const parkingLotSpaces = await getLockableSpaces();
  const spaceIds = parkingLotSpaces.map(space => space.id);
  const lockerBookings = await getBookingsForSpaces(spaceIds);

  return lockerBookings;
}




// Rest of the component remains the same


export default async function LockerAnalyticsDashboard() {
  const lockerData = await getLockerAnalytics();
  const batteryAnalytics = analyzeBatteryPattern(lockerData);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Locker Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(batteryAnalytics).map(([lockerId, data]) => (
          <div key={lockerId} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Locker #{lockerId}</h2>
            <div className="space-y-2">
              <p>Total Bookings: {data.totalUsages}</p>
              <p>Average Booking Duration: {Math.round(data.averageUsageDuration / 1000 / 60)} minutes</p>
              <p>Disconnection Count: {data.disconnectionCount}</p>
              <p>Last Battery Level: {(data.lastBatteryLevel * 100).toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
