import { rateLimit } from "express-rate-limit";

// Global rate limiter: 100 requests per 15 minutes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Auth rate limiter: 5 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many login/register attempts, please try again after 15 minutes",
  },
});

// AI analysis rate limiter: 7 requests per 15 minutes
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 7,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI analysis limit reached, please try again after 15 minutes",
  },
});
