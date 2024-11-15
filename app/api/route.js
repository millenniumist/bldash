import prisma from "@/lib/prisma";

export async function GET() {
    const lockerSpaces = await prisma.parking_lot_spaces.findMany({
      where: {
        type: 'LOCKABLE'
      }
    });
  
    const lockerUsages = await prisma.parking_lot_usages.findMany({
      where: {
        usage_type: 'LOCKER'
      },
      orderBy: {
        created_date: 'desc'
      }
    });
  
    const joinedData = lockerSpaces.map(space => ({
      ...space,
      parking_lot_usages: lockerUsages.filter(usage => 
        usage.parking_lot_space_id === space.id
      )
    }));
  
    return Response.json({ data: joinedData });
  }
  