import { createClient } from '@supabase/supabase-js';
import { DailyRecord, Profile } from './types';

// Storage keys
const SUPABASE_URL_KEY = 'fleet_supabase_url';
const SUPABASE_KEY_KEY = 'fleet_supabase_anon_key';
const LOCAL_USERS_KEY = 'fleet_profiles_v1';
const LOCAL_RECORDS_KEY = 'fleet_daily_records_v1';
const LOCAL_SESSION_KEY = 'fleet_current_session_v1';
const LOCAL_LOGIN_HIST_KEY = 'fleet_login_history_v1';

// Initial pre-seeded mock dataset
const SEED_PROFILES: Profile[] = [
  {
    id: 'user-admin-01',
    vehicle_number: 'ADM-001',
    name: 'Fleet Director Alex Rivera',
    phone: '+1 (555) 019-2834',
    role: 'admin',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-driver-01',
    vehicle_number: 'KA-01-AB-1234',
    name: 'Marcus Chen',
    phone: '+1 (555) 234-5678',
    role: 'user',
    created_at: '2026-01-15T09:30:00Z',
  },
  {
    id: 'user-driver-02',
    vehicle_number: 'MH-02-CD-5678',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 876-5432',
    role: 'user',
    created_at: '2026-02-01T10:15:00Z',
  },
  {
    id: 'user-driver-03',
    vehicle_number: 'DL-1C-9988',
    name: 'David Rodriguez',
    phone: '+1 (555) 432-1098',
    role: 'user',
    created_at: '2026-02-12T11:45:00Z',
  },
];

// Helper to generate past dates in YYYY-MM-DD
function getPastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const SEED_RECORDS: DailyRecord[] = [
  // Driver 1 (Marcus Chen: KA-01-AB-1234)
  {
    id: 'rec-01',
    user_id: 'user-driver-01',
    record_date: getPastDate(0),
    income: 420.00,
    income_details: 'Morning airport shuttle + 4 afternoon executive city runs',
    cost: 85.50,
    cost_location: 'Shell Express - Central Ring Blvd',
    cost_details: '32.4 Liters Diesel fuel + windshield fluid',
    other: 15.00,
    other_details: 'Terminal parking fee & tyre pressure check',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec-02',
    user_id: 'user-driver-01',
    record_date: getPastDate(1),
    income: 380.00,
    income_details: 'Full day corporate charter booking',
    cost: 72.00,
    cost_location: 'BP Highway Station Exit 14',
    cost_details: '28 Liters Diesel fuel refill',
    other: 22.50,
    other_details: 'Highway expressway electronic toll charges',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'rec-03',
    user_id: 'user-driver-01',
    record_date: getPastDate(3),
    income: 510.00,
    income_details: 'Weekend inter-city courier express batch',
    cost: 110.00,
    cost_location: 'Chevron Travel Plaza',
    cost_details: '42 Liters Premium Diesel',
    other: 35.00,
    other_details: 'Express car wash & interior vacuuming',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rec-04',
    user_id: 'user-driver-01',
    record_date: getPastDate(5),
    income: 340.00,
    income_details: 'Standard commuter routes & parcel delivery',
    cost: 65.00,
    cost_location: 'Central Fuel Hub',
    cost_details: '25 Liters Diesel',
    other: 12.00,
    other_details: 'Fastag toll pass deduction',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'rec-05',
    user_id: 'user-driver-01',
    record_date: getPastDate(8),
    income: 490.00,
    income_details: 'Special events group transport',
    cost: 95.00,
    cost_location: 'Shell Airport Service Station',
    cost_details: '36 Liters fuel + engine oil top-up',
    other: 45.00,
    other_details: 'Puncture repair and tire rotation service',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },

  // Driver 2 (Sarah Jenkins: MH-02-CD-5678)
  {
    id: 'rec-06',
    user_id: 'user-driver-02',
    record_date: getPastDate(0),
    income: 390.00,
    income_details: 'Retail logistics distribution delivery route',
    cost: 78.00,
    cost_location: 'TotalEnergies Depot',
    cost_details: '30 Liters Diesel fuel',
    other: 10.00,
    other_details: 'Warehouse loading dock gate fee',
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec-07',
    user_id: 'user-driver-02',
    record_date: getPastDate(2),
    income: 440.00,
    income_details: 'Cross-town pharmaceutical deliveries',
    cost: 88.00,
    cost_location: 'Texaco Midtown Service',
    cost_details: '34 Liters Diesel fuel',
    other: 18.00,
    other_details: 'Bridge toll transit pass',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'rec-08',
    user_id: 'user-driver-02',
    record_date: getPastDate(6),
    income: 310.00,
    income_details: 'City perimeter distribution drops',
    cost: 60.00,
    cost_location: 'Metro Gas & Diesel',
    cost_details: '24 Liters Diesel',
    other: 0.00,
    other_details: 'No incidental costs',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },

  // Driver 3 (David Rodriguez: DL-1C-9988)
  {
    id: 'rec-09',
    user_id: 'user-driver-03',
    record_date: getPastDate(1),
    income: 560.00,
    income_details: 'Industrial machinery components transport',
    cost: 125.00,
    cost_location: 'Interstate Truck Stop North',
    cost_details: '48 Liters Heavy Duty Diesel',
    other: 55.00,
    other_details: 'Highway weigh station fee & coolant flush',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'rec-10',
    user_id: 'user-driver-03',
    record_date: getPastDate(4),
    income: 480.00,
    income_details: 'Wholesale market freight delivery',
    cost: 92.00,
    cost_location: 'QuickStop Fueling Center',
    cost_details: '35 Liters Diesel',
    other: 20.00,
    other_details: 'Terminal cargo security pass',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

// Determine if live Supabase is configured
export function getSupabaseConfig(): { url: string; key: string } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  const storedUrl = localStorage.getItem(SUPABASE_URL_KEY) || '';
  const storedKey = localStorage.getItem(SUPABASE_KEY_KEY) || '';

  return {
    url: storedUrl || envUrl,
    key: storedKey || envKey,
  };
}

export function saveSupabaseConfig(url: string, key: string) {
  if (url && key) {
    localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_KEY_KEY, key.trim());
  } else {
    localStorage.removeItem(SUPABASE_URL_KEY);
    localStorage.removeItem(SUPABASE_KEY_KEY);
  }
}

