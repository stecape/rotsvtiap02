"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full text-left text-sm text-gray-500 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
    >
      Esci
    </button>
  )
}
