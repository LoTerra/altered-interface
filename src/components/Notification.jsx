import React from 'react'
import { CheckCircle, XCircle } from 'phosphor-react'

export default function Notification(props) {
    const { notification, close } = props

    let className = notification.show ? 'show' : ''
    className += notification.type === 'success' ? ' success' : ' error'

    return (
        <div onClick={close} className={`notification ${className}`}>
            <p>
                {notification.type === 'success' && <CheckCircle size={24} />}
                {notification.type === 'error' && <XCircle size={24} />}
                {notification.message}
            </p>
        </div>
    )
}