export function isUsingLiveSupabase(): boolean {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.key && config.url.startsWith('http'));
}

export async function testSupabaseConnection(url: string, key: string): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
  tablesChecked?: string[];
  statusCode?: number;
}> {
  if (!url || !key) {
    return { success: false, message: 'Please provide both Supabase Project URL and Anon Key.' };
  }
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = key.trim();

  const startTime = performance.now();
  try {
    const response = await fetch(`${cleanUrl}/rest/v1/profiles?select=count`, {
      method: 'GET',
      headers: {
        apikey: cleanKey,
        Authorization: `Bearer ${cleanKey}`,
      },
    });
    const latencyMs = Math.round(performance.now() - startTime);

    if (response.ok) {
      return {
        success: true,
        message: `Connection verified! Latency: ${latencyMs}ms. 'public.profiles' table reachable.`,
        latencyMs,
        tablesChecked: ['profiles'],
        statusCode: response.status,
      };
    } else if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        message: `Authentication failed (HTTP ${response.status}). Please check your public Anon Key.`,
        latencyMs,
        statusCode: response.status,
      };
    } else if (response.status === 404 || response.status === 400) {
      return {
        success: true,
        message: `Reachable (${latencyMs}ms), but 'profiles' table not found. Please execute the SQL migration script in your Supabase SQL editor!`,
        latencyMs,
        tablesChecked: [],
        statusCode: response.status,
      };
    } else {
      const text = await response.text().catch(() => '');
      return {
        success: false,
        message: `Supabase returned HTTP ${response.status}: ${text.slice(0, 100)}`,
        latencyMs,
        statusCode: response.status,
      };
    }
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      message: `Failed to reach endpoint: ${err?.message || 'Network error'}. Check your Project URL.`,
      latencyMs,
    };
  }
}

export function getDatabaseStats() {
  const isLive = isUsingLiveSupabase();
  const config = getSupabaseConfig();
  const profiles = getStoredProfiles();
  const records = getStoredRecords();
  let logins = 0;
  try {
    logins = JSON.parse(localStorage.getItem(LOCAL_LOGIN_HIST_KEY) || '[]').length;
  } catch {}

  return {
    isLive,
    url: isLive ? config.url : 'In-Browser Persistent Local Storage',
    totalProfiles: profiles.length,
    totalRecords: records.length,
    totalLogins: logins,
  };
}

