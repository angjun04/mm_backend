import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
    return Response.json("this is api/group/enter get");
}

export async function POST(req:NextRequest) {
    
    return Response.json("this is api/group/enter test");
}