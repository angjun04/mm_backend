import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function GET(req:Request) {
    const { searchParams } = new URL(req.url)
    const nickname = searchParams.get('nickname');
    const user_id = searchParams.get('user_id');
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
    let { data: groupMembers, error:grouperror } = await supabase
        .from('GroupMembers')
        .select('group_id')
        .eq('user_id', user_id);
    if (error || grouperror) {
        console.error("Error fetching user info:", error);
        return NextResponse.json({ error: "Failed to fetch user info" }, { status: 500 });
    }
    
    const groupIds = groupMembers!.map(member => member.group_id);

    if (groupIds.length === 0) {
        return NextResponse.json({ userInfo, groups: [], status: 200 });
    }

  // Fetch group names
    let { data: groups, error: groupsError } = await supabase
        .from('Groups')
        .select('group_id, name')
        .in('group_id', groupIds);

    if (groupsError) {
        console.error("Error fetching group names:", groupsError);
        return NextResponse.json({ error: "Failed to fetch group names" }, { status: 500 });
    }
    if (!userInfo) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({info:userInfo,groups:groups}, {status:200});
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