
import java.sql.Connection;
import java.sql.PreparedStatement;

public class EditUser {

    private final DatabaseConnection dbConnection;

    public EditUser(DatabaseConnection dbConnection) {
        this.dbConnection = dbConnection;
    }

    public boolean editUser(int id, String newName, String newEmail) {
        String updateQuery = "UPDATE users SET name = ?, email = ? WHERE id = ?";
        try (Connection con = dbConnection.getConnection(); PreparedStatement updateStatement = con.prepareStatement(updateQuery)) {
            updateStatement.setString(1, newName);
            updateStatement.setString(2, newEmail);
            updateStatement.setInt(3, id);
            int rowsAffected = updateStatement.executeUpdate();
            System.out.println("Record updated successfully!");
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }
}
