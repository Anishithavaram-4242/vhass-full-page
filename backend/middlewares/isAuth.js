import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    console.log('=== AUTH CHECK START ===');
    console.log('Auth check - Session exists:', !!req.session);
    console.log('Auth check - Session user:', req.session?.user);
    console.log('Auth check - Session ID:', req.session?.id);
    console.log('Auth check - Cookies:', Object.keys(req.cookies || {}));
    console.log('Auth check - User agent:', req.headers['user-agent']?.substring(0, 50));
    console.log('Auth check - Origin:', req.headers.origin);
    console.log('=== AUTH CHECK END ===');

    // 1. Check for session-based login (Google/Passport)
    if (req.session && req.session.user) {
      console.log('Auth: Session-based authentication successful');
      const user = await User.findById(req.session.user._id);
      if (!user) {
        console.log('Auth: User not found in database');
        return res.status(401).json({ 
          message: "User not found",
          code: "USER_NOT_FOUND"
        });
      }
      req.user = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      };
      console.log('Auth: User set in request:', req.user);
      return next();
    }

    // 2. Check for token-based authentication
    // const token = req.headers.cookie || req.headers.authorization?.split(' ')[1];
    // if (token) {
    //   console.log('Auth: Token-based authentication attempt');
    //   const user = await User.findOne({ token });
    //   if (!user) {
    //     return res.status(401).json({ 
    //       message: "Invalid token",
    //       code: "INVALID_TOKEN"
    //     });
    //   }
    //   req.user = {
    //     _id: user._id,
    //     email: user.email,
    //     name: user.name,
    //     role: user.role
    //   };
    //   return next();
    // }

    // 3. Passport user
    // if (req.user) {
    //   console.log('Auth: Passport user found');
    //   return next();
    // }

    // 4. Not authenticated
    console.log('Auth: No authentication found');
    return res.status(401).json({ 
      message: "Authentication required: Please login to continue",
      code: "AUTH_REQUIRED"
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ 
      message: "Authentication system error", 
      error: error.message,
      code: "AUTH_SYSTEM_ERROR"
    });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    console.log('Admin check - User role:', req.user?.role);
    
    if (!req.user) {
      console.log('Admin check: No user found in request');
      return res.status(401).json({
        message: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }

    if (req.user.role !== "admin") {
      console.log('Admin check: User is not admin');
      return res.status(403).json({
        message: "Access denied: Admin privileges required",
        code: "ADMIN_REQUIRED"
      });
    }

    console.log('Admin check: Access granted');
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({
      message: "Admin verification failed",
      error: error.message,
      code: "ADMIN_CHECK_ERROR"
    });
  }
};
