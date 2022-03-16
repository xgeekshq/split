import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NEXT_PUBLIC_NEXTAUTH_URL } from "../../utils/constants";

export async function middleware(req: NextApiRequest) {
  const session = await getToken({ req, secret: process.env.SECRET });

  if (!session) return NextResponse.redirect(`${NEXT_PUBLIC_NEXTAUTH_URL}`);

  return NextResponse.next();
}
