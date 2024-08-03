import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    return Response.json("this is api/user/login test");
}

export async function POST(req:Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signOut();
    if(error) return Response.json({status:401});
    return NextResponse.json({status:200});
}