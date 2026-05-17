import { serve } from "std/http/server";

import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  try {

    // ✅ Handle CORS
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: corsHeaders,
      });
    }

    // ✅ Create Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ✅ Get logged-in user token
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // ✅ Verify logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Invalid user",
        }),
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Verify owner
    const { data: ownerData } =
      await supabaseAdmin
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "owner")
        .maybeSingle();

    if (!ownerData) {
      return new Response(
        JSON.stringify({
          error:
            "Only owner can invite admins",
        }),
        {
          status: 403,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Get request body
    const { email, role } =
      await req.json();

    if (!email || !role) {
      return new Response(
        JSON.stringify({
          error:
            "Email and role required",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Check existing admin
    const { data: existingAdmin } =
      await supabaseAdmin
        .from("admins")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (existingAdmin) {
      return new Response(
        JSON.stringify({
          error: "Admin already exists",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Invite user
    const {
      data,
      error: inviteError,
    } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo:
            "https://coaching-2.netlify.app/set-password",
        }
      );

    if (inviteError || !data.user) {
      return new Response(
        JSON.stringify({
          error:
            inviteError?.message ||
            "Failed to invite admin",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Insert into admins table
    const { error: insertError } =
      await supabaseAdmin
        .from("admins")
        .insert({
          email,
          role,
          user_id: data.user.id,
          status: "pending",
        });

    if (insertError) {
      return new Response(
        JSON.stringify({
          error:
            insertError.message,
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Success
    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );

  }catch (error) {

  return new Response(
    JSON.stringify({
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    }),
    {
      status: 500,
      headers: corsHeaders,
    }
  );
}
});