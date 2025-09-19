"use client"

import { ReactNode, useState } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { Heading } from "../heading"
import { useRouter } from "next/navigation"
import { Modal } from "../ui/modal"
import HeroForm from "../forms/heroform"
import { useQuery } from "@tanstack/react-query"
import { fetchCurrentUser } from "@/lib/fetchCurrentUser"
import { LinkBackButton } from "./LinkBackButton"

interface DashboardPageProps {
  title?: string
  children?: ReactNode
  hideBackButton?: boolean
  showCreate?: boolean
  linkBackTo?: string
  cta?: ReactNode
  isDashboard?: boolean
}

export const DashboardPage = ({
  title,
  children,
  cta,
  linkBackTo,
  hideBackButton,
  showCreate = false,
  isDashboard = false,
}: DashboardPageProps) => {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  })

  return (
    <section className="flex-1 h-full w-full flex flex-col mb-20">
      {/* HEADER */}
      <div className="w-full p-3 sm:p-8 flex items-center justify-between border-b border-gray-200">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {!isDashboard && !hideBackButton && (
            linkBackTo ? (
              <LinkBackButton href={linkBackTo} />
            ) : (
              <Button
                onClick={() => {
                  if (window.history.length > 1) {
                    router.back()
                  } else {
                    router.push("/dashboard")
                  }
                }}
                className="w-fit bg-white"
                variant="outline"
              >
                <ArrowLeft className="size-4" />
              </Button>
            )
          )}

          {!isDashboard && <Heading>{title}</Heading>}

          {isDashboard && (
            <div className="mb-2">
              <h1 className="text-3xl font-heading font-semibold tracking-tight text-gray-900 mb-2">
                Welcome{" "}
                <span className="text-primary">{user?.name ?? "..."}</span>
              </h1>
              <p className="text-2xl font-heading font-semibold tracking-tight text-gray-700">
                Account balance:{" "}
                <span className="text-golden-dark">
                  {isLoading ? "Loading..." : user?.balance / 100}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {cta}
          {showCreate && (
            <>
              {/* Big screen button */}
              <Button
                size="sm"
                className="hidden md:block bg-primary text-white hover:bg-amber-800"
                onClick={() => setShowCreateModal(true)}
              >
                + Create Escrow
              </Button>

              {/* Mobile floating button */}
              <button
                className="flex md:hidden fixed bottom-20 right-8 z-20 items-center justify-center h-16 w-16 rounded-full bg-primary text-white shadow-lg hover:bg-amber-700 transition-colors duration-200"
                onClick={() => setShowCreateModal(!showCreateModal)}
              >
                <Plus className="h-12 w-12" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 mt-10">{children}</div>

      {/* CREATE ESCROW MODAL */}
      <Modal
        showModal={showCreateModal}
        setShowModal={() => setShowCreateModal(false)}
        className="max-w-2xl p-8"
      >
        <h2 className="text-lg font-semibold mb-4">Create Escrow</h2>
        <HeroForm inDashboard onSuccess={() => setShowCreateModal(false)} />
      </Modal>
    </section>
  )
}
