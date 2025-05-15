import React, { useState } from "react";
import axios from "axios";

function UserListComponent() {
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [error, setError] = useState("");

  // Obtém o token e o role do localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log("Token:", token);
  console.log("Role:", role);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response Data:", response.data); // Verifique o que está sendo retornado

      if (response.status === 200) {
        setUsers(response.data.users);
        setShowUsers(true);
      } else {
        setError("Erro ao buscar usuários.");
      }
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError("Erro ao buscar usuários.");
    }
  };

  // Verifica se o usuário tem permissão de acesso
  if (role && role.trim() !== "ADMIN") {
    return (
      <div className="alert alert-warning my-3">
        Você não tem permissão para acessar esta funcionalidade.
      </div>
    );
  }  

  return (
    <div className="container mt-4">
      <h3>Administração de Usuários</h3>

      <button className="btn btn-primary my-3" onClick={fetchUsers}>
        Listar Todos os Usuários
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {showUsers && users.length > 0 && (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Usuário</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Matrícula</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(function (user, index) {
              return (
                <tr key={index}>
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.cpf}</td>
                  <td>{user.matricula}</td>
                  <td>{user.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserListComponent;
