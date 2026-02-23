import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize demo user
const initializeDemoUser = async () => {
  try {
    const demoEmail = 'mirajkarayush07@gmail.com';
    const existingUser = await kv.get(`user:${demoEmail}`);
    
    if (!existingUser) {
      const hashedPassword = await hashPassword('demo@123');
      await kv.set(`user:${demoEmail}`, {
        email: demoEmail,
        password: hashedPassword,
        name: 'Ayush Mirajkar',
        createdAt: new Date().toISOString(),
      });
      console.log('Demo user initialized');
    }
  } catch (error) {
    console.error('Failed to initialize demo user:', error);
  }
};

// Initialize on startup
initializeDemoUser();

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Sign up route
app.post('/make-server-243adae1/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Check if user exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // Hash password (simple hash for demo)
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${email}`, user);

    return c.json({
      success: true,
      user: { email, name },
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Login route
app.post('/make-server-243adae1/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Get user
    const user = await kv.get(`user:${email}`);
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Create session token (simple token for demo)
    const sessionToken = await generateToken(email);
    await kv.set(`session:${sessionToken}`, { email, createdAt: new Date().toISOString() });

    return c.json({
      success: true,
      token: sessionToken,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Verify session
app.get('/make-server-243adae1/auth/verify', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const session = await kv.get(`session:${token}`);
    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    const user = await kv.get(`user:${session.email}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log('Verify session error:', error);
    return c.json({ error: 'Verification failed' }, 500);
  }
});

// Logout
app.post('/make-server-243adae1/auth/logout', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      await kv.del(`session:${token}`);
    }
    return c.json({ success: true });
  } catch (error) {
    console.log('Logout error:', error);
    return c.json({ error: 'Logout failed' }, 500);
  }
});

// ============================================
// ASSET ROUTES
// ============================================

// Get all assets for a user
app.get('/make-server-243adae1/assets', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const session = await kv.get(`session:${token}`);
    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    const assets = await kv.getByPrefix(`asset:${session.email}:`);
    return c.json({ success: true, assets: assets || [] });
  } catch (error) {
    console.log('Get assets error:', error);
    return c.json({ error: 'Failed to get assets' }, 500);
  }
});

// Add asset
app.post('/make-server-243adae1/assets', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const session = await kv.get(`session:${token}`);
    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    const assetData = await c.req.json();
    const { name, type, quantity, buyPrice, currentPrice } = assetData;

    if (!name || !type || !quantity || !buyPrice) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const assetId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const asset = {
      id: assetId,
      userId: session.email,
      name,
      type,
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice),
      currentPrice: parseFloat(currentPrice || buyPrice),
      createdAt: new Date().toISOString(),
    };

    await kv.set(`asset:${session.email}:${assetId}`, asset);

    return c.json({ success: true, asset });
  } catch (error) {
    console.log('Add asset error:', error);
    return c.json({ error: 'Failed to add asset' }, 500);
  }
});

// Update asset
app.put('/make-server-243adae1/assets/:id', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const session = await kv.get(`session:${token}`);
    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    const assetId = c.req.param('id');
    const updateData = await c.req.json();

    const existingAsset = await kv.get(`asset:${session.email}:${assetId}`);
    if (!existingAsset) {
      return c.json({ error: 'Asset not found' }, 404);
    }

    const updatedAsset = {
      ...existingAsset,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`asset:${session.email}:${assetId}`, updatedAsset);

    return c.json({ success: true, asset: updatedAsset });
  } catch (error) {
    console.log('Update asset error:', error);
    return c.json({ error: 'Failed to update asset' }, 500);
  }
});

// Delete asset
app.delete('/make-server-243adae1/assets/:id', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const session = await kv.get(`session:${token}`);
    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    const assetId = c.req.param('id');
    await kv.del(`asset:${session.email}:${assetId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete asset error:', error);
    return c.json({ error: 'Failed to delete asset' }, 500);
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function hashPassword(password: string): Promise<string> {
  // Simple hash for demo - in production use bcrypt or similar
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

async function generateToken(email: string): Promise<string> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `${email}-${timestamp}-${random}`;
}

// Start server
Deno.serve(app.fetch);