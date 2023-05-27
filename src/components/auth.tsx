// lib/auth.js
import { NextApiRequest, NextApiResponse } from 'next';
import { SteamProfile } from "@/lib/passport";
import { NextSteamAuthApiRequest } from "@/lib/router";
import router from "@/lib/router";

export async function checkAuth({ req, res}:{req: NextSteamAuthApiRequest, res: NextApiResponse}) {
    await router.run(req, res);
    return { props: { user: req.user || null } };
}
