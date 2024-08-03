import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    return Response.json("this is api/user/login test");
}

export async function POST(req:Request) {
    const {email, pw} = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pw
    });
    if(error) return NextResponse.json({error:error},{status:400})
    let { data: user_id, error:userError } = await supabase
    .from('userInfo')
    .select('user_id')
    .eq('email', email)
    .single();
    
    if(userError) return NextResponse.json({error:error},{status:500})
    return NextResponse.json({data:data, userId:user_id?.user_id}, {status:200});
}