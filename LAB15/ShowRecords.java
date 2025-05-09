
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ShowRecords {

    private final DatabaseConnection dbConnection;

    public ShowRecords(DatabaseConnection dbConnection) {
        this.dbConnection = dbConnection;
    }

    public String getRecords(int offset) {
        StringBuilder sb = new StringBuilder();
        String countQuery = "SELECT COUNT(*) AS total FROM users";
        String selectQuery = "SELECT * FROM users LIMIT ?, 10";
        try (Connection con = dbConnection.getConnection(); PreparedStatement countStatement = con.prepareStatement(countQuery); PreparedStatement selectStatement = con.prepareStatement(selectQuery)) {

            ResultSet countResult = countStatement.executeQuery();
            countResult.next();
            int totalRecords = countResult.getInt("total");

            if (offset >= totalRecords) {
                offset = 0; // Reset offset to 0 if it exceeds total records
            }

            selectStatement.setInt(1, offset);
            ResultSet rs = selectStatement.executeQuery();

            // Add table header with clear formatting
            sb.append(String.format("%-5s %-25s %-35s\n", "ID", "Name", "Email"));
            sb.append("=".repeat(65)).append("\n");

            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String email = rs.getString("email");
                sb.append(String.format("%-5d %-25s %-35s\n", id, name, email));
            }

            // Add footer line
            sb.append("=".repeat(65)).append("\n");
            sb.append("Total Records: ").append(totalRecords).append("\n");
        } catch (Exception e) {
            System.out.println(e);
        }
        return sb.toString();
    }
}
