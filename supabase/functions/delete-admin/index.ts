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

    // ✅ Get auth token
    const authHeader =
      req.headers.get("Authorization");

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

    const token =
      authHeader.replace("Bearer ", "");

    // ✅ Verify logged-in user
    const {
      data: { user },
      error: userError,
    } =
      await supabaseAdmin.auth.getUser(
        token
      );

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
            "Only owner can delete admins",
        }),
        {
          status: 403,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Get admin id
    const { adminId } =
      await req.json();

    if (!adminId) {
      return new Response(
        JSON.stringify({
          error: "Admin ID required",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Find admin
    const { data: adminData } =
      await supabaseAdmin
        .from("admins")
        .select("*")
        .eq("id", adminId)
        .maybeSingle();

    if (!adminData) {
      return new Response(
        JSON.stringify({
          error: "Admin not found",
        }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    // ❌ Prevent deleting owner
    if (adminData.role === "owner") {
      return new Response(
        JSON.stringify({
          error:
            "Owner cannot be deleted",
        }),
        {
          status: 403,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Delete auth user
    const { error: deleteAuthError } =
      await supabaseAdmin.auth.admin.deleteUser(
        adminData.user_id
      );

    if (deleteAuthError) {
      return new Response(
        JSON.stringify({
          error:
            deleteAuthError.message,
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Delete admin row
    const { error: deleteRowError } =
      await supabaseAdmin
        .from("admins")
        .delete()
        .eq("id", adminId);

    if (deleteRowError) {
      return new Response(
        JSON.stringify({
          error:
            deleteRowError.message,
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