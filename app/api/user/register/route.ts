import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    return NextResponse.json("this is api/user/register test");
}

export async function POST(req:Request) {
    const {email, pw, nickname} = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signUp({
        email,
        password:pw,
        options: {
            data: {
              name: nickname,
            }
          }
    }); 
    if(error) {
        console.log(error);
        return NextResponse.json({err:"failed", status:500});
    }
    const { data:userInfo, error:err } = await supabase
    .from('userInfo')
    .insert([
        {email:email, nickname:nickname, admin:false},
    ])
    .select()
    return NextResponse.json({data: userInfo},{status:200});
}