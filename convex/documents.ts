import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server"

export const create = mutation({
  args: { title: v.optional(v.string()), initialContent: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()

    if (!user) {
      throw new ConvexError("Unauthorized")
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined

    return await ctx.db.insert("documents", {
      title: args.title ?? "Untitled document",
      ownerId: user.subject,
      organizationId,
    })
  },
})

export const get = query({
  args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string())},
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity()

    if (!user) {
      throw new ConvexError("Unauthorized")
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined

    if (search && organizationId) {
      return await ctx.db
      .query("documents")
      .withSearchIndex("search_title", (q) =>
        q.search("title", search).eq("organizationId", organizationId)
      )
      .paginate(paginationOpts)
    }

    //personal search
    if (search) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("ownerId", user.subject)
      )
      .paginate(paginationOpts)
    }

    //all docs in organization
    if (organizationId) {
      return await ctx.db
      .query("documents")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
      .paginate(paginationOpts)
    }

    //all personal docs
    return await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts)
  },
});



export const removeById = mutation({
  args: { id: v.id("documents") },
  handler: async (convexToJson, args) => {
    const user = await convexToJson.auth.getUserIdentity()

    if (!user) {
      throw new ConvexError("Unauthorized")
    }


    const document = await convexToJson.db.get(args.id)

    if (!document) {
      throw new ConvexError("Document not found")
    }

    const isOwner = document.ownerId === user.subject
    if (!isOwner) {
      throw new ConvexError("Unauthorized")
    }

    return await convexToJson.db.delete(args.id)
  }
})

export const updateById = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (convexToJson, args) => {
    const user = await convexToJson.auth.getUserIdentity()


    if (!user) {
      throw new ConvexError("Unauthorized")
    }

        
    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined

    const document = await convexToJson.db.get(args.id)

    if (!document) {
      throw new ConvexError("Document not found")
    }

    const isOwner = document.ownerId === user.subject
    const isOrganizationMember =
      !!(document.organizationId && document.organizationId === organizationId)


    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Unauthorized")
    }

    return await convexToJson.db.patch(args.id, { title: args.title })
  }
})

export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const document = await ctx.db.get(id)

    if (!document) {
      throw new ConvexError("Document not found")
    }

    return document
  }

});