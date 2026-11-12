import React, { useEffect, useState } from "react";
import "./supabase-connection-status.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseCheckTable = import.meta.env.VITE_SUPABASE_CHECK_TABLE;

function SupabaseConnectionStatus() {
  const [status, setStatus] = useState({
    message: "Checking Supabase connection…",
    state: "checking",
  });

  useEffect(() => {
    if (!supabaseUrl || !supabasePublishableKey || !supabaseCheckTable) {
      setStatus({
        message: "Supabase connection failed: configuration is missing.",
        state: "error",
      });
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    async function checkConnection() {
      try {
        const response = await fetch(
          `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/${encodeURIComponent(supabaseCheckTable)}?select=*&limit=0`,
          {
            headers: {
              apikey: supabasePublishableKey,
              Accept: "application/json",
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          setStatus({
            message: `Supabase database check failed for "${supabaseCheckTable}" (HTTP ${response.status}). Check that the table exists and is accessible.`,
            state: "error",
          });
          return;
        }

        setStatus({
          message: `Supabase connected successfully (table: ${supabaseCheckTable}).`,
          state: "success",
        });
      } catch (error) {
        if (error.name === "AbortError") {
          setStatus({
            message: "Supabase connection failed: request timed out.",
            state: "error",
          });
          return;
        }

        setStatus({
          message: "Supabase connection failed: unable to reach the project.",
          state: "error",
        });
      }
    }

    checkConnection();
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={`supabase-connection-status is-${status.state}`}
      role="status"
    >
      <span aria-hidden="true" className="supabase-connection-indicator" />
      {status.message}
    </div>
  );
}

export default SupabaseConnectionStatus;
