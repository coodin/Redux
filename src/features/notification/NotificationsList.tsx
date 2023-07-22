import React, { useEffect, useLayoutEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { formatDistanceToNow, parseISO } from "date-fns"
import classnames from "classnames"

import { selectAllUsers } from "../users/usersSlice"

import {
  allNotificationsRead,
  selectMetadataEntities,
  useGetNotificationsQuery,
} from "./notificationsSlice"
import { AppDispatch } from "../../app/store"
import { useAppDispatch } from "../../app/hooks"

export const NotificationsList = () => {
  //const notifications = useSelector(selectAllNotifications)
  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetadata = useSelector(selectMetadataEntities)
  const users = useSelector(selectAllUsers)
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  }, [notifications.length])

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) || {
      name: "Unknown User",
    }
    const metadata = notificationsMetadata[notification.id]
    const notificationClassname = classnames("notification", {
      new: metadata?.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
