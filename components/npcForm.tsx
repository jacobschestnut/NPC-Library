"use client"

import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

type NPCFormProps = {
  onCreated?: () => void;
  isVisible: boolean;
};

export default function NPCForm({ onCreated, isVisible }: NPCFormProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/npc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, desc, userId }),
      })

      if (!res.ok) {
        throw new Error("Failed to create NPC")
      }

      setName("")
      setDesc("")
      onCreated?.();
    } catch (err) {
      console.error(err)
      alert("Error creating NPC")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (data?.user) {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {isVisible && <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white shadow-lg dark:bg-slate-900 p-5 space-y-3"
      >
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">New NPC</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          maxLength={50}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          maxLength={50}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="h-12 cursor-pointer mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Submit"}
        </button>
      </form>}
    </div>
  )
}