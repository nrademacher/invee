import { _ProjectModel } from 'prisma/zod'

export const createProjectSchema = _ProjectModel.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
})
