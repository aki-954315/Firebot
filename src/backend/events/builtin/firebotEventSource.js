"use strict";

/**
 * The firebot event source
 */
const firebotEventSource = {
    id: "firebot",
    name: "Firebot",
    description: "Various events that can happen within Firebot.",
    events: [
        {
            id: "chat-connected",
            name: "Twitch Connected",
            description: "When Firebot connects to Twitch.",
            cached: false,
            activityFeed: {
                icon: "fad fa-plug",
                getMessage: () => {
                    return `Connected to Twitch`;
                }
            }
        },
        {
            id: "view-time-update",
            name: "View Time Update",
            description: "When a viewer's view time updates automatically.",
            cached: false,
            manualMetadata: {
                username: "Firebot",
                previousViewTime: 1,
                newViewTime: 2
            }
        },
        {
            id: "currency-update",
            name: "Currency Update",
            description: "When a viewer's currency changes.",
            cached: false,
            manualMetadata: {
                username: "Firebot",
                currencyName: "Coins",
                previousCurrencyAmount: 1,
                newCurrencyAmount: 2
            }
        },
        {
            id: "viewer-created",
            name: "Viewer Created",
            description: "When a viewer is first saved in the Viewer Database",
            cached: false,
            manualMetadata: {
                username: "Firebot"
            }
        },
        {
            id: "firebot-started",
            name: "Firebot Started",
            description: "When Firebot has started running.",
            cached: false
        },
        {
            id: "custom-variable-expired",
            name: "Custom Variable Expired",
            description: "When a custom variable expires",
            cached: false
        },
        {
            id: "custom-variable-set",
            name: "Custom Variable Created",
            description: "When a custom variable gets created",
            cached: false
        },
        {
            id: "highlight-message",
            name: "Chat Message Highlight",
            description: "When you select to highlight a message on your overlay.",
            cached: false,
            manualMetadata: {
                username: "Firebot",
                messageText: "Test message"
            }
        },
        {
            id: "category-changed",
            name: "Category Changed",
            description: "When you change the stream category in the dashboard.",
            cached: false,
            manualMetadata: {
                category: "Just Chatting"
            }
        }
    ]
};

module.exports = firebotEventSource;