export function exportAllDatabaseJson(): string {
  const profiles = getStoredProfiles();
  const records = getStoredRecords();
  const logins = JSON.parse(localStorage.getItem(LOCAL_LOGIN_HIST_KEY) || '[]');
  return JSON.stringify(
    {
      exported_at: new Date().toISOString(),
      version: '1.0',
      profiles,
      daily_records: records,
      login_history: logins,
    },
    null,
    2
  );
}

export function importDatabaseJson(jsonString: string): {
  success: boolean;
  message: string;
  countProfiles: number;
  countRecords: number;
} {
  try {
    const data = JSON.parse(jsonString);
    if (!data.profiles || !Array.isArray(data.profiles)) {
      return {
        success: false,
        message: 'Invalid JSON backup: missing profiles array.',
        countProfiles: 0,
        countRecords: 0,
      };
    }
    saveProfiles(data.profiles);
    if (Array.isArray(data.daily_records)) {
      saveRecords(data.daily_records);
    }
    if (Array.isArray(data.login_history)) {
      localStorage.setItem(LOCAL_LOGIN_HIST_KEY, JSON.stringify(data.login_history));
    }
    return {
      success: true,
      message: 'Database imported successfully!',
      countProfiles: data.profiles.length,
      countRecords: Array.isArray(data.daily_records) ? data.daily_records.length : 0,
    };
  } catch (err: any) {
    return { success: false, message: `Parse error: ${err.message}`, countProfiles: 0, countRecords: 0 };
  }
}

// Memory / LocalStorage Data Helpers
function getStoredProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(SEED_PROFILES));
      return SEED_PROFILES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_PROFILES;
  }
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(profiles));
}

function getStoredRecords(): DailyRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_RECORDS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify(SEED_RECORDS));
      return SEED_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_RECORDS;
  }
}

function saveRecords(records: DailyRecord[]) {
  localStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify(records));
}

export function resetDemoData() {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(SEED_PROFILES));
  localStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify(SEED_RECORDS));
  localStorage.removeItem(LOCAL_SESSION_KEY);
}

// Client Abstraction that behaves consistently whether in live or local mode
class MockSupabaseClient {
  private authSubscribers: ((event: string, session: any) => void)[] = [];

  auth = {
    signUp: async ({ email, password, options }: any) => {
      await new Promise(r => setTimeout(r, 200));
      const vehicle_number = (options?.data?.vehicle_number || '').trim().toUpperCase();
      const name = (options?.data?.name || '').trim();
      const phone = (options?.data?.phone || '').trim();

      if (!vehicle_number) {
        return { data: null, error: { message: 'Vehicle number is required.' } };
      }
      if (!name) {
        return { data: null, error: { message: 'Driver name is required.' } };
      }
      if (!password || password.length < 4) {
        return { data: null, error: { message: 'Password must be at least 4 characters.' } };
      }

      const profiles = getStoredProfiles();
      const exists = profiles.some(p => p.vehicle_number.toUpperCase() === vehicle_number);
      if (exists) {
        return { data: null, error: { message: `Vehicle ${vehicle_number} is already registered. Please login.` } };
      }

      const newId = 'user-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const isFirstUser = profiles.length === 0;
      const newProfile: Profile = {
        id: newId,
        vehicle_number,
        name,
        phone: phone || '+1 (555) 000-0000',
        role: isFirstUser || vehicle_number.startsWith('ADM') ? 'admin' : 'user',
        created_at: new Date().toISOString(),
      };

      profiles.push(newProfile);
      saveProfiles(profiles);

      const session = {
        user: { id: newId, email, user_metadata: options?.data },
        access_token: 'demo-token-' + newId,
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));

      this.notifyAuth('SIGNED_IN', session);
      return { data: { user: session.user, session }, error: null };
    },

    signInWithPassword: async ({ email, password }: any) => {
      await new Promise(r => setTimeout(r, 200));
      const profiles = getStoredProfiles();
      const prefix = (email || '').split('@')[0].trim().toUpperCase();

      const profile = profiles.find(
        p => p.vehicle_number.toUpperCase() === prefix || p.id === prefix || (p.name.toLowerCase() === email.toLowerCase())
      );

      if (!profile) {
        return {
          data: null,
          error: { message: `No vehicle found with identifier "${prefix}". Please check vehicle number or register.` },
        };
      }

      const session = {
        user: { id: profile.id, email: `${profile.vehicle_number.toLowerCase()}@vehicle.local` },
        access_token: 'demo-token-' + profile.id,
      };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));

      this.notifyAuth('SIGNED_IN', session);
      return { data: { user: session.user, session }, error: null };
    },

    getSession: async () => {
      try {
        const raw = localStorage.getItem(LOCAL_SESSION_KEY);
        if (raw) {
          const session = JSON.parse(raw);
          return { data: { session }, error: null };
        }
      } catch {}
      return { data: { session: null }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      this.notifyAuth('SIGNED_OUT', null);
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      this.authSubscribers.push(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              this.authSubscribers = this.authSubscribers.filter(cb => cb !== callback);
            },
          },
        },
      };
    },
  };

  private notifyAuth(event: string, session: any) {
    this.authSubscribers.forEach(cb => {
      try {
        cb(event, session);
      } catch (err) {
        console.error('Auth state change listener error', err);
      }
    });
  }

  from(table: string) {
    return new QueryBuilder(table);
  }
}

