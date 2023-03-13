export const styles = {
    productsWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    product: {
        width: "100%",
        height: "200px",
        borderRadius: "16px",
        background: "rgba(0,74,128,0.2)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor:"pointer",
        ":hover": {
            background: "rgba(0,74,128,0.15)",
        }
    },
    titleDescriptionBox: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    title: {
        fontWeight: "bold",
        fontSize: "24px",
        color: "rgb(13, 56, 116)"
    },
    description: {
        fontSize: "16px",
        color: "rgb(13, 56, 116)",
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
        width: "70%"
    },
    linearProgressWrapper: {
        height: "16px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    linearProgress: {
        width: "300px",
        height: "100%",
        borderRadius: "8px"
    },
    raisedStatus: {
        fontWeight: "semibold",
        color: "rgb(93,149,219)"
    }
}