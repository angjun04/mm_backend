import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    const { searchParams } = new URL(req.url)
    const nickname = searchParams.get('nickname')

    if (!nickname) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    let { data: userInfo, error } = await supabase
        .from('userInfo')
        .select('*')
        .eq('nickname', nickname)
        .single();
    
    if (error) {
        console.error("Error fetching user info:", error);
        return NextResponse.json({ error: "Failed to fetch user info" }, { status: 500 });
    }

    if (!userInfo) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({userInfo, status:200});
}

export async function POST(req:Request) {
    const { oldNickname, newNickname } = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    let { data: existingUser, error:checkError } = await supabase
        .from('userInfo')
        .select('*')
        .eq('nickname', newNickname)
        .single();
    if(existingUser) return NextResponse.json({error: "Already exists"}, {status:400});
    if (checkError && checkError.code !== 'PGRST116') {
        return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    let { data: updatedUserInfo, error: updateError } = await supabase
    .from('userInfo')
    .update({ nickname: newNickname })
    .eq('nickname', oldNickname)
    .select()
    .single();

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return Response.json({data: updatedUserInfo}, {status:200});
}