class QueryBuilder {
  private tableName: string;
  private filters: ((item: any) => boolean)[] = [];
  private orderField: string | null = null;
  private orderAscending = true;
  private isSingle = false;
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private updatePayload: any = null;
  private insertPayload: any = null;

  constructor(table: string) {
    this.tableName = table;
  }

  select(_columns = '*') {
    this.operation = 'select';
    return this;
  }

  insert(payload: any) {
    this.operation = 'insert';
    this.insertPayload = payload;
    return this;
  }

  update(payload: any) {
    this.operation = 'update';
    this.updatePayload = payload;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item: any) => item[column] === value);
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push((item: any) => item[column] !== value);
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push((item: any) => item[column] >= value);
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push((item: any) => item[column] <= value);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderField = column;
    this.orderAscending = options?.ascending ?? true;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  then(resolve: (res: any) => void, reject?: (err: any) => void) {
    return this.execute().then(resolve, reject);
  }

  private async execute(): Promise<{ data: any; x?: any; error: any }> {
    await new Promise(r => setTimeout(r, 40));
    try {
      if (this.operation === 'insert') {
        return this.executeInsert();
      }
      if (this.operation === 'update') {
        return this.executeUpdate();
      }
      if (this.operation === 'delete') {
        return this.executeDelete();
      }
      return this.executeSelect();
    } catch (err: any) {
      console.error(`Error executing ${this.operation} on ${this.tableName}:`, err);
      return { data: null, error: { message: err?.message || 'Database operation failed' } };
    }
  }

  private executeSelect(): { data: any; x?: any; error: any } {
    let items: any[] = [];

    if (this.tableName === 'profiles') {
      items = [...getStoredProfiles()];
    } else if (this.tableName === 'daily_records') {
      items = [...getStoredRecords()];
    } else if (this.tableName === 'login_history') {
      try {
        items = JSON.parse(localStorage.getItem(LOCAL_LOGIN_HIST_KEY) || '[]');
      } catch {
        items = [];
      }
    }

    for (const f of this.filters) {
      items = items.filter(f);
    }

    if (this.orderField) {
      const field = this.orderField;
      const asc = this.orderAscending;
      items.sort((a, b) => {
        if (a[field] < b[field]) return asc ? -1 : 1;
        if (a[field] > b[field]) return asc ? 1 : -1;
        return 0;
      });
    }

    if (this.isSingle) {
      const single = items[0] || null;
      return { data: single, error: single ? null : { message: 'Row not found' } };
    }

    return { data: items, x: items, error: null };
  }

  private executeInsert(): { data: any; error: any } {
    const payload = this.insertPayload;
    if (this.tableName === 'daily_records') {
      const records = getStoredRecords();
      const newRec: DailyRecord = {
        id: 'rec-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        user_id: payload.user_id,
        record_date: payload.record_date || new Date().toISOString().slice(0, 10),
        income: Number(payload.income) || 0,
        income_details: payload.income_details || '',
        cost: Number(payload.cost) || 0,
        cost_location: payload.cost_location || '',
        cost_details: payload.cost_details || '',
        other: Number(payload.other) || 0,
        other_details: payload.other_details || '',
        created_at: new Date().toISOString(),
      };
      records.unshift(newRec);
      saveRecords(records);
      return { data: [newRec], error: null };
    }

    if (this.tableName === 'profiles') {
      const profiles = getStoredProfiles();
      profiles.push(payload);
      saveProfiles(profiles);
      return { data: [payload], error: null };
    }

    if (this.tableName === 'login_history') {
      try {
        const hist = JSON.parse(localStorage.getItem(LOCAL_LOGIN_HIST_KEY) || '[]');
        hist.push({ id: Date.now(), user_id: payload.user_id, logged_in_at: new Date().toISOString() });
        localStorage.setItem(LOCAL_LOGIN_HIST_KEY, JSON.stringify(hist.slice(-100)));
      } catch {}
      return { data: [payload], error: null };
    }

    return { data: null, error: null };
  }

  private executeUpdate(): { data: any; error: any } {
    const payload = this.updatePayload;
    if (this.tableName === 'daily_records') {
      let records = getStoredRecords();
      records = records.map(r => {
        let matches = true;
        for (const f of this.filters) {
          if (!f(r)) matches = false;
        }
        if (matches) {
          return { ...r, ...payload };
        }
        return r;
      });
      saveRecords(records);
      return { data: records, error: null };
    }

    if (this.tableName === 'profiles') {
      let profiles = getStoredProfiles();
      profiles = profiles.map(p => {
        let matches = true;
        for (const f of this.filters) {
          if (!f(p)) matches = false;
        }
        if (matches) {
          return { ...p, ...payload };
        }
        return p;
      });
      saveProfiles(profiles);
      return { data: profiles, error: null };
    }

    return { data: null, error: null };
  }

  private executeDelete(): { data: any; error: any } {
    if (this.tableName === 'daily_records') {
      let records = getStoredRecords();
      const beforeCount = records.length;
      records = records.filter(r => {
        for (const f of this.filters) {
          if (f(r)) return false; // delete matching
        }
        return true;
      });
      saveRecords(records);
      return { data: { count: beforeCount - records.length }, error: null };
    }

    if (this.tableName === 'profiles') {
      let profiles = getStoredProfiles();
      profiles = profiles.filter(p => {
        for (const f of this.filters) {
          if (f(p)) return false;
        }
        return true;
      });
      saveProfiles(profiles);
      return { data: true, error: null };
    }

    return { data: null, error: null };
  }
}

