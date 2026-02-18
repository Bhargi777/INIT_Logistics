import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;
let supabaseError: string | null = null;

export function getSupabaseError(): string | null {
    return supabaseError;
}

export function getSupabase(): SupabaseClient {
    if (supabaseInstance) return supabaseInstance;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        supabaseError =
            "Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings, then redeploy.";
        throw new Error(supabaseError);
    }

    // Validate URL format before passing to Supabase client
    try {
        new URL(supabaseUrl);
    } catch {
        supabaseError = `Invalid NEXT_PUBLIC_SUPABASE_URL: "${supabaseUrl}" is not a valid URL. It should look like https://xxxxx.supabase.co`;
        throw new Error(supabaseError);
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
}
