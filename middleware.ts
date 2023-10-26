import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => token?.role === "ADMIN" || token?.role === "MANAGER",
    },
  }
)


export const config = { matcher: ["/admin/:path*", "/"] }