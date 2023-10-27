import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check for /admin and root path
        if (
          req.url.startsWith('http://localhost:3000/admin') ||
          req.url === "http://localhost:3000/"
        ) {
          return token?.role === "ADMIN" || token?.role === "MANAGER";
        }

        // Check for /vote path
        if (req.url.startsWith("http://localhost:3000/vote")) {
          return !!token;  // If the token exists, the user is authenticated
        }

        // By default, deny access
        return false;
      },
    },
  }
)

export const config = { matcher: ["/admin/:path*", "/", "/vote"] }
