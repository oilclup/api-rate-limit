const rateLimitStore = new Map();

const TIERS = {
  test: { hourly: 5, daily: 10 },
  free: { hourly: 100, daily: 1000 },
  standard: { hourly: 500, daily: 10000 },
  premium: { hourly: 2000, daily: 100000 }
};

function getTimeKeys() {
  const now = new Date();
  const hourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
  const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  return { hourKey, dayKey };
}

function initUserData(userId, tier) {
  const { hourKey, dayKey } = getTimeKeys();
  return {
    tier,
    hourly: { key: hourKey, count: 0 },
    daily: { key: dayKey, count: 0 }
  };
}

function getUserData(userId) {
  if (!rateLimitStore.has(userId)) {
    return null;
  }
  
  const data = rateLimitStore.get(userId);
  const { hourKey, dayKey } = getTimeKeys();
  
  if (data.hourly.key !== hourKey) {
    data.hourly = { key: hourKey, count: 0 };
  }
  
  if (data.daily.key !== dayKey) {
    data.daily = { key: dayKey, count: 0 };
  }
  
  return data;
}

export function rateLimitMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(400).json({ error: 'x-user-id header is required' });
  }
  
  let userData = getUserData(userId);
  
  if (!userData) {
    return res.status(404).json({ error: 'User not found. Please create user first.' });
  }
  
  const limits = TIERS[userData.tier];
  
  if (userData.hourly.count >= limits.hourly) {
    return res.status(429).json({
      error: 'Hourly rate limit exceeded',
      limit: limits.hourly,
      remaining: 0
    });
  }
  
  if (userData.daily.count >= limits.daily) {
    return res.status(429).json({
      error: 'Daily rate limit exceeded',
      limit: limits.daily,
      remaining: 0
    });
  }
  
  userData.hourly.count++;
  userData.daily.count++;
  rateLimitStore.set(userId, userData);
  
  req.quota = {
    hourly: {
      limit: limits.hourly,
      used: userData.hourly.count,
      remaining: limits.hourly - userData.hourly.count
    },
    daily: {
      limit: limits.daily,
      used: userData.daily.count,
      remaining: limits.daily - userData.daily.count
    }
  };
  
  next();
}

export { rateLimitStore, TIERS, initUserData, getUserData };