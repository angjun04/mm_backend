import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
    return Response.json("this is api/group/establish test");
}

export async function POST(req:NextRequest) {
    return Response.json("this is api/group/establish test");
}