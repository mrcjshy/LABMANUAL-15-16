
import java.sql.Connection;
import java.sql.PreparedStatement;

public class AddUser {

    private final DatabaseConnection dbConnection;

    public AddUser(DatabaseConnection dbConnection) {
        this.dbConnection = dbConnection;
    }

    public boolean addUser(String name, String email) {
        String insertQuery = "INSERT INTO users (name, email) VALUES (?, ?)";
        try (Connection con = dbConnection.getConnection(); PreparedStatement insertStatement = con.prepareStatement(insertQuery)) {
            insertStatement.setString(1, name);
            insertStatement.setString(2, email);
            insertStatement.executeUpdate();
            System.out.println("User inserted successfully!");
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }
}
