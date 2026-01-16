import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { settings: true },
  });

  return Response.json(
    {
      user: {
        id: dbUser?.id,
        email: dbUser?.email,
        name: dbUser?.name,
        publicToken: dbUser?.publicToken,
      },
      settings: dbUser?.settings || null,
    },
    { status: 200 }
  );
}
