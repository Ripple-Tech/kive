/** 
 * An array of routes that are accessible to the public.
 * These routes do not require authentication
 * @type {string[]}
  */
export const publicRoutes = [
    "/",
    "/auth/email-verification",
     "/seller",
     "/buyer",
     "/about",
     "/help",
    "/terms",
    "/api/paystack/webhook",
    "/api/paystack-callback",
    "/api/v1/kyve",
    "/api/flutterwave/webhook",
    //"/search",
    "/sitemap",
    "/sitemap.xml",
   "/robots",
];
/** 
 * An array of routes that are used for authentification.
 * These routes will redirect logged in users to /settings
 * @type {string[]}
  */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
]
/** 
 * The prefix for API authentification routes.
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
  */
export const apiAuthPrefix = "/api/auth";
/** 
 * The default redirect path after logging in
 * @type {string}
  */
export const    DEFAULT_LOGIN_REDIRECT = "/"