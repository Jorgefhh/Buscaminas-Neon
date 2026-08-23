package backend.repository;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import backend.model.Usuario;


//Esto es una interfaz genérica:
public interface UsuarioRepository extends CrudRepository<Usuario, Integer> {
    //Usuario es la clase asociada a la tabla de donde mapeará las operaciones spring
    //Integer se refiere al tipo de dato de la clave primaria que posee esa tabla
    Optional<Usuario> findByCorreo(String correo);

    //La implementación que spring hará será:
    //SELECT * FROM usuarios WHERE correo = 'test@test.com';

}