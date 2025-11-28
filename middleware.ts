import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

const isEmployeeRoute = createRouteMatcher([
  '/employee(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

 
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

 
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  
  let role = (sessionClaims?.metadata as { role?: string })?.role || 'employee'
  
  

 
  if (isAdminRoute(req) && role !== 'admin') {
   
    return NextResponse.redirect(new URL('/employee/dashboard', req.url))
  }

  
  if (isEmployeeRoute(req) && role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
