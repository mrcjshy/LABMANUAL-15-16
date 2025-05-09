
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class SearchUser {

    private final DatabaseConnection dbConnection;

    public SearchUser(DatabaseConnection dbConnection) {
        this.dbConnection = dbConnection;
    }

    public String searchById(int id) {
        StringBuilder sb = new StringBuilder();
        String selectQuery = "SELECT * FROM users WHERE id = ?";
        try (Connection con = dbConnection.getConnection(); PreparedStatement selectStatement = con.prepareStatement(selectQuery)) {
            selectStatement.setInt(1, id);
            ResultSet rs = selectStatement.executeQuery();

            boolean found = false;
            // Add table header with clear formatting
            sb.append(String.format("%-5s %-25s %-35s\n", "ID", "Name", "Email"));
            sb.append("=".repeat(65)).append("\n");

            while (rs.next()) {
                found = true;
                String name = rs.getString("name");
                String email = rs.getString("email");
                sb.append(String.format("%-5d %-25s %-35s\n", id, name, email));
            }

            // Add footer line
            sb.append("=".repeat(65)).append("\n");

            if (!found) {
                sb.append("\nNo record found with ID: ").append(id).append("\n");
            }
        } catch (Exception e) {
            System.out.println(e);
        }
        return sb.toString();
    }
}
