exports.user = {
    level: {
        FREE: 1,
        PAID: 3,
        ADMIN: 15,
    },
    type: {
        ADMIN: (15 << 4),
        SELLER: (1 << 4),
        CUSTOMER: (2 << 4)
    }
}