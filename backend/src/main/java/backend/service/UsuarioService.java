package backend.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import backend.model.Usuario;
import backend.repository.UsuarioRepository;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.findByCorreo(usuario.getCorreo()).isPresent()) {
            throw new RuntimeException("Ese correo ya está registrado");
        }

        // Hashea la contraseña con bcrypt para seguridad
        //Además se inicializa los datos de la tabla usuario por primera vez
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setFechaInicio(LocalDate.now());
        usuario.setExperiencia(0);
        return usuarioRepository.save(usuario);  //Llama al repository y le pasa los datos recién procesados
    }

    public Usuario login(String correo, String password) {

        //Busca en la BD si está un usuario asociado a ese correo, caso afirmativo 
        //Verifica que la pass sea correcta, si todo sale bien el login acontece
        
        try{
            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

            if (!usuarioOpt.isPresent()) {
            throw new RuntimeException("Usuario no encontrado.");
            } 
            Usuario usuario = usuarioOpt.get(); //Obtengo el objeto usuario dentro del optional

            if(!passwordEncoder.matches(password, usuario.getPassword())){
                throw new RuntimeException("Contrasenia invalida.");
            }

            //Si llega acá las credenciales son correctas:
            System.out.println("Login exitoso.");

            return usuario;

        }catch (RuntimeException e){
           System.out.println("Error en el login: " + e.getMessage());
           e.printStackTrace();
           return null; // o lanzar la excepción hacia arriba
           //EN JAVA TODOS LOS CAMINOS LLEVAN A UN VALOR, INCLUSO TRY CATCH
           //COMO EL FLUJO DE EJECUCIÓN SIGUE VIVO ENTONCES ESPERA QUE DEVUELVAS ALGO
        }
    }
}