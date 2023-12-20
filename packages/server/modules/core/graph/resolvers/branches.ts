'use strict'

import { withFilter } from 'graphql-subscriptions'

import { StreamBranchesArgs } from '@/modules/core/graph/generated/graphql'
import {
  pubsub,
  BranchSubscriptions as BranchPubsubEvents
} from '@/modules/shared/utils/subscriptions'
import { authorizeResolver } from '@/modules/shared'

import { getBranchByNameAndStreamId, getBranchById } from '../../services/branches'
import {
  createBranchAndNotify,
  updateBranchAndNotify,
  deleteBranchAndNotify
} from '@/modules/core/services/branch/management'
import { getPaginatedStreamBranches } from '@/modules/core/services/branch/retrieval'

import { getUserById } from '../../services/users'
import { Roles } from '@speckle/shared'
import {
  BranchCreateInput,
  BranchDeleteInput,
  BranchUpdateInput
} from '@/test/graphql/generated/graphql'

// subscription events
const BRANCH_CREATED = BranchPubsubEvents.BranchCreated
const BRANCH_UPDATED = BranchPubsubEvents.BranchUpdated
const BRANCH_DELETED = BranchPubsubEvents.BranchDeleted

/** @type {import('@/modules/core/graph/generated/graphql').Resolvers} */
export default {
  Query: {},
  Stream: {
    async branches(parent: { id: string }, args: StreamBranchesArgs) {
      return await getPaginatedStreamBranches(parent.id, args)
    },

    async branch(parent: { id: string }, args: { name: string }) {
      // TODO: TEMPORARY HACK
      // Temporary "Forwards" compatibility layer to allow .NET and PY clients
      // to use FE2 urls without major changes.
      // When getting a branch by name, if not found, we try to do a 'hail mary' attempt
      // and get it by id as well (this would be coming from a FE2 url).

      const branchByName = await getBranchByNameAndStreamId({
        streamId: parent.id,
        name: args.name
      })
      if (branchByName) return branchByName

      const branchByIdRes = await getBranchById({ id: args.name })
      if (!branchByIdRes) return null

      // Extra validation to check if it actually belongs to the stream
      if (branchByIdRes.streamId !== parent.id) return null
      return branchByIdRes
    }
  },
  Branch: {
    async author(
      parent: { authorId: string },
      args: unknown,
      context: { auth: unknown }
    ) {
      if (parent.authorId && context.auth)
        return await getUserById({ userId: parent.authorId })
      else return null
    }
  },
  Mutation: {
    async branchCreate(
      parent: unknown,
      args: { branch: BranchCreateInput },
      context: { userId: string }
    ) {
      await authorizeResolver(
        context.userId,
        args.branch.streamId,
        Roles.Stream.Contributor
      )

      const { id } = await createBranchAndNotify(args.branch, context.userId)

      return id
    },

    async branchUpdate(
      parent: unknown,
      args: { branch: BranchUpdateInput },
      context: { userId: string }
    ) {
      await authorizeResolver(
        context.userId,
        args.branch.streamId,
        Roles.Stream.Contributor
      )

      const newBranch = await updateBranchAndNotify(args.branch, context.userId)
      return !!newBranch
    },

    async branchDelete(
      parent: unknown,
      args: { branch: BranchDeleteInput },
      context: { userId: string }
    ) {
      await authorizeResolver(
        context.userId,
        args.branch.streamId,
        Roles.Stream.Contributor
      )

      const deleted = await deleteBranchAndNotify(args.branch, context.userId)
      return deleted
    }
  },
  Subscription: {
    branchCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([BRANCH_CREATED]),
        async (payload, variables, context) => {
          await authorizeResolver(
            context.userId,
            payload.streamId,
            Roles.Stream.Reviewer
          )

          return payload.streamId === variables.streamId
        }
      )
    },

    branchUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([BRANCH_UPDATED]),
        async (payload, variables, context) => {
          await authorizeResolver(
            context.userId,
            payload.streamId,
            Roles.Stream.Reviewer
          )

          const streamMatch = payload.streamId === variables.streamId
          if (streamMatch && variables.branchId) {
            return payload.branchId === variables.branchId
          }

          return streamMatch
        }
      )
    },

    branchDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([BRANCH_DELETED]),
        async (payload, variables, context) => {
          await authorizeResolver(
            context.userId,
            payload.streamId,
            Roles.Stream.Reviewer
          )

          return payload.streamId === variables.streamId
        }
      )
    }
  }
}