// Factory returning either live Supabase client or local mock client
function getClientInstance() {
  const config = getSupabaseConfig();
  if (config.url && config.key && config.url.startsWith('http')) {
    try {
      return createClient(config.url, config.key);
    } catch (err) {
      console.warn('Failed to initialize live Supabase client, falling back to local store:', err);
    }
  }
  return new MockSupabaseClient();
}

export const supabase: any = getClientInstance();

export const SUPABASE_SQL_SCHEMA = `-- PostgreSQL / Supabase SQL Schema for Vehicle Income & Cost System
-- Paste and execute this in your Supabase SQL Editor:

create type public.app_role as enum('user','admin');

create table public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  vehicle_number text unique not null,
  name text not null,
  phone text not null,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now()
);

create table public.daily_records(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  record_date date not null,
  income numeric(14,2) not null default 0 check(income>=0),
  income_details text not null default '',
  cost numeric(14,2) not null default 0 check(cost>=0),
  cost_location text not null default '',
  cost_details text not null default '',
  other numeric(14,2) not null default 0 check(other>=0),
  other_details text not null default '',
  created_at timestamptz not null default now()
);

create table public.login_history(
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  logged_in_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin')
$$;

alter table public.profiles enable row level security;
alter table public.daily_records enable row level security;
alter table public.login_history enable row level security;

create policy "profile read" on public.profiles for select using(id=auth.uid() or public.is_admin());
create policy "profile insert" on public.profiles for insert with check(id=auth.uid());
create policy "profile update" on public.profiles for update using(id=auth.uid() or public.is_admin()) with check(id=auth.uid() or public.is_admin());

create policy "record read" on public.daily_records for select using(user_id=auth.uid() or public.is_admin());
create policy "record insert" on public.daily_records for insert with check(user_id=auth.uid());
create policy "record update" on public.daily_records for update using(user_id=auth.uid() or public.is_admin()) with check(user_id=auth.uid() or public.is_admin());
create policy "record delete" on public.daily_records for delete using(user_id=auth.uid() or public.is_admin());

create policy "history read" on public.login_history for select using(user_id=auth.uid() or public.is_admin());
create policy "history insert" on public.login_history for insert with check(user_id=auth.uid() or public.is_admin());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin 
  insert into public.profiles(id, vehicle_number, name, phone)
  values(
    new.id,
    upper(coalesce(new.raw_user_meta_data->>'vehicle_number','')),
    coalesce(new.raw_user_meta_data->>'name',''),
    coalesce(new.raw_user_meta_data->>'phone','')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created 
  after insert on auth.users 
  for each row execute function public.handle_new_user();
`;
