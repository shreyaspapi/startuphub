'use client'

import { Button } from "@/components/ui/button"
import { logout } from '@/app/login/actions'

export default function LogoutButton() {
  return (
    <Button onClick={() => logout()}>
      Log out
    </Button>
  )
}
