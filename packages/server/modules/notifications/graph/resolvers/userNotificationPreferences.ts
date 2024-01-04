import { Resolvers } from '@/modules/core/graph/generated/graphql'
import {
  updateNotificationPreferences,
  getUserNotificationPreferences
} from '@/modules/notifications/services/notificationPreferences'

export = {
  User: {
    async notificationPreferences(parent) {
      const preferences = await getUserNotificationPreferences(parent.id)
      return preferences
    }
  },
  Mutation: {
    async userNotificationPreferencesUpdate(_parent, args, context) {
      await updateNotificationPreferences(context.userId, args.preferences)
      return true
    }
  }
} as Resolvers
