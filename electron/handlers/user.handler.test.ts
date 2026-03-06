// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest"
import type { IpcMainInvokeEvent } from "electron"
import { ipcMain } from "electron"
import bcrypt from "bcryptjs"

import { registerUserHandlers } from "./user.handler"
import { prisma } from "../lib/prisma"

vi.mock("electron", () => ({
    ipcMain: {
        handle: vi.fn(),
    },
}))

vi.mock("../lib/prisma", () => ({
    prisma: {
        user: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}))

vi.mock("bcryptjs", () => ({
    default: {
        hash: vi.fn(),
    },
}))

const mockUser = {
    id: 1,
    username: "user1",
    name: "User One",
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
}

type HandlerFn<T = unknown> = (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<T>

const getHandler = (channel: string): HandlerFn =>
    vi.mocked(ipcMain.handle).mock.calls.find((call) => call[0] === channel)![1] as HandlerFn

const nullEvent = null as unknown as IpcMainInvokeEvent

describe("User Handlers", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        registerUserHandlers()
    })

    it("should return users list", async () => {
        const handler = getHandler("users:find-all")
        vi.mocked(prisma.user.findMany).mockResolvedValue([mockUser] as never)

        const result = await handler(nullEvent)

        expect(prisma.user.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { name: "asc" },
        })
        expect(result).toEqual([mockUser])
    })

    it("should create user", async () => {
        const handler = getHandler("users:create")
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
        vi.mocked(bcrypt.hash).mockResolvedValue("hashedPassword" as never)
        vi.mocked(prisma.user.create).mockResolvedValue(mockUser as never)

        const result = await handler(nullEvent, {
            username: "user1",
            name: "User One",
            role: "USER",
            password: "password123",
        })

        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10)
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                username: "user1",
                name: "User One",
                role: "USER",
                password: "hashedPassword",
            },
            select: expect.any(Object),
        })
        expect(result).toEqual(mockUser)
    })

    it("should reject creation if username is taken", async () => {
        const handler = getHandler("users:create")
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never)

        await expect(
            handler(nullEvent, { username: "user1", name: "User One", role: "USER", password: "password123" }),
        ).rejects.toThrow("Nome de usuário já está em uso.")
    })

    it("should update user details and password", async () => {
        const handler = getHandler("users:update")
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as never) // existingUser
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null) // usernameInUse
        vi.mocked(bcrypt.hash).mockResolvedValue("newHashedPassword" as never)
        vi.mocked(prisma.user.update).mockResolvedValue({ ...mockUser, name: "User Two" } as never)

        const result = (await handler(nullEvent, 1, {
            username: "user2",
            name: "User Two",
            role: "ADMIN",
            password: "newPassword",
        })) as { name: string }

        expect(bcrypt.hash).toHaveBeenCalledWith("newPassword", 10)
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                username: "user2",
                name: "User Two",
                role: "ADMIN",
                password: "newHashedPassword",
            },
            select: expect.any(Object),
        })
        expect(result.name).toBe("User Two")
    })

    it("should update user details without changing password", async () => {
        const handler = getHandler("users:update")
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never) // existingUser
        vi.mocked(prisma.user.update).mockResolvedValue({ ...mockUser, name: "User Two" } as never)

        const result = (await handler(nullEvent, 1, {
            username: "user1",
            name: "User Two",
        })) as { name: string }

        expect(bcrypt.hash).not.toHaveBeenCalled()
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                username: "user1",
                name: "User Two",
            },
            select: expect.any(Object),
        })
        expect(result.name).toBe("User Two")
    })

    it("should reject update if user not found", async () => {
        const handler = getHandler("users:update")
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

        await expect(handler(nullEvent, "999", { name: "test" })).rejects.toThrow("Usuário não encontrado.")
    })

    it("should reject update if new username is taken", async () => {
        const handler = getHandler("users:update")
        // existingUser found
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as never)
        // new username already exists
        vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 2 } as never)

        await expect(handler(nullEvent, 1, { username: "user2" })).rejects.toThrow("Nome de usuário já está em uso.")
    })

    it("should delete user", async () => {
        const handler = getHandler("users:delete")
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never)
        vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as never)

        const result = await handler(nullEvent, 1)

        expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } })
        expect(result).toEqual({ success: true })
    })

    it("should reject delete if user not found", async () => {
        const handler = getHandler("users:delete")
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

        await expect(handler(nullEvent, "999")).rejects.toThrow("Usuário não encontrado.")
    })
})
