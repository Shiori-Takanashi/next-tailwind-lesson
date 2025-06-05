export default function PlaceholderMessage({ message }: { message: any }) {
    const styles = {
        placeholder: {
            color: "#666",
            fontSize: "1rem",
            userSelect: "none" as "none",
        },
    };

    return (
        <p style={styles.placeholder}>{message}</p>
    );
}
